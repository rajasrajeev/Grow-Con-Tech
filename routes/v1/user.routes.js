const express = require('express');
const uploadFiles = require('../../middlewares/image.middleware');
const { 
    /* createUserHandler,
    verifyEmailHandler, */
    loginHandler,
    /* profileHandler,
    changePasswordHandler,
    forgotPasswordHandler,
    resetPasswordHandler */
} = require('../../controllers/user.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');


const router = express.Router();
const uploads = uploadFiles.fields([{name: 'image', maxCount: 1}]);

module.exports = (app) => {

    /* // authentication
    router.post('/signup', uploads, createUserHandler);
    router.patch('/verifyemail/:verificationCode', verifyEmailHandler); */
    router.post('/login', loginHandler);

   /*  // induvidual profile
    router.get('/profile', userAuth, profileHandler);
    router.patch('/update-public-profile', uploads, userAuth, updatePublicProfileHandler);
    router.patch('/update-doctor-profile', uploads, userAuth, updateDoctorProfileHandler);
    router.patch('/update-shop-profile', uploads, userAuth, updateShopProfileHandler); */
    
    /* // change and reset password
    router.patch('/change-password', userAuth, changePasswordHandler);
    router.post('/forgotpassword', forgotPasswordHandler);
    router.patch('/resetpassword/:resetToken', resetPasswordHandler); */
   /*  
    // for admin get list, detail update and deletion of all users
    router.get('/users', userAuth, checkRole(["admin"]), getUsersHandler);
    router.get('/shops', userAuth, checkRole(["admin"]), getShopsHandler);
    router.get('/doctors', userAuth, checkRole(["admin"]), getDoctorsHandler);
    router.delete('/delete/:id', userAuth, checkRole(["admin"]), deleteUserHandler);
    router.get('/detail/:id', userAuth, checkRole(["admin"]), userDetailHandler);
    router.patch('/update/:id', uploads, userAuth, checkRole(["admin"]), userUpdateHandler);
    router.patch('/verification/:id', userAuth, checkRole(["admin"]), verificationHandler); */

    app.use('/api/v1/accounts', router);
}