import { AisensyConfig } from "../config/aisensy.js";
import Patients from "../models/patientsModel.js";

const aisensy = new AisensyConfig();

export class BroadcastMsgController {
    constructor() { }

    async broadcastSameMsg(req, res, next) {
        try {
            const { patientIds, message } = req.body;

            const campaignName = "robodoc_appointment";

            const patients = await Patients.find({ _id: { $in: patientIds } });

            const userSpecificData = patients.map((patient) => {
                return {
                    userName: patient.name,
                    destination: patient.phone,
                    media: undefined
                }
            });

            const deliveryReport = await aisensy.broadcastSameMsg(campaignName, userSpecificData);

            res.status(200).json({
                success: true, data: {
                    totalMsg: deliveryReport.totalMsg,
                    totalSuccess: deliveryReport.totalSuccess,
                    totalFailed: deliveryReport.totalFailed,
                    totalError: deliveryReport.totalError,
                }
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}