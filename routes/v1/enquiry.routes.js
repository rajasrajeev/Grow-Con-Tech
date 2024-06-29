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
    router.post('/', userAuth,checkRole(['CONTRACTOR']), createEnquiryHandler);
    router.get('/', userAuth, getEnquiriesHandler);
    router.patch('/negotiation/:id', userAuth, checkRole(['VENDOR']), updateNegotiationHandler);

    app.use('/api/v1/enquiry', router);
}