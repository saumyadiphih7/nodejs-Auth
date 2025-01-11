const asyncHandler = require("express-async-handler");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//creating user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password ,role} = req.body;

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  await user.save();

  if (user) {
    res.status(201).json({
      message: "User created successfully",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


//login user

const loginUser = asyncHandler(async (req, res) => {

  const { username, password } = req.body;
  
  const user = await User.findOne({ username })

   
  if (!user) {
    res.status(400);
    throw new Error("User not found")
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)
  
  if (!isPasswordMatch) {
    res.status(400);
    throw new Error("Invalid credentials")
  }

//creating access token
  const accessToken = jwt.sign({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  }, process.env.JWT_SECRET,
    
    {
      expiresIn: "30m" 
      
    })

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
    },
    accessToken,
  });
});


// change password
const changePassword = asyncHandler(async (req, res) => {
  
  const id = req.user.id
  // console.log(id,"id")
  const user = await User.findById(id)
  // console.log(user,"user")

  if (!user) {
     throw new Error("user not found")
  }
  

  //getting old password and new password from request
  const { oldPassword, newPassword } = req.body
  
  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
  
  if (!isPasswordMatch) {
    throw new Error("Invalid old password, please try again")
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  user.password = hashedPassword
  await user.save()

  res.status(200).json({
    message: "Password changed successfully",
  })

})

module.exports = { registerUser, loginUser, changePassword };
