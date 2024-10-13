import { Dialog, Card, CardBody, Typography, Input, CardFooter } from "@material-tailwind/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getAllUsers, registerAdmin } from "../../../redux/thunk/user";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function PopupForm({ open, toggler, currentPage, pageSize }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");

  const [lableError, setLabelError] = useState({ bool: false, message: "" });
  const [nameError, setNameError] = useState({ bool: false, message: "" });
  const [userError, setUsernameError] = useState({ bool: false, message: "" });
  const [passwordError, setPasswordError] = useState({ bool: false, message: "" });
const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name === "") {
      setNameError({
        bool: true,
        message: "*Indicates a required field"
      });
    }
    if (label === "") {
      setLabelError({
        bool: true,
        message: "*Indicates a required field"
      });
    }
    if (email === "") {
      setUsernameError({
        bool: true,
        message: "*Indicates a required field"
      });
    }
    if (password === "") {
      setPasswordError({
        bool: true,
        message: "*Indicates a required field"
      });
    }
    let body = {
      name,
      email,
      password,
      label
    };
    dispatch(registerAdmin(body))
      .unwrap()
      .then((data) => {
        toast.success(data?.msg);
        dispatch(getAllUsers({ currentPage, pageSize }));
        toggler();
        setEmail("");
        setPassword("");
        setName("");
        setLabel("");
      })
      .catch((error) => {
        toggler();
        toast.error(error);
        setEmail("");
        setPassword("");
        setName("");
        setLabel("");
      });
  };
  return (
    <Dialog size="xs" open={open} handler={toggler} className=" shadow-none">
      <Card className="mx-auto w-full max-w-[24rem]">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Add User
          </Typography>
          <Typography className="-mb-2" variant="h6">
            Name
          </Typography>
          <Input label="Name" size="lg" value={name} required onChange={(e) => setName(e.target.value)} />
          {nameError.bool && <p className="text-red-500 text-sm mt-1">{nameError.message}</p>}
          <Typography className="-mb-2" variant="h6">
            Label
          </Typography>
          <Input label="Label" size="lg" value={label} required onChange={(e) => setLabel(e.target.value)} />
          {lableError.bool && <p className="text-red-500 text-sm mt-1">{lableError.message}</p>}
          <Typography className="-mb-2" variant="h6">
            Email
          </Typography>
          <Input label="Email" size="lg" value={email} required onChange={(e) => setEmail(e.target.value)} />
          {userError.bool && <p className="text-red-500 text-sm mt-1">{userError.message}</p>}
          <Typography className="-mb-2" variant="h6" security="password">
            Password
          </Typography>
          <div className="relative">
            <Input label="Password" required size="lg" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
         
          {passwordError.bool && <p className="text-red-500 text-sm mt-1">{passwordError.message}</p>}
        </CardBody>
        <CardFooter className="pt-0">
          <button onClick={handleSubmit} className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-700">
            Add
          </button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}

export default PopupForm;
