const {Sequelize} = require('../../models/db');
var {EntryTag} = require('../../models/EntryTag');
const {Tag} = require('../../models/Tag');

var debug = require('debug')('tag');

const Op = Sequelize.Op;

exports.tags_list=async function(req, res){
  var page = req.query.page || 1;
  page = parseInt(page);
  var perPage = req.query.perPage || 10;
  perPage = parseInt(perPage);
  var search = '%' + (req.query.s || '') + '%';
  // var tags = req.query.in;
  var entryid = req.query.entryid;
  var tags=[];
  var where  =  {
    [Op.or]: [{
      key: {
        [Op.like]: search
      }
    }, {
      value: {
        [Op.like]: search
      }
    }]
  };
  /* sql in
  if(tags)
  {
   where['key']={
       [Op.in]:tags.split('|')
    };
  }
  */
 if(entryid){
 tags= await Tag.findAndCountAll({
    include:{
      model: EntryTag,
      where:{
        entryId: entryid
      },
      attributes:[]
    }
  })}
  else{
  tags = await Tag.findAndCountAll({
    limit: perPage,
    offset: (page - 1) * perPage,
    where:where
  })}
  debug(`tags: ${tags}`)
  var pageCount = Math.ceil(tags.count / perPage);
  res.json({
    data: tags.rows,
    pagination: {
      pageCount: pageCount,
      page: page,
      perPage: perPage
    },
  });
}