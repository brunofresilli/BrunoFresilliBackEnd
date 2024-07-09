const ticketService = require('../services/ticketService.js');


/* class ticketController {
    async finalizePurchase(req, res) {
        try {
          const cartId = req.params.cid;
          const purchaser = req.user.email;
          console.log('Iniciando compra para cartId:', cartId, 'por el usuario:', purchaser);
    
          const result = await ticketService.finalizePurchase(cartId, purchaser);
          console.log('Resultado de la compra:', result);
    
          res.status(200).json(result);
        } catch (error) {
          console.error('Error al completar la compra:', error);
          res.status(400).json({
            status: 'error',
            message: error.message,
          });
        }
      }
    }
    
  module.exports = new ticketController(); */