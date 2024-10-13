import { check } from "express-validator"
  import { resultChecker } from "./resultChecker.js"


  
  const addInvoice = [
    check('invoiceNumber').notEmpty().withMessage('Invoice number is required to add invoice'),
    check('customerName').notEmpty().withMessage('Customer name is required to add invoice'),
    check('address').notEmpty().withMessage('Address is required to add invoice'),
    check('date').notEmpty().withMessage('Date is required to add invoice'),
    check("finalAmount").notEmpty().withMessage("Final Amount is required to add invoice")

  ];
  
  export const addInvoiceValidation = [addInvoice, resultChecker]
  
  
  