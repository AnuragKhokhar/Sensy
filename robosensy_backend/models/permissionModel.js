import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    moduleKey: { type: String, required: true },
    moduleName: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: false },
    description: String,
    submodules: [
        {
            submoduleKey: { type: String, required: true },
            submoduleName: { type: String, required: true },
            description: String
        }
    ]
})

const Permission = mongoose.model('permissions', permissionSchema);
export default Permission;