import { Input } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { hasSubmodulePermission } from "../../utils/helpers";

const PatientHeader = ({ searchHandler, setAddPatientModel, count, handleSortByName, sortButtonColor, isSortButtonDisabled }) => {
  const userPermissions = useSelector((state) => state.LoginSlice.userPermissions?.data);

  const hasAddPatientPermission = hasSubmodulePermission(userPermissions, "PATIENTS", "ADD_PATIENT");

  return (
    <div>
      <h1 className="font-bold text-[23px] mb-5">Patient List</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex w-full sm:w-[40%] bg-white mb-4 sm:mb-0">
          <Input label="Search by name/id/email/phone/state/city/pincode" color="blue" onChange={(e) => searchHandler(e.target.value)} />
        </div>
        <span className="font-bold mb-4 sm:mb-0">Total patients: {count}</span>

        {hasAddPatientPermission && (
          <button type="button" className="border h-10 bg-theme text-white px-4 text-sm rounded-md " onClick={() => setAddPatientModel(true)}>
            Add Patient
          </button>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className={`border h-10 ${sortButtonColor}  text-white px-4 text-sm rounded-md`} // Apply dynamic color
          onClick={handleSortByName}
          disabled = {isSortButtonDisabled}
        >
          Sort by Name
        </button>
      </div>
    </div>
  );
};

export default PatientHeader;
