const express = require('express');
const { createEmployeeHandler } = require('../../controllers/backend.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

module.exports = (app) => {
    router.post('/create-employee', userAuth, checkRole(['BACKEND']), createEmployeeHandler);

    app.use('/api/v1/backend', router);
}