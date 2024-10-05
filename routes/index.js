const router = require('express').Router();
const controllers = require('../controllers/urlcontroller');


/* GET home page. */
router.get('/', controllers.getHome);

router.get('/:alias', controllers.getAlias);

router.post('/', controllers.postAlias);


module.exports = router;
