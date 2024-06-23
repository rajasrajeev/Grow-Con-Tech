const express = require('express');
const uploadFiles = require('../../middlewares/image.middleware');
const {
    getProducts,
    createProducts,
    deleteProduct,
    getGrades,
    getCategories
} = require('../../controllers/product.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');


const router = express.Router();
const uploads = uploadFiles.fields([{name: 'product_image', maxCount: 1}]);

module.exports = (app) => {

    router.get('/', userAuth, getProducts);
    router.post('/', userAuth, uploads, createProducts);
    router.delete('/:id', userAuth, deleteProduct);
    router.get('/grades', userAuth, getGrades);
    router.get('/categories', userAuth, getCategories);


    app.use('/api/v1/products', router);
}