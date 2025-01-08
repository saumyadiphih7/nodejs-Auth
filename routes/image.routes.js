const express = require('express');
const {
  uploadImageController,
  getImagesController,
} = require("../controllers/image.controller");
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/uploadMiddleware');


const router = express.Router();

router.post("/upload", authMiddleware, adminMiddleware, upload.single("image"), uploadImageController);
router.get("/get", authMiddleware, getImagesController);

module.exports = router;