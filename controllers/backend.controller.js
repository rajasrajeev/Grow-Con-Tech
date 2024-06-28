const { createEmployee,
        getDailyRates 
} = require('../services/backend.service');


const createEmployeeHandler = async (req, res, next) => {
    try {
        const data = await createEmployee(req.body);
        return res.status(201).send(data);
    } catch(err) {
        next(err);
    }
}

const getDailyRatesHandler = async (req, res, next) => {
    try {
        const data = await getDailyRates(req.params.vendorid, req.query);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}

module.exports = {
    createEmployeeHandler,
    getDailyRatesHandler
}