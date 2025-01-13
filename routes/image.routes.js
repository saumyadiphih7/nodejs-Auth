const express = require('express');
const {
  uploadImageController,
  getImagesController,
  deleteImageController,
} = require("../controllers/image.controller");
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminmiddleware');
const upload = require('../middlewares/uploadMiddleware');


const router = express.Router();

router.post("/upload", authMiddleware, adminMiddleware, upload.single("image"), uploadImageController);
router.get("/get", authMiddleware, getImagesController);
router.delete("/delete/:id", authMiddleware,adminMiddleware, deleteImageController);

module.exports = router;