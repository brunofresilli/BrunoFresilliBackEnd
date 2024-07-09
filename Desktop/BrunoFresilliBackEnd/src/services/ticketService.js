const CartRepository = require('../repositories/cartRepository');
const ProductRepository = require('../repositories/productRepository');
const TicketRepository = require('../repositories/ticketRepository');
const crypto = require('crypto');
const logger = require('../utils/logger');

/*class TicketService {
    async finalizePurchase(cartId, purchaser) {
        console.log('Iniciando finalizePurchase con cartId:', cartId);

        try {
            const cart = await CartRepository.getById(cartId);
            console.log('Cart encontrado:', cart);

            if (!cart) {
                throw new Error('Cart not found');
            }

            const productsNotPurchased = [];
            const purchasedProducts = [];
            let totalAmount = 0;

            for (const cartProduct of cart.products) {
                console.log("repository", cartProduct.product._id)
                const product = await ProductRepository.getById(cartProduct.product._id);
                console.log('Product encontrado:', product);

                const quantity = cartProduct.quantity;

                if (product.stock >= quantity) {
                    product.stock -= quantity;
                    await ProductRepository.update(product);
                    purchasedProducts.push({
                        product: product._id,
                        quantity,
                    });
                    totalAmount += product.price * quantity;
                } else {
                    productsNotPurchased.push(product._id);
                }
            }

            const ticketCode = crypto.randomBytes(16).toString('hex');
            console.log('Generando ticket con código:', ticketCode);

            const ticket = await TicketRepository.create({
                code: ticketCode,
                products: purchasedProducts,
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: purchaser,
            });

            cart.products = cart.products.filter(cartProduct => !productsNotPurchased.includes(cartProduct.product._id));
            await CartRepository.update(cart);

            console.log('Compra finalizada con éxito');
            return {
                status: 'success',
                message: 'Purchase completed',
                ticket,
                productsNotPurchased,
            };
        } catch (error) {
            console.error('Error al finalizar la compra:', error);
            throw new Error('Error finalizando la compra: ' + error.message);
        }
    }
}


module.exports = new TicketService(); */