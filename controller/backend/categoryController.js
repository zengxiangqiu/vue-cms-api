const {Sequelize} = require('../../models/db');
var {Category} = require('../../models/Category');
var debug = require('debug')('category');

const Op = Sequelize.Op;

exports.categories_list=function(req, res){
  var page = req.query.page || 1;
  page = parseInt(page);
  var perPage = req.query.perPage || 10;
  perPage = parseInt(perPage);
  var search = '%' + (req.query.s || '') + '%';

  Category.findAndCountAll({
    limit: perPage,
    offset: (page - 1) * perPage,
    where: {
      [Op.or]: [{
        key: {
          [Op.like]: search
        }
      }, {
        value: {
          [Op.like]: search
        }
      }],
    },
  }).then(tags => {
    var pageCount = Math.ceil(tags.count / perPage);
    res.json({
      data: tags.rows,
      pagination: {
        pageCount: pageCount,
        page: page,
        perPage: perPage
      },
    });
  })
}


exports.categories_update_post=async function(req, res){
  var tag  =req.body;
  const result = await UpdateCategory(tag);
  if(result){
    res.status(200).json({category: tag.key});
  }
  else{
    res.status(400).json({error: '更新失败'});
  }
}

exports.categories_destory_delete = async function(req, res){
  const result  = await Category.destroy({where:{key: req.params.key}});
  if(result>0)
    res.status(200).send();
  else
    res.status(400).json({error: '删除失败'});
}

const UpdateCategory = async (category)=>{
  const db_c = await Category.findByPk(category.key);
  debug(db_c);
  if(db_c==null){
    const result = await Category.create(category);
    return result==null?false: true;
  }
  else{
    const result = await Category.update(category);
    if(result[0]>0)
      return true;
    else
      return false;
  }
}