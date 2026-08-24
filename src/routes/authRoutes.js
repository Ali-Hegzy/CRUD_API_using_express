const express = require('express');
const authController = require('../controllers/authController');
const middleware = require('../middleware/auth')
const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.signInWithPass);
router.get('/logout', middleware.getUserAuth,authController.logout);
router.get('/public/info',authController.publicInfo);
router.get('/protected/info', middleware.getUserAuth, authController.protectedInfo);
router.get('/protected/profile', middleware.getUserAuth, authController.protectedProfile);

module.exports = router;