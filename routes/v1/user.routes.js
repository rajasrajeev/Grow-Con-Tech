const express = require('express');
const uploadFiles = require('../../middlewares/image.middleware');
const {
    loginHandler,
    helloHandler,
    uploadFilesController,
    signupController,
    doVerification
} = require('../../controllers/user.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');


const router = express.Router();
const uploads = uploadFiles.fields([{name: 'image', maxCount: 3}]);

module.exports = (app) => {

    router.post('/login', loginHandler);
    router.post('/upload-files', uploads, uploadFilesController );
    router.post('/signup', signupController );
    router.patch('/verify/:id', doVerification)


    app.use('/api/v1/accounts', router);
}