var {Tag} = require('../../models/Tag');

exports.tags_list=async function(req, res){
  const tags =await Tag.findAll()
    var data =  tags.map(tag=>{
      return Object.assign({},{
        title: tag.value,
        link: '/tag/'+tag.key
      });
    });
    res.status(200).json({tags:data});
}