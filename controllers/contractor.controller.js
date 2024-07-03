const { 
        getContractors, 
        getContractorDetail,
        updateContractorStatus,
        getContractorForVendor,
        getContractorDetailForVendor 
    } = require('../services/contractor.service');


const contractorListHandler = async (req, res, next) => {
    try {
        const data = await getContractors(req.query);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}
const getContractorForVendorHandler = async (req, res, next) => {
    try {
        const data = await getContractorForVendor(req.user, req.query);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


const contractorDetailHandler = async (req, res, next) => {
    try {
        const data = await getContractorDetail(req.params.id);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}
const getContractorDetailForVendorHandler = async (req, res, next) => {
    try {
        const data = await getContractorDetailForVendor(req.params.id);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


const contractorStatusHandler = async (req, res, next) => {
    try {
        const data = await updateContractorStatus(parseInt(req.params.id), req.body);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


module.exports = {
    contractorListHandler,
    contractorDetailHandler,
    contractorStatusHandler,
    getContractorForVendorHandler,
    getContractorDetailForVendorHandler
}