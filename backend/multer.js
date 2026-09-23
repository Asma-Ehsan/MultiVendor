const multer = require("multer");

//Creates a storage engine that keeps files in memory (RAM) instead of disk.
const storage = multer.memoryStorage();

exports.upload = multer({
    storage, //tells multer to use the memory storage engine we just created.
    limits: {
        fileSize: 5 * 1024 * 1024, //sets a maximum file size: 5 * 1024 * 1024 bytes = 5 MB.
    }
});

/*
===========================================
Multer
===========================================

Purpose:

Express can read:

- JSON data (express.json())
- URL-encoded form data (express.urlencoded())

But it CANNOT read uploaded files (images, PDFs, videos, etc.).

Multer is a middleware that handles file uploads.

This file configures Multer to:
- Receive uploaded files.
- Save them into the uploads folder.
- Give each file a unique filename.


===========================================
multer.memoryStorage() / .diskStorage();
===========================================

Multer gives you two storage choices:

1. diskStorage — saves the uploaded file directly onto your server's hard disk as an actual file.

2. memoryStorage — keeps the uploaded file in RAM (memory), as a Buffer (raw binary data), and does not save it to disk at all.

==========================================
Flow (full picture, request journey)

1. User picks images in a form and submits.
2. Request arrives with Content-Type: multipart/form-data.
3. Multer (upload.array("images")) intercepts it, reads the files, and stores them as buffers in RAM. It attaches them to req.files.
4. Control passes to your controller function.
5. Controller loops over req.files, calls uploadToCloudinary(file.buffer, "products") for each one.
6. uploadToCloudinary streams each buffer to Cloudinary.
7. Cloudinary returns public_id and secure_url.
8. Your controller saves these URLs into MongoDB.
*/