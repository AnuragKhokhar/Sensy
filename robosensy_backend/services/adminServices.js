import APIError, { HttpStatusCode } from "../exceptions/errorHandler.js"
import Admin from "../models/adminModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";
import encryption from "../helpers/encryption.js"
import { transporter } from "../config/sendMail.js"
import Doctor from '../models/doctorModel.js';
import Hospital from '../models/hospitalModel.js'
import Permission from "../models/permissionModel.js"
import { getObjectId } from "../helpers/mongoose.js"
import { sendEmail } from '../utils/email.js';
const encryptionData = new encryption()
export default class admin {
    constructor() { }

  async generateToken(userId, hospitalId, userRole, time) {
    try {
      //generate new token
      let jwtSecretKey = process.env.JWT_SECRET_KEY;

      let generatedTime = new Date().getTime();
      let tokenExpiryTime = generatedTime + time; // Token Expires In 1 Day

      let data = {
        userId: userId,
        hospitalId: hospitalId,
        userRole: userRole,
        tokenExpiryTime: tokenExpiryTime,
      };
      const token = jwt.sign(data, jwtSecretKey);

      return {
        token: token,
        expiresAt: tokenExpiryTime,
      };
    } catch (error) {
      throw new APIError(
        error.name,
        error.httpCode,
        error.isOperational,
        error.message
      );
    }
  }

  async Adminlogin(email, password) {
    try {
        //#region User Pipeline
        let userPipeline = [
            {
                $project: {
                    email: { $toLower: '$email' },
                    password: '$password',
                    name: '$name',
                    hospitalId: '$hospitalId',
                    userRole: '$userRole'
                }
            },
            {
                $match: {
                    email: email
                }
            }
        ]
        //#endregion

        let result = await Admin.aggregate(userPipeline)
        if (result.length == 0) {
            throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'This User Does Not Exist.');
        }

        let userDetails = result[0]

        let hashedPassword = userDetails.password

        let isPasswordMatched = await encryptionData.compareData(password, hashedPassword)

        if (isPasswordMatched) {

            // getting Token of User
            let tokenObj = await this.generateToken(userDetails._id, userDetails.hospitalId, userDetails.userRole, 24 * 60 * 60 * 1000)

            return {
                token: tokenObj.token,
                expiresAt: tokenObj.expiresAt,
                userName: userDetails.name,
                userRole: userDetails.userRole,
                id:userDetails._id
            }
        }
        else {
            throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'Password Does not match.');
        }

    } catch (error) {
        throw new APIError(error.name, error.httpCode, error.isOperational, error.message);
    }
}

// Service code  for ForgotPassword
forgotPassword = async (email) => {
  try {
    const result = await Admin.find({ email });
    const userData = result[0];

    if (!userData) throw new APIError("UNAUTHORIZED_REQUEST", 401, true, 'This User Does Not Exist.');

    const expiryTime = 5 * 60 * 1000; // 5 minutes
    const tokenObj = await this.generateToken(userData._id, userData.hospitalId, 'admin', expiryTime);
    await Admin.findByIdAndUpdate(userData._id, { token: tokenObj.token }, { new: true });

    const resetLink = `http://localhost:3000/reset-password/${tokenObj.token}`;
    const emailOptions = {
      from: 'asuppal0478@gmail.com',
      to: userData.email,
      subject: 'Reset Password',
      html: `<div><p>Hello ${userData.name},</p>
             <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
             <p>To reset your password, click the link below:</p>
             <p><a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 3px;">Reset Password</a></p>
             <p>If you're having trouble with the button above, you can also copy and paste the following link into your web browser:</p>
             <p>${resetLink}</p>
             <p>This link will expire in 5 minutes.</p></div>`,
    };

    await sendEmail(emailOptions);

    return { message: 'Reset link sent to your email' };
  } catch (error) {
    throw new APIError('INTERNAL_SERVER_ERROR', 500, false, 'Internal server error');
  }
};

