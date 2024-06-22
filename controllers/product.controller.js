const { 
    getProductsForUser,
    createProduct,
    deleteProductWithId,
    getGrades,
    getCategories
} = require("../services/product.service");
const productSchema = require('../schemas/product.schema');


const getProducts = async(req, res, next) => {
    try {
        const data = await getProductsForUser(req.query.role, req.query.vendor_id, req.query.category_id,req.query);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


const createProducts = async(req, res, next) => {
    try {
        const {_, error} = productSchema.validate({
            name: req.body.name,
            base_price: req.body.base_price,
            quantity: req.body.quantity
        });
        if(error) return res.status(400).send({'data': error});
        const product = await createProduct(req.body, req.files);
        return res.status(201).send(product);

    } catch(err) {
        next(err);
    }
}

const deleteProduct = async(req, res, next) => {
    try {
        const data = await deleteProductWithId(parseInt(req.params.id, 10));
        return res.status(200).send({ message : "Deleted!!!"});
    } catch(err) {
        next(err);
    }
}
const getGrades = async(req, res, next) => {
    try {
        const data = await getGrades();
        return res.status(200).send({ message : "Deleted!!!"});
    } catch(err) {
        next(err);
    }
}
const getCategories = async(req, res, next) => {
    try {
        const data = await getCategories();
        return res.status(200).send({ message : "Deleted!!!"});
    } catch(err) {
        next(err);
    }
}


module.exports = {
    getProducts,
    createProducts,
    deleteProduct,
    getGrades,
    getCategories
}