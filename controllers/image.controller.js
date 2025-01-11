const Image = require("../models/image.model");
const { uploadToCloudinary } = require("../helper/cloudinaryHelper.js");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const asyncHandler = require("express-async-handler");


//controller for image upload
const uploadImageController = asyncHandler(async (req, res) => {

  //gettng the image from the request
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }


  //uploading the image to cloudinary
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

  //delete image from the server
  fs.unlinkSync(req.file.path);


  return res.status(201).json({
    message: "Image uploaded successfully",
    image,
  });
});



//controller for getting images
const getImagesController = asyncHandler(async (req, res) => { 


  //page no 
  const page = parseInt(req.query.page) || 1

  //limit in each page
  const limit = parseInt(req.query.limit) || 2
  const skip = (page - 1) * limit


  //By which we are sorting
  const sortBy = req.query.sortBy || 'createdAt'

  // in which order we are sorting
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

  const totalImages=await Image.countDocuments()
  const totalPage = Math.ceil(totalImages / limit)
  

  //creating a sort object 
  const sortObj = {}

  //sort object key will be sortBy and value will be sortOrder (key-value)
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

//delete image controller
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
