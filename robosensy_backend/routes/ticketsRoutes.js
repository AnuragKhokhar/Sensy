import express from 'express';

import { adminAuth } from '../middlewares/validation/auth.js';
import TicketController from '../controllers/ticketsController.js';
const router = express.Router();
const ticketController = new TicketController();
router.post('/customerTicket', [adminAuth],ticketController.createTicket);
router.get('/getTicket/:id',[adminAuth], ticketController.getTicketById);
export default router;
