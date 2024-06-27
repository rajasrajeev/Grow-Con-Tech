const { createEmployee } = require('../services/backend.service');

const createEmployeeHandler = async (req, res, next) => {
    try {
        const data = await createEmployee(req.body);
        return res.status(201).send(data);
    } catch(err) {
        next(err);
    }
}

module.exports = {
    createEmployeeHandler
}