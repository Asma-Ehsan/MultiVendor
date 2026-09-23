const {Readable} = require("stream");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        
        //cloudinary.uploader.upload_stream(options, callback): Cloudinary's own method for streaming uploads (uploading data piece-by-piece instead of all at once).
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder, //put this in the given folder
                resource_type: "image", //treat it as an image.
            },
            // Callback runs after the upload finishes:
            (error, result) => {
                if(error) reject(error);
                resolve(result); //result contains info like public_id and secure_url
            }
        );
        // converts buffer to a stream and feeds it directly into Cloudinary's upload stream
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

//Readable.from(fileBuffer).pipe(uploadStream);
/*
- fileBuffer is the raw image data, just sitting as one big chunk in memory (given to you by multer).

- Readable.from(fileBuffer) turns that one big chunk into a stream — a "flow" that releases data little by little, instead of all at once. Think of it like turning a filled water bucket into a hose that lets water flow out steadily.

- uploadStream (created above it by cloudinary.uploader.upload_stream(...)) is Cloudinary's intake pipe — it's waiting to receive a stream of data and upload it as it arrives.

- .pipe(uploadStream) connects the hose directly to the intake pipe. Now data flows automatically: fileBuffer → (converted to stream) → pipe → uploadStream → Cloudinary's servers. You don't have to manually read and send chunks yourself — .pipe() does that connecting and flowing for you.
*/

//Interview:
/*
"Instead of saving uploaded images on my own server's disk, I stream them directly to Cloudinary using their upload_stream API. I convert the file buffer into a readable stream and pipe it into Cloudinary's upload stream. This returns a secure_url and public_id, which I then save in my MongoDB document, so my database only stores links, not actual image files."
*/