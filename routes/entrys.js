var express = require('express');
var router = express.Router();
var EntryFactory = require('../models/Entry');

const Op = EntryFactory.Sequelize.Op;

router.get('/', function (req, res, next) {
  if (req.query.category != null) {
    QueryData(req, res, {
      key: req.query.category
    }, {});
  } else if (req.query.tag != null) {
    QueryData(req, res, {}, {
      key: req.query.tag
    });
  } else {
    QueryData(req, res, {}, {});
  }
  // res.json(Object.assign({},{data:result.data, pagination:result.pagination}));
});


router.get('/:id([0-9]*)', function (req, res, next) {
  console.log(req.params.id);
  var id = req.params.id;
  EntryFactory.Entry.findOne({
    attributes: ['id', 'title', 'lastModDate', 'author', 'countOfComments', 'category', 'content'],
    group: ['Entry.id', 'title', 'lastModDate', 'author', 'countOfComments', 'category', 'content'],
    include: [{
        model: EntryFactory.EntryTag,
        include: [{
          model: EntryFactory.EntryTagMaster,
          attributes: ['key', 'value'],
          required: true
        }],
        required: true
      },
      {
        model: EntryFactory.EntryCategoryMaster,
        attributes: ['key', 'value'],
        required: true,
      }
    ],
    where: {
      id: id
    }
  }).then(entry => {
    if(entry==null){
      entry = {};
      entry.NoFound = true;
      res.json({data: entry});
      return;
    }
    EntryFactory.Entry.findOne({
      where: {
        "id": {
          [Op.gt]: entry.id,
        }
      },
      order: [
        ['id', 'ASC']
      ],
      attributes: ['title', 'imgUrl', 'id']
    }).then(next => {
      EntryFactory.Entry.findOne({
        where: {
          "id": {
            [Op.lt]: entry.id,
          }
        },
        order: [
          ['id', 'DESC']
        ],
        attributes: ['title', 'imgUrl', 'id']
      }).then(previous => {
        var e = JSON.parse(JSON.stringify(entry));
        e.tags = e.EntryTags.map(tag => {
          return {
            link: '/tag/'+tag.EntryTagMaster.key,
            title: tag.EntryTagMaster.value
          }
        });
        e.category = {
          key: e.EntryCategoryMaster.key,
          value: e.EntryCategoryMaster.value
        };
        delete e['EntryTags'];
        delete e['EntryCategoryMaster'];
        e.previous = previous;
        e.next = next;
        res.json({
          data: e,
        });
      })
    })
  })
})

router.get('/news', function (req, res, next) {
  EntryFactory.Entry.findAll({
    order: [
      ['lastModDate', 'DESC']
    ],
    limit: 5,
    //imgUrl, title, link,lastModDate, countOfComments
    attributes: ['id', 'title', 'imgUrl', 'link', 'lastModDate', 'countOfComments']
  }).then(entries => {
    res.json({
      data: entries
    });
  });
})

router.get('/tags', function(req, res, next){
  EntryFactory.EntryTagMaster.findAll().then(tags=>{
    var data =  tags.map(tag=>{
      return Object.assign({},{
        title: tag.value,
        link: '/tag/'+tag.key
      });
    });
    res.json({data:data});
  })
})

router.get('/menu', function (req, res, next) {
  EntryFactory.EntryMenu.findAll({
    include: [{
        model: EntryFactory.EntryMenu,
        include: [{
            model: EntryFactory.EntryCategoryMaster
          },
          {
            model: EntryFactory.EntryTagMaster
          }
        ],
        attributes: ['id', 'm_key', 'm_type', 'orderNum'],
        order: [
          ['orderNum', 'Asc']
        ]
      },
      {
        model: EntryFactory.EntryCategoryMaster
      },
      {
        model: EntryFactory.EntryTagMaster
      }
    ],
    where: {
      parentKey: null
    },
    order: [
      ['orderNum', 'ASC']
    ],
    attributes: ['id', 'm_key', 'm_type', 'orderNum']
  }).then(menu => {
    // var submenu = menu.map(x=>new Object.assign({},{}));
    var data = menu.map(x => {
      return Object.assign({}, {
        id: x.id,
        category: x.m_key,
        title: (x.EntryCategoryMaster || x.EntryTagMaster).value,
        isSelect: false,
        link: (!!x.m_type == true ? '/' + x.m_type : '') + '/' + x.m_key,
        tags: x.EntryMenus.map(y => {
          return Object.assign({}, {
            key: y.m_key,
            value: (y.EntryCategoryMaster || y.EntryTagMaster).value,
            link: '/' + y.m_type + '/' + y.m_key,
          });
        })
      });
    })
    data.unshift({
      id: 1,
      title: "首页",
      category: "/",
      isSelect: false,
      link: "/",
      tags: []
    });
    data.push({
        id: 9999,
        title: "站内搜索",
        category: "search",
        isSelect: false,
        link: "/search",
        tags: [] 
    });
    res.json({
      data
    });
  })
});

var QueryData = (req, res, categoryWhere, tagWhere) => {
  var page = req.query.page || 1;
  page = parseInt(page);
  var perPage = req.query.perPage || 10;
  perPage = parseInt(perPage);
  var tag = req.query.tag;
  var category = req.query.category;
  var search = '%' + (req.query.s || '') + '%';

  var p1 = EntryFactory.Entry.findAndCountAll({
    limit: perPage,
    offset: (page - 1) * perPage,
    include: [{
        model: EntryFactory.EntryCategoryMaster,
        where: categoryWhere,
        required: true,
        attributes: []
      },
      {
        model: EntryFactory.EntryTag,
        include: {
          model: EntryFactory.EntryTagMaster,
          where: tagWhere,
          required: true,
          attributes: [],
        },
        required: true,
        attributes: [],
      }
    ],
    subQuery: false,
    where: {
      [Op.or]: [{
        title: {
          [Op.like]: search
        }
      }, {
        content: {
          [Op.like]: search
        }
      }],
    },
    attributes: ['id', 'category', 'title', 'excerpt', 'author', 'imgUrl', 'lastModDate', 'countOfComments'],
    group: ['Entry.id', 'Entry.category', 'title', 'excerpt', 'author', 'imgUrl', 'lastModDate', 'countOfComments'],
  })
  var p2 = EntryFactory.EntryCategoryMaster.findOne({
    where: {
      key: category || ''
    }
  });
  var p3 = EntryFactory.EntryTagMaster.findOne({
    where: {
      key: tag || ''
    }
  });

  Promise.all([p1, p2, p3]).then(values => {
    var entries = values[0];
    var category = values[1] || '';
    var tag = values[2] || '';
    var pageCount = Math.ceil(entries.count.length / perPage);
    const result = {
      data: entries.rows,
      pagination: {
        pageCount: pageCount,
        page: page,
        perPage: perPage
      },
      header: category.value || tag.value || ''
    };
    res.json(result);
  })
}


/*Entrys*/

module.exports = router;