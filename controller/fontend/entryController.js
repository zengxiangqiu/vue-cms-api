const {Sequelize} = require('../../models/db');
var {Entry} = require('../../models/Entry');
var {Category} = require('../../models/Category');
var {Tag} = require('../../models/Tag');
var {EntryTag} = require('../../models/EntryTag');

var debug = require('debug')('backend');

const Op = Sequelize.Op;

exports.entry_list = async function(req, res) {
  if (req.query.category != null) {
    QueryData(req, res, { key: req.query.category}, {});
  } else if (req.query.tag != null) {
    QueryData(req, res, {}, { key: req.query.tag });
  } else {
    QueryData(req, res, {}, {});
  }
};

exports.entry_id_get = async (req, res)=>{
  let id = req.params.id;
  let preEntry, nextEntry;
  let entry = await Entry.findOne({ 
    attributes: ['id', 'title', 'lastModDate', 'author', 'countOfComments', 'category', 'content'],
    // group: ['Entry.id', 'title', 'lastModDate', 'author', 'countOfComments', 'category', 'content'],
    include: [{
        model: EntryTag,
        include: [{
          model: Tag,
          attributes: ['key', 'value'],
          required: true
        }],
      },
      {
        model: Category,
        attributes: ['key', 'value'],
        as:'c',
        required: true,
      }
    ],
    where: {
      id: id
    }
  })
  if(entry){
    nextEntry = await Entry.findOne({
      where: {
        "id": {
          [Op.gt]: entry.id,
        }
      },
      order: [
        ['id', 'ASC']
      ],
      attributes: ['title', 'imgUrl', 'id']
    })

    preEntry = await Entry.findOne({
      where: {
        "id": {
          [Op.lt]: entry.id,
        }
      },
      order: [
        ['id', 'DESC']
      ],
      attributes: ['title', 'imgUrl', 'id']
    })

    entry =  JSON.parse(JSON.stringify(entry));
  
    if(entry.EntryTags){
      entry.tags = entry.EntryTags.map(x=>{
        return {
          title: x.Tag.value,
          link: '/tag/'+ x.Tag.key
        }
      })
    }

    delete entry['EntryTags']

    entry.previous = preEntry;
    entry.next = nextEntry;

    res.status(200).json({entry: entry});
  }
  else{
    res.status(400).json({error: '找不到文章'})
  }
}

exports.entry_news_get = async(req, res)=>{
  let entries = await Entry.findAll({
    limit:5,
    order:[['lastModDate','desc']],
    attributes:['id','title','lastModDate','imgUrl','countOfComments']
  })
  if(entries)
     res.status(200).json({entries});
  else
     res.status(400).json({error:'找不到最近的文章'});

}

var QueryData = async function(req, res, categoryWhere, tagWhere){
  let page = req.query.page || 1;
  page = parseInt(page);
  let perPage = req.query.perPage || 10;
  perPage = parseInt(perPage);
  let tag = req.query.tag;
  let category = req.query.category;
  let search = '%' + (req.query.s || '') + '%';
  let header = '';
  let entries =await Entry.findAndCountAll({
    limit: perPage,
    offset: (page - 1) * perPage,
    include: [{
        model: Category,
        where: categoryWhere,
        as:'c',
        required: true
      },
      {
        model: EntryTag,
        include: {
          model: Tag,
          where: tagWhere,
        },
      },
    ],
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
    subQuery:false,
    attributes: ['id', 'category', 'title', 'excerpt', 'author', 'imgUrl', 'lastModDate', 'countOfComments'],
    group: ['Entry.id'],
    order: [
      ['lastModDate', 'DESC']
    ],
    
  })

  if(tag){
    header = (await Tag.findOne({where:{key: tag}})).value;
  }
  if(category){
    header = (await Category.findOne({where:{key:category}})).value;
  }

  debug(entries.count)
  var pageCount = Math.ceil(entries.count.length / perPage);
  const result = {
    entries : entries.rows,
    pagination: {
      pageCount: pageCount,
      page: page,
      perPage: perPage
    },
    header: header
  };
  res.status(200).json(result);
}

