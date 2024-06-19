const { 
    signin,
    alreadyExist,
    signup,
    verificationUpdate
} = require("../services/user.service");
const { checkUserValidation } = require("../utils/user.validation");




const loginHandler = async(req, res, next) => {
    try {
        const {username, password} = req.body;

        if(username === '' || password === '') {
            return res.status(400).send({'message': "Please enter email and password"});
        }

        const data = await signin(username, password);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}

const helloHandler = async(req, res, next) => {
    try {
        const data = {
            message: "Hello World!"
        };
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}

const uploadFilesController = async(req, res, next) => {
    try {
        const url = req.protocol + '://' + req.get("host");
        console.log(req.files); // Corrected to req.file

        if (!req.files) {
            return res.status(400).send({ message: "No file uploaded" });
        }

        return res.status(200).send({ "url": url + "/uploads/files/" + req.files.image[0].originalname});
    } catch (err) {
        next(err);
    }
}
const signupController = async(req, res, next) => {
    try {
        const data = await signup(req.body);
        if(data) {
            return res.status(200).send(data);
        } else {
            return res.status(500).send({ message: "Signup not successfull!!!" });
        }
        
    } catch (err) {
        next(err);
    }
}
const doVerification = async(req, res, next) => {
    try {
        const data = await verificationUpdate(parseInt(req.params.id, 10));
        return res.status(200).send({ message : "Verification done successfully!!!"});
    } catch(err) {
        next(err);
    }
}

module.exports = {
    loginHandler,
    helloHandler,
    uploadFilesController,
    signupController,
    doVerification
}