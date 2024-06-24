const express = require('express');
const uploadFiles = require('../../middlewares/image.middleware');
const {
    getProductsHandler,
    createProductsHandler,
    deleteProductHandler,
    getGradesHandler,
    getCategoriesHandler,
    updateProductsHandler,
    getUnitHandler,
    getDailyRatesForVendorHandler,
    updateDailyRatesForVendorHandler
} = require('../../controllers/product.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');


const router = express.Router();
const uploads = uploadFiles.fields([{name: 'product_image', maxCount: 1}]);

module.exports = (app) => {

    router.get('/', userAuth, getProductsHandler);
    router.post('/', userAuth, uploads, createProductsHandler);
    router.patch('/:id', userAuth, uploads, updateProductsHandler)
    router.delete('/:id', userAuth, deleteProductHandler);
    router.get('/grades', userAuth, getGradesHandler);
    router.get('/categories', userAuth, getCategoriesHandler);
    router.get('/unit', userAuth, getUnitHandler);
    router.get('/daily-rates', userAuth, getDailyRatesForVendorHandler);
    router.post('/daily-rates', userAuth, updateDailyRatesForVendorHandler)


    app.use('/api/v1/products', router);
}