const { 
    getProductsForUser,
    createProduct,
    deleteProductWithId,
    getGradesList,
    getCategoriesList
} = require("../services/product.service");
const productSchema = require('../schemas/product.schema');


const getProductsHandler = async(req, res, next) => {
    try {
        const data = await getProductsForUser(req.query.role, parseInt(req.user.id, 10), parseInt(req.query.category_id), req.query);
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


const createProductsHandler = async(req, res, next) => {
    console.log(req.body)
    try {
        /* const {_, error} = productSchema.validate({
            name: req.body.name,
            base_price: req.body.base_price,
            quantity: req.body.quantity,
            category_id: parseInt(req.body.category_id),
            grade_id: parseInt(req.body.category_id),
            product_image: req.files[0]
        });
        if(error) return res.status(400).send({'data': error}); */
        const product = await createProduct(req.body, req.user, req.files);
        return res.status(201).send(product);

    } catch(err) {
        next(err);
    }
}
const updateProductsHandler = async(req, res, next) => {
    
    try {
        const {_, error} = productSchema.validate({
            name: req.body.name,
            base_price: req.body.base_price,
            quantity: req.body.quantity,
            category_id: parseInt(req.body.category_id),
            grade_id: parseInt(req.body.category_id)
        });
        if(error) return res.status(400).send({'data': error});
        const product = await createProduct(req.body, req.files);
        return res.status(201).send(product);

    } catch(err) {
        next(err);
    }
}

const deleteProductHandler = async(req, res, next) => {
    try {
        const data = await deleteProductWithId(parseInt(req.params.id, 10));
        return res.status(200).send({ message : "Deleted!!!"});
    } catch(err) {
        next(err);
    }
}
const getGradesHandler = async(req, res, next) => {
    try {
        const data = await getGradesList();
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}
const getCategoriesHandler = async(req, res, next) => {
    try {
        const data = await getCategoriesList();
        return res.status(200).send(data);
    } catch(err) {
        next(err);
    }
}


module.exports = {
    getProductsHandler,
    createProductsHandler,
    deleteProductHandler,
    getGradesHandler,
    getCategoriesHandler,
    updateProductsHandler
}