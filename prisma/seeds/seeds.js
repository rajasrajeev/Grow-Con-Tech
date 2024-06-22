const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create states
  const state1 = await prisma.state.create({
    data: {
      name: 'State 1',
      districts: {
        create: [
          {
            name: 'District 1-1',
            /* vendors: {
              create: [
                { name: 'Vendor 1-1-1' },
                { name: 'Vendor 1-1-2' }
              ]
            } */
          },
          {
            name: 'District 1-2',
            /* vendors: {
              create: [
                { name: 'Vendor 1-2-1' },
                { name: 'Vendor 1-2-2' }
              ]
            } */
          }
        ]
      },
      /* vendors: {
        create: [
          { name: 'Vendor 1-1' },
          { name: 'Vendor 1-2' }
        ]
      } */
    }
  });

  const state2 = await prisma.state.create({
    data: {
      name: 'State 2',
      districts: {
        create: [
          {
            name: 'District 2-1',
            /* vendors: {
              create: [
                { name: 'Vendor 2-1-1' },
                { name: 'Vendor 2-1-2' }
              ]
            } */
          },
          {
            name: 'District 2-2',
            /* vendors: {
              create: [
                { name: 'Vendor 2-2-1' },
                { name: 'Vendor 2-2-2' }
              ]
            } */
          }
        ]
      },
      /* vendors: {
        create: [
          { name: 'Vendor 2-1' },
          { name: 'Vendor 2-2' }
        ]
      } */
    }
  });

  console.log({ state1, state2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
