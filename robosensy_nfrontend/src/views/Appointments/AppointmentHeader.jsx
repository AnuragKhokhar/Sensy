import { useEffect, useState } from "react";
import { getTimestampFromYYYYMMDD } from "../../utils/dateHelper";
import { Input } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { appointmentThunk } from "../../redux/thunk/appointments";

const AppointmentHeader = ({ setDropdown, payload, searchValue, setSearchValue, pageSize, pageIndex, count, setCurrentPage }) => {
  const [dateFilter, setDateFilter] = useState("");

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case "date":
        setDateFilter(value);
        setDropdown((prev) => ({
          ...prev,
          search: searchValue,
          date: getTimestampFromYYYYMMDD(value)
        }));
        setCurrentPage(1);
        break;

      default:
        break;
    }
  };

  const handleSelectChange = (e) => {
    setDropdown((prev) => ({
      ...prev,
      search: searchValue,
      status: e.target.value
    }));
    setCurrentPage(1);
  };
  const filterHandler = () => {
    setDateFilter({ date: "", status: "", search: "" });
    setDropdown({ date: "", status: "", search: "" });
    setSearchValue("");
    setCurrentPage(1);
  };
  let debouncer;
  const dispatch = useDispatch();

  useEffect(() => {
    clearTimeout(debouncer);
    debouncer = setTimeout(() => {
      dispatch(appointmentThunk({ ...payload, search: searchValue, pageSize, pageIndex }));
    }, 500);
  }, [searchValue, pageIndex, payload]);

  return (
    <>
      <h1 className="font-bold text-xl sm:text-[23px]">Appointment List</h1>
      <div className="flex flex-col sm:flex-row justify-between my-2 space-y-4 sm:space-y-0 sm:space-x-4">
        <span className="w-full sm:w-1/2 ">
          <p>&nbsp;</p>
          <Input label="Search PatientName/id/DoctorName" color="blue" className="bg-white" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        </span>
        <div className="w-full sm:w-72">
          <label htmlFor="dateFilter" className="block text-sm font-bold text-gray-600 mb-1">
            Date
          </label>
          <input type="date" id="dateFilter" value={dateFilter} onChange={(e) => handleFilterChange("date", e.target.value)} className="w-full p-2 border rounded focus:outline-none focus:border-blue-500" />
        </div>
        <div className="w-72">
          <label htmlFor="sortField" className="block text-sm font-bold text-gray-600 mb-1">
            Status
          </label>
          <select onChange={handleSelectChange} id="sortField" value={payload.status} className="w-full p-2 border rounded focus:outline-none focus:border-blue-500">
            <option value=""> Select Field </option>
            <option value="Completed">Completed</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="w-full sm:w-auto mt-4 sm:mt-0">
          <span className="font-bold">Total Appointments: {count}</span>
        </div>
        <div className="w-full sm:w-auto mt-4 sm:mt-0">
          <p>&nbsp;</p>
          <button type="button" className="border h-10 bg-theme text-white px-4 text-sm w-full sm:w-32 rounded-md " onClick={filterHandler}>
            Clear filter
          </button>
        </div>
      </div>
    </>
  );
};

export default AppointmentHeader;
