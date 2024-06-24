const express = require('express');
const {
    vendorListHandler,
    vendorDetailHandler,
    vendorStatusHandler,
    vendorMiniHandler
} = require('../../controllers/vendor.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');

const router = express.Router();


module.exports = (app) => {
    router.get('/:id', userAuth, checkRole(['BACKEND']), vendorDetailHandler);
    router.patch('/:id', userAuth, checkRole(['BACKEND']), vendorStatusHandler);
    router.get('/', userAuth, checkRole(['BACKEND']), vendorListHandler);
    router.get('/vendor-min', userAuth, vendorMiniHandler);
    app.use('/api/v1/vendors', router);
}