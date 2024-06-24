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
                { contractor_id: { contains: search } },
                { company_name: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } }
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


const getContractorDetail = async (id) => {
    try {
        const contractor = await prisma.contractor.findFirst({
            where: {
              contractor: id
            }
          });
        return contractor;
    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot get Detail"});
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
        return vendor;

    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot update status"});
    }
}


module.exports = {
    getContractors,
    getContractorDetail,
    updateContractorStatus
}