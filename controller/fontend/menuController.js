const {Menu} = require('../../models/Menu');
const {Category} = require('../../models/Category');
const {Tag} = require('../../models/Tag');
const _ = require('lodash');
const debug = require('debug')('fontend');

exports.menu_list=async (req, res)=>{
  const menu =await  Menu.findAll({
    attributes: ['m_key', 'm_type','parentKey','orderNum'],
    include:[{
      model: Tag,
      attributes:['value']
    },{
      model: Category,
      attributes:['value']
    }],
    order:[['parentKey','asc'],['orderNum','asc']],
  });
  
  var menuJson  =JSON.parse(JSON.stringify(menu));
  var result = _.groupBy(menuJson,'parentKey')[''];
  
  for (let index = 0; index < menuJson.length; index++) {
    const element = menuJson[index];
    if(element.parentKey!='')
    {
      var k = _.find(menuJson,x=>x.m_key == element.parentKey);
      if(k)
      {  
        if(k.children)
        k.children.push(element);
        else{
          k.children = [];
          k.children.push(element);
        }
      }
    }
    element.category = element.m_key;
    
    element.title = (element.Category || element.Tag).value;
    element.isSelect = false;
    element.link ='/'+ element.m_type+'/'+element.m_key

  }
  for (let index = 0; index < menuJson.length; index++) {
    const element = menuJson[index];
    delete element.m_key;
    delete element.parentKey;
    delete element.Tag;
    delete element.Category;
  }
  result.unshift({
    id: 1,
    title: "首页",
    category: "/",
    isSelect: false,
    link: "/",
  });
  result.push({
      id: 9999,
      title: "站内搜索",
      category: "search",
      isSelect: false,
      link: "/search",
  });
  res.json({
    menu:result
  });
}