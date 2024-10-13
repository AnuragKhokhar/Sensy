import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaDownload, FaFileUpload, FaPrescription, FaPenSquare } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import AddPrescription from "../../component/modal/appointment/appPrescription";
import { ActionTable } from "../../component/common/ActionTable/ActionTable";
import { appointmentHeading, appointmentKeys } from "../../component/common/ActionTable/TableConstants";
import AppointmentHeader from "./AppointmentHeader";
import UpdateAppointment from "../../component/modal/appointment/updateAppointment";
import UploadDoc from "../../component/modal/appointment/uploadDoc";
import DownloadFiles from "../../component/modal/patients/downloadDoc";
import { TiCancel } from "react-icons/ti";
import CancelAppointment from "../../component/modal/appointment/cancel";
import { PiListChecks } from "react-icons/pi";
import ViewAppointment from "../../component/modal/patients/viewAppointments";
import Notes from "../../component/modal/appointment/Notes";
import { DefaultPagination } from "../../utils/pagination";
import { useNavigate } from "react-router-dom";
import { IoIosSend } from "react-icons/io";
import SendPrescription from "../../component/modal/appointment/sendPrescription";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import ViewPrescription from "../../component/modal/appointment/viewPrescription";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import CompleteAppointment from "../../component/modal/appointment/completeAppointment";
import { hasSubmodulePermission } from "../../utils/helpers";
import Select from "react-select";

const AppointmentTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isNotesModalOpen, setNotesModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointent] = useState();
  const [isUploadDocModalOpen, setUploadDocModalOpen] = useState(false);
  const [isAppHistoryModalOpen, setAppHistoryModalOpen] = useState(false);
  const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
  const [isUpdateAppointmentModalOpen, setUpdateAppointmentModalOpen] = useState(false);
  const [cancelAppointment, setCancelAppointment] = useState(false);
  const [sendPrescriptionModal, setSendPrescriptionModal] = useState(false);
  const [prescriptionHistoryModal, setPrescriptionHistoryModal] = useState(false);
  const [completeAppointmentModal, setCompleteAppointmentModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedColumn, setSelectedColumns] = useState(() => JSON.parse(localStorage.getItem("selectedColumn")) || []);
  const [filteredKey, setFilteredKeys] = useState(() => JSON.parse(localStorage.getItem("filteredKey")) || []); 

  const options = appointmentHeading.map((heading, index) => ({
    label: heading,
    value: appointmentKeys[index+1]
  }));

  const handleColumnSelection = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.label);
    const selectedKeys = selectedOptions.map((option) => option.value);
    
    const updatedKeys = ["appointment",...selectedKeys];

    setSelectedColumns(selectedValues);
    setFilteredKeys(updatedKeys);
  };

  useEffect(() => {
    localStorage.setItem("selectedColumn", JSON.stringify(selectedColumn));
    localStorage.setItem("filteredKey", JSON.stringify(filteredKey));
  }, [selectedColumn, filteredKey]);



  const pageSize = 25;

  const [payload, setPayload] = useState({ date: "", status: "", search: searchValue });
  const userPermissions = useSelector((state) => state.LoginSlice.userPermissions?.data);

  const appointments = useSelector((state) => state.AppointmentSlice);
  const navigate = useNavigate();

  useEffect(() => {
    setTableData(appointments?.allAppoinments?.allAppoinments?.appointmentList);
    setLoading(appointments.loading);
  }, [appointments]);

  const totalPages = appointments?.allAppoinments?.allAppoinments?.count ? Math.ceil(appointments?.allAppoinments?.allAppoinments?.count / pageSize) : 0;

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const totalAppointments = appointments?.allAppoinments?.allAppoinments?.count || 0;

  const actions = [
    { icon: <FaPrescription size={20} color="red" className="cursor-pointer" />, id: "ADD_PRESCRIPTION", tooltip: "Add Prescription", onClickFunction: (data) => navigate("prescription/" + data._id) },
    { icon: <MdOutlineRemoveRedEye size={20} color="teal" className="cursor-pointer" />, id: "PRESCRIPTION_HISTORY", tooltip: "Prescription History", onClickFunction: () => setPrescriptionHistoryModal(true) },
    { icon: <CgNotes size={20} color="#3f51b5" className="cursor-pointer" />, id: "NOTES_APPOINTMENT", tooltip: "Notes", onClickFunction: () => setNotesModalOpen(true) },
    { icon: <FaFileUpload size={18} color="teal" className="cursor-pointer" />, id: "UPLOAD_DOCS_APPOINTMENT", tooltip: "Upload File", onClickFunction: () => setUploadDocModalOpen(true) },
    { icon: <FaDownload size={18} color="orange" className="cursor-pointer" />, id: "DOWNLOAD_DOCS_APPOINTMENT", tooltip: "Download File", onClickFunction: () => setDownloadModalOpen(true) },
    { icon: <PiListChecks size={18} color="teal" className="cursor-pointer" />, id: "ALL_APPOINTMENTS", tooltip: "All Appointments", onClickFunction: () => setAppHistoryModalOpen(true) },
    { icon: <FaPenSquare size={18} color="green" className="cursor-pointer " />, id: "RESCHEDULE_APPOINTMENT", tooltip: "Reschedule Appointment", onClickFunction: () => setUpdateAppointmentModalOpen(true) },
    { icon: <IoCheckmarkDoneSharp size={22} color="green" className="cursor-pointer" />, id: "MARK_COMPLETE", tooltip: "Mark Complete", onClickFunction: () => setCompleteAppointmentModal(true) },
    { icon: <TiCancel size={22} color="red" className="cursor-pointer" />, id: "CANCEL_APPOINTMENT", tooltip: "Cancel Appointment", onClickFunction: () => setCancelAppointment(true) },
    { icon: <IoIosSend size={22} color="blue" className="cursor-pointer" />, id: "SEND_PRESCRIPTION", tooltip: "Send Prescription", onClickFunction: () => setSendPrescriptionModal(true) }
  ];

  const authorizedModules = actions.filter((obj) => {
    if (!userPermissions) return false;
    return hasSubmodulePermission(userPermissions, "APPOINTMENTS", obj.id);
  });

  const handleActionClick = (action, data) => {
    action.onClickFunction(data);
  };

  return (
    <div className="relative overflow-x-auto w-full px-7 py-10">
      <AppointmentHeader setDropdown={setPayload} count={totalAppointments} payload={payload} searchValue={searchValue} setSearchValue={setSearchValue} pageSize={pageSize} pageIndex={currentPage} setCurrentPage={setCurrentPage} />
      <div className="overflow-x-auto"> 
      <Select
          options={options}
          isMulti
          defaultValue={options.filter((option) => selectedColumn.includes(option.label))} 
          onChange={handleColumnSelection}
        />
        <ActionTable heading={selectedColumn} keys={filteredKey} tableData={tableData} actions={authorizedModules} selectedRow={setSelectedAppointent} loading={loading} pageInfo={{ currentPage: currentPage - 1, pageSize }} onActionClick={handleActionClick} />
      </div>
      <AddPrescription open={isModalOpen} toggler={() => setModalOpen(false)} appointment={selectedAppointment} currentPage={currentPage} />
      <Notes open={isNotesModalOpen} toggler={() => setNotesModalOpen(false)} appointment={selectedAppointment} currentPage={currentPage} payloadValue={payload} />
      <UploadDoc open={isUploadDocModalOpen} toggler={() => setUploadDocModalOpen(false)} appointment={selectedAppointment} currentPage={currentPage} payloadValue={payload} />
      <DownloadFiles setParentModalOpen={setDownloadModalOpen} open={isDownloadModalOpen} toggler={() => setDownloadModalOpen(!isDownloadModalOpen)} patient={selectedAppointment && selectedAppointment?.patient && selectedAppointment?.patient[0]} selectedRow={setSelectedAppointent} appointment={true} currentPage={currentPage} payloadValue={payload} />
      <SendPrescription open={sendPrescriptionModal} toggler={() => setSendPrescriptionModal(!sendPrescriptionModal)} appointment={selectedAppointment} currentPage={currentPage} />
      <ViewAppointment open={isAppHistoryModalOpen} toggler={() => setAppHistoryModalOpen(false)} patient={selectedAppointment && selectedAppointment?.patient && selectedAppointment?.patient[0]} />
      <ViewPrescription open={prescriptionHistoryModal} toggler={() => setPrescriptionHistoryModal(!prescriptionHistoryModal)} appointment={selectedAppointment} />
      <UpdateAppointment isOpen={isUpdateAppointmentModalOpen} onRequestClose={() => setUpdateAppointmentModalOpen(false)} appointment={selectedAppointment} payloadValue={payload} />
      <CancelAppointment open={cancelAppointment} toggler={() => setCancelAppointment(!cancelAppointment)} appointment={selectedAppointment} currentPage={currentPage} payloadValue={payload} />
      <CompleteAppointment open={completeAppointmentModal} toggler={() => setCompleteAppointmentModal(!completeAppointmentModal)} appointment={selectedAppointment} currentPage={currentPage} payload={payload} />
      <div className="flex flex-row justify-center">
        <DefaultPagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export default AppointmentTable;
