const express = require('express');
const {
    contractorListHandler,
    contractorDetailHandler,
    contractorStatusHandler
} = require('../../controllers/contractor.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');

const router = express.Router();


module.exports = (app) => {
    router.get('/:id', userAuth, contractorDetailHandler);
    router.patch('/:id', userAuth, checkRole(['BACKEND']), contractorStatusHandler);
    router.get('/', userAuth, contractorListHandler);
    
    app.use('/api/v1/contractors', router);
}