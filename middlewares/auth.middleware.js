const passport = require('passport');


const userAuth = passport.authenticate('jwt', {session: false});

const checkRole = roles => (req, res, next) => {
    let tRole = [];
    var value = 0;

    if(req.user.isUser) tRole.push("user");
    /* else if(req.user.isAdmin) tRole.push("admin");
    else if(req.user.isDoctor) tRole.push("doctor");
    else if(req.user.isPublic) tRole.push("public");
    else if(req.user.isShop) tRole.push("shop"); */
    // else if(req.user.isAdmin && req.user.isTrainer) tRole.push("admin", "trainer");

    
    tRole.forEach(function(word){
      value = value + roles.includes(word);
    });
    
    (value !== 1 && value < 1) 
        ? res.status(401).json({
            message: "Unauthorized",
            success: false
        })
        : next();
}

module.exports = {
    userAuth,
    checkRole
};