import Ticket from '../models/ticketsModel.js';
import mongoose from 'mongoose';

class TicketServices {
    constructor() {}

    // Method to create a new ticket
    async createTicket(data) {
        try {
            const { reason, description, file } = data;

            // Validate required fields
            if (!reason || !description) {
                throw new Error("Reason and description are required.");
            }

            const ticket = new Ticket({
                reason,
                description,
                file,
            });

            await ticket.save();
            return ticket;
        } catch (error) {
            if (error.name === 'ValidationError') {
                console.error("Validation error creating ticket:", error);
                throw new Error("Invalid ticket data. Please check your input.");
            }
            console.error("Error creating ticket:", error);
            throw new Error("An error occurred while creating the ticket. Please try again.");
        }
    }

    // Method to get a ticket by ID
    async getTicketById(id) {
        try {
            // Sanitize and validate the ID
            const sanitizedId = id.trim(); // Remove any leading/trailing whitespace or newlines
            if (!mongoose.Types.ObjectId.isValid(sanitizedId)) {
                throw new Error("Invalid ticket ID format.");
            }

            const ticket = await Ticket.findById(sanitizedId);
            if (!ticket) {
                throw new Error("Ticket not found.");
            }
            return ticket;
        } catch (error) {
            if (error.name === 'CastError') {
                console.error("Cast error fetching ticket:", error);
                throw new Error("Invalid ticket ID format.");
            }
            console.error("Error fetching ticket:", error);
            throw new Error("An error occurred while fetching the ticket. Please try again.");
        }
    }
}

export default new TicketServices();
