import Invoice from "../models/invoiceModel.js";
import Hospital from "../models/hospitalModel.js";
import APIError, { HttpStatusCode } from "../exceptions/errorHandler.js";
import { PDFGenerate } from "../config/pdfGenerate.js";
import { FormatDate } from "../helpers/dateFormat.js";
import S3Service from "./s3Service.js";
import fs from "fs";
import FileHelper from "../helpers/fileHelper.js";
import mongoose from "mongoose";
const DateFormat = new FormatDate();
const GeneratePDF = new PDFGenerate();
const s3Service = new S3Service();
class InvoiceService {
  constructor() {}

  async addInvoice({
    invoiceNumber,
    date,
    customerName,
    address,
    medicines,
    finalAmount,
    discount,
    totalAmount,
  }) {
    try {
      const isAlreadyExist = await Invoice.findOne({ invoiceNumber });
      if (isAlreadyExist) {
        throw new APIError(
          "BAD_INPUT",
          HttpStatusCode.BAD_INPUT,
          true,
          "Invoice with given invoice number already exists"
        );
      }
      const payload = {
        invoiceNumber,
        date,
        customerName,
        address,
        medicines,
        finalAmount,
        discount,
        totalAmount,
      };

      const InvoiceData = await Invoice.create(payload);

      return InvoiceData;
    } catch (error) {
      throw new APIError(
        error.name,
        error.httpCode,
        error.isOperational,
        error.message
      );
    }
  }

  async generateInvoicePDF(invoiceNumber, hospitalId) {
    try {
      const invoiceData = await Invoice.findOne({ invoiceNumber });
      if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
        throw new APIError(
          "BAD_INPUT",
          HttpStatusCode.BAD_INPUT,
          true,
          "Invalid Hospital ID"
        );
      }
      const hospitalObjectId = new mongoose.Types.ObjectId(hospitalId);
      const hospitalData = await Hospital.findOne({ _id: hospitalObjectId });
      const timestamp = new Date().getTime();
      if (!invoiceData) {
        throw new APIError(
          "BAD_INPUT",
          HttpStatusCode.BAD_INPUT,
          true,
          "No Invoice found"
        );
      }

      const {
        _id: invoiceId,
        customerName,
        address,
        date,
        medicines,
        totalAmount,
        discount,
        finalAmount,
      } = invoiceData;

      const formattedDate = await DateFormat.prescriptionPdfDate(date);
      const pdfData = {
        customerName,
        address,
        date: formattedDate,
        medicines,
        totalAmount,
        discount,
        finalAmount,
        invoiceNumber,
        hospital: {
          name: hospitalData.name,
          logo: hospitalData.logo,
          address: hospitalData.address,
          contactNumber: hospitalData.contactNumber,
          email: hospitalData.email,
        },
      };

      const data = await GeneratePDF.renderEjs(
        "templates/invoice/invoice.ejs",
        pdfData
      );

      const outputPath = `${invoiceId}-${timestamp}.pdf`;
      await GeneratePDF.convertHtmlToPdf(data, outputPath, "A4");

      const underScoredDateAndTime =
        DateFormat.getUnderscoredDateAndTime(timestamp);

      const fileName = `${customerName}_${underScoredDateAndTime}.pdf`;
      const s3path = `invoices/${invoiceId}/${fileName}`;
      const fileContent = fs.readFileSync(outputPath);
      const pdfUrl = await s3Service.uploadFileToS3(
        process.env.BUCKET_NAME,
        s3path,
        fileContent,
        "application/pdf"
      );
      FileHelper.deleteFile(outputPath);

      return pdfUrl;
    } catch (error) {
      console.error("Error in generateInvoicePDF:", error);
      throw new APIError(
        error.name,
        error.httpCode,
        error.isOperational,
        error.message
      );
    }
  }
}
export default InvoiceService;
