import { Typography } from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getStatusColor } from "../../component/common/ActionTable/TableFunctions";
import { getDate, getTime } from "../../utils/dateHelper";
import moment from "moment";
import { FaDownload, FaEye } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";

const PatientAppointment = () => {
  const [PerscriptionHistoryData, setPerscriptionHistoryData] = useState([]);
  const [DocsData, setDocsData] = useState([]);

  const { state } = useLocation();

  const pdfUrl = state?.prescriptionPdfUrl;
  const linkText = pdfUrl ? pdfUrl : "-";

  const downloadFile = (file) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = file.s3url;
    downloadLink.download = file.filePath;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  useEffect(() => {
    setDocsData(state?.patientId?.docs || []);
  }, [state?.patientId?.docs]);

  useEffect(() => {
    setPerscriptionHistoryData(state?.prescriptionPdfHistory || []);
  }, [state?.prescriptionPdfHistory]);

  const truncateUrl = (url, maxLength = 100) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  const oldestPrescription = PerscriptionHistoryData.length > 0 ? PerscriptionHistoryData[0] : null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mt-28 mx-4 sm:mx-12">
      <Typography className="text-center" variant="h3">
        Appointment Details
      </Typography>
      <div className="flex mt-4 px-10 text-gray-600">
        <div className="mr-20 flex-shrink-0">
          {state.patientId.profilePic ? (
            <img src={state.patientId.profilePic} alt="Patient Profile" className="w-40 h-40 rounded-full" />
          ) : (
            <FaUserCircle className="w-40 h-40 text-gray-400" />
          )}
        </div>
        <div className="flex flex-col justify-center flex-grow">
          <div className="grid grid-cols-2 gap-y-4">
            <span>
              <Typography>Patient Name</Typography>
              <Typography className="font-bold text-black">{state.patientId.name}</Typography>
            </span>
            <span>
              <Typography>Date</Typography>
              <Typography className="font-bold text-black">{getDate(state.date)}</Typography>
            </span>
            <span>
              <Typography>Time</Typography>
              <Typography className="font-bold text-black">{getTime(state.date)}</Typography>
            </span>
            <span className="flex items-center">
              <Typography>Status</Typography>
              <Typography className="font-bold text-black ml-1">
                <span>{getStatusColor(state.status)}</span>
              </Typography>
            </span>
            <span>
              <Typography>Department</Typography>
              <Typography className="font-bold text-black">{state.departmentId?.name}</Typography>
            </span>
            <span>
              <Typography>Doctor</Typography>
              <Typography className="font-bold text-black">{state.doctorId?.name}</Typography>
            </span>
          </div>
        </div>
      </div>
      <div>
        <Typography variant="h4" className="mt-8">
          Prescription
        </Typography>
        <Typography className="font-bold text-black">
          {pdfUrl ? (
            <a href={pdfUrl} className="text-blue-500" target="_blank" rel="noopener noreferrer">
              {linkText}
            </a>
          ) : (
            linkText
          )}
        </Typography>
      </div>
      <div>
        <Typography variant="h4" className="mt-8">
          Prescription History
        </Typography>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="col-span-3 font-bold">URL</div>
          <div className="col-span-1 font-bold">Date</div>
          {oldestPrescription ? (
            <>
              <div className="col-span-3">
                <a href={oldestPrescription.url} className="text-blue-500 truncate" target="_blank" rel="noopener noreferrer">
                  {truncateUrl(oldestPrescription.url)}
                </a>
              </div>
              <div className="col-span-1 text-gray-600">
                ({moment(oldestPrescription.createdAt).format("MMMM Do YYYY, h:mm:ss a")})
              </div>
            </>
          ) : (
            <Typography className="text-gray-600 col-span-4">No prescription history available.</Typography>
          )}
        </div>
      </div>
      <div>
        <Typography variant="h4" className="mt-8">
          Document List
        </Typography>
        <div>
          {DocsData.map((file, index) => (
            <div key={index} className="mb-4 flex items-center">
              <span className="text-gray-700 max-w-[80%] truncate ml-3">{file.fileName}</span>
              <div className="flex items-center ml-auto">
                <a href={file.s3url} rel="noopener noreferrer" target="_blank">
                  <FaEye className="text-blue-500 cursor-pointer mr-2" style={{ width: "24px", height: "24px" }} />
                </a>
                <FaDownload className="text-green-500 cursor-pointer mr-2" style={{ width: "24px", height: "24px" }} onClick={() => downloadFile(file)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Typography variant="h4" className="mt-8">
          Reference
        </Typography>
        <div>
          {state.patientId.reference ? (
            <Typography className="text-gray-600">{state.patientId.reference}</Typography>
          ) : (
            <Typography className="text-gray-600">No reference available.</Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointment;
