const express = require('express');
const {
  uploadImageController,
  getImagesController,
  deleteImageController,
} = require("../controllers/image.controller");
const authMiddleware = require('../middlewares/authMiddleware.js');
const adminMiddleware = require('../middlewares/adminmiddleware.js');
const upload = require('../middlewares/uploadMiddleware.js');


const router = express.Router();

router.post("/upload", authMiddleware, adminMiddleware, upload.single("image"), uploadImageController);
router.get("/get", authMiddleware, getImagesController);
router.delete("/delete/:id", authMiddleware,adminMiddleware, deleteImageController);

module.exports = router;