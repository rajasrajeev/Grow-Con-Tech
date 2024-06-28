const express = require('express');
const { createEmployeeHandler,
        getDailyRatesHandler
 } = require('../../controllers/backend.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

module.exports = (app) => {
    router.post('/create-employee', userAuth, checkRole(['BACKEND']), createEmployeeHandler);
    router.get('/products/:id', userAuth, checkRole(['BACKEND']), getDailyRatesHandler);

    app.use('/api/v1/backend', router);
}