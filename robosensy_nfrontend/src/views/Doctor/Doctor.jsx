import React, { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import Form from "./Form";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorThunk } from "../../redux/thunk/doctor";
import { Input } from "@material-tailwind/react";

const Doctor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const temp = useSelector((state) => state.DoctorSlice);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const [id, setId] = useState();

  const toggleModal = (id) => {
    setId(id);
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    dispatch(getDoctorThunk({ searchTerm }));
  }, [searchTerm]);

  useEffect(() => {
    if (temp?.doctorList) setDoctors(temp?.doctorList);
  }, [temp?.doctorList]);

  return (
    <div className="relative w-full px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Mark Doctor Unavailable</h1>
      <div className="flex w-fit bg-white">
        <Input label="Search By Doctor Name" color="blue" onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-sm border rounded-lg">
          <thead className="text-sm font-semibold bg-custom-theme text-white">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">S No.</th>
              <th className="px-4 py-2">Doctor Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors &&
              doctors.length > 0 &&
              doctors.map((doctor, index) => (
                <tr key={index} className="bg-white hover:bg-gray-200">
                  <td className="border px-4 py-2 text-center w-4">{index + 1}</td>
                  <td className="border px-4 py-2 text-center">{doctor.name}</td>
                  <td className="border px-4 py-2 text-center">{doctor.email}</td>
                  <td className="border px-4 py-2 text-center">{doctor.mobile}</td>
                  <td className="border px-4 py-2 text-center">
                    <div className="flex justify-center">
                      <FaCalendarAlt
                        className="cursor-pointer text-blue-500"
                        onClick={() => {
                          toggleModal(doctor._id);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Form isOpen={isModalOpen} onClose={toggleModal} id={id} />
    </div>
  );
};

export default Doctor;
