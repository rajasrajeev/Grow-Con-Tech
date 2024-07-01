const { prisma } = require("../utils/prisma");
const { generatePasswordHash } = require('./user.service');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const { createPaginator } = require("prisma-pagination");

const paginate = createPaginator();

const createEnquiry = async (user, body) => {
    try {
        const enquiry = await prisma.enquiry.create({
            data: {
                product: {
                    connect: { id: parseInt(body.product_id, 10) }
                },
                vendor: {
                    connect: { id: parseInt(body.vendor_id, 10) }
                },
                contractor: {
                    connect: { id: parseInt(user.contractor.id, 10) }
                },
                enquiry_id: "ENQ",
                quantity: body.quantity,
                negotiations: {
                    create: {
                        price_from_contractor: parseFloat(body.price_from_contractor, 10),
                        status: 'REPLIED'
                    }
                }
            },
        });

        const enquiry_id = `ENQ${1000 + enquiry.id}`;

        const updatedEnquiry = await prisma.enquiry.update({
            where: { id: enquiry.id },
            data: { enquiry_id }
        });

        return updatedEnquiry;

    } catch (err) {
        console.error(err);
        throw ({ status: 500, message: "Something went wrong" })
    }
}

const getEnquiries = async (vendor_id, query) => {

    try {
        let page = query.page || 1;
        let perPage = 8;
        let search = query.search || '';
        let status = query.status || '';
        let contractor = query.contractor || '';

        let whereClause = {
            AND: [
                {
                    OR: [
                        { enquiry_id: { contains: search, mode: 'insensitive' } },
                        { product: { name: { contains: search, mode: 'insensitive' } } },
                        { contractor: { name: { contains: search, mode: 'insensitive' } } }
                    ]
                },
                { vendor_id: vendor_id }
            ]
        };

        if (contractor) {
            whereClause.AND.push({
                contractor: { name: contractor }
            });
        }

        if (status) {
            if (status === 'PENDING') {
                whereClause.AND.push({
                    negotiations: {
                        some: {
                            status: 'REPLIED',
                            price_from_vendor: null
                        }
                    }
                });
            } else if (status === 'REPLIED') {
                whereClause.AND.push({
                    negotiations: {
                        some: {
                            status: 'REPLIED',
                            price_from_vendor: { not: null }
                        }
                    }
                });
            } else {
                whereClause.AND.push({
                    negotiations: {
                        some: { status: status }
                    }
                });
            }
        }

        const enquiry = await paginate(prisma.enquiry, {
            where: whereClause,
            include: {
                product: { select: { id: true, name: true } },
                vendor: { select: { id: true, company_name: true } },
                contractor: { select: { id: true, name: true } },
                negotiations: {
                    orderBy: {
                        created_at: 'desc'
                    },
                    take: 1
                }
            },
            orderBy: {
                id: 'desc'
            },
        },
            { page: page, perPage: perPage });

        return enquiry;

    } catch (err) {
        console.error(err);
        throw ({ status: 500, message: "Cannot get enquiries" });
    }
};

const updateNegotiation = async (id, body, user) => {
    try {
        if (user.role == "VENDOR") {
            var data = {}
            if (parseFloat(body.price_from_vendor)) {
                data.price_from_vendor = parseFloat(body.price_from_vendor)
            }
            if (body.status) {
                data.status = body.status
            }
            return await prisma.negotiation.update({
                where: { id: id },
                data: data
            });
        } else if (user.role == "CONTRACTOR") {
            return await prisma.negotiation.create({
                data: {
                    id: id,
                    price_from_contractor: parseFloat(body.price_from_contractor),
                    status: "REPLIED"
                }
            });
        } else {
            console.error(err);
            throw ({ status: 404, message: "Access Denied!!!" });
        }


    } catch (err) {
        console.log(err);
        throw ({ status: 403, message: "Sorry, Something went wrong!!!" });
    }
}

const getContractors = async (user) => {
    try {

        const contractors = await prisma.enquiry.findMany({
            where: {
                vendor_id: user.vendor.id
            },
            select: {
                contractor: {
                    select: {
                        name: true
                    }
                }
            },
            distinct: ['contractor_id']
        });

        const contractorNames = contractors.map(enquiry => ({
            name: enquiry.contractor.name
        }));

        return contractorNames;
    } catch (err) {
        console.log(err);
        throw { status: 403, message: "Sorry, something went wrong!!!" };
    }

}

const getEnquiryDetails = async (id, user) => {
    try {
        const enquires = await prisma.enquiry.findFirst({
            where: {
                enquiry_id: id,
                vendor_id: user.vendor.id
            },
            include: {
                product: {
                    select: {
                        id: true, 
                        name: true, 
                        product_image: true, 
                        category: true,
                        grade: true, 
                        unit: true,
                        dailyRates: {
                            orderBy: {
                                created_at: 'desc'
                            },
                            take: 1
                        }
                    }
                },
                vendor: { select: { id: true, company_name: true } },
                contractor: { select: { id: true, name: true } },
                negotiations: {
                    orderBy: {
                        created_at: 'desc'
                    }
                }
            },
            orderBy: {
                id: 'desc'
            },
        });
        return enquires;
    } catch (error) {
        console.log(error);
        throw { status: 403, message: "Sorry, something went wrong!!!" };
    }
}


module.exports = {
    createEnquiry,
    getEnquiries,
    updateNegotiation,
    getContractors,
    getEnquiryDetails
}