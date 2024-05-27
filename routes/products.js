const express = require("express");
const router = express.Router()
const ProductController = require("../controllers/ProductController.js");
const { authentication,isAdmin } = require("../middleware/authentication.js");
const { uploadUserProductImages } = require('../middleware/multer.js');


router.post('/',uploadUserProductImages.single('productImg'), authentication, isAdmin, ProductController.create);
router.put('/id/:_id', authentication, isAdmin, ProductController.update);
router.delete('/id/:_id', authentication, isAdmin, ProductController.delete);
router.get('/', authentication, ProductController.getAll);
router.get('/title/:title', authentication, ProductController.getProductsByTitle);
router.get('/id/:_id', authentication, ProductController.getById);
router.put('/like/:_id', authentication, ProductController.like);
router.delete('/like/:_id', authentication, ProductController.dislike);

module.exports = router;