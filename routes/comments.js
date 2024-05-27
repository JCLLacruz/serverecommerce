const express = require('express');
const router = express.Router()
const CommentController = require('../controllers/CommentController.js');
const { authentication, isAuthor } = require('../middleware/authentication.js');
const {uploadCommentImages} = require('../middleware/multer.js')

router.post('/', authentication, uploadCommentImages.single('commentImg'), CommentController.create);
router.put('/id/:_id', authentication, isAuthor, CommentController.update);
router.delete('/id/:_id', authentication, isAuthor, CommentController.delete);
router.get('/', authentication, CommentController.getAll);
router.put('/like/:_id', authentication, CommentController.like);
router.delete('/like/:_id', authentication, CommentController.dislike);

module.exports = router;