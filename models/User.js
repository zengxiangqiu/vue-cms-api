const {Sequelize,sequelize} = require('./db');

const Model = Sequelize.Model;

class User extends Model {} 

User.init({
  name:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  password:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  nickname:{
    type: Sequelize.STRING,
    allowNull: false,
  }
},{sequelize,freezeTableName:true})

module.exports ={ User }
 