const Image = require("../models/image.model");
const { uploadToCloudinary } = require("../helper/cloudinaryHelper.js");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const asyncHandler = require("express-async-handler");

const uploadImageController = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { url, publicId } = await uploadToCloudinary(req.file.path);

  const image = new Image({
    url,
    publicId,
    uploadedBy: req.user.id,
  });

  await image.save();

  if (!image) {
    throw new Error("Failed to save image to database");
  }

  fs.unlinkSync(req.file.path);
  return res.status(201).json({
    message: "Image uploaded successfully",
    image,
  });
});


const getImagesController = asyncHandler(async (req, res) => { 
  const images = await Image.find();

  if (!images) {
    throw new Error("Failed to fetch images")
  }
  return res.status(200).json({
    message: "Images fetched successfully",
    images
  })
});

module.exports = {
  uploadImageController,
  getImagesController,
};
