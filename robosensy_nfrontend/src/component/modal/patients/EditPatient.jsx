import { Button, Dialog, DialogBody, DialogHeader, Input, Option, Select, Textarea } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getPatientThunk, updatePatientThunk } from "../../../redux/thunk/patients";
import { inputFormatDate } from "../../../utils/dateHelper";
import { resizeFile } from "../../../utils/resizeFile";

const EditPatient = ({ open, toggler, patient, currentPage, searchValue }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    email: "",
    govtID: "",
    address: "",
    referenc: "",
    profilePic: null,
    state: "",
    city: "",
    pincode: ""
  });

  const dispatch = useDispatch();
  useEffect(() => {
    if (patient) {
      setError({
        name: false,
        phone: false,
        dob: false
      });
      setFormData({
        name: patient.name || "",
        phone: patient.phone || "",
        dob: inputFormatDate(patient.dob) || "",
        emergencyContactName: patient.emergencyContactName || "",
        emergencyContactNumber: patient.emergencyContactNumber || "",
        email: patient.email || "",
        govtID: patient.govtID || "",
        address: patient.address || "",
        reference: patient.reference || "",
        state: patient.state || "",
        city: patient.city || "",
        pincode: patient.pincode || ""
      });

      setPatientGender(patient.gender || "");
    }
  }, [patient]);

  const [error, setError] = useState({
    name: false,
    phone: false,
    dob: false
  });

  const [patientGender, setPatientGender] = useState("");

  const updateFormHandler = (e) => {
    let { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateHandler = async () => {
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
      setError(newErrors);
      return;
    }
    await dispatch(updatePatientThunk({ id: patient?._id, data: { ...formData, gender: patientGender } }));
    dispatch(getPatientThunk({ value: searchValue, pageSize: 25, pageIndex: currentPage }));
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
    <Dialog open={open} handler={toggler}>
      <DialogHeader>Update Patient Details</DialogHeader>
      <DialogBody>
        <form className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <span>
            <Input label="Name*" color="blue" type="text" name="name" value={formData.name} error={error.name} onChange={updateFormHandler} />
            <p className={`${error.name ? "block" : "hidden"} ml-2 text-red-400 text-xs mt-1`}>Please Enter valid Name</p>
          </span>
          <span>
            <Input label="Phone*" color="blue" type="number" name="phone" value={formData.phone} error={error.phone} onChange={updateFormHandler} />
            <p className={`${error.phone ? "block" : "hidden"} ml-2 text-red-400 text-xs mt-1`}>Please Enter valid Phone Number</p>
          </span>
          <div className="lg:col-span-2">
            <Textarea label="Address" color="blue" name="address" value={formData.address} type="text" onChange={updateFormHandler} />
          </div>
          <span>
            <Input label="Date of birth*" color="blue" name="dob" type="date" value={formData.dob} error={error.dob} onChange={updateFormHandler} />
            <p className={`${error.dob ? "block" : "hidden"} ml-2 text-red-400 text-xs mt-1`}>Please Enter valid Date of birth</p>
          </span>
          <span>
            <Select label="Gender*" cotlor="blue" name="gender" value={patientGender} error={error.gender} id="gender">
              <Option onClick={() => setPatientGender("MALE")} value="MALE">
                {" "}
                Male
              </Option>
              <Option onClick={() => setPatientGender("FEMALE")} value="FEMALE">
                Female
              </Option>
              <Option onClick={() => setPatientGender("OTHER")} value="OTHER">
                Other
              </Option>
            </Select>
            <p className={`${error.gender ? "block" : "hidden"} ml-2 text-red-400 text-xs mt-1`}>Please Enter valid Gender</p>
          </span>
          <div className="lg:col-span-2">
            <Input label="Reference" color="blue" name="reference" value={formData?.reference} onChange={updateFormHandler} />
          </div>
          <Input label="Email" color="blue" type="email" name="email" value={formData.email} onChange={updateFormHandler} />
          <Input label="GovtId" color="blue" type="text" name="govtId" value={formData.govtID} onChange={updateFormHandler} />
          <span>
            <Input label="Emergency Contact Name" color="blue" type="text" name="emergencyContactName" value={formData.emergencyContactName} error={error.emergencyContactName} onChange={updateFormHandler} />
            <p className={`${error.emergencyContactName ? "block" : "hidden"} ml-2 text-red-400 text-xs mt-1`}>Please Enter valid Contact Name</p>
          </span>
          <span>
            <Input label="Emergency Contact Number" color="blue" type="number" value={formData.emergencyContactNumber} error={error.emergencyContactNumber} name="emergencyContactNumber" onChange={updateFormHandler} />
            <p className={`${error.emergencyContactNumber ? "block" : "hidden"} ml-2 text-red-400 text-xs mt-1`}>Please Enter valid Contact Number</p>
          </span>
          <Input label="Profile Photo" color="blue" type="file" name="profilePhoto" onChange={handleFileChange} />
          <Input label="City" color="blue" type="text" name="city" value={formData.city} onChange={updateFormHandler} className="col-span-1" />
          <Input label="State" color="blue" type="text" name="state" value={formData.state} onChange={updateFormHandler} className="col-span-1" />
          <Input label="Pincode" color="blue" type="number" name="pincode" value={formData.pincode} onChange={updateFormHandler} className="col-span-1" />
          <div className="col-span-2 flex justify-center">
            <Button className="bg-custom-button-purple" onClick={updateHandler}>
              {" "}
              Update
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default EditPatient;
