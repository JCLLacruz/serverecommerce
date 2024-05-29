const express = require('express');
const router = express.Router()
const OrderController = require('../controllers/OrderController.js');
const { authentication, isAuthor, isAdmin } = require('../middleware/authentication.js');
const {uploadCommentImages} = require('../middleware/multer.js')

router.post('/', authentication, );
router.put('/id/:_id', authentication, isAuthor, );
router.delete('/id/:_id', authentication, isAdmin, );
router.get('/', authentication, );

module.exports = router;