const { getOrders } = require('../services/order.service');

const getOrdersHandler = async (req, res, next) => {
    try {
        const data = await getOrders(req.query, req.user);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


module.exports = {
    getOrdersHandler
}