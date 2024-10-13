import nodemailer from 'nodemailer';
import APIError from '../exceptions/errorHandler.js';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'asuppal0478@gmail.com',
    pass: 'ochmqpfqylfxgijj'
  }
});

export const sendEmail = async (options) => {
  try {
    const info = await transporter.sendMail(options);
   
    return info;
  } catch (error) {
    next(new APIError("INTERNAL_SERVER_ERROR", 500, false, "Internal server error."));
    
  }
};
