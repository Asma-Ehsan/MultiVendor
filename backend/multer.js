const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null, "uploads");
        //cb is a callback function that takes 2 parameters. first is error(if any) and 2nd is path of a file in which images is going to store.
    },
    filename: function(req, file , cb){
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = file.originalname.split(".")[0];
        cb(null,filename + "-" + uniqueSuffix + ".png");
    }
});

exports.upload = multer({storage: storage});