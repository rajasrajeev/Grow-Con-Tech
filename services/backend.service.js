const { prisma } = require("../utils/prisma");
const { generatePasswordHash } = require('./user.service');


const createEmployee = async (body) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: body.email
            }
        });

        if(user) throw({status: 400, message: "Email ID already exists!"})

        const existPhone = await prisma.backend.findFirst({
            where: {
                phone: body.phone
            }
        });

        if(existPhone) throw({status: 400, message: "Mobile Number already exists!"});

        const hashedPassword = await generatePasswordHash(body.password);

        const newUser = await prisma.user.create({
            data: {
                username: body.email,
                password: hashedPassword,
                role: 'BACKEND',
                last_logged_in: null,
                verified: true
            },
        });

        if (newUser) {
            const backend = await prisma.backend.create({
                data: {
                    user: {
                        connect: { id: newUser.id }
                    },
                    name: body.name,
                    phone: body.phone,
                    email: body.email,
                    employee_id: body.employee_id
                },
            });
            return backend;
        } else {
            throw({status: 400, message: "Cannot create user"})
        }

    } catch (err) {
        console.error(err);
        throw({status: 500, message: "Something went wrong"})
    }
}

module.exports = {
    createEmployee
}