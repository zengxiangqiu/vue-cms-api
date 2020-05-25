
const {Sequelize,sequelize} = require('./db');

const Model = Sequelize.Model;

class Category extends Model {}

Category.init({
  key: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  value: {
    type: Sequelize.STRING,
    allowNull: false
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false,
  tableName: 'EntryCategoryMaster'
});

module.exports={ Category }