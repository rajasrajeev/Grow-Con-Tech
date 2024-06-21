const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {SECRET, ORIGIN_URL} = require("../config/index");
const { Email } = require('../utils/email.util');
const { prisma } = require("../utils/prisma");
const { createPaginator } = require('prisma-pagination');

const paginate = createPaginator();


const alreadyExistingEmail = async (email) => {
    const user = await prisma.user.findFirst({
        where: {
            username: email
        }
    });
    return user ? true : false;
}

const alreadyExistingPhone = async (phone) => {
    const user = await prisma.vendor.findFirst({
        where: {
            phone: phone
        }
    });
    return user ? true : false;
}

const generatePasswordHash = async (password) => {
    const salt = await bcrypt.genSaltSync(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}


const generateToken = (user) => {
    const token = jwt.sign({
        user_id: user.id,
        email: user.username,
        role: user.role
    }, SECRET, {expiresIn: "7 days"});

    const result = {
        role: user.role,
        token: `Bearer ${token}`,
        expiresIn: 168
    } 

    return result;
}


const signin = async (username, password) => {
    const user = await prisma.user.findFirst({
        where: {
            username: username
        },
        include: { vendor: true, contractor: true, warehouse: true, backend: true }
    });

    if (!user) throw ({status: 401, message: "Invalid user credentials!!"});
    if(!user.verified) throw ({status: 401, message: "Email not verified"});

    console.log(user.role);

    const isMatch = await bcrypt.compare(password, user.password);

    if(isMatch) {
        let userData;
        switch (user.role) {
            case 'VENDOR':
              userData = user.vendor;
              break;
            case 'CONTRACTOR':
              userData = user.contractor;
              break;
            case 'WAREHOUSE':
              userData = user.warehouse;
              break;
            case 'BACKEND':
              userData = user.backend;
              break;
          }
        const data = generateToken(user);
        return {
            token: data,
            user: {
                ...user,
                roleData: userData
            }
        };
    } else {
        throw ({status: 401, message: "Invalid user credentials"});
    } 
}


const signup = async (body, files) => {
    const emailExists = await alreadyExistingEmail(body.email);
    if(emailExists) {
        throw ({status: 400, message: "User with same email id already exists!"});
    }

    const phoneExists = await alreadyExistingPhone(body.phone);
    if(phoneExists) {
        throw ({status: 400, message: "User with same mobile number id already exists!"});
    }

    const { password, role} = body;
    const hashedPassword = await generatePasswordHash(password);

    const user = await prisma.user.create({
        data: {
            username: body.email,
            password: hashedPassword,
            role: role,
            last_logged_in: null,
            verified: false
        },
    });

    if (user) {
        const profile = await createProfile(body, user.id, files);

        if (profile) {
           return true;
        } else {
            throw ({status: 400, message: "Can't create profile, please check provided informations"});
        }

    } else {
        throw ({status: 400, message: "Can't signup, please check provided informations"});
    }
}


const createProfile = async (body, userId, files) => {
    const {role} = body;
    if (role === 'VENDOR') {
        const user = await prisma.vendor.create({
            data: {
                company_name: body.company_name,
                phone: body.phone,
                email: body.email,
                pin: body.pin,
                address: body.address,
                pan: files.pan[0].path,
                gst: files.gst[0].path,
                licence: files.license[0].path,
                pan_no: body.pan_no,
                gst_no: body.gst_no,
                licence_no: body.license_no,
                city: body.city,
                status: "Pending",
                user: {
                    connect: { id: userId }
                },
                district: {
                    connect: { id: parseInt(body.districtId, 10) }
                },
                state: {
                    connect: { id: parseInt(body.stateId, 10) }
                }
            },
        });
        return user;

    } else if (role === 'CONTRACTOR') {
        const contractor = await prisma.contractor.create({
            data: {
                user: {
                    connect: { id: userId } // Connect to an existing user with ID 7
                    // or if you need to create a new user
                    // create: { /* user data here */ }
                },
                name: body.name,
                company_name: body.company_name,
                phone: body.phone,
                email: body.email,
                licence: body.licence
            },
        });
        return contractor;

    } else if (role === 'WAREHOUSE') {
        const warehouse = await prisma.warehouse.create({
            data: {
                user: {
                    connect: { id: userId } // Connect to an existing user with ID 7
                    // or if you need to create a new user
                    // create: { /* user data here */ }
                },
                name: body.name,
                location: body.location,
                incharge_name: body.incharge_name
            },
        });
        return warehouse;

    } else {
        const backend = await prisma.backend.create({
            data: {
                user: {
                    connect: { id: userId } // Connect to an existing user with ID 7
                    // or if you need to create a new user
                    // create: { /* user data here */ }
                },
                name: body.name,
                phone: body.phone,
                email: body.email
            },
        });
        return backend;
    }
}


const verificationUpdate = async (id) => {
    try {
      const user = await prisma.user.update({
          where: {
              id: id
          },
          data: {
              verified: true,
              verification_code: null
          }
      });
      return user;

    } catch(err) {
        console.log(err)
        throw ({status: 403, message: "Cannot verify email!"});
    }
}


module.exports = {
    signin,
    signup,
    verificationUpdate
}

/* try {
    user.name = profile.name;
    const redirectUrl = `${ORIGIN_URL}/verifyemail/${verifyCode}`;
    await new Email(user, password, redirectUrl).sendVerificationCode();
} catch(err) {
    await prisma.user.update({
        where: {
            id: user.id
        },
            verificationCode: null
        }
    });
    throw ({status: 403, message: err});
} */