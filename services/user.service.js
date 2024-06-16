const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {SECRET, ORIGIN_URL} = require("../config/index");
const { Email } = require('../utils/email.util');
const { prisma } = require("../utils/prisma");
const { createPaginator } = require('prisma-pagination');

const paginate = createPaginator();

const alreadyExist = async (email) => {
    const user = await prisma.user.findFirst({
        where: {
            username: email
        }
    });
    if(user) return "User with same email already exists";
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
        role: role,
        token: `Bearer ${token}`,
        expiresIn: 168
    } 

    return result;
}

/* // const getCountry = async(id) => {
//     const country = await prisma.country.findFirst({
//         where: {
//             id: id
//         }
//     });
//     return country;
// }

// const getState = async(id) => {
//     const state = await prisma.state.findFirst({
//         where: {
//             id: id
//         }
//     });
//     return state;
// }

// const getDistrict = async(id) => {
//     const district = await prisma.district.findFirst({
//         where: {
//             id: id
//         }
//     });
//     return district;
// }

const createProfile = async (url, payload, files, userId) => {
    const {role} = payload;

    if (role === "public") {
        const user = await prisma.public.create({
            data: {
                name: payload.name,
                address: payload.address,
                image: (files.image) ? `${url}/${files.image[0].path}` : '',
                user: {connect: { id: userId }},
                country: {connect: { id: parseInt(payload.countryId) }},
                state: {connect: { id: parseInt(payload.stateId) }},
                district: { connect: {id: parseInt(payload.districtId) }}
            },
        });
        return user;

    } else if (role === "shop") {
        const shop = await prisma.shop.create({
            data: {
                name: payload.name,
                phone: payload.phone,
                type: payload.type,
                address: payload.address,
                user: {connect: { id: userId }},
                country: {connect: { id: parseInt(payload.countryId) }},
                state: {connect: { id: parseInt(payload.stateId) }},
                district: { connect: {id: parseInt(payload.districtId) }},
                image: (files.image) ? `${url}/${files.image[0].path}` : '',
            },
        });
        return shop;
    } else {
        const doctor = await prisma.doctor.create({
            data: {
                name: payload.name,
                address: payload.address,
                speciality: payload.speciality,
                user: {connect: { id: userId }},
                country: {connect: { id: parseInt(payload.countryId) }},
                state: {connect: { id: parseInt(payload.stateId) }},
                district: { connect: {id: parseInt(payload.districtId) }},
                image: (files.image) ? `${url}/${files.image[0].path}` : '',
            },
        });
        return doctor;
    }
}


const signup = async (url, payload, files) => {
    const {email, username, password, role} = payload;
    const hashedPassword = await generatePasswordHash(password);
    const verifyCode = crypto.randomBytes(32).toString('hex');
    const verificationCode = crypto
      .createHash('sha256')
      .update(verifyCode)
      .digest('hex');

    const user = await prisma.user.create({
        data: {
            email: email,
            username: username,
            password: hashedPassword,
            isPublic: (role === "public") ? true : false,
            isDoctor: (role === "doctor") ? true : false,
            isShop: (role === "shop") ? true : false,
            verificationCode: verificationCode
        },
    });

    if (user) {
        const profile = await createProfile(url, payload, files, user.id);

        if (profile) {
            try {
                user.name = profile.name;
                const redirectUrl = `${ORIGIN_URL}/verifyemail/${verifyCode}`;
                await new Email(user, password, redirectUrl).sendVerificationCode();
            } catch(err) {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        verificationCode: null
                    }
                });
                throw ({status: 403, message: err});
            }
        } else {
            throw ({status: 400, message: "Can't create profile, please check provided informations"});
        }
    } else {
        throw ({status: 400, message: "Can't signup, please check provided informations"});
    }
}


const emailVerification = async(verifyCode) => {
    try {
        const verificationCode = crypto
        .createHash('sha256')
        .update(verifyCode)
        .digest('hex');
  
      const user = await prisma.user.update({
          where: {
              verificationCode: verificationCode
          },
          data: {
              verified: true,
              verificationCode: null
          }
      });
      return user;

    } catch(err) {
        throw ({status: 403, message: "Cannot verify email!"});
    }
} */


