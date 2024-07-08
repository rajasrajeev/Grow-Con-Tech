const { getVendors, 
        getVendorDetail,
        updateVendorStatus,
        getMiniList,
        updateCreditLimit
    } = require('../services/vendor.service');


const vendorListHandler = async (req, res, next) => {
    try {
        const data = await getVendors(req.query);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


const vendorDetailHandler = async (req, res, next) => {
    try {
        const data = await getVendorDetail(req.params.id);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


const vendorStatusHandler = async (req, res, next) => {
    try {
        const data = await updateVendorStatus(parseInt(req.params.id), req.body);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}

const vendorMiniHandler = async (req, res, next) => {
    try {
        const data = await getMiniList(req.query);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}

const updateCreditLimitHandler = async (req, res, next) => {
    try {
        const data = await updateCreditLimit(req.body, parseInt(req.params.id), req.user);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


module.exports = {
    vendorListHandler,
    vendorDetailHandler,
    vendorStatusHandler,
    vendorMiniHandler,
    updateCreditLimitHandler
}