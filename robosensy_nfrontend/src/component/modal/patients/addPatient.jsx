import { useEffect, useState } from "react";
import { Button, Dialog, Input, Typography, Select, Option, Textarea } from "@material-tailwind/react";
import form from "../../../assets/form.png";
import { useDispatch } from "react-redux";
import { addPatientThunk, getPatientThunk } from "../../../redux/thunk/patients";
import { resizeFile } from "../../../utils/resizeFile";
const initialData = {
  name: "",
  phone: "",
  dob: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  email: "",
  govtID: "",
  address: "",
  reference: "",
  city: "",
  state: "",
  pincode: "",
  profilePic: null
};

export const AddNewPatient = ({ open, toggler }) => {
  const [formData, setFormData] = useState(initialData);

  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    gender: false,
    dob: false
  });

  useEffect(() => {
    setErrors({ name: false, phone: false, gender: false, dob: false });
  }, [open]);

  const [patientGender, setPatientGender] = useState("");

  const dispatch = useDispatch();

  const updateFormHandler = (e) => {
    let { name, value } = e.target;
    setFormData((pre) => ({ ...pre, [name]: value }));
  };

  const submitHandler = async () => {
    const requiredFields = ["name", "phone", "dob"];
    let newErrors = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors.gender = patientGender === "" ? true : false;
        newErrors[field] = true;
        isValid = false;
      } else {
        newErrors[field] = "";
      }
    });
    let isValidPhoneEmergency = true;
    const isValidPhone = /^\d{10}$/.test(formData.phone);
    if (formData.emergencyContactNumber) isValidPhoneEmergency = /^\d{10}$/.test(formData.emergencyContactNumber);

    if (!isValidPhone || !isValidPhoneEmergency) {
      newErrors = {
        ...newErrors,
        phone: isValidPhone ? false : true,
        emergencyContactNumber: isValidPhoneEmergency ? false : true
      };
      isValid = false;
    }
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    await dispatch(addPatientThunk({ ...formData, gender: patientGender }));
    dispatch(getPatientThunk({ pageSize: 25, pageIndex: 1 }));
    setFormData(initialData);
    toggler();
  };

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      const image = await resizeFile(file, 300, 300, "JPEG", 100);
      setFormData((prev) => ({ ...prev, profilePic: image }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={open} handler={toggler} size="lg" className="flex items-center justify-center sm:items-center sm:justify-center">
      <div className="flex flex-col lg:flex-row">
        <div className="bg-theme/60 lg:w-1/2 w-full">
          <img src={form} className="hidden sm:block md:block h-full w-full object-cover lg:w-full sm:w-1/3 md:w-1/2" />
        </div>
        <div className="p-3 w-full lg:w-1/2">
          <Typography variant="h3" className="text-center  pb-3">
            <span className="text-red-400">Add</span>
            <span className="text-blue-400 pl-2">Patient</span>{" "}
          </Typography>
          <form className="grid grid-cols-1 gap-4 lg:grid-cols-2 ">
            <span className="col-span-1">
              <Input label="Name*" color="blue" type="text" name="name" error={errors.name} onChange={updateFormHandler} />
              <p className={`${errors.name ? "block" : "hidden"} ml-2 text-red-400 text-xs mt-1 `}>Please Enter valid Name</p>
            </span>
            <span className="col-span-1">
              <Input label="Whatsapp Number*" color="blue" type="number" name="phone" error={errors.phone} onChange={updateFormHandler} />
              <p className={`${errors.phone ? "block" : "hidden"} ml-2  text-red-400 text-xs mt-1`}>Please Enter valid Phone Number</p>
            </span>
            <div className="col-span-1 sm:col-span-2">
              <Textarea label="Address" color="blue" className="gr" name="address" type="text" onChange={updateFormHandler} />
            </div>
            <span className="col-span-1">
              <Input label="Date of birth*" color="blue" name="dob" type="date" error={errors.dob} onChange={updateFormHandler} />
              <p className={`${errors.dob ? "block" : "hidden"} ml-2 text-red-400 text-xs mt-1`}>Please Enter valid Date of birth</p>
            </span>
            <span className="col-span-1">
              <Select label="Gender*" color="blue" name="gender " error={errors.gender} id="gender">
                <Option onClick={() => setPatientGender("MALE")}> Male</Option>
                <Option onClick={() => setPatientGender("FEMALE")}>Female</Option>
                <Option onClick={() => setPatientGender("OTHER")}>Other</Option>
              </Select>
              <p className={`${errors.gender ? "block" : "hidden"} ml-2 text-red-400 text-xs mt-1`}>Please Enter valid Gender</p>
            </span>
            <div className="col-span-1 sm:col-span-2">
              <Input label="Reference" color="blue" name="reference" onChange={updateFormHandler} />
            </div>
            <Input label="Email" color="blue" type="email" name="email" onChange={updateFormHandler} className="col-span-1" />
            <Input label="Govt Id" color="blue" type="text" name="govtID" onChange={updateFormHandler} className="col-span-1" />
            <span className="col-span-1">
              <Input label="Emergency Contact Name" color="blue" error={errors.emergencyContactName} type="text" name="emergencyContactName" onChange={updateFormHandler} />
              <p className={`${errors.emergencyContactName ? "block" : "hidden"} ml-2 text-red-400 text-xs mt-1`}>Please Enter valid Contact Name</p>
            </span>
            <span className="col-span-1 sm:col-span-1">
              <Input label="Emergency Contact Number" color="blue" type="number" error={errors.emergencyContactNumber} name="emergencyContactNumber" onChange={updateFormHandler} />
              <p className={`${errors.emergencyContactNumber ? "block" : "hidden"} ml-2 text-red-400 text-xs mt-1`}>Please Enter valid Contact Number</p>
            </span>
            <Input label="City" color="blue" type="text" name="city" onChange={updateFormHandler} className="col-span-1" />
            <Input label="State" color="blue" type="text" name="state" onChange={updateFormHandler} className="col-span-1" />
            <Input label="Pincode" color="blue" type="number" name="pincode" onChange={updateFormHandler} className="col-span-1" />
            <Input label="Profile Photo" color="blue" type="file" name="profilePhoto" onChange={handleFileChange} />
            <div className="col-span-1 sm:col-span-2 flex justify-center">
              <Button className="bg-custom-button-purple" onClick={submitHandler}>
                {" "}
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};
