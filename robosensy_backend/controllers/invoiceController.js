import InvoiceService from "../services/invoiceService.js";

const invoiceService = new InvoiceService();
export default class InvoiceController {
  constructor() {}

  async addInvoice(req, res, next) {
    try {
      const {
        invoiceNumber,
        date,
        customerName,
        address,
        medicines,
        discount,
        totalAmount,
        finalAmount,
      } = req.body;

      const result = await invoiceService.addInvoice({
        invoiceNumber,
        date,
        customerName,
        address,
        medicines,
        discount,
        totalAmount,
        finalAmount,
      });

      return res.status(200).json({ msg: "Success", data: result });
    } catch (error) {
      next(error);
    }
  }
  async generateInvoicePDF(req, res, next) {
    try {
      const { invoiceNumber } = req.query;
      const { hospitalId } = req.body;
      if (!invoiceNumber) {
        throw new APIError(
          "BAD_INPUT",
          HttpStatusCode.BAD_INPUT,
          true,
          "Invoice number is required"
        );
      }

      if (!hospitalId) {
        throw new APIError(
          "BAD_INPUT",
          HttpStatusCode.BAD_INPUT,
          true,
          "Hospital ID is required"
        );
      }

      const invoiceData = await invoiceService.generateInvoicePDF(
        invoiceNumber,
        hospitalId
      );
      return res
        .status(201)
        .json({ msg: "Invoice Generated Successfully", invoiceData });
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
}