const signin = async (username, password) => {
    const user = await prisma.user.findFirst({
        where: {
            username: username
        },
        include: { vendor: true, contractor: true, warehouse: true, backend: true }
    });

    if (!user) throw ({status: 401, message: "Invalid user credentials!"});
    if(!user.verified) throw ({status: 401, message: "Email not verified"});

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


/* const profile = async (user) => {
    var profileDetail = {};

    if(user.isAdmin) {
        profileDetail = {
            id: user.id,
            email: user.email,
            username: user.username
        };
    }  else {
        profileDetail = await prisma.user.findFirst({
            where: {
                id: user.id
            },
			select: {
				id: true,
				email: true,
				username: true,
				doctor: true,
                shop: true,
                public: true
			}
        });
    }
    return profileDetail;
}


const passwordChange = async (old_password, new_password, user) => {
    const isMatch = await bcrypt.compare(old_password, user.password);

    if(isMatch) {
        const hashedPassword = await generatePasswordHash(new_password);
        const data = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: hashedPassword
            }
        });

        if(!data) throw({status: 404, message: "Cannot change password"});
        
        return data;
    
    } else {
        throw ({status: 401, message: "Incorrect password"});
    }
}


const forgotPassword = async(email) => {
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    if(!user) 
        throw ({status: 404, message: "User not found"});

    if(user && !user.verified)
        throw ({status: 401, message: "Account not verified"});
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            passwordResetToken: passwordResetToken,
            passwordResetAt: new Date(Date.now() + 10 * 60 * 1000)
        }
    });

    try {
        if(user.isAdmin) user.name = "Admin";
        else if(user.isShop) user.name = user.shop.name;
        else if(user.isPublic) user.name = user.public.name;
        else user.name = user.doctor.name;

        const url = `${ORIGIN_URL}/resetPassword/${resetToken}`;
        await new Email(user, '', url).sendPasswordResetToken();
    } catch(err) {
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                passwordResetToken: null, 
                passwordResetAt: null
            }
        });
        throw ({status: 403, message: "Cannot send email!"});
    }

    return user;
}


const resetPassword = async(resetToken, password) => {
    const passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const user = await prisma.user.findFirst({
        where: {
            passwordResetToken: passwordResetToken,
            passwordResetAt: {
                gt: new Date(),
            }
        }
    });

    if(!user) throw ({status: 401, message: "Invalid token or token has expired"});

    const hashedPassword = await bcrypt.hash(password, 12);

    const updated = await prisma.user.update({
        where: {
            id: user.id
        }, 
        data: {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetAt: null
        }
    });

    return updated;
} */


/* const publicProfileUpdate = async(url, user, payload, files) => {
    const { name, address, countryId, stateId, districtId } = payload;
    const publics = await prisma.public.findFirst({
        where: {
            userId: user.id
        },
        select: {
            image: true
        }
    });

    const updatedUser = await prisma.public.update({
        where: {
            userId: user.id
        },
        data: {
            name: name,
            address: address,
            country: {connect: { id: parseInt(countryId) }},
            state: {connect: { id: parseInt(stateId) }},
            district: { connect: {id: parseInt(districtId) }},
            image: (files.image) ? `${url}/${files.image[0].path}` : publics.image,
        }
    });

    return updatedUser;
}


const doctorProfileUpdate = async(url, user, payload, files) => {
    const { name, address, speciality, countryId, stateId, districtId } = payload;
    const doctor = await prisma.doctor.findFirst({
        where: {
            userId: user.id
        },
        select: {
            image: true
        }
    });

    const updatedUser = await prisma.doctor.update({
        where: {
            userId: user.id
        },
        data: {
            name: name,
            address: address,
            country: {connect: { id: parseInt(countryId) }},
            state: {connect: { id: parseInt(stateId) }},
            district: { connect: {id: parseInt(districtId) }},
            speciality: speciality,
            image: (files.image) ? `${url}/${files.image[0].path}` : doctor.image
        }
    });

    return updatedUser;
}


const shopProfileUpdate = async(url, user, payload, files) => {
    const { name, address, type, phone, countryId, stateId, districtId } = payload;
    const shop = await prisma.shop.findFirst({
        where: {
            userId: user.id
        },
        select: {
            image: true
        }
    });

    const updatedUser = await prisma.shop.update({
        where: {
            userId: user.id
        },
        data: {
            name: name,
            address: address,
            country: {connect: { id: parseInt(countryId) }},
            state: {connect: { id: parseInt(stateId) }},
            district: { connect: {id: parseInt(districtId) }},
            type: type,
            phone: phone,
            image: (files.image) ? `${url}/${files.image[0].path}` : shop.image
        }
    });

    return updatedUser;
}


const getUsers = async(query) => {	
	let page = query.page;
	let perPage = query.perPage || 1;
	let search = query.search;

	const users = await paginate(
		prisma.user,
		{
			where: {
				isPublic: true,
				OR: [
					{ email: { contains: search } },
					{ username: { contains: search } },
					{ public: {name: {contains: search}} },
					{
						public: {
							country: {
								name: {
									contains: search
								}
							}
						}
					},
					{
						public: {
							state: {
								name: {
									contains: search
								}
							}
						}
					},
					{
						public: {
							district: {
								name: {
									contains: search
								}
							}
						}
					},
				]
			},
			select: {
				id: true,
				email: true,
				username: true,
				public: true
			},
			orderBy: {
				id: 'desc',
		  	}
		}, 
		{ page: page, perPage: perPage }
	);
	return users;
}


const getDoctors = async(query) => {
	let page = query.page;
	let search = query.search;
	let perPage = query.perPage || 1;

	const users = await paginate(
		prisma.user,
		{
			where: {
				isDoctor: true,
				OR: [
					{ email: { contains: search } },
					{ username: { contains: search } },
					{ doctor: {name: {contains: search}} },
					{
						doctor: {
							country: {
								name: {
									contains: search
								}
							}
						}
					},
					{
						doctor: {
							state: {
								name: {
									contains: search
								}
							}
						}
					},
					{
						doctor: {
							district: {
								name: {
									contains: search
								}
							}
						}
					},
				]
			},
			select: {
				id: true,
				email: true,
				username: true,
				doctor: true
			},
			orderBy: {
				id: 'desc',
		  	}
		}, 
		{ page: page, perPage: perPage }
	);
	return users;
}


const getShops = async(query) => {
	let page = query.page;
	let search = query.search;
	let perPage = query.perPage || 1;

	const users = await paginate(
		prisma.user,
		{
			where: {
				isShop: true,
				OR: [
					{ email: { contains: search } },
					{ username: { contains: search } },
					{ shop: {name: {contains: search}} },
					{
						shop: {
							country: {
								name: {
									contains: search
								}
							}
						}
					},
					{
						shop: {
							state: {
								name: {
									contains: search
								}
							}
						}
					},
					{
						shop: {
							district: {
								name: {
									contains: search
								}
							}
						}
					},
				]
			},
			select: {
				id: true,
				email: true,
				username: true,
				shop: true
			},
			orderBy: {
				id: 'desc',
		  	}
		}, 
		{ page: page, perPage: perPage }
	);
	return users;
}


const deleteUser = async(id) => {
    const user = await prisma.user.findFirst({
        where: {
            id: parseInt(id),
            isAdmin: false
        },
    });

    if (!user) throw({status: 404, message: "Invalid user id"});

    await prisma.user.delete({
        where: {
            id: user.id
        }
    });

    return true;
}


const userDetail = async(id) => {
    const user = await prisma.user.findFirst({
        where: {
            id: parseInt(id)
        },
        select: {
            id: true,
            email: true,
            username: true,
            public: true,
            doctor: true,
            shop: true
        }
    });

    return user;
}


const userUpdate = async(id, payload, files, url) => {
    const user = await prisma.user.findFirst({
        where: {
            id: parseInt(id),
            isAdmin: false
        }
    });

    if (!user) throw({status: 404, message: "Invalid user id"});

    if (user.isPublic) {
        const updatedUser = await publicProfileUpdate(url, user, payload, files);
        return updatedUser;
    } else if(user.isDoctor) {
        const updatedUser = await doctorProfileUpdate(url, user, payload, files);
        return updatedUser;
    } else if(user.isShop) {
        const updatedUser = await shopProfileUpdate(url, user, payload, files);
        return updatedUser;
    } else {
        throw({status: 404, message: "Cannot find user"});
    }
}


const verifyAbyAdmin = async(id) => {
    const verified = await prisma.user.update({
        where: {
            id: parseInt(id)
        },
        data: {
            verified: true
        }
    });

    return verified;
} */


module.exports = {
    alreadyExist,
   /*  signup,
    emailVerification, */
    signin
    /* profile,
    passwordChange,
    forgotPassword,
    resetPassword */
}