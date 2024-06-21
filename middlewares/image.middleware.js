const path = require('path');
const multer = require('multer');

const maxSize = 1 * 5000 * 5000;

const fileMatch = [
    "image/png", 
    "image/jpg", 
    "image/jpeg", 
    "application/pdf", 
    "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
    "text/csv", 
    "application/vnd.ms-excel", 
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];

var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (fileMatch.indexOf(file.mimetype) >= 0)
            callback(null, path.join(`./uploads/files/`));
    },

    filename: (req, file, callback) => {
        if (fileMatch.indexOf(file.mimetype) === -1) {
            return callback("Invalid file format", null);
        }
        // Append file name with current datetime and make name unique
        var filename = `${file.originalname}`;
        callback(null, filename);
    }
});


let uploadFiles = multer({
    storage: storage,
    limits: { fileSize: maxSize}
});
module.exports = uploadFiles;