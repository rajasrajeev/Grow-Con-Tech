const express = require('express');
const { 
    createEnquiryHandler,
    getEnquiriesHandler,
    updateNegotiationHandler,
    getContractorsHandler,
    getEnquiryDetailsHandler
 } = require('../../controllers/enquiry.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

module.exports = (app) => {
    // Define routes for handling enquiries
    router.patch('/negotiation/:id', userAuth, updateNegotiationHandler);
    router.get('/contractors', userAuth, checkRole(['VENDOR']), getContractorsHandler);
    router.get('/:id', userAuth, checkRole(['VENDOR']), getEnquiryDetailsHandler);
    router.post('/', userAuth,checkRole(['CONTRACTOR']), createEnquiryHandler);
    router.get('/', userAuth, getEnquiriesHandler);
    

    app.use('/api/v1/enquiry', router);
}