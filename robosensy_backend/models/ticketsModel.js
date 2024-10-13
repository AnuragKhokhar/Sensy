import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    reason: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    file: {
        type: String,
    },
    status: {
        type: String,
        default: 'open',
    },
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
