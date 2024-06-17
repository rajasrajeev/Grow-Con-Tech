const { 
    /* signup,  */
    signin,
    alreadyExist, 
    /* emailVerification,
    profile,
    passwordChange,
    resetPassword,
    forgotPassword */
} = require("../services/user.service");
const { checkUserValidation } = require("../utils/user.validation");


/* const createUserHandler = async (req, res, next) => {
    try {
        await checkUserValidation(req, res);

        const exist = await alreadyExist(req.body.email);
        if(exist) return res.status(400).send({'message': exist});

        const url = req.protocol + '://' + req.get("host");
        await signup(url, req.body, req.files);

        return res.status(201).send({
            status: 'success',
            message: 'An email with a verification code has been sent to your email',
        });
    } catch(err) {
        next(err);
    }

}


const verifyEmailHandler = async(req, res, next) => {
    try {
        await emailVerification(req.params.verificationCode);
        return res.status(200).send({message: "Your email is verified"});
    } catch(err) {
        next(err);
    }
} */


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


/* const profileHandler = async(req, res, next) => {
    try {
        const data = await profile(req.user);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


const changePasswordHandler = async (req, res, next) => {
    try {
        const {old_password, new_password} = req.body;
        await passwordChange(old_password, new_password, req.user);
        return res.status(200).send({'message': 'Password changes successfully'});
    } catch(err) {
        next(err);
    } 
}


const forgotPasswordHandler = async (req, res, next) => {
    try {   
        await forgotPassword(req.body.email);
        return res.status(200).send({
            message: 'You will receive a reset email if user with that email exist'
        });
    } catch(err) {
        next(err);
    }
}


const resetPasswordHandler = async (req, res, next) => {
    try {
        await resetPassword(req.params.resetToken, req.body.password);
        return res.status(200).send({
            message: 'Password updated successfully'
        });
    } catch(err) {
        next(err);
    }
} */

module.exports = {
    /* createUserHandler,
    verifyEmailHandler, */
    loginHandler,
    helloHandler
    /* profileHandler,
    changePasswordHandler,
    forgotPasswordHandler,
    resetPasswordHandler */
}