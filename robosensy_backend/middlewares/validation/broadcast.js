import { check } from "express-validator";
import { resultChecker } from "./resultChecker.js"

const broadcastMsg = [
    check('message').exists().withMessage('message not found'),
    check('patientIds').exists().withMessage('patientIds data not found'),
    check('patientIds').isArray().withMessage('patientIds data must be an array'),
]

export const broadcastMsgValidator = [broadcastMsg, resultChecker]