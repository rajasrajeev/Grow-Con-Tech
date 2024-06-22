const { getAllStates, getDistricts } = require('../services/location.service');

const statesHandler = async (req, res, next) => {
    try {
        const data = await getAllStates();
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}

const districtHandler = async (req, res, next) => {
    try {
        const data = await getDistricts(parseInt(req.params.state_id));
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


module.exports = {
    statesHandler,
    districtHandler
}