import adminService from "../services/adminServices.js";
import APIError from "../exceptions/errorHandler.js";
const AdminService = new adminService();

export default class adminController {
  constructor() {}

  async login(req, res, next) {
    try {
      let { email, password } = req.body;

      let result = await AdminService.Adminlogin(email.toLowerCase(), password);
      return res.status(200).json({ msg: "Success", result });
    } catch (error) {
      next(error);
    }
  }
  // Controller for Forget Password
  forgotPassword=async(req, res, next) => {
    try {
        let { email } = req.body;
        let result = await AdminService.forgotPassword(email);
        return res.status(200).json({ msg: 'Reset Link has been sent to your email.', result });
    } catch (error) {
       
        next(new APIError("INTERNAL_SERVER_ERROR", 500, false, "Internal server error."));
    }
}
// Controller for Reset Password

resetPassword=async (req, res, next) => {
    try {
        const token = req.params.id;
        const { password } = req.body;
        if (!token) return res.status(400).json({ msg: 'Token not found' });
        let result = await AdminService.resetPassword(token, password);
        return res.status(200).json({ msg: 'Password changed successfully', result });
    } catch (error) {
       
        next(new APIError("INTERNAL_SERVER_ERROR", 500, false, "Internal server error."));
    }
}

  async userList(req, res, next) {
    try {
      const { hospitalId } = req.body;
      const result = await AdminService.userList(hospitalId);
      return res
        .status(200)
        .json({ msg: "Admins Fetched Successfully", users: result });
    } catch (error) {
      next(error);
    }
  }

  async getUserDetails(req, res, next) {
    try {
      const { userId } = req.body;
      const result = await AdminService.getUserDetails(userId);
      return res
        .status(200)
        .json({ msg: "Admins Fetched Successfully", users: result });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { id, password } = req.body;
      const result = await AdminService.changePassword({ id, password });
      return res
        .status(200)
        .json({ msg: "Admins Fetched Successfully", result });
    } catch (error) {
      next(error);
    }
  }

  //Onboard doctors controller
  async onboardDoctor(req, res, next) {
    try {
      const doctorData = req.body;
      const result = await AdminService.onboardDoctor(doctorData);
      return res
        .status(201)
        .json({ msg: "Doctor onboarded successfully", result });
    } catch (error) {
      next(error);
    }
  }

//get doctors
  async getDoctors(req, res, next) {
    try {
      const result = await AdminService.getDoctors();
      return res
        .status(200)
        .json({ msg: "Doctors fetched successfully", doctors: result });
    } catch (error) {
      next(error);
    }

  }
    async getPermissions (req,res,next) {
        try {
            const {userid} = req.params;
            const data = await AdminService.getPermissions(userid)
            return res.status(200).json({ msg: 'Permissions Fetched Successfully', data })
        } catch (error) {
            next(error)
        }
    }

    async getAllPermissions (req,res,next) {
        try {
            const result = await AdminService.getAllPermissions()
            return res.status(200).json({ msg: 'Permissions Fetched Successfully', data:result })
        } catch (error) {
            next(error)
        }
    }

    async updatePermissions (req,res,next) {
        try {
            const {userid} = req.params;
            const {permissionArray} = req.body
            const result = await AdminService.updateUserPermission(userid, permissionArray)
            return res.status(200).json({ msg: 'Permissions Updated Successfully', data:result , success:true })
        } catch (error) {
            next(error)
        }
    }

    async register(req, res, next) {
      try {
        let { name, email, password, label, hospitalId, userRole } = req.body;
        let result = await AdminService.AdminRegister(
          name,
          email,
          password,
          hospitalId,
          userRole,
        );
        return res.status(200).json({ msg: "Success", result });
      } catch (error) {
        next(error);
      }
    }
  
}