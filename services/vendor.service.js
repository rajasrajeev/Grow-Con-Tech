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
                { vendor_id: { contains: search } },
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
                id: true,
                vendor_id: true,
                requested_on: true,
                company_name: true,
                phone: true,
                email: true,
                address: true,
                status: true
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
              vendor_id: id
            }
          });
        return vendor;
    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot get Detail"});
    }
}


const updateVendorStatus = async (id, body) => {
    try {
        const vendor = await prisma.vendor.update({
            where: {
              id: id
            },
            data: {
                status: body.status
            }
          });
        
        await prisma.user.update({
            where: {
                id: vendor.user_id
            },
            data: {
                verified: body.status === 'Approved' ? true : false
            }
        });
        return vendor;

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