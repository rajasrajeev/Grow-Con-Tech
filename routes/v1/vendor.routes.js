const express = require('express');
const {
    vendorListHandler,
    vendorDetailHandler,
    vendorStatusHandler,
    vendorMiniHandler,
    updateCreditLimitHandler
} = require('../../controllers/vendor.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');

const router = express.Router();


module.exports = (app) => {
    router.patch('/:id/update-credit', userAuth, checkRole(['VENDOR']), updateCreditLimitHandler);
    router.get('/vendor-mini', userAuth, vendorMiniHandler);
    router.get('/:id', userAuth, checkRole(['BACKEND']), vendorDetailHandler);
    router.patch('/:id', userAuth, checkRole(['BACKEND']), vendorStatusHandler);
    router.get('/', userAuth, checkRole(['BACKEND']), vendorListHandler);
    
    app.use('/api/v1/vendors', router);
}