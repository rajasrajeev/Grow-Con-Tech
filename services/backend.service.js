const { prisma } = require("../utils/prisma");
const { generatePasswordHash } = require('./user.service');
const { subDays, startOfDay, endOfDay } = require('date-fns');


const createEmployee = async (body) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: body.email
            }
        });

        if(user) throw({status: 400, message: "Email ID already exists!"})

        const existPhone = await prisma.backend.findFirst({
            where: {
                phone: body.phone
            }
        });

        if(existPhone) throw({status: 400, message: "Mobile Number already exists!"});

        const hashedPassword = await generatePasswordHash(body.password);

        const newUser = await prisma.user.create({
            data: {
                username: body.email,
                password: hashedPassword,
                role: 'BACKEND',
                last_logged_in: null,
                verified: true
            },
        });

        if (newUser) {
            const backend = await prisma.backend.create({
                data: {
                    user: {
                        connect: { id: newUser.id }
                    },
                    name: body.name,
                    phone: body.phone,
                    email: body.email,
                    employee_id: body.employee_id
                },
            });
            return backend;
        } else {
            throw({status: 400, message: "Cannot create user"})
        }

    } catch (err) {
        console.error(err);
        throw({status: 500, message: "Something went wrong"})
    }
}

const getDailyRates = async (vendor_id, query) => {
    try {
        let page = query.page || 1;
        let perPage = 8;
        let search = query.search || '';
        let filter = query.filter || ''; 
    
        /* let whereClause = {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { vendor: { company_name: { contains: search, mode: 'insensitive' } } }
          ],
          vendor_id: vendor_id
          // category_id: category_id || undefined
        }; */
        let whereClause = {
            AND: [
              {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { vendor: { company_name: { contains: search, mode: 'insensitive' } } }
                ]
              },
              { vendor_id: vendor_id }
            ]
          };

        if (filter) {
            whereClause = {
                ...whereClause,
                AND: { status: filter }
            };
        }
    
        const today = new Date();
        const yesterday = subDays(today, 1);
    
        const products = await prisma.product.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            category: { select: { name: true } },
            grade: { select: { name: true } },
            quantity: true,
            product_image: true,
            vendor: {
              select: {
                id: true,
                vendor_id: true,
                company_name: true
              }
            },
            unit: { select: { name: true } },
            dailyRates: {
              where: {
                OR: [
                  {
                    created_at: {
                      gte: startOfDay(today),
                      lte: endOfDay(today)
                    }
                  },
                  {
                    created_at: {
                      gte: startOfDay(yesterday),
                      lte: endOfDay(yesterday)
                    }
                  }
                ]
              },
              orderBy: {
                created_at: 'desc'
              }, 
              take: 2
            }
          },
          orderBy: {
            id: 'desc'
          },
          skip: (page - 1) * perPage,
          take: perPage
        });
    
        const totalCount = await prisma.product.count({ where: whereClause });
    
        const enhancedProducts = products.map(product => {
          const todaysRate = product.dailyRates.find(rate => rate.created_at >= startOfDay(today) && rate.created_at <= endOfDay(today));
          const yesterdaysRate = product.dailyRates.find(rate => rate.created_at >= startOfDay(yesterday) && rate.created_at <= endOfDay(yesterday));
    
          return {
            id: product.id,
            name: product.name,
            productImage: product.product_image,
            category: product.category.name,
            grade: product.grade.name,
            quantity: product.quantity,
            unit: product.unit.name,
            yesterdaysPrice: yesterdaysRate ? yesterdaysRate.daily_rate : null,
            todaysPrice: todaysRate ? todaysRate.daily_rate : null,
            // isUpdated: todaysRate ? true : false,
            vendor: product.vendor
          };
        });
    
        return {
          data: enhancedProducts,
          meta: {
            total: totalCount,
            lastPage: Math.ceil(totalCount / perPage),
            currentPage: page,
            perPage: perPage,
            prev: page > 1 ? page - 1 : null,
            next: page < Math.ceil(totalCount / perPage) ? page + 1 : null
          }
        };
    
      } catch (err) {
        console.error(err);
        throw ({ status: 500, message: "Cannot get Products" });
      }
}

const updateDailyRates = async (body) => { 
    try {
        const today = new Date();
        const startOfToday = startOfDay(today);
        const endOfToday = endOfDay(today);
    
        const existingRate = await prisma.dailyRate.findFirst({
          where: {
            product_id: parseInt(body.product_id, 10),
            created_at: {
              gte: startOfToday,
              lte: endOfToday
            }
          }
        });

        console.log(existingRate);
    
        let response;
    
        if (existingRate) {
          return { message: "Sorry, today's rate is already updated", success: false };
        } else {
          response = await prisma.dailyRate.create({
            data: {
              daily_rate: parseFloat(body.daily_rate),
              product: {
                connect: { id: parseInt(body.product_id, 10) }
              }
            }
          });
          return { message: "Today's rate updated", data: response };
        }
    
      } catch (err) {
        console.log(err);
        throw ({ status: 403, message: "Sorry, Something went wrong!!!" });
      }
}

module.exports = {
    createEmployee,
    getDailyRates,
    updateDailyRates
}