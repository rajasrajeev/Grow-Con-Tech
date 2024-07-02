const express = require('express');
const { 
    getOrdersHandler,
    getOrderDetailsHandler
 } = require('../../controllers/order.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

module.exports = (app) => {
    router.get('/:id', userAuth, getOrderDetailsHandler);
    router.get('/', userAuth, getOrdersHandler);
    

    app.use('/api/v1/orders', router);
}