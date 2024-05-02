const fs = require('fs');
/*
const CARTS_FILE_PATH = './carts.json';

let currentId = 1; 

const loadCarts = () => {
  try {
    const data = fs.readFileSync(CARTS_FILE_PATH);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveCarts = (carts) => {
  fs.writeFileSync(CARTS_FILE_PATH, JSON.stringify(carts, null, 2));
};

const getNextId = () => {
  return currentId++; 
};

const createCart = (products) => {
  const cartId = getNextId();
  const newCart = {
    id: cartId,
    products: products || []
  };

  const carts = loadCarts();
  carts.push(newCart);
  saveCarts(carts);

  return newCart;
};

const getCartProducts = (cartId) => {
  const carts = loadCarts();
  const cart = carts.find(cart => cart.id == cartId);
  return cart ? cart.products : null;
};

const addProductToCart = (cartId, productId, quantity) => {
  if (!quantity || isNaN(quantity) || quantity < 1) {
    return { error: 'La cantidad debe ser un número entero mayor que cero' };
  }

  const carts = loadCarts();
  const cart = carts.find(cart => cart.id == cartId);

  if (!cart) {
    return { error: 'Carrito no encontrado' };
  }

  const existingProductIndex = cart.products.findIndex(product => product.id == productId);
  if (existingProductIndex !== -1) {
    cart.products[existingProductIndex].quantity += parseInt(quantity);
  } else {
    cart.products.push({ id: productId, quantity: parseInt(quantity) });
  }

  saveCarts(carts);

  return { message: 'Producto agregado al carrito' };
};

module.exports = {
  createCart,
  getCartProducts,
  addProductToCart
};
*/
const Cart = require("./models/cart");

class CartManager {
    async createCart(products) {
        try {
            const newCart = await Cart.create({ products });
            return newCart;
        } catch (error) {
            throw new Error('Error creating cart: ' + error.message);
        }
    }

    async getCartProducts(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            return cart ? cart.products : null;
        } catch (error) {
            throw new Error('Error getting cart products: ' + error.message);
        }
    }

    async addProductToCart(cartId, productId, quantity) {
      try {
         
          let cart = await Cart.findById(cartId);
  
          
          if (!cart) {
              cart = await this.createCart([]); 
          }

            const existingProductIndex = cart.products.findIndex(product => product.productId.toString() === productId);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += parseInt(quantity);
            } else {
                cart.products.push({ productId, quantity: parseInt(quantity) });
            }

            await cart.save();

            return { message: 'Product added to cart' };
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }
}

module.exports = CartManager;
