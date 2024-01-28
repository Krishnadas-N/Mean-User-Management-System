const express=require('express');
const { isAdmin ,authenticateToken} = require('../middlewares/authorizationMiddleWare');
const adminRoute = express.Router()
const adminController = require('../Controller/adminController');

adminRoute.get('/userslist',authenticateToken,isAdmin,adminController.adminUserslist)

adminRoute.put('/editUser/:id',authenticateToken,isAdmin,adminController.editUsers)

adminRoute.delete('/deleteUser/:id',authenticateToken,isAdmin,adminController.deleteUser)


module.exports=adminRoute