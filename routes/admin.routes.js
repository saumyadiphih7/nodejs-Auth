const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware.js")
const adminMiddleware = require("../middlewares/adminmiddleware.js");
const router = express.Router()

router.get("/", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the admin page",
  });
});

module.exports=router