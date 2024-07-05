const { prisma } = require("../utils/prisma");
const { createPaginator } = require("prisma-pagination");

const paginate = createPaginator();


const getContractors = async (query) => {
    try {
        let page = query.page || 1;
        let perPage = 8;
        let search = query.search || '';
        let filter = query.filter || ''; 

        let whereClause = {
            OR: [
                { contractor_id: { contains: search, mode: 'insensitive' } },
                { company_name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } }
            ]
        };

        if (filter) {
            whereClause = {
                ...whereClause,
                AND: { status: filter }
            };
        }

        const contractors = await paginate(prisma.contractor, {
            where: whereClause,
            select: {
                id: true,
                contractor_id: true,
                created_at: true,
                company_name: true,
                name: true,
                phone: true,
                email: true,
                status: true
            },
            orderBy: {
                id: 'desc'
            }
        }, 
        { page: page, perPage: perPage });

        return contractors;

    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot get Contractors"});
    }
}

const getContractorForVendor = async (user, query) => {
    try {
        let page = parseInt(query.page) || 1;
        let perPage = parseInt(query.perPage) || 8;
        let search = query.search || '';
        let filter = query.filter || ''; 

        let whereClause = {
            OR: [
                { contractor_id: { contains: search, mode: 'insensitive' } },
                { company_name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } }
            ],
            Order: {
                some: {
                    vendor_id: user.vendor.id
                }
            }
        };

        if (filter) {
            whereClause.AND = { status: filter };
        }

        const contractors = await paginate(prisma.contractor, {
            where: whereClause,
            select: {
                id: true,
                contractor_id: true,
                created_at: true,
                company_name: true,
                name: true,
                phone: true,
                email: true,
                status: true
            },
            orderBy: {
                id: 'desc'
            }
        }, 
        { page: page, perPage: perPage });

        return contractors;
    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot get Contractors"});
    }
}


const getContractorDetail = async (id) => {
    try {
        const contractor = await prisma.contractor.findFirst({
            where: {
              contractor_id: id
            }
          });
        return contractor;
    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot get Detail"});
    }
}


const getContractorDetailForVendor = async (id) => {
    try {
        const contractor = await prisma.contractor.findFirst({
            where: {
              contractor_id: id
            },
            include: {
                Order: {
                    where: {
                        status: {
                            not: 'COMPLETED'
                        }
                    },
                    include: {
                        product: true,
                        vendor: true
                    }
                },
                user: true 
            }
          });
        return contractor;
    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot get Detail"});
    }
}


const getOrderListOngoingFromContractor = async (user, query) => {
        try {
            let page = parseInt(query.page) || 1;
            let perPage = 8;
            let filter = query.filter || '';
        
            let whereClause = {
                vendor_id: user.vendor.id,
                contractor_id: parseInt(query.contractor_id),
                status: {
                    not: 'COMPLETED'
                }
            };
        
            if (filter) {
                whereClause.status = filter;
            }
        
            const enquiry = await paginate(prisma.order, {
                where: whereClause,
                include: {
                    product: { select: { id: true, name: true, unit: true, product_image: true } },
                },
                orderBy: {
                    id: 'desc'
                },
            },
            { page: page, perPage: perPage });
        
            return enquiry;
        
        } catch (err) {
            console.error(err);
            throw { status: 500, message: "Cannot get orders" };
        }
}
const getOrderListPurchaseHistoryFromContractor = async (user, query) => {
        try {
            let page = parseInt(query.page) || 1;
            let perPage = 8;
            let filter = query.filter || '';
        
            let whereClause = {
                vendor_id: user.vendor.id,
                contractor_id: parseInt(query.contractor_id),
                status: "COMPLETED"
            };
        
            if (filter) {
                whereClause.status = filter;
            }
        
            const enquiry = await paginate(prisma.order, {
                where: whereClause,
                include: {
                    product: { select: { id: true, name: true, unit: true, product_image: true } },
                },
                orderBy: {
                    id: 'desc'
                },
            },
            { page: page, perPage: perPage });
        
            return enquiry;
        
        } catch (err) {
            console.error(err);
            throw { status: 500, message: "Cannot get orders" };
        }
        
}


const updateContractorStatus = async (id, body) => {
    try {
        const contractor = await prisma.contractor.update({
            where: {
              id: id
            },
            data: {
                status: body.status
            }
          });
        
        await prisma.user.update({
            where: {
                id: contractor.user_id
            },
            data: {
                verified: body.status === 'Approved' ? true : false
            }
        });
        return contractor;

    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot update status"});
    }
}


module.exports = {
    getContractors,
    getContractorDetail,
    updateContractorStatus,
    getContractorForVendor,
    getContractorDetailForVendor,
    getOrderListOngoingFromContractor,
    getOrderListPurchaseHistoryFromContractor
}