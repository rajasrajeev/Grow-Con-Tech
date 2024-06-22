const { prisma } = require("../utils/prisma");
const { createPaginator } = require("prisma-pagination");

const paginate = createPaginator();


const getVendors = async (query) => {
    try {
        let page = query.page || 1;
        let perPage = 8;
        let search = query.search;

        const states = await paginate(prisma.vendor, {}, { page: page, perPage: perPage });
        return states;
    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot get States"});
    }
}


const getVendorDetail = async (state_id) => {
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