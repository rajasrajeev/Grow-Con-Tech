const { prisma } = require("../utils/prisma");

const getAllStates = async () => {
    try {
        const states = await prisma.state.findMany();
        return states;
    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot get States"});
    }
}

const getDistricts = async (state_id) => {
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
    getAllStates,
    getDistricts
}