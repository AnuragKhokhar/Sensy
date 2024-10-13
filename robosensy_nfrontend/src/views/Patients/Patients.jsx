import { useEffect, useState } from "react";
import { AddNewPatient } from "../../component/modal/patients/addPatient";
import { useDispatch, useSelector } from "react-redux";
import { getPatientThunk } from "../../redux/thunk/patients";
import { CiCalendarDate } from "react-icons/ci";
import { MdModeEditOutline } from "react-icons/md";
import ScheduleAppointment from "../../component/modal/patients/scheduleAppointment";
import EditPatient from "../../component/modal/patients/EditPatient";
import PatientHeader from "./PatientHeader";
import { ActionTable } from "../../component/common/ActionTable/ActionTable";
import { FaRegEye, FaUpload, FaDownload, FaTrash } from "react-icons/fa";
import UploadDoc from "../../component/modal/patients/uploadDoc";
import DownloadFiles from "../../component/modal/patients/downloadDoc";
import DeletePatient from "../../component/modal/patients/deletePatient";
import { DefaultPagination } from "../../utils/pagination";
import { CgNotes } from "react-icons/cg";
import Notes from "../../component/modal/appointment/Notes";
import { hasSubmodulePermission } from "../../utils/helpers";
import Select from "react-select";
import { patientHeading, patientKeys } from "../../component/common/ActionTable/TableConstants";
import ViewAppointment from "../../component/modal/patients/viewAppointments";

