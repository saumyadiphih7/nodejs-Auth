const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")
const adminMiddleware = require("../middlewares/adminMiddleware")
const router = express.Router()

router.get("/", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the admin page",
  });
});

module.exports=router