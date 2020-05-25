# vue-cms-api

## Project setup
```
npm install
```

### run command in package.json
```
npm run start
```


# [express](http://expressjs.com/en/starter/generator.html) 

Use the application generator tool, express-generator, to quickly create an application skeleton.

```
$ npm install -g express-generator

$ express

```


# [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) 
check token in node

```javascript
const token = jwt.sign({user_id: user_id},process.env.SECRET_CODE,{expiresIn: 3600});

jwt.verify(token, process.env.SECRET_CODE,function(err, decoded){
  ...
})
```

# [sequelize.js](https://github.com/sequelize/sequelize) 
CRUD database 

```javascript
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
```

```javascript
Entry.hasOne(Category, {sourceKey: 'category',foreignKey: 'key',as: 'c'});
```

# [lodash](https://lodash.com/docs/4.17.15#forEach) 
Lodash makes JavaScript easier by taking the hassle out of working with arrays, numbers, objects, strings, etc.

```javascript
_.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 });
// → { 'a': 1, 'b': 2 }
_.partition([1, 2, 3, 4], n => n % 2);
// → [[1, 3], [2, 4]]
```


# [dotenv](https://www.npmjs.com/package/dotenv) 
Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.

```javascript
require('dotenv').config({path:'./.env.local'})

PORT=3000
SECRET_CODE=something
```

# [multer](https://www.npmjs.com/package/multer) 
Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.

```javascript
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })

router.post('/entry/picture',checkToken, upload.single('image'), entry_controller.entry_upload_picture);
```


# [debug](https://www.npmjs.com/package/debug)
 A tiny JavaScript debugging utility modelled after Node.js core's debugging technique. Works in Node.js and web browsers.

```javascript
var debug=require('debug')('entry');

in package.json

  "scripts": {
    "start": "set DEBUG=entry & nodemon ./bin/www"
  },

restart it

```

