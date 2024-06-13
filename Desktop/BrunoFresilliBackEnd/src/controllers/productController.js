const productService = require('../services/productService.js');
const CustomError = require('../services/errors/CustomError.js');
const { ErrorCodes } = require('../services/errors/enums.js');
const { generateProductsErrorInfo } = require('../services/errors/info.js');

class ProductController {

    async getProducts(req, res, next) {
        try {
            const products = await productService.getProducts();
            res.status(200).json(products);
        } catch (error) {
            next(CustomError.createError({
                name: 'Database Error',
                cause: error,
                message: 'Error al obtener productos',
                code: ErrorCodes.DATABASE_ERROR,
            }));
        }
    }

    async getProductById(req, res, next) {
        try {
            const productId = req.params.id;
            const product = await productService.getProductById(productId);
            if (!product) {
                throw CustomError.createError({
                    name: 'Product Not Found',
                    cause: `Producto con ID ${productId} no encontrado`,
                    message: 'Producto no encontrado',
                    code: ErrorCodes.PRODUCT_NOT_FOUND,
                });
            }
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    async getProductByCode(req, res, next) {
        try {
            const code = req.params.code;
            const product = await productService.getProductByCode(code);
            if (!product) {
                throw CustomError.createError({
                    name: 'Product Not Found',
                    cause: `Producto con código ${code} no encontrado`,
                    message: 'Producto no encontrado',
                    code: ErrorCodes.PRODUCT_NOT_FOUND,
                });
            }
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    async addProduct(req, res, next) {
        try {
            const productData = req.body;

            
            if (!isValidProductData(productData)) {
                const error = CustomError.createError({
                    name: 'Invalid Types Error',
                    message: 'Invalid types in productData',
                    code: ErrorCodes.INVALID_TYPES_ERROR,
                });
                return next(error);
            }

            const newProduct = await productService.addProduct(productData);
            res.status(201).json(newProduct);
        } catch (error) {
            next(CustomError.createError({
                name: 'Database Error',
                cause: error,
                message: 'Error al agregar producto',
                code: ErrorCodes.DATABASE_ERROR,
            }));
        }
    }

    async updateProduct(req, res, next) {
        try {
            const productId = req.params.id;
            const updatedProductData = req.body;
            await productService.updateProduct(productId, updatedProductData);
            res.status(200).json({ message: 'Producto actualizado correctamente' });
        } catch (error) {
            next(CustomError.createError({
                name: 'Database Error',
                cause: error,
                message: 'Error al actualizar el producto',
                code: ErrorCodes.DATABASE_ERROR,
            }));
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const productId = req.params.id;
            await productService.deleteProduct(productId);
            res.status(200).json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            next(CustomError.createError({
                name: 'Database Error',
                cause: error,
                message: 'Error al eliminar producto',
                code: ErrorCodes.DATABASE_ERROR,
            }));
        }
    }
}

module.exports = new ProductController();
