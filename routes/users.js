const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();
const { authentication } = require('../middleware/authentication.js');
const { uploadProfileImages } = require('../middleware/multer.js');

router.get('/onlineusers', UserController.allOnlineUsers);
router.get('/confirm/:emailToken', UserController.confirmUser);
router.get('/id/:_id', UserController.findUserById);
router.get('/name/:username', UserController.findUserByName);
router.get('/userinfo', authentication, UserController.userInfo);
router.get('/recoverPassword/:email', UserController.recoverPassword);
router.post('/', uploadProfileImages.single('profileImg'), UserController.register);
router.post('/login', UserController.login);
router.put('/resetPassword/:recoverToken', UserController.resetPassword);
router.put('/follow/:_id', authentication, UserController.follow);
router.put('/unfollow/:_id', authentication, UserController.unfollow);
router.put('/getonline/:_id', authentication, UserController.getOnline);
router.delete('/logout/:_id', authentication, UserController.logout);

module.exports = router;