function Patients() {
  const [addPatientModel, setAddPatientModel] = useState(false);
  const [scheduleModel, setScheduleModel] = useState(false);
  const [editPatientModel, setEditPatientModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState();
  const [appointmentModel, setAppointmentModel] = useState(false);
  const [uploadDoc, setUploadDoc] = useState(false);
  const [downloadDoc, setDownloadDoc] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isNotesModalOpen, setNotesModalOpen] = useState(false);
  const [sortByName, setSortByName] = useState(false);
  const [sortButtonColor, setSortButtonColor] = useState("bg-blue-500");
  const [isSortButtonDisabled, setIsSortButtonDisabled] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(() => JSON.parse(localStorage.getItem("selectedColumns")) || []);
  const [filteredKeys, setFilteredKeys] = useState(() => JSON.parse(localStorage.getItem("filteredKeys")) || []);

  const options = patientHeading.map((heading, index) => ({
    label: heading,
    value: patientKeys[index]
  }));

  const handleColumnSelection = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.label);
    const selectedKeys = selectedOptions.map((option) => option.value);

    const updatedKeys = ["patient", ...selectedKeys];

    setSelectedColumns(selectedValues);
    setFilteredKeys(updatedKeys);
  };

  useEffect(() => {
    localStorage.setItem("selectedColumns", JSON.stringify(selectedColumns));
    localStorage.setItem("filteredKeys", JSON.stringify(filteredKeys));
  }, [selectedColumns, filteredKeys]);

  const pageSize = 25;

  const patientData = useSelector((state) => state.PatientSlice);
  const userPermissions = useSelector((state) => state.LoginSlice.userPermissions?.data);
  const dispatch = useDispatch();

  useEffect(() => {
    if (patientData?.patientList?.allPatients?.patients) {
      let patients = [...(patientData.patientList.allPatients.patients || [])];
      if (sortByName) {
        patients.sort((a, b) => a.name.localeCompare(b.name));
        setSortButtonColor("bg-gray-200");
        setIsSortButtonDisabled(true);
      } else {
        setSortButtonColor("bg-blue-500");
        setIsSortButtonDisabled(false);
      }
      setSortedData(patients);
    }
    setLoading(patientData.loading);
  }, [patientData, sortByName]);

  useEffect(() => {
    dispatch(getPatientThunk({ value: searchValue, pageSize, pageIndex: currentPage }));
  }, [currentPage]);

  const totalPages = patientData?.patientList?.allPatients?.count ? Math.ceil(patientData?.patientList?.allPatients?.count / pageSize) : 0;

  let debouncer;

  const searchHandler = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
    clearTimeout(debouncer);
    debouncer = setTimeout(() => {
      dispatch(getPatientThunk({ value, pageSize, pageIndex: 1, sortByName }));
    }, 500);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPatients = patientData?.patientList?.allPatients?.count || patientData?.patientList?.allPatients?.patients.length || 0;

  const handleSortByName = () => {
    setSortByName((prevSortByName) => !prevSortByName);
  };

  const actions = [
    {
      icon: <CiCalendarDate size={18} color="teal" className="cursor-pointer " />,
      id: "SCHEDULE_APPOINTMENT",
      tooltip: "Schedule Appointment",
      onClickFunction: () => setScheduleModel(true)
    },
    {
      icon: <MdModeEditOutline size={18} color="teal" className="cursor-pointer" />,
      id: "UPDATE_PATIENT",
      tooltip: "Update Details",
      onClickFunction: () => setEditPatientModel(true)
    },
    {
      icon: <FaRegEye size={18} color="blue" className="cursor-pointer" />,
      id: "VIEW_APPOINTMENTS",
      tooltip: "View Appointment",
      onClickFunction: () => setAppointmentModel(true)
    },
    { icon: <CgNotes size={20} color="#3f51b5" className="cursor-pointer" />, id: "NOTES_PATIENT", tooltip: "Notes", onClickFunction: () => setNotesModalOpen(true) },
    { icon: <FaUpload size={18} className="cursor-pointer text-[#3985cd]" />, id: "UPLOAD_DOCS_PATIENT", tooltip: "Upload Documents", onClickFunction: () => setUploadDoc(true) },
    { icon: <FaDownload size={18} color="green" className="cursor-pointer" />, id: "DOWNLOAD_DOCS_PATIENT", tooltip: "Download Documents", onClickFunction: () => setDownloadDoc(true) },
    { icon: <FaTrash size={18} color="red" className="cursor-pointer" />, id: "DELETE_PATIENT", tooltip: "Delete Patient", onClickFunction: () => setDeleteModal(true) }
  ];

  const authorizedModules = actions.filter((obj) => {
    if (!userPermissions) return;
    return hasSubmodulePermission(userPermissions, "PATIENTS", obj.id);
  });

  return (
    <div className="relative w-full px-4 sm:px-6 py-10">
      <PatientHeader
        searchHandler={searchHandler}
        setAddPatientModel={setAddPatientModel}
        count={totalPatients}
        handleSortByName={handleSortByName}
        sortButtonColor={sortButtonColor}
        isSortButtonDisabled={isSortButtonDisabled}
      />
      <div className="overflow-x-auto mt-2">
        <Select
          options={options}
          isMulti
          defaultValue={options.filter((option) => selectedColumns.includes(option.label))}
          onChange={handleColumnSelection}
        />

        <ActionTable
          heading={selectedColumns}
          keys={filteredKeys}
          tableData={sortedData}
          actions={authorizedModules}
          selectedRow={setSelectedPatient}
          loading={loading}
          pageInfo={{ currentPage: currentPage - 1, pageSize }}
        />
      </div>
      <AddNewPatient open={addPatientModel} toggler={() => setAddPatientModel(!addPatientModel)} />
      <ScheduleAppointment open={scheduleModel} toggler={() => setScheduleModel(!scheduleModel)} patient={selectedPatient} currentPage={currentPage} searchValue={searchValue} />
      <EditPatient open={editPatientModel} toggler={() => setEditPatientModel(!editPatientModel)} patient={selectedPatient} currentPage={currentPage} searchValue={searchValue} />
      <Notes open={isNotesModalOpen} toggler={() => setNotesModalOpen(false)} patient={selectedPatient} currentPage={currentPage} searchValue={searchValue} />
      <ViewAppointment open={appointmentModel} toggler={() => setAppointmentModel(!appointmentModel)} patient={selectedPatient} />
      <UploadDoc open={uploadDoc} toggler={() => setUploadDoc(!uploadDoc)} patient={selectedPatient} currentPage={currentPage} searchValue={searchValue} />
      <DownloadFiles setParentModalOpen={setDownloadDoc} open={downloadDoc} toggler={() => setDownloadDoc(!downloadDoc)} patient={selectedPatient} />
      <DeletePatient open={deleteModal} toggler={() => setDeleteModal(!deleteModal)} patient={selectedPatient} />
      <div className="flex justify-center mt-6">
        <DefaultPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  );
}

export default Patients;
