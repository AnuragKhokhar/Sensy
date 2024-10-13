import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPermissions, getAllUsers } from "../../redux/thunk/user";
import { userHeading, userKeys } from "../../component/common/ActionTable/TableConstants";
import { ActionTable } from "../../component/common/ActionTable/ActionTable";
import { DefaultPagination } from "../../utils/pagination";
import { GoPasskeyFill } from "react-icons/go";
import PermissionModal from "./components/permissionsModal";
import PopupForm from "./components/popupForm";

const user = () => {
  const tableData = useSelector((state) => state.UserSlice);
  const [selectedUser, setSelectedUser] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPermissionsModal, setShowPermissionModal] = useState(false);
  const [showPopupForm, setShowPopupForm] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUsers({ currentPage, pageSize }));
  }, [currentPage]);

  useEffect(() => {
    dispatch(getAllPermissions());
  }, []);

  const pageSize = 25;

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const totalPages = tableData.allUsers?.count ? Math.ceil(tableData.allUsers?.count / pageSize) : 0;

  const actions = [{ icon: <GoPasskeyFill size={20} color="#4D8DBD" className="cursor-pointer" />, id: "Permissions", tooltip: "Permissions", onClickFunction: () => setShowPermissionModal(true) }];

  return (
    <div className="px-4 sm:px-6 py-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-bold text-[23px]">Users List</h1>
        <button className="bg-custom-theme text-white font-bold py-2 px-4 rounded" onClick={() => setShowPopupForm(true)}>
          Add User
        </button>
      </div>

      <div>
        <ActionTable heading={userHeading} keys={userKeys} tableData={tableData.allUsers} actions={actions} selectedRow={setSelectedUser} loading={tableData.loading} pageInfo={{ currentPage: currentPage - 1, pageSize }} />
        <div className="flex flex-row justify-center">
          <DefaultPagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
        </div>
      </div>
      <PermissionModal open={showPermissionsModal} toggler={() => setShowPermissionModal(!showPermissionsModal)} user={selectedUser} currentPage={currentPage} pageSize={pageSize} />
      <PopupForm open={showPopupForm} toggler={() => setShowPopupForm(!showPopupForm)} currentPage={currentPage} pageSize={pageSize} />
    </div>
  );
};

export default user;
