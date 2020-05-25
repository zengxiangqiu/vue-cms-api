const {Sequelize,sequelize} = require('./db');

const Model = Sequelize.Model;

class Tag extends Model {}
Tag.init({
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
  tableName:'EntryTagMaster'
});

module.exports={ Tag }