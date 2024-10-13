import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    patientId: mongoose.Types.ObjectId,
    appointmentId: mongoose.Types.ObjectId,
    invoiceNumber: {
      type: String,
    },
    customerName:{ type: String },
    address:{type:String},
    date:{type:Number},
    medicines: [
      {
        medicineId: { type: String },
        name: { type: String },
        qty: { type: String },
        price: { type: String },
        totalAmount: { type: String },
      },
    ],
    finalAmount: { type: String },
    discount: { type: String },
    totalAmount:{type:String}
  },
  { timestamps: true }
);

const Invoice = mongoose.model("invoice", invoiceSchema);

export default Invoice;
