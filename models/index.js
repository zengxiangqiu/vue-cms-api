const {Menu} = require('../models/Menu');
const {Category} = require('../models/Category');
const {Tag} = require('../models/Tag');
const {Entry} = require('../models/Entry');
const {EntryTag} = require('../models/EntryTag');

Menu.belongsTo(Category,{targetKey: 'key', foreignKey:'m_key'});
Menu.belongsTo(Tag,{targetKey: 'key', foreignKey:'m_key'});

Entry.hasMany(EntryTag);
EntryTag.belongsTo(Entry);

Tag.hasMany(EntryTag,{sourceKey: 'key',foreignKey: 'entryTagMasterId'})
EntryTag.belongsTo(Tag, {targetKey: 'key',foreignKey: 'entryTagMasterId'});

Entry.hasOne(Category, {sourceKey: 'category',foreignKey: 'key',as: 'c'});
