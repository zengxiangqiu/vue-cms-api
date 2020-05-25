const {Sequelize} = require('../../models/db');
var {Entry} = require('../../models/Entry');
var {Category} = require('../../models/Category');
var {EntryTag} = require('../../models/EntryTag');

var moment = require('moment');
var fs = require('fs');
var debug = require('debug')('backend');

const Op = Sequelize.Op;

exports.entry_list = async function(req, res) {
  debug('entry_list'+ req)
  var page = req.query.page || 1;
  page = parseInt(page);
  var perPage = req.query.perPage || 10;
  perPage = parseInt(perPage);
  var search = '%' + (req.query.s || '') + '%';
  const user = req.params.user;

  let data =  await  Entry.findAndCountAll({
    limit: perPage,
    offset: (page - 1) * perPage,
    where: {
      [Op.or]: [{
        title: {
          [Op.like]: search
        }
      }],
      author: user
    },
    attributes:['id','title','author','lastModDate']
  });
  const entries = data.rows;
  const count = data.count;
  var pageCount = Math.ceil(count / perPage);
  res.json({
    entries: entries,
    pagination: {
      pageCount: pageCount,
      page: page,
      perPage: perPage
    },
  });
};

exports.entry_id_get=async function(req, res){
    try {
      debug('start')
      const entry =  await Entry.findOne({
       include:[{
         model: Category,
         as:'c'
       },
       {
         model: EntryTag,
         attributes:[['entryTagMasterId','key']]
       }
       ],
       where:{ id :req.params.id}
      });
      debug('end');
      if(entry){
        var e = JSON.parse(JSON.stringify(entry));
        if(e.c){
          e.category = e.c.key;
        }
        if(e.EntryTags){
          e.tags = e.EntryTags.map(t=>t['key'])
        }
        delete e['c']
        delete e['EntryTags']
        
        res.status(200).json({entry:e})
      }
      else{
        throw '找不到文章'
      }
    } catch (error) {
        //default category 
        debug(error)
        Category.findOne().then(category=>{
          res.json({entry:Entry.build({title: '', content:'', category:category.key,tags:[]})})
        });
    } 
}

exports.entry_upload_picture=function(req, res){
  
  var tmp_path = req.file.path;   
  var day=moment(new Date(), "yyyymmdd"); 
  const directoryPath ='./public/'+ req.file.destination+day
  if(!fs.existsSync(directoryPath))
    fs.mkdirSync(directoryPath);
  var target_path = directoryPath+"/"+req.file.originalname;

  fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      fs.unlink(tmp_path, function() {
         if (err) throw err;
         res.send(req.file.destination+day+"/"+req.file.originalname);
      });
  });
}

exports.entry_update_post = async function(req, res){
  var entry = req.body;
  entry.author = req.params.user;
  debug(req.body);
  var result = {};
  if(entry.id){
     result =  await Entry.update(entry,{fields:['content','category','title'],where:{id: entry.id}});
  }
  else{
    try {
      result = await Entry.create(entry);
    } catch (error) {
      res.json({data: -1})
    }
  }
  if(result[0]>0)
  {
    EntryTag.destroy({where:{entryId: entry.id}}).then(result=>{
      debug(result);
      const tags = entry.tags.map(t=>
        {
          return {
            entryId: entry.id,
            entryTagMasterId: t
          }
        })
      debug(tags);
       EntryTag.bulkCreate(tags).then(result=>{
         res.json(result[0]>0?{data: entry.id}:{data: -1});
       });
    })
  }
  res.json({data: result.id})
}
