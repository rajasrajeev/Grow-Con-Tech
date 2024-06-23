/* const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {SECRET, ORIGIN_URL} = require("../config/index");
const { Email } = require('../utils/email.util'); */
const { prisma } = require("../utils/prisma");
const { createPaginator } = require('prisma-pagination');

const paginate = createPaginator();

const getProductsForUser = async(role, user_id, category_id, query) => {
    let products = [];
    if(role == "VENDOR") {
      try {
        let page = query.page || 1;
        let perPage = 8;
        let search = query.search || '';

        let whereClause = {
            OR: [
                { name: { contains: search } },
                // { category: { id: {contains: category_id}}},
                { vendor: { company_name: { contains: query.search}}}
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
                vendor: true
            },
            orderBy: {
                id: 'desc'
            }
        }, 
        { page: page, perPage: perPage });

        return products;

    } catch (err) {
        console.error(err);
        throw ({status: 500, message: "Cannot get Products"});
    }
        /* const where = {
            AND: [
              search ? { name: { contains: search, mode: 'insensitive' } } : {},
              category_id ? { category_id: category_id } : {},
              vendor_id ? { vendor_id: vendor_id } : {},
            ],
          };
        
          const products = await paginate(
            prisma.product,
            {
              where,
              include: {
                category: true,
                grade: true,
              },
              orderBy: {
                id: 'desc',
              },
            },
            { page, perPage }
          );
        
          return products; */
    }
    
	return products;
}

const createProduct = async(req, user, files) => {
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
            quantity: parseInt(req.quantity, 10),
            product_image: files.product_image[0].path,
        }
    });

    return newProduct;
}
const updateProducts = async(id, req, files) => {
    const newProduct = await prisma.product.update({
      where: {
        id: id
      },
      data: {
        name: req.name,
        base_price: parseInt(req.base_price),
        category: {
          connect: { id: parseInt(req.category_id, 10) }
        },
        grade: {
          connect: { id: parseInt(req.grade_id, 10) }
        },
        vendor: {
          connect: { id: parseInt(user.id, 10) }
        },
        quantity: parseInt(req.quantity, 10),
        product_image: files.product_image[0].path,
    }
    });

    return newProduct;
}

const deleteProductWithId = async(id) => {
  try {
    const del = await prisma.product.delete({
      where: {
          id: id
      }
    });
  return del;
  } catch(err) {
    console.log(err)
          throw ({status: 403, message: "Sorry, Something went wrong!!!"});
  }
}
const getGradesList = async() => {
  try {
    const del = await prisma.grade.findMany();
  return del;
  } catch(err) {
    console.log(err)
          throw ({status: 403, message: "Sorry, Something went wrong!!!"});
  }
}
const getCategoriesList = async() => {
  try {
    const del = await prisma.category.findMany();
  return del;
  } catch(err) {
    console.log(err)
          throw ({status: 403, message: "Sorry, Something went wrong!!!"});
  }
}



module.exports = {
    getProductsForUser,
    createProduct,
    deleteProductWithId,
    getGradesList,
    getCategoriesList,
    updateProducts
}