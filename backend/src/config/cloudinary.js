// config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Add debug logging
console.log("Cloudinary configured with:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  configured: !!process.env.CLOUDINARY_API_KEY,
});

module.exports = {
  cloudinary,
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "myarchive-documents",
      resource_type: "auto",
    },
  }),
};
