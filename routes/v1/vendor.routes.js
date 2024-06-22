const express = require('express');
const {
    vendorListHandler,
    vendorDetailHandler,
    VendorStatusHandler
} = require('../../controllers/vendor.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');

const router = express.Router();


module.exports = (app) => {
    router.get('/:id', userAuth, checkRole(['BACKEND']), vendorDetailHandler);
    router.patch('/:id', userAuth, checkRole(['BACKEND']), VendorStatusHandler);
    router.get('/', userAuth, checkRole(['BACKEND']), vendorListHandler);
    
    app.use('/api/v1/vendors', router);
}