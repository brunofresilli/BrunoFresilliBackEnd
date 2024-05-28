const ProductService = require("./src/services/productService.js");

module.exports = (io) => {
    io.on("connection", (socket) => {
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
    });
}
