import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { downloadPrescriptionPdf, getMedicineThunk, getSingleAppointment, getRemarksThunk, getTestThunk, prescriptionThunk, sendPrescriptionThunk } from "../../redux/thunk/appointments";
import { useParams } from "react-router-dom";
import { IoMdCloseCircle } from "react-icons/io";
import CreatableSelect from "react-select/creatable";
import { customStyles } from "../../component/constants/CustomSelect";
import { toast } from "react-toastify";

const AddPrescription = () => {
  const [medicineArr, setMedicineArr] = useState([{ name: null, period: "", frequency: "", remarks: "" }]);
  const [diagnosis, setDiagnosis] = useState("");
  const [vitalsValue, setVitalsValue] = useState({ pulseRate: "", bodyWeight: "", bloodPressure: "", bodyTemperature: "", SpO2: "" });
  const [docotrsAdvice, setDoctorAdvice] = useState("");
  const [testPrescribed, setTestPrescribed] = useState(null);
  const [errorArr, setErrorArr] = useState({ diagnosis: false, medicineArr: false });
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [markAsCompleted, setMarkAsCompleted] = useState(false);

  const dispatch = useDispatch();

  const appointmentData = useSelector((state) => state.AppointmentSlice.singleAppointmentData?.data);
  const testData = useSelector((state) => state.AppointmentSlice.testData?.data);
  const medicineData = useSelector((state) => state.AppointmentSlice.medicineData?.data);
  const periodData = useSelector((state) => state.AppointmentSlice.periodData?.data);
  const frequencyData = useSelector((state) => state.AppointmentSlice.frequencyData?.data);
  const timingData = useSelector((state) => state.AppointmentSlice.timingData?.data);

  const params = useParams();
  useEffect(() => {
    dispatch(getSingleAppointment(params.appointmentId));
    dispatch(getTestThunk());
    dispatch(getMedicineThunk());
    dispatch(getRemarksThunk("timing"));
    dispatch(getRemarksThunk("period"));
    dispatch(getRemarksThunk("frequency"));
  }, []);

  useEffect(() => {
    if (appointmentData?.prescription) {
      const { advice, diagnosis, vitals, testPrescribed, medicines } = appointmentData.prescription;

      setDoctorAdvice(advice || "");
      setDiagnosis(diagnosis || "");

      if (vitals) {
        setVitalsValue({
          pulseRate: vitals.pulseRate || "",
          bodyWeight: vitals.bodyWeight || "",
          bloodPressure: vitals.bloodPressure || "",
          bodyTemperature: vitals.bodyTemperature || "",
          SpO2: vitals.SpO2 || ""
        });
      }

      setTestPrescribed(testPrescribed || []);

      if (medicines?.length) {
        const temp = medicines.map(({ name, period, remarks, frequency, ...rest }) => ({
          name: name ? { medicineName: name } : "",
          period: period ? { remark: period } : "",
          frequency: frequency ? { remark: frequency } : "",
          remarks: remarks ? { remark: remarks } : "",
          ...rest
        }));
        setMedicineArr(temp);
      } else {
        setMedicineArr([{ name: null, period: "", frequency: "", remarks: "" }]);
      }

      return () => {
        setDoctorAdvice("");
        setDiagnosis("");
        setVitalsValue({
          pulseRate: "",
          bodyWeight: "",
          bloodPressure: "",
          bodyTemperature: "",
          SpO2: ""
        });
        setTestPrescribed([]);
        setMedicineArr([{ name: null, period: "", frequency: "", remarks: "" }]);
      };
    }
  }, [appointmentData, params]);

  const handleVitalsChange = (id, value) => {
    setVitalsValue((prev) => ({ ...prev, [id]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!diagnosis) {
      toast.error(`Diagnosis field is required.`);
      setErrorArr((prev) => ({ ...prev, diagnosis: true }));
      return;
    }

    let emptyCount = 0;
    let count = 0;

    // validating medicine array
    for (let med of medicineArr) {
      // check if any field is filled
      count++;
      if (med?.frequency || med?.name || med?.period || med?.remarks) {
        if (!med.frequency?.remark || !med.name?.medicineName || !med.period?.remark || !med.remarks?.remark) {
          toast.error(`Please fill all details of medicine row ${count}.`);
          setErrorArr((prev) => ({ ...prev, medicineArr: true }));
          return;
        }
      } else {
        emptyCount++;
      }
    }

    if (emptyCount > 1) {
      toast.error(`Please delete atleast ${emptyCount - 1} medicine row.`);
      return;
    }

    setErrorArr((prev) => ({ ...prev, medicineArr: false }));

    const prescriptionData = {
      vitals: vitalsValue,
      advice: docotrsAdvice,
      testPrescribed,
      diagnosis,
      medicines: medicineArr.map(({ name, period, frequency, remarks, ...rest }) => ({
        name: name?.medicineName || null,
        period: period?.remark || null,
        frequency: frequency?.remark || null,
        remarks: remarks?.remark || null,
        ...rest
      })),
      markAsCompleted,
    };

    await dispatch(prescriptionThunk({ appointmentId: appointmentData._id, ...prescriptionData }))
      .unwrap()
      .then(() => {
        dispatch(getSingleAppointment(params.appointmentId));
      });
  };
  const updateField = (index, name, value) => {
    if (errorArr.medicineArr) setErrorArr((prev) => ({ ...prev, medicineArr: false }));
    const temp = [...medicineArr];
    temp[index] = { ...temp[index], [name]: value };
    setMedicineArr(temp);
  };
  const removeField = (index) => {
    const temp = [...medicineArr];
    temp.splice(index, 1);
    setMedicineArr(temp);
  };

  const downloadPdfHandler = () => {
    setGeneratingPdf(true);
    dispatch(downloadPrescriptionPdf(appointmentData._id))
      .unwrap()
      .then((data) => {
        if (data?.appointmentData) {
          setGeneratingPdf(false);
          dispatch(getSingleAppointment(params.appointmentId));
          window.open(data.appointmentData?.prescriptionPdfUrl);
        }
      });
  };

  const handleCreateTest = (inputValue) => {
    const newOption = { testName: inputValue };
    setTestPrescribed((prev) => (prev ? [...prev, newOption] : [newOption]));
  };

  const handleCreateMedicine = (inputValue, index) => {
    const newOption = { medicineName: inputValue };
    const temp = [...medicineArr];
    temp[index] = { ...temp[index], name: newOption };
    setMedicineArr(temp);
  };

  const handleCreateRemark = (inputValue, index, remark) => {
    const newOption = { remark: inputValue };
    const temp = [...medicineArr];
    temp[index] = { ...temp[index], [remark]: newOption };
    setMedicineArr(temp);
  };

  const sendPrescriptionHandler = (e) => {
    e.preventDefault();
    setSendingMsg(true);
    dispatch(sendPrescriptionThunk(appointmentData._id))
      .unwrap()
      .then((data) => {
        setSendingMsg(false);
        if (data?.data?.success) toast.success("Prescription Sent Successfully");
      });
  };

  return (
    <div className="p-5 h-full min-h-screen bg-white">
      <div className="flex gap-3 ">
        <div className="w-1/2 custom-polifyx-scrollbar   border-r-4  h-full  pr-2">
          <Typography variant="h3" className="mb-4 text-center">
            Add Prescription
          </Typography>
          <form className="flex flex-col gap-4 mt-2" onSubmit={submitHandler}>
            <div className="flex gap-3">
              <Input label="Pulse Rate" id="pulse" value={vitalsValue.pulseRate} onChange={(e) => handleVitalsChange("pulseRate", e.target.value)} color="blue" />
              <Input label="Body Weight" id="pulse" value={vitalsValue.bodyWeight} onChange={(e) => handleVitalsChange("bodyWeight", e.target.value)} color="blue" />
              <Input label="Blood Pressure" id="pulse" value={vitalsValue.bloodPressure} onChange={(e) => handleVitalsChange("bloodPressure", e.target.value)} color="blue" />
            </div>
            <div className="flex gap-3">
              <Input label="Body Temperature:" id="pulse" value={vitalsValue.bodyTemperature} onChange={(e) => handleVitalsChange("bodyTemperature", e.target.value)} color="blue" />
              <Input label="Oxygen Saturation:" id="o2" value={vitalsValue.SpO2} onChange={(e) => handleVitalsChange("SpO2", e.target.value)} color="blue" />
            </div>
            <Textarea
              label="Diagnosis*"
              id="Diagnosis"
              rows={5}
              error={errorArr.diagnosis}
              value={diagnosis}
              onChange={(e) => {
                setErrorArr((prev) => ({ ...prev, diagnosis: false }));
                setDiagnosis(e.target.value);
              }}
              color="blue"
            />
            <Textarea label="Advice" id="advice" rows={4} value={docotrsAdvice} onChange={(e) => setDoctorAdvice(e.target.value)} color="blue" />
            <CreatableSelect isClearable menuPlacement="top" isMulti getOptionLabel={(option) => option.testName} getOptionValue={(option) => option.testName} placeholder="Test Prescribed" onChange={(value) => setTestPrescribed(value)} options={testData} value={testPrescribed} onCreateOption={handleCreateTest} />
            {medicineArr &&
              medicineArr.map((obj, i) => {
                return (
                  <div key={i} id={i} className="flex mb-2  gap-3 justify-between ">
                    <div className="flex gap-2">
                      <Typography className="font-bold text-black">{i + 1}.</Typography>
                      <div>
                        <div className="flex gap-4 justify-between mb-2 item-center">
                          <span className="w-1/2">
                            <CreatableSelect isClearable menuPlacement="top" getOptionValue={(option) => option?.medicineName} getOptionLabel={(option) => option?.medicineName} placeholder="Select Medicine" styles={errorArr.medicineArr && customStyles} onChange={(option) => updateField(i, "name", option)} options={medicineData || []} onCreateOption={(name) => handleCreateMedicine(name, i, "medicineName")} value={medicineArr[i]?.name} />
                          </span>
                          <span className="w-1/2">
                            <CreatableSelect isClearable menuPlacement="top" getOptionValue={(option) => option?.remark} getOptionLabel={(option) => option?.remark} placeholder="Select Period" onChange={(option) => updateField(i, "period", option)} options={periodData || []} styles={errorArr.medicineArr && customStyles} value={medicineArr[i]?.period} onCreateOption={(name) => handleCreateRemark(name, i, "period")} />
                          </span>
                        </div>
                        <div className="flex gap-4 min-w-[28rem]  item-center">
                          <span className="w-1/2 ">
                            <CreatableSelect isClearable menuPlacement="top" getOptionValue={(option) => option?.remark} getOptionLabel={(option) => option?.remark} placeholder="Select Frequency" styles={errorArr.medicineArr && customStyles} onChange={(option) => updateField(i, "frequency", option)} options={frequencyData || []} value={medicineArr[i]?.frequency} onCreateOption={(name) => handleCreateRemark(name, i, "frequency")} />
                          </span>
                          <span className="w-1/2">
                            <CreatableSelect isClearable menuPlacement="top" getOptionValue={(option) => option?.remark} getOptionLabel={(option) => option?.remark} placeholder="Select Remarks" styles={errorArr.medicineArr && customStyles} onChange={(option) => updateField(i, "remarks", option)} options={timingData || []} value={medicineArr[i]?.remarks} onCreateOption={(name) => handleCreateRemark(name, i, "remarks")} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-center items-center">
                      <Button color="green" className={i !== medicineArr.length - 1 && "hidden"} onClick={() => setMedicineArr((prev) => [...prev, { name: "", quantity: "", frequency: "", remarks: "" }])}>
                        Add More
                      </Button>
                      <IoMdCloseCircle className={`text-3xl cursor-pointer text-red-700 ${i == 0 && "hidden"}`} onClick={() => removeField(i)} />
                    </div>
                  </div>
                );
              })}
            <div className="flex justify-center gap-2">
              <input id="mark-as-complete" className="cursor-pointer" type="checkbox" data-indeterminate="false" onChange={(e) => setMarkAsCompleted(e.target.checked)} />
              <label htmlFor="mark-as-complete" className="text-gray-600 cursor-pointer select-none">Mark as completed</label>
            </div>
            <div className="lg:col-span-2 flex justify-center gap-4">
              <Button color="indigo" type="submit">
                Submit
              </Button>
              {appointmentData?.prescription?.diagnosis && (
                <Button color="deep-orange" loading={generatingPdf} type="button" onClick={downloadPdfHandler}>
                  {generatingPdf ? "Generating" : "Generate"}
                </Button>
              )}
              {appointmentData?.prescriptionPdfUrl && (
                <Button color="green" type="button" loading={sendingMsg} onClick={sendPrescriptionHandler}>
                  {sendingMsg ? "Sending" : "Send"}
                </Button>
              )}
            </div>
          </form>
        </div>
        <div className="w-[45%] max-h-[87vh] overflow-scroll fixed right-6">
          <header className="flex justify-between px-6 ">
            <div className="w-[40%] leading-1">
              <Typography className="text-[#3737A0] font-bold text-lg">{appointmentData?.doctorId?.name}</Typography>
              <Typography className="font-semibold text-xs">{appointmentData?.doctorId?.qualifications.join(", ")}</Typography>
              <Typography className="font-semibold text-xs">{appointmentData?.doctorId?.mobile}</Typography>
            </div>
            <img className="w-12 h-12" src={appointmentData?.hospitalId?.logo} />
            <div className="w-[40%]">
              <Typography className="text-[#3737A0] font-bold text-lg">{appointmentData?.hospitalId?.name}</Typography>
              <Typography className="font-semibold text-xs">Address: {appointmentData?.hospitalId?.address}</Typography>
              <Typography className="font-semibold text-xs">Ph: {appointmentData?.hospitalId?.contactNumber}</Typography>
              <Typography className="font-semibold text-xs">Email: {appointmentData?.hospitalId?.email}</Typography>
            </div>
          </header>
          <div className="border-t-2  border-[#191b53] w-full my-4"></div>
          <div className="flex">
            <Typography className="text-xs w-[45%]">
              {" "}
              Patient Name: <span className="text-black font-bold">{appointmentData && appointmentData?.patientId?.name}</span>{" "}
            </Typography>
            <Typography className="text-xs w-[25%]">
              {" "}
              Age/Sex:{" "}
              <span className="text-black font-bold">
                {dayjs().diff(dayjs(appointmentData?.patientId?.dob), "year")}/{appointmentData?.patientId?.gender}
              </span>
            </Typography>
            <Typography className="text-xs">
              {" "}
              Date: <span className="text-black font-bold">{dayjs().format("MM/DD/YYYY")}</span>{" "}
            </Typography>
          </div>
          <div className="flex my-2">
            <Typography className="text-xs w-[35%]">
              {" "}
              Phone No: <span className="text-black font-bold">{appointmentData && appointmentData?.patientId?.phone}</span>{" "}
            </Typography>
            <Typography className="text-xs ">
              {" "}
              Address: <span className="text-black font-bold">{appointmentData && appointmentData?.patientId?.address}</span>{" "}
            </Typography>
          </div>
          <Typography className="text-xs ">
            {" "}
            Ref By: <span className="text-black font-bold">{appointmentData && appointmentData?.patientId?.reference}</span>{" "}
          </Typography>

          <div className="mt-4 flex gap-3">
            <Typography className="text-xs">Vitals:</Typography>
            <Typography className="text-black text-xs font-bold">
              {vitalsValue.pulseRate ? (
                <span>
                  PULSE RATE - <span className="font-medium">{vitalsValue.pulseRate}</span> |{" "}
                </span>
              ) : (
                ""
              )}
              {vitalsValue.bodyWeight ? (
                <span>
                  BODY WEIGHT - <span className="font-medium">{vitalsValue.bodyWeight}</span> |{" "}
                </span>
              ) : (
                ""
              )}
              {vitalsValue.bloodPressure ? (
                <span>
                  BLOOD PRESSURE - <span className="font-medium">{vitalsValue.bloodPressure}</span> |{" "}
                </span>
              ) : (
                ""
              )}
              {vitalsValue.bodyTemperature ? (
                <span>
                  BODY TEMPERATURE - <span className="font-medium">{vitalsValue.bodyTemperature}</span> |{" "}
                </span>
              ) : (
                ""
              )}
              {vitalsValue.SpO2 ? (
                <span>
                  Oxygen Saturation - <span className="font-medium">{vitalsValue.SpO2}</span>
                </span>
              ) : (
                ""
              )}
            </Typography>
          </div>
          <div className="mt-3 flex gap-3">
            <Typography className="text-xs">Diagnosis</Typography>
            <Typography className="text-black text-xs font-bold">{diagnosis}</Typography>
          </div>
          <div className="mt-3 flex gap-3">
            <Typography className="text-xs">Test Prescribed</Typography>
            {testPrescribed &&
              testPrescribed.map((obj, i) => {
                return (
                  <Typography key={i} className="text-black text-xs font-bold mr-1">
                    {obj.testName},
                  </Typography>
                );
              })}
          </div>
          <div className="mt-3 flex gap-3">
            <Typography className="text-xs">Advice</Typography>
            <Typography className="text-black text-xs font-bold">{docotrsAdvice}</Typography>
          </div>

          <Typography className="text-xs text-center font-bold my-2 text-[#9487ab] ">PRESCRIPTION</Typography>

          {medicineArr && (
            <table className="w-full text-xs border-2 border-[#9487ab]  rounded-lg ">
              <thead className="text-xs font-semibold bg-[#c6b7de] text-black ">
                <tr className="text-center">
                  <th className="py-1 border-r-2 border-b-2 border-[#9487ab] ">S. No.</th>
                  <th className=" border-r-2 border-b-2 border-[#9487ab] ">Name</th>
                  <th className=" border-r-2 border-b-2 border-[#9487ab] ">Period</th>
                  <th className=" border-r-2 border-b-2 border-[#9487ab] ">Frequency</th>
                  <th className=" border-r-2 border-b-2 border-[#9487ab] ">Remarks</th>
                </tr>
              </thead>
              <tbody className="overflow-scroll">
                {medicineArr &&
                  medicineArr.map((data, i) => {
                    return (
                      <tr key={i} className=" text-center font-medium text-black">
                        <td className="py-1 border-r-2 border-b-2 border-[#9487ab] ">{i + 1}</td>
                        <td className=" border-r-2 border-b-2 border-[#9487ab] ">{data?.name?.medicineName}</td>
                        <td className=" border-r-2  border-b-2 border-[#9487ab] ">{data?.period?.remark}</td>
                        <td className=" border-r-2 border-b-2 border-[#9487ab] ">{data?.frequency?.remark}</td>
                        <td className=" border-r-2 border-b-2 border-[#9487ab] ">{data?.remarks?.remark}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPrescription;
