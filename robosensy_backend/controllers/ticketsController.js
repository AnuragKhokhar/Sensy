import ticketServices from "../services/ticketsService.js";

export default class TicketController {
    constructor() {}

    // Method to handle creating a ticket
    async createTicket(req, res, next) {
        try {
            const ticketData = req.body;
            const result = await ticketServices.createTicket(ticketData);
            return res.status(201).json({ msg: 'Ticket created successfully', ticketId: result._id, status: result.status });
        } catch (error) {
            next(error);
        }
    }

    // Method to handle getting a ticket by ID
    async getTicketById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await ticketServices.getTicketById(id);
            return res.status(200).json({ msg: 'Ticket fetched successfully', ticket: result });
        } catch (error) {
            next(error);
        }
    }
}
