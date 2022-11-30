const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const genereteToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
};

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!email || !name || !password) {
    res.status(400)
    throw new Error('please fill in  all  required fields');
  }
  if (password.length < 6) {
    res.status(400)
    throw new Error('password must a be up to 6 characters');
  }
  //check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400)
    throw new Error('Email has already been registered');
  }

  //create new user
  const user = await User.create({
    name,
    email,
    password
  })
  //Generate Token
  const token = genereteToken(user._id);

  //sent HTTP-only cookie
  res.cookie("token", token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 hari
    sameSite: "none",
    secure: true
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token
    });
  } else {
    res.status(400)
    throw new Error('user invalid')
  }
});

//login User 
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //validasi Request
  if (!email || !password) {
    res.status(400)
    throw new Error('tolong isi email dan password');
  }
  //check if user exits
  const user = await User.findOne({ email })
  if (!user) {
    res.status(400)
    throw new Error('user not found, please signup');
  }

  //user exists, check if  password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password)

  //Generate Token
  const token = genereteToken(user._id);

  //sent HTTP-only cookie
  res.cookie("token", token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 hari
    sameSite: "none",
    secure: true
  });
  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token
    });
  } else {
    res.status(400)
    throw new Error('salah email dan password');
  }
});

// Logout User
const Logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: '/',
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true
  });
  return res.status(200).json({
    message: "successfully logout"
  })
});

// get User Data
const GetUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400)
    throw new Error('suser tidak di temukan');
  }
});

//get Login Status
const LoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  //verifikasi token  
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if(verified){
    return res.json(true);
  }
  return res.json(false);
})

//update user
const UpdateUser = asyncHandler(async(req,res)=> {
  const user = await User.findById(req.user._id)
  if(user){
    const { _id, name, email, photo, phone, bio } = user;
    user.email =  email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save()
    res.status(200).json({
      _id   : updatedUser._id,
      name  : updatedUser.name,
      email : updatedUser.email,
      photo : updatedUser.photo,
      phone : updatedUser.phone,
      bio   : updatedUser.bio,
    })
  }else{
    res.status(400)
    throw new Error("User not found")
  }
})

const changePassword = asyncHandler(async(req,res)=> {
  const user = await User.findById(req.user._id);
  const {oldPassword,password} = req.body;
  if(!user){
    res.status(400)
    throw new Error("user not found, please signup")
  }
  //validate
  if(!oldPassword || !password){
    res.status(400)
    throw new Error("tolong isi old dan password baru")
  }
  //check if password matches password id db
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);


  //save new password
  if(user && passwordIsCorrect){
    user.password = password
    await user.save()
    res.status(200).send("password sudah berhasil di ubah")
  }else{
    res.status(400)
    throw new Error("old password is incorrect")
  }
})

const ForgotPassword = asyncHandler (async(req ,res)=> {
  res.send("forget success")
})
module.exports = {
  registerUser,
  loginUser,
  Logout,
  GetUser,
  LoginStatus,
  UpdateUser,
  changePassword,
  ForgotPassword
};