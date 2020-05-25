const {Menu} = require('../../models/Menu');
const {Category} = require('../../models/Category');
const {Tag} = require('../../models/Tag');
const _ = require('lodash');
const debug = require('debug')('backend');

exports.menu_list=async (req, res)=>{
  // const menu =  await Menu.findAll({
  //   include: [
  //   {
  //     model: Menu,
  //     attributes: ['id', 'm_key', 'orderNum'],
  //     order: [
  //       ['orderNum', 'Asc']
  //     ],
  //     include: {
  //       model: Tag,
  //       attributes:['value'],
  //       include:{
  //         model: Menu,
  //         attributes: ['id', 'm_key', 'orderNum'],
  //         order: [
  //           ['orderNum', 'Asc']
  //         ],
  //       }
  //     }
  //   },
  //   {
  //     model: Category,
  //     attributes:['value']
  //   },
   
  // ],
  // where: {
  //   parentKey: ''
  // },
  // order: [
  //   ['orderNum', 'ASC']
  // ],
  // attributes: ['id', 'm_key', 'orderNum']
  // });

  const menu =await  Menu.findAll({
    attributes: ['m_key','m_type', 'parentKey','orderNum'],
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
    if((element.Tag || element.Category )==null)
      continue;
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
    element.label = element.Category == null? element.Tag.value: element.Category.value;
    element.id = element.m_key;
  }
  for (let index = 0; index < menuJson.length; index++) {
    const element = menuJson[index];
    delete element.m_key;
    delete element.parentKey;
    delete element.Tag;
    delete element.Category;
  }

  


  res.json(result);
  // const menuForUI =  menu.map(menu=>{
  //   return Object.assign({},{
  //     id: menu.m_key,
  //     label: menu.Category==null? '': menu.Category.value,
  //     children: menu.Menus.map(subMenu=>{
  //       return {
  //         id: subMenu.m_key,
  //         label: subMenu.Tag == null ? '': subMenu.Tag.value
  //       }
  //     })
  //   });
  // })

  // _.remove(menuForUI, x=>x.label=='');
  // _.forEach(menuForUI,x=>_.remove(x.children, y=>y.label==''))

  // res.json(menuForUI);
}

exports.menu_update_post=async (req, res)=>{
  try {
    const menuFormUI =  req.body;
    debug(menuFormUI)
    let order = 0, subOrder = 0;
    await Menu.destroy({truncate: true});
    // const menu =  menuFormUI.map(menu=>{
    //   order++;
    //   const p_menu = { 
    //     m_key: menu.id,
    //     parentKey:'',
    //     orderNum: order
    //    }  
    //   subOrder = 0;
    //   const s_menu =  menu.children.map(m=>{
    //     subOrder++;
    //     return {
    //       m_key : m.id,
    //       parentKey: menu.id,
    //       orderNum: subOrder
    //     }
    //   })
    //   return {p_menu,s_menu};
    // });
    
    var result = [];
    var index = 0;
    _.forEach(menuFormUI,x=>{
      index++;
      result = _.concat(result,getMenu(x,'',index))
    });

    // menuFormUI.forEach(x=>{
    //   getMenu(x,'',index);
    // });

    debug(_.orderBy(result,['parentKey','orderNum'],['asc','asc']));

    // await Menu.bulkCreate(menu.map(x=>{return x.p_menu}));
  
    // _.forEach(menu,async s=>{
    //   await Menu.bulkCreate(s.s_menu);
    // })
    await Menu.bulkCreate(result);
    res.json({sucess: true});
  } catch (error) {
    debug(error);
    res.json({sucess: false});
  }
}



const getMenu = function(menu,parentKey,order){
  var result = [];
  if(parentKey==''){
    const p_menu = { 
      m_key: menu.id,
      parentKey:parentKey,
      orderNum: order,
      m_type: menu.m_type
    }  
    result = _.concat(result,p_menu);
  }
  var subOrder = 0;
  if(menu.children){
  const s_menu =  menu.children.map(m=>{
    subOrder++;
    if(m.children){
      result = _.concat(result,getMenu(m,menu.id,subOrder));
    }
    return {
      m_key : m.id,
      parentKey: menu.id,
      orderNum: subOrder,
      m_type: m.m_type
    }
  })
  result = _.concat(result,s_menu);
  }
  return result;
}


