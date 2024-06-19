const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  // Create a state
  const country = await prisma.country.create({
    data: {
      name: 'India'
    },
  });
  // Create a state
  const state = await prisma.state.create({
    data: {
      name: 'Kerala',
      countryId: country.id
    },
  });

  // Create a city
  const city = await prisma.city.create({
    data: {
      name: 'Attingal',
      stateId: state.id
    },
  });

  console.log({ state, city, country });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
