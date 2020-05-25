const {Sequelize,sequelize} = require('./db');

const Model = Sequelize.Model;

class Menu extends Model {}

Menu.init({
  m_key: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  m_type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  parentKey: {
    type: Sequelize.STRING,
  },
  parentType: {
    type: Sequelize.STRING,
  },
  orderNum: {
    type: Sequelize.INTEGER,
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false,
  tableName: 'EntryMenu'
});

module.exports ={ Menu }
 