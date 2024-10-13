

import { Input } from "@material-tailwind/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddMedicineModal from "./AddMedicineModal";
import UpdateMedicineModal from "./UpdateMedicineModal";
import DeleteConfirmationModal from "./DeleteConfirmationMedicine";
import { useState } from "react";

const MedicineTable = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const toggleAddModal = () => setOpenAddModal(!openAddModal);
  const toggleUpdateModal = (medicine = null) => {
    setSelectedMedicine(medicine);
    setOpenUpdateModal(!openUpdateModal);
  };
  const toggleDeleteModal = (medicine = null) => {
    setSelectedMedicine(medicine);
    setOpenDeleteModal(!openDeleteModal);
  };

  const medicineTable = [
    {
      name: "Paracetamol",
      price: 100,
      quantity: 10,
      doe: "21/02/2323",
    },
    {
      name: "DOLO",
      price: 1030,
      quantity: 10,
      doe: "21/02/2323",
    },
  ];

  return (
    <div className="relative w-full px-4 py-8 sm:px-6 lg:px-10">
      <h1 className="text-2xl font-bold mb-4">Medicine Inventory</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <Input label="Search" color="blue" placeholder="Search" fullWidth />
        </div>

        <button
          onClick={toggleAddModal}
          type="button"
          className="w-full sm:w-auto h-10 bg-theme text-white px-4 py-2 text-sm rounded-md mt-2 sm:mt-0"
        >
          Add Medicine
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded-lg mt-2">
          <thead className="text-sm font-semibold bg-custom-theme text-white">
            <tr>
              <th className="px-4 py-2">Sn</th>
              <th className="px-4 py-2">Medicine Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">DOE</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {medicineTable.map((medicine, index) => (
              <tr key={index} className="bg-white hover:bg-gray-200">
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2 text-center">{medicine.name}</td>
                <td className="border px-4 py-2 text-center">{medicine.price}</td>
                <td className="border px-4 py-2 text-center">{medicine.quantity}</td>
                <td className="border px-4 py-2 text-center">{medicine.doe}</td>
                <td className="border px-4 py-2 text-center flex justify-center gap-2">
                  <FaEdit
                    size={18}
                    className="cursor-pointer text-blue-500"
                    onClick={() => toggleUpdateModal(medicine)}
                  />
                  <FaTrash
                    size={18}
                    className="cursor-pointer text-red-500"
                    onClick={() => toggleDeleteModal(medicine)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddMedicineModal open={openAddModal} toggleModal={toggleAddModal} />
      <UpdateMedicineModal
        open={openUpdateModal}
        toggleModal={toggleUpdateModal}
        selectedMedicine={selectedMedicine}
      />
      <DeleteConfirmationModal
        open={openDeleteModal}
        toggleModal={toggleDeleteModal}
        medicineName={selectedMedicine?.name || ""}
      />
    </div>
  );
};

export default MedicineTable;
