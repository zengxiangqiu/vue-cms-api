
const {Sequelize,sequelize} = require('./db');

const Model = Sequelize.Model;

class Entry extends Model {}
Entry.init({
  // attributes
  // Id: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false
  // },
  category: {
    type: Sequelize.STRING,
    // allowNull defaults to true
  },
  title: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  content: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  author: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  excerpt: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  imgUrl: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  link: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  sourceId: {
    type: Sequelize.INTEGER
    // allowNull defaults to true
  },
  lastModDate: {
    type: Sequelize.DATE,
    // allowNull defaults to true
  },
  countOfComments: {
    type: Sequelize.INTEGER
    // allowNull defaults to true
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false
});

module.exports = {Entry}