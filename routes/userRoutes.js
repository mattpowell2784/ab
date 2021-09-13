const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

//address routes
router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/logout', authController.logout)

//router.get('/all-users', userController.getAllUsers);

module.exports = router;
