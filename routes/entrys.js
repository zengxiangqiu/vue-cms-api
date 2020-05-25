var express = require('express');
var router = express.Router();

const menu_controller = require('../controller/fontend/menuController');
const entry_controller = require('../controller/fontend/entryController');
const tag_controller = require('../controller/fontend/tagController');

router.get('/', entry_controller.entry_list);

router.get('/:id([0-9]*)', entry_controller.entry_id_get);

router.get('/news', entry_controller.entry_news_get);

router.get('/tags', tag_controller.tags_list)

router.get('/menu', menu_controller.menu_list);

module.exports = router;