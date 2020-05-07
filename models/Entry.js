const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/tianfateng.db'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Model = Sequelize.Model;
class Entry extends Model {}
Entry.init({
  // attributes
  // Id: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false
  // },
  category: {
    type: Sequelize.STRING
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
  // options
});


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

class EntryCategoryMaster extends Model {}

EntryCategoryMaster.init({
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
  timestamps: false
});

class EntryTagMaster extends Model {}
EntryTagMaster.init({
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
  timestamps: false
});

class EntryMenu extends Model {}
EntryMenu.init({
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
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false
});



// Entry.id = EntryTag.entryId 
Entry.hasMany(EntryTag);
EntryTag.belongsTo(Entry);
// Entry.id = EntryTag.entryId 

EntryMenu.belongsTo(EntryCategoryMaster,{targetKey: 'key', foreignKey:'m_key'});
EntryMenu.belongsTo(EntryTagMaster,{targetKey: 'key', foreignKey:'m_key'});

EntryMenu.hasMany(EntryMenu,{sourceKey:'m_key',foreignKey:'parentKey'});
// EntryMenu.belongsTo(EntryMenu,{sourceKey: 'm_key', foreignKey: 'parentKey'})

EntryTag.belongsTo(EntryTagMaster, {
  targetKey: 'key',
  foreignKey: 'entryTagMasterId',
});


// EntryTagMaster.hasMany(EntryTag,{sourceKey:'key'})

// EntryCategoryMaster.id = EntryTag.EntryCategoryMasterId
// EntryTag.belongsTo(EntryCategoryMaster);
// EntryCategoryMaster.hasMany(EntryTag);

// Entry.category = EntryCategoryMaster.id 
Entry.hasOne(EntryCategoryMaster, {
  sourceKey: 'category',
  foreignKey: 'key'
});
// EntryCategoryMaster.belongsTo(Entry,{targetKey:'category', foreignKey:'key'});



module.exports = {
  Entry: Entry,
  EntryTag: EntryTag,
  EntryCategoryMaster: EntryCategoryMaster,
  EntryTagMaster: EntryTagMaster,
  EntryMenu: EntryMenu,
  Sequelize: Sequelize,
};