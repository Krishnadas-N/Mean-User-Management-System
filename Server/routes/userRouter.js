const express=require('express');
const userRoute = express.Router()
const UserController = require('../Controller/UserController');
const { authenticateToken } = require('../middlewares/authorizationMiddleWare');
const multer = require('multer');
const { fileUpload } = require('../Utils/firebaseSetup');
const upload = multer({ storage: multer.memoryStorage() });
userRoute.post('/login',UserController.userpost);

userRoute.post('/register',UserController.userRegister);

userRoute.get('/home',authenticateToken,UserController.userHome);

userRoute.get('/profile',authenticateToken,UserController.profile);

userRoute.post('/logout',authenticateToken,UserController.logout)

userRoute.post('/uploadImage/:userId',upload.single('profileImage'),fileUpload)

module.exports=userRoute