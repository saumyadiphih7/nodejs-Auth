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

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 2
  const skip = (page - 1) * limit


  const sortBy=req.query.sortBy || 'createdAt'
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1
  const totalImages=await Image.countDocuments()
  const totalPage = Math.ceil(totalImages / limit)
  
  const sortObj = {}
  sortObj[sortBy] = sortOrder
  
  const images = await Image.find().sort(sortObj).limit(limit).skip(skip);

  if (!images) {
    throw new Error("Failed to fetch images")
  }
  return res.status(200).json({
    message: "Images fetched successfully",
    totalPage: totalPage,
    currentPage: page,
    totalImages: totalImages,
    images
  })
});


const deleteImageController = asyncHandler(async (req, res) => {
  
   const { id } = req.params;
   const image = await Image.findById(id);

  if (!image) {
    throw new Error("Image not found");
  }

  if(image.uploadedBy.toString() !== req.user.id){
    throw new Error("You are not authorized to delete this image")
  }

  //delete from cloudinary
  await cloudinary.uploader.destroy(image.publicId);

  // delete from mongodb database
  await Image.findByIdAndDelete(id);

  return res.status(200).json({
    message: "Image deleted successfully"
    
  })
  
})

module.exports = {
  uploadImageController,
  getImagesController,
  deleteImageController
};
