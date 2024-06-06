const ProductService = require("./src/services/productService.js");
const CartService = require("./src/services/cartService.js");
const passport = require('passport');

const authenticateSocket = (socket, next) => {
    passport.authenticate('jwt', (err, user, info) => {
        if (err || !user) {
            return next(new Error('Authentication error'));
        }
        socket.user = user; 
    })(socket.request, {}, next);
};

module.exports = (io) => {
  io.use(authenticateSocket);

    io.on("connection", (socket) => {
        console.log('Cliente conectado');
        
        socket.on("createProduct", async (data) => {
            try {
                await ProductService.addProduct(data);
                const products = await ProductService.getProducts();
                socket.emit("publishProducts", products);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        socket.on("deleteProduct", async (data) => {
            try {
                await ProductService.deleteProduct(data.pid);
                const products = await ProductService.getProducts();
                socket.emit("publishProducts", products);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        socket.on("addProductToCart", async (data) => {
            console.log('Producto agregado al carrito:', data);
            try {
                if (socket.user && socket.user._id) {
                    const userId = socket.user._id; 
                    const { productId } = data;
                    const cart = await CartService.addProductToCart(userId, productId);
                    socket.emit("productAddedToCart", { success: true, cart });
                } else {
                    throw new Error('User not authenticated');
                }
            } catch (error) {
                console.error('Error agregando producto al carrito:', error);
                socket.emit("productAddedToCartError", { error: 'Error adding product to cart' });
            }
        });
        
    });
};
