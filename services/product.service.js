const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {SECRET, ORIGIN_URL} = require("../config/index");
const { Email } = require('../utils/email.util');
const { prisma } = require("../utils/prisma");
const { createPaginator } = require('prisma-pagination');

const paginate = createPaginator();

const getProductsForUser = async(role, vendor_id, category_id, page, search, perPage = 1) => {
    /* const page = query.page;
	const search = query.search;
	const perPage = query.perPage || 1; */
    var products = [];

    if(role == "VENDOR") {
        const where = {
            AND: [
              search ? { name: { contains: search, mode: 'insensitive' } } : {},
              categoryId ? { category_id: category_id } : {},
              vendorId ? { vendor_id: vendor_id } : {},
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
        
          return products;
    }
    
	return products;
}

const createProduct = async(req) => {
    const newProduct = await prisma.product.create({
        data: {
            name: req.body.name,
            base_price: parseInt(req.body.base_price),
            caregory_id: req.body.category_id,
            grade_id: req.body.grade_id,
            vendor_id: req.body.vendor_id,
            quantity: req.body.quantity,
            product_image: req.body.product_image
        }
    });

    return newProduct;
}
const productVerification = async(id) => {
    try {
  
        const user = await prisma.product.update({
            where: {
                id: id
            },
            data: {
                verified: true
            }
        });
        return user;
  
      } catch(err) {
          console.log(err)
          throw ({status: 403, message: "Cannot verify email!"});
      }
}



module.exports = {
    getProductsForUser,
    createProduct,
    productVerification
}