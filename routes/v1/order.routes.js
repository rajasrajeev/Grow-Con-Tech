const express = require('express');
const uploadFiles = require('../../middlewares/image.middleware');
const { 
    getOrdersHandler,
    getOrderDetailsHandler,
    uploadEBillsHandler
 } = require('../../controllers/order.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

const uploads = uploadFiles.fields([{name: 'e_bill', maxCount: 1},{name: 'e_way_bill', maxCount: 30}]);

module.exports = (app) => {
    router.patch('/:id', userAuth, checkRole(['VENDOR']), uploads, uploadEBillsHandler);
    router.get('/:id', userAuth, getOrderDetailsHandler);
    router.get('/', userAuth, getOrdersHandler);
    

    app.use('/api/v1/orders', router);
}