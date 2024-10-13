import axios from 'axios'
import APIError from '../exceptions/errorHandler.js';
import mongoose from 'mongoose';

export class AisensyConfig {
    constructor() { }

    async sendWhatappMsg({ campaignName, destination, userName, media, templateParams }) {

        try {

            const payload = {
                apiKey: process.env.AISENSY_KEY,
                campaignName,
                destination: destination.length === 10 ? "+91" + destination : destination.length == 11 && destination.charAt(0) === "0" ? "+91" + destination.slice(1) : destination,
                userName,
                source: "Direct",
                media,
                templateParams
            }

            const sendMsg = await axios.post("https://backend.aisensy.com/campaign/t1/api/v2", payload);

            return sendMsg
        } catch (error) {
            console.log(error, "Error from sendWhatappMsg")
            throw new APIError(error.name, error.httpCode, error.isOperational, error.message);
        }
    }

    /**
     * Broadcast message to multiple users
     * 
     * @param {{doctorId: mongoose.Types.ObjectId, doctorName: string, doctorMobile: string}} doctorInfo 
     * @param {{hospitalName: string, hospitalContact: string}} hospitalInfo
     * @param {"robodoc_appointment" | appointment_cancel" | "prescription"} campaignName
     * @param {{userName: string, destination: string, appoinmentDate: string, appoinmentTime: string, media: {url:string, filename: string} | undefined}[]} userSpecificData 
     * @returns {Promise<{sendMsg: {success: boolean, submitted_message_id: string}[], totalMsg: number, totalSuccess: number, totalFailed: number, totalError: number}}>}
     */
    async broadcastMsg(doctorInfo, hospitalInfo, campaignName, userSpecificData) {

        const deliveryReport = {
            sendMsg: [],
            totalMsg: userSpecificData.length,
            totalSuccess: 0,
            totalFailed: 0,
            totalError: 0
        };

        for (let i = 0; i < userSpecificData.length; i++) {

            let templateParams;

            switch (campaignName) {
                case "robodoc_appointment":
                    templateParams = [
                        userSpecificData[i].userName,
                        hospitalInfo.hospitalName,
                        userSpecificData[i].appoinmentDate,
                        userSpecificData[i].appoinmentTime,
                        doctorInfo.doctorName
                    ];
                    break;

                case "appointment_cancel":
                    templateParams = [
                        userSpecificData[i].userName,
                        hospitalInfo.hospitalName,
                        doctorInfo.doctorName,
                        userSpecificData[i].appoinmentDate,
                        userSpecificData[i].appoinmentTime,
                    ];
                    break;

                case "prescription":
                    templateParams = [
                        userSpecificData[i].userName,
                        hospitalInfo.hospitalName,
                        userSpecificData[i].appoinmentDate,
                        doctorInfo.doctorMobile,
                        doctorInfo.doctorName,
                        hospitalInfo.hospitalContact
                    ];
                    break;
            }

            try {
                const sendMsg = await this.sendWhatappMsg({
                    campaignName,
                    destination: userSpecificData[i].destination,
                    userName: userSpecificData[i].userName,
                    media: userSpecificData[i].media,
                    templateParams
                });

                if (sendMsg.success) {
                    deliveryReport.totalSuccess++;
                } else {
                    deliveryReport.totalFailed++;
                }

                deliveryReport.sendMsg.push(sendMsg);
            } catch (error) {
                deliveryReport.totalError++;
            }
        }

        return deliveryReport;
    }

    /** Broadcast message to multiple users
     *
     * @param {string} campaignName
     * @param {{userName: string, destination: string}[]} userSpecificData 
     * @returns {Promise<{sendMsg: {success: boolean, submitted_message_id: string}[], totalMsg: number, totalSuccess: number, totalFailed: number, totalError: number}}>}
     */
    async broadcastSameMsg(campaignName, userSpecificData) {

        const deliveryReport = {
            totalMsg: userSpecificData.length,
            totalSuccess: 0,
            totalFailed: 0,
            totalError: 0
        };

        for (let i = 0; i < userSpecificData.length; i++) {

            let templateParams;

            switch (campaignName) {
                case "robodoc_appointment":
                    templateParams = [
                        userSpecificData[i].userName,
                        "Hospital name",
                        "some date",
                        "some time",
                        "Doctor name"
                    ];
                    break;

                default:
                    templateParams = [
                    ];
            }

            try {
                const sendMsg = await this.sendWhatappMsg({
                    campaignName,
                    destination: userSpecificData[i].destination,
                    userName: userSpecificData[i].userName,
                    media: userSpecificData[i].media,
                    templateParams
                });

                if (sendMsg.data.success) {
                    deliveryReport.totalSuccess++;
                } else {
                    console.log(sendMsg.data);
                    deliveryReport.totalFailed++;
                }
                
            } catch (error) {
                console.log(error);
                deliveryReport.totalError++;
            }
        }

        return deliveryReport;
    }
}