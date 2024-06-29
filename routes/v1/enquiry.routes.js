const express = require('express');
const { 
    createEnquiryHandler,
    getEnquiriesHandler,
    updateNegotiationHandler
 } = require('../../controllers/enquiry.controller');
const { userAuth, checkRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

module.exports = (app) => {
    // Define routes for handling enquiries
    router.patch('/negotiation/:id', userAuth, checkRole(['VENDOR']), updateNegotiationHandler);
    router.post('/', userAuth,checkRole(['CONTRACTOR']), createEnquiryHandler);
    router.get('/', userAuth, getEnquiriesHandler);
    

    app.use('/api/v1/enquiry', router);
}