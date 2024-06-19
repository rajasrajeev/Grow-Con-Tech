const express = require('express');
const uploadFiles = require('../../middlewares/image.middleware');
const {
    getProducts,
    createProducts,
    verifyProducts
} = require('../../controllers/product.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');


const router = express.Router();
const uploads = uploadFiles.fields([{name: 'image', maxCount: 3}]);

module.exports = (app) => {

    router.get('/', getProducts);
    router.post('/', createProducts);
    router.patch('/verify-product/:id', verifyProducts);


    app.use('/api/v1/products', router);
}