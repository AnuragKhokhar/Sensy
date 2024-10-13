
import { Input, Dialog, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { useState,useEffect } from "react";
const UpdateMedicineModal = ({ open, toggleModal, selectedMedicine }) => {
  const [formValues, setFormValues] = useState({
    name: "",
    price: "",
    quantity: "",
    doe: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedMedicine) {
      setFormValues({ 
        name: selectedMedicine.name || "",
        price: selectedMedicine.price || "",
        quantity: selectedMedicine.quantity || "",
        doe: selectedMedicine.doe || "",
      });
    }
    setErrors({});
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formValues.name) tempErrors.name = "Medicine Name is required.";
    if (!formValues.price) tempErrors.price = "Price is required.";
    if (!formValues.quantity) tempErrors.quantity = "Quantity is required.";
    if (!formValues.doe) tempErrors.doe = "Date of Expiry is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validate()) {
      // Proceed with the update operation
      console.log("Form is valid. Updating medicine...");
      toggleModal();
    }
  };

  return (
    <Dialog 
      open={open} 
      handler={toggleModal}
      className="max-w-lg mx-auto w-full"
    >
      <DialogBody className="p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Update Medicine</h2>
        <div className="mb-4">
          <Input
            label="Medicine Name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            error={!!errors.name}
            className="w-full"
            placeholder={errors.name || ""}
            containerProps={{ className: "mb-4" }}
          />
        </div>
        <div className="mb-4">
          <Input
            label="Price"
            name="price"
            value={formValues.price}
            onChange={handleInputChange}
            error={!!errors.price}
            className="w-full"
            placeholder={errors.price || ""}
            containerProps={{ className: "mb-4" }}
          />
        </div>
        <div className="mb-4">
          <Input
            label="Quantity"
            name="quantity"
            value={formValues.quantity}
            onChange={handleInputChange}
            error={!!errors.quantity}
            className="w-full"
            placeholder={errors.quantity || ""}
            containerProps={{ className: "mb-4" }}
          />
        </div>
        <div className="mb-4">
          <Input
            label="DOE"
            name="doe"
            type="date"
            value={formValues.doe}
            onChange={handleInputChange}
            error={!!errors.doe}
            className="w-full"
            placeholder={errors.doe || ""}
            containerProps={{ className: "mb-4" }}
          />
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between">
        <Button 
          variant="text" 
          color="red" 
          onClick={toggleModal} 
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          color="blue" 
          onClick={handleUpdate} 
          className="w-full sm:w-auto ml-2 sm:ml-4"
        >
          Update
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default UpdateMedicineModal;
