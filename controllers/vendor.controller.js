const { getVendors, 
        getVendorDetail,
        updateVendorStatus } = require('../services/vendor.service');


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
        const data = await getVendorDetail(parseInt(req.params.state_id));
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


const VendorStatusHandler = async (req, res, next) => {
    try {
        const data = await updateVendorStatus(parseInt(req.params.state_id));
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


module.exports = {
    vendorListHandler,
    vendorDetailHandler,
    VendorStatusHandler
}