const express = require('express');
const router = express.Router()
const OrderController = require('../controllers/OrderController.js');
const { authentication, isAuthor } = require('../middleware/authentication.js');
const {uploadCommentImages} = require('../middleware/multer.js')

router.post('/', authentication, );
router.put('/id/:_id', authentication, isAuthor, );
router.delete('/id/:_id', authentication, isAuthor, );
router.get('/', authentication, );
router.put('/like/:_id', authentication, );
router.delete('/like/:_id', authentication, );

module.exports = router;