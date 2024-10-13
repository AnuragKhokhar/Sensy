import express from 'express'
import InvoiceController from '../controllers/invoiceController.js'
import { adminAuth } from '../middlewares/validation/auth.js'
import { addInvoiceValidation } from '../middlewares/validation/invoice.js'

const router = express.Router()
const invoiceController=new InvoiceController()

router.post('/addInvoice',[addInvoiceValidation,adminAuth], invoiceController.addInvoice.bind(invoiceController))
router.get(
  "/generate-invoice",
  [adminAuth],
  invoiceController.generateInvoicePDF.bind(invoiceController)
);
export default router