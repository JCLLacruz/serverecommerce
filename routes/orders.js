const express = require('express');
const router = express.Router()
const OrderController = require('../controllers/OrderController.js');
const { authentication, isAuthor, isAdmin } = require('../middleware/authentication.js');
const {uploadCommentImages} = require('../middleware/multer.js')

router.post('/', authentication, OrderController.create);
router.put('/id/:_id', authentication, isAdmin, OrderController.update);
router.delete('/id/:_id', authentication, isAdmin, OrderController.delete);
router.get('/', authentication, OrderController.getAll);

module.exports = router;