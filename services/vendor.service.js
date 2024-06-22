const { prisma } = require("../utils/prisma");
const { createPaginator } = require("prisma-pagination");

const paginate = createPaginator();


const getVendors = async (query) => {
    try {
        let page = query.page || 1;
        let perPage = 8;
        let search = query.search || '';
        let filter = query.filter || ''; 

        let whereClause = {
            OR: [
                { company_name: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } },
                { address: { contains: search } },
            ]
        };

        if (filter) {
            whereClause = {
                ...whereClause,
                AND: { status: filter }
            };
        }

        const vendors = await paginate(prisma.vendor, {
            where: whereClause,
            select: {
                company_name: true,
                phone: true,
                email: true,
                address: true
            },
            orderBy: {
                id: 'desc'
            }
        }, 
        { page: page, perPage: perPage });

        return vendors;

    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot get Vendors"});
    }
}



const getVendorDetail = async (id) => {
    try {
        const vendor = await prisma.vendor.findFirst({
            where: {
              id: id
            }
          });
        return vendor;
    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot get States"});
    }
}


const updateVendorStatus = async (state_id) => {
    try {
        const districts = await prisma.district.findMany({
            where: {
              stateId: state_id
            }
          });
        return districts;
    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot get States"});
    }
}


module.exports = {
    getVendors,
    getVendorDetail,
    updateVendorStatus
}