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
                product: { select: { id: true, name: true } },
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




module.exports = {
    getOrders
}