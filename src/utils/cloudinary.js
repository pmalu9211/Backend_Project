import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file uploaded successfully,
    console.log("FILE UPLOADED ON CLOUDNARY");
    // console.log(response);
    fs.unlinkSync(localFilePath); //remove the locally
    return response;
  } catch (error) {
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      console.log("error", error);
    } //remove the locally savved temp file as the upload failed
  }
};

export default uploadOnCloudinary;
