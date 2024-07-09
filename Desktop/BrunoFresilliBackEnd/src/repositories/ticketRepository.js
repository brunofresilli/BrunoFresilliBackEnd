const Ticket = require('../dao/models/ticket.js');


class TicketRepository {
    async create(ticketData) {
      return Ticket.create(ticketData);
    }
  }
module.exports = new TicketRepository();