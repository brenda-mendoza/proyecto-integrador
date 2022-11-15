import ProductModelMongoDB from '../model/products-mongodb.js'

const modelProducts = new ProductModelMongoDB();


///////////////////////////////////////////////////////////////////////////////
//                                API Get ALL                                //
///////////////////////////////////////////////////////////////////////////////

const getProducts = async () => {
    const products = await modelProducts.readProducts();
    return products;
};

///////////////////////////////////////////////////////////////////////////////
//                                API Get ONE                                //
///////////////////////////////////////////////////////////////////////////////

const getProduct = async id => {
    const product = await modelProducts.readProduct(id);
    return product;
};


///////////////////////////////////////////////////////////////////////////////
//                                API Create                                 //
///////////////////////////////////////////////////////////////////////////////

const createProduct = async product => {
        const createdProduct = await modelProducts.createProduct(product);
        return createdProduct;
};


///////////////////////////////////////////////////////////////////////////////
//                                API Update                                 //
///////////////////////////////////////////////////////////////////////////////

const updateProduct = async (id, product) => {

    try {
        const updatedProduct = await modelProducts.updateProduct(id, product);
        return updatedProduct;    
    } catch {
        console.error(`Error al cargar el updateProduct: ${error.message}`);
        return {};
    }

};


///////////////////////////////////////////////////////////////////////////////
//                                API Delete                                 //
///////////////////////////////////////////////////////////////////////////////

const deleteProduct = async id => {
    const removedProduct = await modelProducts.deleteProduct(id);
    return removedProduct;
};


export default {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};
