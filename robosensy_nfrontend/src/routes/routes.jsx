import { FaBars, FaHome, FaUser, FaCalendar, FaUserMd, FaHandsHelping, FaAddressBook } from "react-icons/fa";
  import Dashboard from "../views/Dashboard/Dashboard"
  import Patients from "@/views/Patients/Patients";
  import Appointment from "@/views/Appointments/Appointment";
  import Doctor from "@/views/Doctor/Doctor";
  import MessageBroadcasting from "@/views/Broadcasting/MessageBroadcasting";
  import SupportForm from "@/views/Support/SupportForm";
  
  const icon = {
    className: "w-5 h-5 text-inherit",
  };
  
  export const routes = [
    {
      layout: "dashboard",
      pages: [
        {
          icon: <FaHome />,
          name: "dashboard",
          path: "/home",
          element: <Dashboard />,
        },
        {
          icon: <FaUser />,
          name: "patients",
          path: "/patients",
          element: <Patients />,
        },
        {
          icon: <FaCalendar />,
          name: "appointments",
          path: "/appointment",
          element: <Appointment />,
        },
        {
          icon: <FaUserMd />,
          name: "doctors",
          path: "/doctors",
          element: <Doctor />,
        },
        {
           icon: <FaAddressBook />,
           name: "broadCasting",
           path: "/messageBroadcasting",
           element: <MessageBroadcasting />,
        },
        {
           icon: <FaHandsHelping />,
           name: "support Care",
           path: "/support",
           element: <SupportForm />,
        },
      ],
    },
  ];
  
  export default routes;
  