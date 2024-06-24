const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create states
  /* const state1 = await prisma.state.create({
    data: {
      name: 'State 1',
      districts: {
        create: [
          {
            name: 'District 1-1',
          },
          {
            name: 'District 1-2',
          }
        ]
      },
    }
  });

  const state2 = await prisma.state.create({
    data: {
      name: 'State 2',
      districts: {
        create: [
          {
            name: 'District 2-1',
          },
          {
            name: 'District 2-2',
          }
        ]
      },
    }
  }); */
  /* const grade = await prisma.grade.create({
    data: {
      name: 'Grade 1',
    }
  });
  const category = await prisma.category.create({
    data: {
      name: 'Category 1',
    }
  }); */
  const unit = await prisma.unit.create({
    data: {
      name: 'Kg',
    }
  });

  // console.log({ grade, category });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
