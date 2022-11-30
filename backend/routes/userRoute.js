const express = require('express');
const router = express.Router();
const {
   registerUser, 
   loginUser, 
   Logout, 
   GetUser,
   LoginStatus,
   UpdateUser,
   changePassword,
   ForgotPassword,
} = require('../controllers/userController');
const Protect = require('../middleWare/authMidlleWare');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', Logout);
router.get('/getUser',Protect, GetUser);
router.get('/loggedin',LoginStatus);
router.patch('/updateuser',Protect,UpdateUser);
router.patch('/changepassword',Protect,changePassword);
router.post('/forgotpassword',ForgotPassword);


module.exports = router
