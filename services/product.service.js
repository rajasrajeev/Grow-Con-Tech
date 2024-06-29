const path = require('path');
const fs = require('fs');
const { prisma } = require("../utils/prisma");
const { createPaginator } = require('prisma-pagination');
const { subDays, startOfDay, endOfDay } = require('date-fns');

const paginate = createPaginator();

const getProductsForUser = async (role, user_id, query) => {
  if (role == "VENDOR") {
    try {
      let page = query.page || 1;
      let perPage = 8;
      let search = query.search || '';

      let whereClause = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { vendor: { company_name: { contains: search, mode: 'insensitive' } } },
        ],
        vendor_id: user_id
      };

      const products = await paginate(prisma.product, {
        where: whereClause,
        select: {
          id: true,
          category: true,
          grade: true,
          name: true,
          quantity: true,
          product_image: true,
          vendor: {
            select: {
              id: true,
              vendor_id: true,
              company_name: true
            }
          },
          unit: true,
          dailyRates: {
            orderBy: {
              created_at: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          id: 'desc'
        }
      },
        { page: page, perPage: perPage });

      return products;

    } catch (err) {
      throw ({ status: 500, message: "Cannot get Products" });
    }
  } else {
    throw ({ status: 500, message: "Not implemented yet" });
  }
};


const createProduct = async (req, user, files) => {
  try {
    const newProduct = await prisma.product.create({
      data: {
        name: req.name,
        category: {
          connect: { id: parseInt(req.category_id, 10) }
        },
        grade: {
          connect: { id: parseInt(req.grade_id, 10) }
        },
        vendor: {
          connect: { id: parseInt(user.vendor.id, 10) }
        },
        unit: {
          connect: { id: parseInt(req.unit_id, 10) }
        },
        quantity: parseInt(req.quantity, 10),
        product_image: files.product_image[0].path,
      }
    });

    await prisma.dailyRate.create({
      data: {
        daily_rate: parseFloat(req.base_price),
        product: {
          connect: { id: newProduct.id }
        }
      }
    });

    const product = await prisma.product.findFirst({
      where: {
        id: newProduct.id
      },
      select: {
        id: true,
        category: true,
        grade: true,
        name: true,
        quantity: true,
        product_image: true,
        vendor: {
          select: {
            id: true,
            vendor_id: true,
            company_name: true
          }
        },
        unit: true,
        dailyRates: true
      }
    });

    return product;
  } catch (err) {
    console.log(err);
    throw({ status: 500, message: "Something went wrong" });
  }
};

const updateProducts = async (id, user, req, files) => {
  try {
    const data = {};

    if (req.name) {
      data.name = req.name;
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
    });

    if (!product) {
      throw ({ status: 404, message: "Product not found" });
    }

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

    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const existingRate = await prisma.dailyRate.findFirst({
      where: {
        product_id: parseInt(id, 10),
        created_at: {
          gte: startOfToday,
          lte: endOfToday
        }
      }
    });

    if (existingRate) {
      await prisma.dailyRate.update({
        where: { id: existingRate.id },
        data: {
          daily_rate: parseFloat(req.base_price)
        }
      });
    } else {
      await prisma.dailyRate.create({
        data: {
          daily_rate: parseFloat(req.base_price),
          product: {
            connect: { id: parseInt(id, 10) }
          }
        }
      });
    }

    return newProduct;
  } catch (err) {
    throw ({ status: 403, message: "Sorry, Something went wrong!!!" });
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

    // Delete entries from DailyRate table associated with the product
    await prisma.dailyRate.deleteMany({
      where: { product_id: id }
    });

    const del = await prisma.product.delete({
      where: { id: id }
    });
    return del;
  } catch (err) {
    console.log(err);
    throw ({ status: 403, message: "Sorry, Something went wrong!!!" });
  }
};

const getGradesList = async () => {
  try {
    const grades = await prisma.grade.findMany();
    return grades;
  } catch (err) {
    throw ({ status: 403, message: "Sorry, Something went wrong!!!" });
  }
};

const getCategoriesList = async () => {
  try {
    const data = await prisma.category.findMany();
    return data;
  } catch (err) {
    throw ({ status: 403, message: "Sorry, Something went wrong!!!" });
  }
};

const getUnitList = async () => {
  try {
    const data = await prisma.unit.findMany();
    return data;
  } catch (err) {
    throw ({ status: 403, message: "Sorry, Something went wrong!!!" });
  }
};

const updateDailyRatesForVendor = async (body, user) => {
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
};

const dailyRatesListForVendor = async (user, query) => {
  try {
    let page = query.page || 1;
    let perPage = 8;
    let search = query.search || '';
    let filter = query.filter || '';

    let whereClause = {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { vendor: { company_name: { contains: search, mode: 'insensitive' } } }
      ],
      vendor_id: user.vendor.id
      // category_id: category_id || undefined
    };

    if (filter) {
      whereClause = {
        ...whereClause,
        AND: { category: { name: filter } }
      }
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

const productDetail = async(user, id, role) => {
  let selectClause = {
    id: true,
    category: true,
    grade: true,
    name: true,
    quantity: true,
    product_image: true,
    vendor: {
      select: {
        id: true,
        vendor_id: true,
        company_name: true
      }
    },
    unit: true,
    dailyRates: {
      orderBy: {
        created_at: 'desc'
      },
      take: 2
    }
  };

  if(role === 'BACKEND') {
    try {
      const product = await prisma.product.findFirst({
        where: { id: parseInt(id) },
        select: selectClause,
      });
      return product;

    } catch (err) {
      throw ({ status: 500, message: "Sorry, Something went wrong!!!" });
    }
   
  } else {
    try {
      const product = await prisma.product.findFirst({
        where: {
          id: parseInt(id),
          vendor_id: user.vendor.id
        },
        select: selectClause
      });
      return product;

    } catch (err) {
      throw ({ status: 500, message: "Sorry, Something went wrong!!!" });
    }
  }
};

const getProductMiniForVendor = async (user) => {
  try {
    const data = await prisma.product.findMany({
      where: {
        vendor_id: user.vendor.id
      },
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      },
    });
    return data;
  } catch (err) {
    throw ({ status: 500, message: "Sorry, Something went wrong!!!" });
  }
};

module.exports = {
  getProductsForUser,
  createProduct,
  deleteProductWithId,
  getGradesList,
  updateProducts,
  getCategoriesList,
  getUnitList,
  dailyRatesListForVendor,
  updateDailyRatesForVendor,
  productDetail,
  getProductMiniForVendor
};
