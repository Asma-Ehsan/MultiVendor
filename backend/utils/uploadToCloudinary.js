const {Readable} = require("stream");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if(error) reject(error);
                resolve(result);
            }
        );
        Readable.from(fileBuffer).pipe(uploadStream);
    });
};

module.exports = uploadToCloudinary;

/*
This helper receives an image buffer and returns Cloudinary’s result:
{
  public_id: "...",
  secure_url: "https://res.cloudinary.com/..."
}
*/