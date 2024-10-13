import Doctors from '../models/doctorModel.js';
import APIError, { HttpStatusCode } from '../exceptions/errorHandler.js';

export default class UsageMonitoringService {
    constructor() { }

    /**
     * Increase messageSentCount of doctor by incrementBy, default value is 1
     */
    async incrementTotalMessageSent(doctorId, incrementBy = 1) {
        try {
            const doctorData = await Doctors.findOne({ _id: doctorId })

            if (!doctorData) {
                throw new APIError('BAD_INPUT', HttpStatusCode.BAD_INPUT, true, 'No doctor found')
            }

            const updatedDoctor = await Doctors.findOneAndUpdate(
                { _id: doctorData._id },
                { $inc: { 'serviceUsage.totalMessagesSent': incrementBy } },
                { new: true }
            )

            return updatedDoctor
        } catch (error) {
            throw new APIError(error.name, error.httpCode, error.isOperational, error.message);
        }
    }
}