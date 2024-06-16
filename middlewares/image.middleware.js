const path = require('path');
const multer = require('multer');

const maxSize = 1 * 1000 * 1000;
const imageMatch = ["image/png", "image/jpg", "image/jpeg"];


var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (imageMatch.indexOf(file.mimetype) >= 0)
            callback(null, path.join(`./uploads/dp/`));
    },

    filename: (req, file, callback) => {
        if (imageMatch.indexOf(file.mimetype) === -1) {
            return callback("Please use png/jp/jpeg", null);
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