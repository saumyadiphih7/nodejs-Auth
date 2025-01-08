const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


router.get("/", authMiddleware, (req, res) => {
  const {username,email,role}=req.user
  res.json({
    success: true,
    message: "Welcome to the home route",
    user: {
      username,
      email,
      role
    }
  });
})


module.exports = router;