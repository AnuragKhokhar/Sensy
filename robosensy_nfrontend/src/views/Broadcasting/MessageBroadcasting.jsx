import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Checkbox, Table, TableHead, TableBody, TableRow, TableCell, Box, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getPatientThunk } from "../../redux/thunk/patients";
import { DefaultPagination } from "../../utils/pagination";
import axios from "axios";
import { baseURL } from "../../component/constants/defaultValues";
import { toast } from "react-toastify";
import { genderHandler } from "@/component/common/ActionTable/TableFunctions";

const MessageBroadcasting = () => {
  const [template, setTemplate] = useState("");
  const [message, setMessage] = useState({
    content: "",
    border: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingPatients, setFetchingPatients] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCount, setSelectedCount] = useState(0); // State for selected count
  const pageSize = 10;
  const dispatch = useDispatch();
  const patientData = useSelector((state) => state.PatientSlice);
  

  const templates = [
    {
      id: "broadcast_message",
      label: "Broadcast Message",
      content: `Hi {{patientName}} ! 

We are glad to inform you that you have been successfully registered with Hospital name. 
Here are your appointment details : 
Date: some date
Time: some time
Assigned Doctor: Doctor name

Have a nice day!`,
      editable: true
    }
  ];

  useEffect(() => {
    setFetchingPatients(true);
    dispatch(getPatientThunk({ value: searchQuery, pageSize, pageIndex: currentPage })).finally(() => setFetchingPatients(false));
  }, [dispatch, currentPage, searchQuery]);

  useEffect(() => {
    const currentPatients = patientData?.patientList?.allPatients?.patients || [];
    const currentPatientIds = currentPatients.map((patient) => patient._id);
    const allSelected = currentPatientIds.every((id) => selectedPatients.includes(id));
    const noneSelected = currentPatientIds.every((id) => !selectedPatients.includes(id));

    if (allSelected) {
      setSelectAll(true);
    } else if (noneSelected) {
      setSelectAll(false);
    } else {
      setSelectAll(false); // Partially selected, default to false
    }

    setSelectedCount(selectedPatients.length); // Update selected count
  }, [selectedPatients, patientData, currentPage]);

  const handlePatientSelection = (selectedPatientId) => {
    setSelectedPatients((prevPatients) => {
      const newSelectedPatients = prevPatients.includes(selectedPatientId) ? prevPatients.filter((id) => id !== selectedPatientId) : [...prevPatients, selectedPatientId];
      return newSelectedPatients;
    });
  };

  const handleSelectAll = () => {
    const currentPatients = patientData?.patientList?.allPatients?.patients || [];
    const currentPatientIds = currentPatients.map((patient) => patient._id);

    if (selectAll) {
      setSelectedPatients((prevPatients) => prevPatients.filter((id) => !currentPatientIds.includes(id)));
    } else {
      setSelectedPatients((prevPatients) => [...prevPatients, ...currentPatientIds.filter((id) => !prevPatients.includes(id))]);
    }
    setSelectAll((prevSelectAll) => !prevSelectAll);
  };

  const handleBroadcast = async () => {
    if (selectedPatients.length === 0) {
      toast.error("Please select at least one patient to broadcast the message.");
      return;
    }

    const patientNames = selectedPatients
      .map((id) => {
        const patient = patientData?.patientList?.allPatients?.patients.find((p) => p._id === id);
        return patient || null; // Return the patient object or null if not found
      })
      .filter((patient) => patient !== null); // Filter out null values if needed

    const finalMessage = `Hi ${patientNames}, ${message.content} Thanks`;

    const payload = {
      patientIds: selectedPatients,
      campaignName: "Default",
      doctorId: "65acd2f5d8e7a673531c34ac",
      message: finalMessage
    };

    setLoading(true);

    try {
      const res = await axios.post(baseURL + `/broadcast/broadcastMsg`, payload);
      toast.success("Message broadcasted successfully!");
      console.log(res.data);
      setSelectedPatients([]); // Deselect all patients
      setSelectAll(false); // Reset Select All state
    } catch (error) {
      console.error("Error broadcasting message:", error);
      toast.error("Failed to broadcast message.");
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (event) => {
    setMessage({ ...message, content: event.target.value });
  };

  const handleMessageClick = () => {
    setMessage((prev) => ({ ...prev, border: true }));
  };

  const handleTemplateChange = (event) => {
    const selectedTemplate = templates.find((t) => t.id === event.target.value);
    if (selectedTemplate) {
      setTemplate(selectedTemplate.id);
      setMessage({ content: selectedTemplate.content, editable: selectedTemplate.editable });
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    setSelectAll(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); 
  };

  const totalPages = patientData?.patientList?.allPatients?.count ? Math.ceil(patientData.patientList.allPatients.count / pageSize) : 0;

  return (
    <Container
      style={{
        borderRadius: "8px",
        marginTop: "2rem",
        padding: "2rem"
      }}
    >
      <h1 className="font-bold text-xl sm:text-[23px]">Message Broadcasting</h1>

      <TextField select label="Select Template" value={template} onChange={handleTemplateChange} fullWidth margin="normal" variant="outlined">
        {templates.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <Box position="relative" marginBottom="1rem">
        <Typography
          variant="caption"
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            background: "#ffffff",
            padding: "0 4px",
            fontWeight: 500,
            color: "#7D55F3",
            zIndex: 1
          }}
        >
          Message
        </Typography>
        <TextField
          label=""
          placeholder="Type your message here"
          value={message.content}
          onChange={handleMessageChange}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
          onClick={handleMessageClick}
          InputProps={{
            style: {
              paddingTop: "24px",
              paddingBottom: "8px"
            }
          }}
          style={{
            border: message.border ? "2px solid #7D55F3" : "1px solid #ccc",
            borderRadius: "4px"
          }}
          disabled={true}
        />
      </Box>

      <Box marginBottom="1rem">
        <TextField label="Search" value={searchQuery} onChange={handleSearchChange} margin="normal" variant="outlined" className="w-1/2 " />
      </Box>

      <Box display="flex" alignItems="center" marginBottom="1rem">
        <Button variant="outlined" onClick={handleSelectAll} className="border-[#7D55F3] text-[#7D55F3] hover:bg-[#7D55F3] w-fit">
          {selectAll ? "Deselect All" : "Select All"}
        </Button>
        <Typography variant="body2" style={{ marginLeft: "auto",
          fontSize: "1.25rem",
          textAlign: "right",
          color: "#333",
          fontWeight: 600,
          display: "block",
          padding: "0.5rem 1rem",  
          backgroundColor: "#f4f4f4",  
          borderRadius: "4px" }}>
          {selectedCount} : Selected
        </Typography>
      </Box>
      <div className="overflow-auto" >   
        <Table className="min-w-full" >
        <TableHead>
          <TableRow style={{ backgroundColor: "#3b97dc" }}>
            <TableCell
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "white",
                padding: "8px 16px",
                borderRight: "1px solid #e0e0e0"
              }}
            ></TableCell>

            <TableCell
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "white",
                padding: "8px 16px",
                borderRight: "1px solid #e0e0e0"
              }}
              className="whitespace-nowrap"
            >
              Patient's Name
            </TableCell>
            <TableCell
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "white",
                padding: "8px 16px",
                borderRight: "1px solid #e0e0e0",
                whiteSpace: "nowrap"
              }}
            >
              Phone No.
            </TableCell>
            <TableCell
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "white",
                padding: "8px 16px",
                borderRight: "1px solid #e0e0e0"
              }}
            >
              Gender
            </TableCell>
            <TableCell
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "white",
                padding: "8px 16px",
                borderRight: "1px solid #e0e0e0"
              }}
            >
              State
            </TableCell>
            <TableCell
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "white",
                padding: "8px 16px",
                borderRight: "1px solid #e0e0e0"
              }}
            >
              City
            </TableCell>
            <TableCell
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "white",
                padding: "8px 16px",
                borderRight: "1px solid #e0e0e0"
              }}
            >
              Pin
            </TableCell>
            <TableCell
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "white",
                padding: "8px 16px",
                borderRight: "1px solid #e0e0e0"
              }}
            >
              Department
            </TableCell>
            <TableCell
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                color: "white",
                padding: "8px 16px"
              }}
              className="whitespace-nowrap"
            >
              Date Of Birth
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {patientData?.patientList?.allPatients?.patients?.map((patient) => (
            <TableRow
              key={patient._id}
              hover
              onClick={() => handlePatientSelection(patient._id)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedPatients.includes(patient._id) ? "#f0f0f0" : "white",
                height: "30px" 
              }}
            >
              <TableCell
                style={{
                  borderRight: "1px solid #e0e0e0",
                  borderBottom: "none",
                  fontWeight: 500,
                  padding: "4px 8px"
                }}
              >
                <Checkbox
                  checked={selectedPatients.includes(patient._id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePatientSelection(patient._id);
                  }}
                  color="primary"
                  style={{ transform: "scale(0.8)" }} 
                />
              </TableCell>
              <TableCell
                className="border-r-2 whitespace-nowrap"
                style={{
                  borderBottom: "none",
                  fontWeight: 500,
                  padding: "4px 8px",
                  lineHeight: "1" 
                }}
              >
                {patient.name}
              </TableCell>
              <TableCell
                style={{
                  borderRight: "1px solid #e0e0e0",
                  borderBottom: "none",
                  fontWeight: 500,
                  padding: "4px 8px",
                  lineHeight: "1",
                  textAlign: "center" 
                }}
              >
                {patient.phone}
              </TableCell>
              <TableCell
                style={{
                  borderRight: "1px solid #e0e0e0",
                  borderBottom: "none",
                  fontWeight: 500,
                  padding: "4px 8px", 
                  lineHeight: "1",
                  textAlign: "center" 
                }}
              >
                {genderHandler(patient.gender)}
              </TableCell>
              <TableCell
                style={{
                  borderRight: "1px solid #e0e0e0",
                  borderBottom: "none",
                  fontWeight: 500,
                  padding: "4px 8px", 
                  lineHeight: "1" ,
                  textAlign: "center"
                }}
              >
                {patient.state}
              </TableCell>
              <TableCell
                style={{
                  borderRight: "1px solid #e0e0e0",
                  borderBottom: "none",
                  fontWeight: 500,
                  padding: "4px 8px", 
                  lineHeight: "1",
                  whiteSpace: "nowrap",
                  textAlign: "center"
                }}
              >
                {patient.city}
              </TableCell>
              <TableCell
                style={{
                  borderRight: "1px solid #e0e0e0",
                  borderBottom: "none",
                  fontWeight: 500,
                  padding: "4px 8px", 
                  lineHeight: "1" ,
                  textAlign: "center"
                }}
              >
                {patient.pincode}
              </TableCell>
              <TableCell
                style={{
                  borderRight: "1px solid #e0e0e0",
                  borderBottom: "none",
                  fontWeight: 500,
                  padding: "4px 8px", 
                  whiteSpace: "nowrap",
                  lineHeight: "1" ,
                  textAlign: "center"
                }}
              >
                {patient.departments.map((department) => department.name).join(", ")}
              </TableCell>
              <TableCell
                style={{
                  borderBottom: "none",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  padding: "4px 8px", 
                  lineHeight: "1" ,
                  textAlign: "center"
                }}
              >
                {new Date(patient.dob).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + "," + new Date(patient.dob).getFullYear()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        </Table>
      </div>

      
      <Box className="flex flex-col items-center mt-4 space-y-4">
        <DefaultPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />

        <Button variant="contained" color="primary" onClick={handleBroadcast} disabled={loading} className="w-fit">
          {loading ? "Broadcasting..." : "Broadcast Message"}
        </Button>
      </Box>
    </Container>
  );
};

export default MessageBroadcasting;
