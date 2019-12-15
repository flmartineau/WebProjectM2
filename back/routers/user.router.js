const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();



router.post('/user', userController.createUser);
router.post('/user/login', userController.loginUser);
router.get('/user/logout', userController.logoutUser);
router.get('/user/:userId', userController.getUser);
router.put('/user/:userId', userController.updateUser);
router.delete('/user/:userId', userController.deleteUser);

module.exports = router;
