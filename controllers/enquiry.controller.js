const { createEnquiry, 
    getEnquiries,
    updateNegotiation, getContractors, getEnquiryDetails } = require('../services/enquiry.service');


const createEnquiryHandler = async (req, res, next) => {
    try {
        const data = await createEnquiry(req.user, req.body);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


const getEnquiriesHandler = async (req, res, next) => {
    try {
        const data = await getEnquiries(req.user.vendor.id, req.query);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


const updateNegotiationHandler = async (req, res, next) => {
    try {
        const data = await updateNegotiation(parseInt(req.params.id), req.body, req.user);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}

const getContractorsHandler = async (req, res, next) => {
    try {
        const data = await getContractors(req.user);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}

const getEnquiryDetailsHandler = async (req, res, next) => {
    try {
        const data = await getEnquiryDetails(parseInt(req.params.id), req.user);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


module.exports = {
    createEnquiryHandler,
    getEnquiriesHandler,
    updateNegotiationHandler,
    getContractorsHandler,
    getEnquiryDetailsHandler
}