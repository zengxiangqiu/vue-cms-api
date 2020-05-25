const {Sequelize,sequelize} = require('./db');

const Model = Sequelize.Model;

class EntryTag extends Model {}

EntryTag.init({
  entryId: {
    type: Sequelize.INTEGER,
    allowNull: false
    // allowNull defaults to true
  },
  entryTagMasterId: {
    type: Sequelize.INTEGER,
    allowNull: false
    // allowNull defaults to true
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false,
});

module.exports={EntryTag}