resetPassword = async (token, newPassword) => {
  try {
    const userData = await Admin.findOne({ token });

    if (!userData) throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'Invalid Token');

    // Check if the token is expired (assuming the expiry time is saved with the token)
    if (new Date().getTime() > userData.tokenExpiryTime) {
      throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'Token expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Admin.findByIdAndUpdate(userData._id, { password: hashedPassword, token: "" }, { new: true });

    return { message: "Password updated successfully" };
  } catch (error) {
    throw new APIError(error.name, error.httpCode, error.isOperational, error.message);
  }
};


  async userList(hospitalId) {
    try {
      const adminList = await Admin.find({ hospitalId });
      return adminList;
    } catch (error) {
      throw new APIError(
        error.name,
        error.httpCode,
        error.isOperational,
        error.message
      );
    }
  }

  async getUserDetails(userId) {
    try {
      const userDetails = await Admin.findById({ _id: userId });
      return userDetails;
    } catch (error) {
      throw new APIError(
        error.name,
        error.httpCode,
        error.isOperational,
        error.message
      );
    }
  }

  async changePassword({ id, password }) {
    try {
      const encryptedPassword = await encryptionData.encryptData(password);
      const updatedAdmin = await Admin.findByIdAndUpdate(
        { _id: id },
        { $set: { password: encryptedPassword } }
      );
      return updatedAdmin;
    } catch (error) {
      throw new APIError(
        error.name,
        error.httpCode,
        error.isOperational,
        error.message
      );
    }
  }

  //doctors Onboards services code

  async onboardDoctor(data) {
    const {
      name,
      mobile,
      licenseNumber,
      email,
      hospitalId,
      experience,
      qualifications,
    } = data;

    // Check if hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      throw new Error("Invalid hospital ID");
    }
    
    const doctor = new Doctor({
      name,
      mobile,
      licenseNumber,
      email,
      hospitalId,
      experience,
      qualifications,
    });

    await doctor.save();
    return doctor;
  }
    async getPermissions(userId) {
        try {

            // TODO - Fetch this data from redis
            const allPermissionsPromise = Permission.find().lean()
            const userPermissionPromise = await Admin.findOne({ _id: getObjectId(userId) }).lean().select('permissions')
            const [allPermissions, userPermissions] = await Promise.all([allPermissionsPromise, userPermissionPromise])

            if (!userPermissions.permissions) {
                userPermissions.permissions = []
            }

            const permissionList = this.addPermissionFlags(allPermissions, userPermissions)

            return permissionList

        } catch (error) {
            throw new APIError(error.name, error.httpCode, error.isOperational, error.message);
        }
    }

    async getAllPermissions() {
        try {

            const allPermissions =await Permission.find()
            return allPermissions

        } catch (error) {
            throw new APIError(error.name, error.httpCode, error.isOperational, error.message);
        }
    }

    addPermissionFlags(permissionArray, userPermissionObj) {
        try {
            // Convert user permissions to a Set for quick lookup
            const userPermissionsSet = new Set();
            userPermissionObj.permissions.forEach(module => {
                module.submodules.forEach(submodule => {
                    userPermissionsSet.add(`${module.moduleKey}_${submodule}`);
                });
            });

            // Map through the permission array and add `hasPermission` key
            return permissionArray.map(module => {
                const updatedSubmodules = module.submodules.map(submodule => {
                    const key = `${module.moduleKey}_${submodule.submoduleKey}`;
                    return {
                        ...submodule,
                        hasPermission: userPermissionsSet.has(key)
                    };
                });
                return {
                    ...module,
                    submodules: updatedSubmodules
                };
            });
        } catch (error) {
            return []
        }

    }

    async updateUserPermission(userId, permissionArray) {
        try {

            const allPermissions = await Permission.find().lean()

            const validationResult = this.validatePermissionArray(allPermissions, permissionArray)

            if(!validationResult){
                throw new APIError("BAD_REQUEST", HttpStatusCode.BAD_REQUEST, true, 'Invalid Permission Array');
            }

            const updatedPermission = await Admin.findByIdAndUpdate({ _id: getObjectId(userId) }, { $set: { permissions: permissionArray } },{new:true})

            return updatedPermission

        } catch (error) {
            throw new APIError(error.name, error.httpCode, error.isOperational, error.message);
        }
    }

    validatePermissionArray(allPermissionsArray, permissionArray) {
        // Convert user permissions to a Set for quick lookup
        const allPermissionSet = new Set();
        allPermissionsArray.forEach(module => {
            module.submodules.forEach(submodule => {
                allPermissionSet.add(`${module.moduleKey}_${submodule.submoduleKey}`);
            });
        });

        let result = true

        permissionArray.forEach(module=>{
            module.submodules.forEach(submodule=>{
                const key = `${module.moduleKey}_${submodule}`
               if(!allPermissionSet.has(key)){
                result = false
               }
            })
        })

        return result
    }

    async AdminRegister(name, email, password, hospitalId, userRole) {
      try {
        //#region User Pipeline
        let userPipeline = [
          {
            $project: {
              email: { $toLower: "$email" },
              password: "$password",
              name: "$name",
              hospitalId: "$hospitalId",
              userRole: "$userRole",
            },
          },
          {
            $match: {
              email: email,
            },
          },
        ];
        //#endregion
  
        let result = await Admin.aggregate(userPipeline);
        if (result.length > 0) {
          throw new APIError(
            "CONFLICT",
            HttpStatusCode.CONFLICT,
            true,
            "This User Already Exists.",
          );
        }
        let hashedPassword = encryptionData.encryptData(password);
        let newAdmin = new Admin({
          name,
          email,
          password: hashedPassword,
          hospitalId,
          userRole,
        });
  
        let savedAdmin = await newAdmin.save();
  
        return {
          message: "Admin Registered Successfully",
        };
      } catch (error) {
        throw new APIError(
          error.name,
          error.httpCode,
          error.isOperational,
          error.message,
        );
      }
    }
}