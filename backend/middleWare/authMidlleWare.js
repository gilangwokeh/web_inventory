const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const jwt = require('jsonwebtoken');

const Protect = asyncHandler(async (req,res ,next) => {
  try {
    const token = req.cookies.token
    if(!token){
      res.status(402)
      throw new Error("Not authorize ,please login")
    }
    //verifikasi token  
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    //GET user id from token ..
    user =  await User.findById(verified.id).select("-password")
    if(!user){
      res.status(401)
      throw new Error("user Tidak di temukan")
    }
    req.user = user
    next();
  } catch (error) {
    res.status(402)
    throw new Error("Not authorize ,please login")
  }
})


module.exports = Protect