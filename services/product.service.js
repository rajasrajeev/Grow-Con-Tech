const path = require('path');
const fs = require('fs');
const { prisma } = require("../utils/prisma");
const { createPaginator } = require('prisma-pagination');

const paginate = createPaginator();

const getProductsForUser = async(role, user_id, category_id, query) => {
    // let products = [];
    if(role == "VENDOR") {
      try {
        let page = query.page || 1;
        let perPage = 8;
        let search = query.search || '';

        let whereClause = {
            OR: [
                { name: { contains: search } },
                // { category: { id: {contains: category_id}}},
                { vendor: { company_name: { contains: search }}}
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
                vendor: true,
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
          throw ({status: 500, message: "Cannot get Products"});
      }
    }
    
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
            unit: {
              connect: { id: parseInt(req.unit_id, 10) }
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
        unit: {
          connect: { id: parseInt(req.unit_id, 10) }
        },
        quantity: parseInt(req.quantity, 10),
        product_image: files.product_image[0].path,
    }
    });

    return newProduct;
}

const deleteProductWithId = async(id) => {
    try {
      const product = await prisma.product.findUnique({
          where: { id: id },
          select: { product_image: true } // Assuming the field name is product_image
      });

      if (product && product.product_image) {
        console.log(path.join(__dirname, '', product.product_image))
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
const getUnisList = async() => {
  try {
    const del = await prisma.unit.findMany();
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
    updateProducts,
    getUnisList
}