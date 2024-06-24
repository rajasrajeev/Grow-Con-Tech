const path = require('path');
const fs = require('fs');
const { prisma } = require("../utils/prisma");
const { createPaginator } = require('prisma-pagination');
const { subDays, startOfDay, endOfDay } = require('date-fns');

const paginate = createPaginator();

const getProductsForUser = async (role, user_id, category_id, query) => {
  if (role == "VENDOR") {
    try {
      let page = query.page || 1;
      let perPage = 8;
      let search = query.search || '';

      let whereClause = {
        OR: [
          { name: { contains: search } },
          { vendor: { company_name: { contains: search } } }
        ]
      };

      const products = await paginate(prisma.product, {
        where: whereClause,
        select: {
          id: true,
          category: true,
          grade: true,
          quantity: true,
          product_image: true,
          base_price: true,
          vendor: {
            select: {
              id: true,
              vendor_id: true,
              company_name: true
            }
          },
          unit: true
        },
        orderBy: {
          id: 'desc'
        }
      },
        { page: page, perPage: perPage });

      return products;

    } catch (err) {
      console.error(err);
      throw ({ status: 500, message: "Cannot get Products" });
    }
  }

}

const createProduct = async (req, user, files) => {
  const newProduct = await prisma.product.create({
    data: {
      name: req.name,
      base_price: parseFloat(req.base_price),
      category: {
        connect: { id: parseInt(req.category_id, 10) }
      },
      grade: {
        connect: { id: parseInt(req.grade_id, 10) }
      },
      vendor: {
        connect: { id: parseInt(user.id, 10) }
      },
      unit: {
        connect: { id: parseInt(req.unit_id, 10) }
      },
      quantity: parseInt(req.quantity, 10),
      product_image: files.product_image[0].path,
    }
  });

  return newProduct;
}


const updateProducts = async (id, user, req, files) => {
  try {
    const data = {};

    if (req.name) {
      data.name = req.name;
    }

    if (req.base_price) {
      data.base_price = parseInt(req.base_price);
    }

    if (req.category_id) {
      data.category = {
        connect: { id: parseInt(req.category_id, 10) }
      };
    }

    if (req.grade_id) {
      data.grade = {
        connect: { id: parseInt(req.grade_id, 10) }
      };
    }

    data.vendor = {
      connect: { id: parseInt(user.id, 10) }
    };

    if (req.unit_id) {
      data.unit = {
        connect: { id: parseInt(req.unit_id, 10) }
      };
    }

    if (req.quantity) {
      data.quantity = parseInt(req.quantity, 10);
    }

    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id)
      }
    })

    if (files && files.product_image && files.product_image.length > 0) {
      const filePath = path.resolve('./', product.product_image);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
      data.product_image = files.product_image[0].path;
    }

    const newProduct = await prisma.product.update({
      where: {
        id: parseInt(id)
      },
      data: data
    });

    return newProduct;
  } catch (err) {
    console.error(err);
    throw ({ status: 500, message: "Sorry, something went wrong!" });
  }
};

const deleteProductWithId = async (id) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
      select: { product_image: true }
    });

    if (product && product.product_image) {
      const filePath = path.resolve('./', product.product_image);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }

    const del = await prisma.product.delete({
      where: { id: id }
    });
    return del;
  } catch (err) {
    console.log(err);
    throw { status: 403, message: "Sorry, Something went wrong!!!" };
  }
}


const getGradesList = async () => {
  try {
    const del = await prisma.grade.findMany();
    return del;
  } catch (err) {
    console.log(err)
    throw ({ status: 403, message: "Sorry, Something went wrong!!!" });
  }
}


const getCategoriesList = async () => {
  try {
    const del = await prisma.category.findMany();
    return del;
  } catch (err) {
    console.log(err)
    throw ({ status: 403, message: "Sorry, Something went wrong!!!" });
  }
}

const getUnitList = async () => {
  try {
    const del = await prisma.unit.findMany();
    return del;
  } catch (err) {
    console.log(err)
    throw ({ status: 403, message: "Sorry, Something went wrong!!!" });
  }
}

const updateDailyRatesForVendor = async (body, user) => {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const existingRate = await prisma.dailyRate.findFirst({
      where: {
        product_id: parseInt(body.product_id, 10),
        user_id: parseInt(user.user_id, 10),
        created_at: {
          gte: startOfToday,
          lte: endOfToday
        }
      }
    });

    let response;

    if (existingRate) {
      /* response = await prisma.dailyRate.update({
        where: { id: existingRate.id },
        data: {
          daily_rate: parseFloat(body.daily_rate)
        }
      }); */
      return { message: "Sorry, todays rate is already updated", success: false };
    } else {
      response = await prisma.dailyRate.create({
        data: {
          daily_rate: parseFloat(body.daily_rate),
          user: {
            connect: { id: parseInt(user.user_id, 10) }
          },
          product: {
            connect: { id: parseInt(body.product_id, 10) }
          }
        }
      });
      return { message: "Todays rate updated", data: response };
    }

  } catch (err) {
    console.log(err);
    throw ({ status: 403, message: "Sorry, Something went wrong!!!" });
  }
};

const dailyRatesListForVendor = async (user_id, category_id, query) => {
  try {
    let page = query.page || 1;
    let perPage = 8;
    let search = query.search || '';

    let whereClause = {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { vendor: { company_name: { contains: search, mode: 'insensitive' } } }
      ],
      vendor_id: user_id
      // category_id: category_id || undefined
    };

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
        base_price: true,
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
          }
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
        isUpdated: todaysRate ? true : false,
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
};



module.exports = {
  getProductsForUser,
  createProduct,
  deleteProductWithId,
  getGradesList,
  updateProducts,
  getCategoriesList,
  updateProducts,
  getUnitList,
  dailyRatesListForVendor,
  updateDailyRatesForVendor
}