class CartDTO {
    constructor({ id, products }) {
        this.id = id;
        this.products = products.map(product => ({
            product: product.product,
            quantity: product.quantity
        }));
    }
}

module.exports = CartDTO;
