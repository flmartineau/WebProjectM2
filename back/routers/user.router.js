const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();
const jwtVerify = require('../config/jwt.verify');
const invitationController = require('../controllers/invitation.controller');

router.post('/user', userController.createUser);
router.post('/user/login', userController.loginUser);
router.get('/user/logout', userController.logoutUser);
router.get('/user', jwtVerify.verifyJwtToken, userController.getUser);
router.put('/user', jwtVerify.verifyJwtToken, userController.updateUser);
router.get('/users', jwtVerify.verifyJwtToken, userController.getUsers);

router.get('/user/invitations', jwtVerify.verifyJwtToken, invitationController.getUserInvitations);
module.exports = router;
