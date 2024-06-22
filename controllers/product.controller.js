const { 
    getProductsForUser,
    createProduct,
    productVerification,
    deleteProductWithId
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
        const product = await createProduct(req.body);
        return res.status(201).send(product);

    } catch(err) {
        next(err);
    }
}


const verifyProducts = async(req, res, next) => {
    try {
        const data = await productVerification(parseInt(req.params.id, 10));
        return res.status(200).send({ message : "Verification done successfully!!!"});
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


module.exports = {
    getProducts,
    createProducts,
    verifyProducts,
    deleteProduct
}