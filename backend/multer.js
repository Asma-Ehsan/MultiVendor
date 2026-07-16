const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads");
        //cb is a callback function that takes 2 parameters. first is error(if any) and 2nd is path of a file in which images is going to store.
    },
    filename: function(req, file , cb){
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); //1e9 means: 1 × 10⁹ = 1,000,000,000 = 583472918
        const filename = file.originalname.split(".")[0];
        cb(null,filename + "-" + uniqueSuffix + ".png");
    }
});

exports.upload = multer({storage: storage});

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
Flow
===========================================

Client
    |
    ▼
Select Image
    |
    ▼
Submit Form
    |
    ▼
Express Route
    |
    ▼
upload Middleware (Multer)
    |
    ▼
Save File in uploads/
    |
    ▼
Controller Executes

Note:
The controller runs only AFTER Multer has successfully saved the uploaded file.

===========================================
multer.diskStorage()
===========================================

Code:

const storage = multer.diskStorage({...});

Purpose:

Creates a storage configuration.

It tells Multer:

1. Where should the uploaded file be stored?
2. What should the uploaded file be named?

diskStorage() DOES NOT save the file.

It only defines the rules for saving files.

===========================================
destination()
===========================================

Code:

destination: function(req, file, cb){

}

Purpose:

Decides where uploaded files should be stored.

Parameters:

req
- Express request object.

file
- Information about the uploaded file.

Example:

{
    fieldname: "avatar",
    originalname: "profile.jpg",
    mimetype: "image/jpeg",
    size: 24567
}

cb
- Callback function provided by Multer.
- Used to tell Multer the next step.

-------------------------------------------

Code:

cb(null, "uploads");

Callback format:

cb(error, value)

First parameter:

null

Means:
No error occurred.

Second parameter:

"uploads"

Means:

Store uploaded files inside:

uploads/

Example:

Project

backend/
    uploads/

Uploaded files will be saved in:

backend/uploads/

===========================================
filename()
===========================================

Code:

filename: function(req, file, cb){

}

Purpose:

Decides the name of the uploaded file.

Without this function:

If two users upload:

profile.png

the second upload could overwrite the first one.

Therefore, a unique filename is generated.

===========================================
uniqueSuffix
===========================================

Code:

const uniqueSuffix =
Date.now() + "-" +
Math.round(Math.random() * 1e9);

Purpose:

Creates a unique value for every uploaded file.

-------------------------------------------

Date.now()

Returns the current timestamp in milliseconds.

Example:

1721041200000

-------------------------------------------

Math.random()

Returns a random decimal number.

Example:

0.583472

-------------------------------------------

Math.random() * 1e9

1e9 means:

1 × 10^9

= 1,000,000,000

Example result:

583472918.29

-------------------------------------------

Math.round()

Rounds the number to the nearest integer.

Example:

583472918

-------------------------------------------

Final uniqueSuffix:

1721041200000-583472918

===========================================
Original Filename
===========================================

Code:

const filename =
file.originalname.split(".")[0];

Suppose user uploads:

cat.png

file.originalname

returns:

cat.png

split(".")

returns:

[
    "cat",
    "png"
]

Taking index [0]:

filename

becomes:

cat

===========================================
Final Filename
===========================================

Code:

cb(
    null,
    filename + "-" + uniqueSuffix + ".png"
);

Suppose:

filename = cat

uniqueSuffix = 1721041200000-583472918

Final filename:

cat-1721041200000-583472918.png

This unique filename prevents uploaded files from replacing each other.

-------------------------------------------

Note:

The code always adds ".png" to the filename.

Therefore, every uploaded file is saved with a .png extension regardless of its original extension.

===========================================
Creating Upload Middleware
===========================================

Code:

exports.upload = multer({
    storage: storage
});

Purpose:

Creates a Multer middleware using the storage configuration.

Now it can be imported into route files.

Example:

const { upload } = require("../multer");

Used in routes:

router.post(
    "/create-user",
    upload.single("avatar"),
    createUser
);

Flow:

Client Uploads Image
        |
        ▼
upload.single("avatar")
        |
        ▼
Multer Saves File
        |
        ▼
Controller Executes

===========================================
Connection with Other Files
===========================================

Connection with app.js

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

This makes the uploads folder publicly accessible.

If Multer saves:

uploads/cat-1721041200000-583472918.png

It can be accessed in the browser using:

http://localhost:8000/uploads/cat-1721041200000-583472918.png

===========================================
*/