const doctorSchema = require("../schemas/doctor.schema");
const publicSchema = require("../schemas/public.schema");
const userSchema = require("../schemas/user.schema");
const shopSchema = require("../schemas/shop.schema");

const checkUserValidation = async (req, res) => {
    const {_, error} = userSchema.validate({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        type: req.body.type
    });
    if(error) return res.status(400).send({'data': error});

    else {
        return res.status(400).send({'message': 'Invalid user role'});
    }
}

module.exports = {checkUserValidation}