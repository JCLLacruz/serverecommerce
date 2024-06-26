const express = require("express");
const router = express.Router()
const ProductController = require("../controllers/ProductController.js");
const { authentication,isAdmin } = require("../middleware/authentication.js");
const { uploadUserProductImages } = require('../middleware/multer.js');


router.post('/', ProductController.create);
router.put('/id/:_id', ProductController.update);
router.delete('/id/:_id', ProductController.delete);
router.get('/', ProductController.getAll);
router.get('/title/:title', ProductController.getProductsByTitle);
router.get('/id/:_id', ProductController.getById);
router.put('/like/:_id', ProductController.like);
router.delete('/like/:_id', ProductController.dislike);

module.exports = router;