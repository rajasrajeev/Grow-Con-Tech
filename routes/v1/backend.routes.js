const express = require('express');
const { createEmployeeHandler,
        getDailyRatesHandler,
        updateDailyRatesHandler
 } = require('../../controllers/backend.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

module.exports = (app) => {
    router.post('/create-employee', userAuth, checkRole(['BACKEND']), createEmployeeHandler);
    router.get('/products/:id', userAuth, checkRole(['BACKEND']), getDailyRatesHandler);
    router.post('/products/daily-rates', userAuth, checkRole(['BACKEND']), updateDailyRatesHandler);

    app.use('/api/v1/backend', router);
}