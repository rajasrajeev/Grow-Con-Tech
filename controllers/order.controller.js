const { getOrders, getOrderDetails, uploadEBills } = require('../services/order.service');

const getOrdersHandler = async (req, res, next) => {
    try {
        const data = await getOrders(req.query, req.user);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}
const getOrderDetailsHandler = async (req, res, next) => {
    try {
        const data = await getOrderDetails(req.params.id, req.user);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}
const uploadEBillsHandler = async (req, res, next) => {
    try {
        const data = await uploadEBills(req.params.id, req.files, req.user);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


module.exports = {
    getOrdersHandler,
    getOrderDetailsHandler,
    uploadEBillsHandler
}