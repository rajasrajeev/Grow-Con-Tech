const { prisma } = require("../utils/prisma");
const { createPaginator } = require("prisma-pagination");

const paginate = createPaginator();

const getOrders = async (query, user) => {

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
                        { order_id: { contains: search, mode: 'insensitive' } },
                        { product: { name: { contains: search, mode: 'insensitive' } } },
                        { contractor: { name: { contains: search, mode: 'insensitive' } } }
                    ]
                },
                { vendor_id: user.vendor.id }
            ]
        };

        if (contractor) {
            whereClause.AND.push({
                contractor: { name: contractor }
            });
        }

        if (status) {
            whereClause.AND.push({
                status: status
            });
        }

        const order = await paginate(prisma.order, {
            where: whereClause,
            include: {
                product: { select: { id: true, name: true, unit: true } },
                vendor: { select: { id: true, company_name: true } },
                contractor: { select: { id: true, name: true } }
            },
            orderBy: {
                id: 'desc'
            },
        },
            { page: page, perPage: perPage });

        return order;

    } catch (err) {
        console.error(err);
        throw ({ status: 500, message: "Cannot get order" });
    }
};

const getOrderDetails = async (id, user) => {
    try {
        const order = await prisma.order.findFirst({
            where: {
                order_id: id,
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
                contractor: { select: { id: true, name: true } }
            },
            orderBy: {
                id: 'desc'
            },
        });
        return order;
    } catch (error) {
        console.log(error);
        throw { status: 403, message: "Sorry, something went wrong!!!" };
    }
}




module.exports = {
    getOrders,
    getOrderDetails
}