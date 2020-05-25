var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
const checkToken = require('../middleware/checkToken');

var entry_controller = require('../controller/backend/entryController');
const user_controller = require('../controller/backend/userController');
const tag_controller = require('../controller/backend/tagController');
const menu_controller = require('../controller/backend/menuController');
const category_controller = require('../controller/backend/CategoryController');

router.get('/categories',checkToken,category_controller.categories_list);
router.post('/categories',checkToken, category_controller.categories_update_post);
router.delete('/categories/:key',checkToken,category_controller.categories_destory_delete);

router.get('/tags',checkToken,tag_controller.tags_list);

router.get('/entries',checkToken, entry_controller.entry_list);
router.post('/entry/picture',checkToken, upload.single('image'), entry_controller.entry_upload_picture);
router.post('/entries',checkToken, entry_controller.entry_update_post);
router.get('/entries/:id',checkToken, entry_controller.entry_id_get);

router.post('/login',user_controller.user_valid_post);

router.get('/menu',checkToken, menu_controller.menu_list);
router.post('/menu', checkToken,menu_controller.menu_update_post);

module.exports = router;