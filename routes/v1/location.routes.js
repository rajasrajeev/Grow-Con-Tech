const express = require('express');
const {
    statesHandler,
    districtHandler,
} = require('../../controllers/location.controller');

const router = express.Router();

module.exports = (app) => {
    router.get('/states', statesHandler);
    router.get('/districts/:state_id', districtHandler);

    app.use('/api/v1/locations', router);
}