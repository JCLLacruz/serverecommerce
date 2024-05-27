const express = require('express');
const router = express.Router()
const { authentication } = require('../middleware/authentication.js');
const TagController = require('../controllers/TagController.js');

router.put("/addtagtoproduct/:productId", authentication, TagController.addTagToProduct);
router.put("/addtagtouser", authentication, TagController.addTagToUser);
router.delete("/deletetagtouser/id/:tagId", authentication, TagController.deleteTagToUser);
router.delete("/deletetagtoproduct/id/:productId", authentication, TagController.deleteTagToProduct);

module.exports = router;