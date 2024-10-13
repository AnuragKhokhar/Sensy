
import React from "react";
import { Dialog, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

const DeleteConfirmationModal = ({ open, toggleModal, medicineName }) => {
  return (
    <Dialog 
      open={open} 
      handler={toggleModal}
      className="max-w-lg mx-auto w-full" 
    >
      <DialogBody className="p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Delete Medicine</h2>
        <p className="text-center">
          Are you sure you want to delete <span className="font-semibold">{medicineName}</span>?
        </p>
      </DialogBody>
      <DialogFooter className="flex justify-between">
        <Button 
          variant="text" 
          color="gray" 
          onClick={toggleModal} 
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          color="red" 
          onClick={toggleModal} 
          className="w-full sm:w-auto ml-2 sm:ml-4"
        >
          Delete
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
