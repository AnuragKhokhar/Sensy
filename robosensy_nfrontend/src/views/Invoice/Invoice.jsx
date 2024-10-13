import { Button, Input, Typography } from "@material-tailwind/react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatableSelect from "react-select/creatable";
import Logo from "../../assets/robodoc.png";
import { FaTrash } from "react-icons/fa";
import { invoicethunk } from "../../redux/thunk/invoice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { addOption } from "../../redux/slice/options";
const Invoice = () => {
  const [invoiceItems, setInvoiceItems] = useState([{ description: "", quantity: 1, price: 0 }]);
  const [invoiceDetails, setInvoiceDetails] = useState({
    customerName: "",
    mobile: "",
    address: "",
    invoicedate: new Date().toISOString().split("T")[0],
    duedate: ""
  });
  const [discount, setDiscount] = useState(5);
  const [invoiceNumber, setInvoiceNumber] = useState(100000);
  const [invoicePdf, setInvoicePdf] = useState(null);
  const [isInvoiceGenerated, setIsInvoiceGenerated] = useState(false);
  const [errors, setErrors] = useState({});
  const printIframeRef = useRef(null);
  const dispatch = useDispatch();
  const options = useSelector((state) => state.options.options);

  useEffect(() => {
    // Load the last invoice number from local storage if available
    const lastInvoiceNumber = localStorage.getItem("lastInvoiceNumber");
    if (lastInvoiceNumber) {
      setInvoiceNumber(parseInt(lastInvoiceNumber, 10) + 1);
    }
  }, []);

  const handleInvoiceDetailChange = (e) => {
    const { name, value } = e.target;
    setInvoiceDetails({ ...invoiceDetails, [name]: value });
  };

  const handleItemChange = (index, name, value) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index][name] = value;
    setInvoiceItems(updatedItems);
  };

  const handleSelectChange = (index, newValue) => {
    handleItemChange(index, "description", newValue ? newValue.label : "");
  };

  const handleCreate = (index, inputValue) => {
    const newOption = { label: inputValue, value: inputValue };
    dispatch(addOption(newOption));
    handleSelectChange(index, newOption); 
  };

  const addItem = () => {
    setInvoiceItems([...invoiceItems, { description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
  };

  const calculateTotal = () => {
    const total = invoiceItems.reduce((total, item) => total + item.quantity * item.price * 1.12, 0);
    return total.toFixed(2);
  };

  const handleDiscountChange = (e) => {
    setDiscount(parseFloat(e.target.value));
  };

  const calculateDiscount = () => {
    const totalAmount = parseFloat(calculateTotal());
    const discountAmount = (totalAmount * (discount / 100)).toFixed(2);
    return discountAmount;
  };

  const calculateNetAmount = () => {
    const totalAmount = parseFloat(calculateTotal());
    const discountAmount = parseFloat(calculateDiscount());
    const netAmount = (totalAmount - discountAmount).toFixed(2);
    return netAmount;
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!invoiceDetails.customerName) newErrors.customerName = "Customer Name is required";
    if (!invoiceDetails.mobile) newErrors.mobile = "Mobile number is required";
    if (!invoiceDetails.address) newErrors.address = "Address is required";
    if (!invoiceDetails.invoicedate) newErrors.invoicedate = "Invoice Date is required";
    if (!invoiceDetails.duedate) newErrors.duedate = "Due Date is required";

    invoiceItems.forEach((item, index) => {
      if (!item.description) newErrors[`description-${index}`] = `Description for item ${index + 1} is required`;
      if (item.quantity <= 0) newErrors[`quantity-${index}`] = `Quantity for item ${index + 1} must be greater than zero`;
      if (item.price <= 0) newErrors[`price-${index}`] = `Price for item ${index + 1} must be greater than zero`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateInvoice = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      
      generatePDF();
    }
  };
  const generatePDF = () => {
    const invoiceData = {
      invoiceNumber: invoiceNumber.toString(),
      customerName: invoiceDetails.customerName,
      address: invoiceDetails.address,
      date: new Date(invoiceDetails.invoicedate).getTime() / 1000,
      totalAmount: calculateTotal(),
      discount: calculateDiscount(),
      finalAmount: calculateNetAmount(),
      medicines: invoiceItems.map((item) => ({
        medicineId: "1234",
        name: item.description,
        qty: item.quantity,
        price: item.price,
        taxAmount: (item.quantity * item.price * 0.12).toFixed(2),
        totalAmount: (1.12 * item.quantity * item.price).toFixed(2)
      }))
    };

    const doc = new jsPDF();

    // Header Section
    doc.setFillColor(225, 225, 225);
   

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(92, 104, 147); // Light blue color for the company name
    doc.text("Akash Enterprises", 20, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text("Ajmer Road, Jaipur, Rajasthan 301202", 20, 30);

    // Calculate the positions for even spacing
    const startX = 20;
    const spacing = 60; // Adjust this value if needed
    const phoneX = startX;
    const gstinX = phoneX + spacing;
    const panX = gstinX + spacing;

    doc.text("Phone: +91 9981278197", phoneX, 40);
    doc.text("GSTIN: 08AALCR2857A1ZD", gstinX, 40);
    doc.text("PAN Number: AVHPC9999A", panX, 40);

    // Border color sections
    const borderY = 45; // Small gap from header
    const borderWidth = 210; // Full page width

    doc.setFillColor(255, 0, 0);
    doc.rect(0, borderY, borderWidth, 2, "F"); // Red border

    doc.setFillColor(200, 255, 200);
    doc.rect(0, borderY + 2, borderWidth, 6, "F"); // Light green border

    // Texts
    const invoiceNumberText = "Invoice No: " + invoiceData.invoiceNumber;
    const invoiceDateText = "Invoice Date: " + new Date(invoiceData.date * 1000).toLocaleDateString();

    // Calculate vertical center position
    const greenBorderY = borderY + 2; // Y position of the green border
    const greenBorderHeight = 6; // Height of the green border
    const textY = greenBorderY + greenBorderHeight / 2 + 2; // Vertical center within the green border

    // Calculate text positions
    // const invoiceNumberTextWidth = doc.getStringUnitWidth(invoiceNumberText) * doc.internal.scaleFactor;
    const invoiceDateTextWidth = doc.getStringUnitWidth(invoiceDateText) * doc.internal.scaleFactor;
    const margin = 20; // Margin from the edges

    const invoiceNumberTextX = margin; // Positioned at the left edge of the green border
    const invoiceDateTextX = borderWidth - margin - invoiceDateTextWidth; // Positioned at the right edge of the green border

    // Set text color
    doc.setTextColor(0, 0, 0);

    // Invoice Number and Date in Green Box
    doc.text(invoiceNumberText, invoiceNumberTextX, textY); // Positioned at the left edge
    doc.text(invoiceDateText, invoiceDateTextX, textY); // Positioned at the right edge

    // Reduce unwanted space
    const billToY = greenBorderY + greenBorderHeight + 10; // Adjusted for minimal gap

    // Bill To and Ship To
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("BILL TO", 20, billToY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(invoiceData.customerName, 20, billToY + 10);
    doc.text(invoiceData.address, 20, billToY + 20);

    // doc.setFont("helvetica", "bold");
    // doc.setTextColor(40, 40, 40);
    // doc.text("SHIP TO", 150, billToY);
    // doc.setFont("helvetica", "normal");
    // doc.setTextColor(0, 0, 0);
    // doc.text(invoiceData.customerName, 150, billToY + 10);
    // doc.text(invoiceData.address, 150, billToY + 20);

    // Calculate position for Items Table
    const tableStartY = billToY + 30; // Adjusted to start right after "Bill To" and "Ship To" sections

    // Items Table
    const tableColumn = ["Items", "Quantity", "Price per Unit", "Tax", "Amount"];
    const tableRows = [];

    invoiceData.medicines.forEach((item) => {
      const itemData = [item.name, item.qty, item.price.toFixed(2), item.taxAmount, item.totalAmount];
      tableRows.push(itemData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: tableStartY, // Start the table just after the "Bill To" and "Ship To" sections
      theme: "grid",
      headStyles: { fillColor: [92, 104, 147] }, // Light blue head color
      alternateRowStyles: { fillColor: [240, 240, 240] },
      styles: { font: "helvetica", fontSize: 10 }
    });

    // Summary Section
    const finalY = doc.previousAutoTable.finalY;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount: ", 150, finalY + 10);
    doc.setFont("helvetica", "normal");
    doc.text("Rs. " + Number(invoiceData.totalAmount).toFixed(2), 180, finalY + 10);
    doc.setFont("helvetica", "bold");
    doc.text("Discount: ", 150, finalY + 20);
    doc.setFont("helvetica", "normal");
    doc.text("Rs. " + Number(invoiceData.discount).toFixed(2), 180, finalY + 20);
    doc.setFont("helvetica", "bold");
    doc.text("Net Amount: ", 150, finalY + 30);
    doc.setFont("helvetica", "normal");
    doc.text("Rs. " + Number(invoiceData.finalAmount).toFixed(2), 180, finalY + 30);
    // Footer Section
    doc.setFont("helvetica", "bold");
    doc.text("Bank Details", 20, finalY + 50);
    doc.setFont("helvetica", "normal");
    doc.text("Account Holder: Akash Singh", 20, finalY + 60);
    doc.text("Account Number: 38028101723", 20, finalY + 70);
    doc.text("Bank: SBI", 20, finalY + 80);
    doc.text("Branch: Jaipur", 20, finalY + 90);
    doc.text("IFSC Code: SBIN0002836", 20, finalY + 100);
    doc.text("UPI ID: 1281@paytm", 20, finalY + 110);

    doc.setFont("helvetica", "bold");
    doc.text("Notes", 20, finalY + 130);
    doc.setFont("helvetica", "normal");
    doc.text("1. No return deal", 20, finalY + 140);

    doc.setFont("helvetica", "bold");
    doc.text("Terms & Conditions", 20, finalY + 160);
    doc.setFont("helvetica", "normal");
    doc.text("1. Customer will pay the GST", 20, finalY + 170);
    doc.text("2. Customer will pay the Delivery charges", 20, finalY + 180);
    doc.text("3. Pay due amount within 15 days", 20, finalY + 190);

    doc.setFont("helvetica", "bold");
    doc.text("Customer Signature", 20, finalY + 210);
    doc.text("Authorized Signatory for Akash Enterprises", 150, finalY + 210);

    doc.save("invoice.pdf");
    const pdfBlob = doc.output("blob");

    // Store the PDF Blob in state
    setInvoicePdf(pdfBlob);
    setIsInvoiceGenerated(true);
  };

  const handlePrintInvoice = () => {
    if (invoicePdf) {
      const pdfUrl = URL.createObjectURL(invoicePdf);

      const iframe = printIframeRef.current;
      iframe.src = pdfUrl;

      iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      };
    }
  };

  const handleSave = () => {
    const invoiceData = {
      invoiceNumber: invoiceNumber.toString(),
      customerName: invoiceDetails.customerName,
      address: invoiceDetails.address,
      date: new Date(invoiceDetails.invoicedate).getTime() / 1000,
      finalAmount: calculateNetAmount(),
      medicines: invoiceItems.map((item) => ({
        medicineId: "1234",
        name: item.description,
        qty: item.quantity,
        price: item.price,
        totalAmount: (1.12 * item.quantity * item.price).toFixed(2)
      }))
    };

    dispatch(invoicethunk(invoiceData));

    // Save the current invoice number to local storage
    localStorage.setItem("lastInvoiceNumber", invoiceNumber.toString());

    // Increment the invoice number for the next invoice
    setInvoiceNumber((prev) => prev + 1);
  };

  return (
    <div className="bg-white shadow-lg p-6 m-4 rounded-lg print:w-a4-width print:h-a4-height print:m-auto print:p-a4-padding">
      <div className="custom-polifyx-scrollbar border-r-4 h-full pr-4">
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} className="w-32 h-32 mb-2" alt="Logo" />
          <Typography variant="h4" className="mb-2 text-center py-2 font-semibold text-gray-800">
            IDEAL Hair Clinic
          </Typography>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <Typography variant="h5" className="mb-4 text-gray-700 font-semibold">
            Bill To:
          </Typography>
          <div className="flex flex-wrap justify-between mb-4">
            <div className="flex flex-col gap-4 w-full sm:w-2/6">
              <Input className="w-full" label="Customer Name" name="customerName" value={invoiceDetails.customerName} onChange={handleInvoiceDetailChange} required />
              {errors.customerName && <p className="text-red-500">{errors.customerName}</p>}

              <Input className="w-full" label="Address" name="address" value={invoiceDetails.address} defaultValue={new Date().toISOString().split("T")[0]} onChange={handleInvoiceDetailChange} required />
              {errors.address && <p className="text-red-500">{errors.address}</p>}

              <Input className="w-full" label="Mobile" name="mobile" value={invoiceDetails.mobile} onChange={handleInvoiceDetailChange} required />
              {errors.mobile && <p className="text-red-500">{errors.mobile}</p>}
            </div>
            <div className="flex flex-col gap-4 w-full sm:w-2/6">
              <Typography variant="h6" className="mb-2 text-gray-700 font-semibold">
                Invoice Id: {invoiceNumber}
              </Typography>
              <Input className="w-full" label="Invoice Date" type="date" name="invoicedate" value={invoiceDetails.invoicedate} onChange={handleInvoiceDetailChange} required />
              {errors.invoicedate && <p className="text-red-500">{errors.invoicedate}</p>}
              <Input className="w-full" label="Due Date" type="date" name="duedate" value={invoiceDetails.duedate} onChange={handleInvoiceDetailChange} required />
              {errors.duedate && <p className="text-red-500">{errors.duedate}</p>}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700">Serial No.</th>
                <th className="px-4 py-2 text-left text-gray-700">Item Description</th>
                <th className="px-4 py-2 text-left text-gray-700">Quantity</th>
                <th className="px-4 py-2 text-left text-gray-700">Unit Price</th>
                <th className="px-4 py-2 text-left text-gray-700">Amount</th>
                <th className="px-4 py-2 text-left text-gray-700">TAX</th>
                <th className="px-4 py-2 text-left text-gray-700">Total</th>
                <th className="px-4 py-2 text-left text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="px-4 py-2 text-gray-800">{index + 1}</td>
                  <td className="px-4 py-2">
                    <CreatableSelect isClearable onChange={(newValue) => handleSelectChange(index, newValue)} onCreateOption={(inputValue) => handleCreate(index, inputValue)} options={options} value={options.find((option) => option.label === item.description)} />
                  </td>
                  <td className="px-4 py-2">
                    <Input name="quantity" type="number" min={0} value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value, 10))} required />
                  </td>
                  <td className="px-4 py-2">
                    <Input name="price" type="number" min={0} value={item.price} onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value))} required />
                  </td>
                  <td className="px-4 py-2 text-gray-800">{item.price * item.quantity}</td>
                  <td className="px-4 py-2 text-gray-800">{(0.12 * item.quantity * item.price).toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-800">{(1.12 * item.quantity * item.price).toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-800">
                    <Button color="red" onClick={() => removeItem(index)} className="p-2 rounded-full">
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button color="green" onClick={addItem} className="mb-6 w-full sm:w-auto bg-green-500 text-white p-2 rounded-lg">
          + Add Item
        </Button>

        <div className="flex flex-col items-end mb-6">
          <div className="text-left">
            <Typography variant="h4" className="text-gray-800 font-semibold">
              Total Amount: ₹{calculateTotal()}
            </Typography>
            <div className="w-full sm:w-1/2 mt-2">
              <Input label="Discount (%)" type="number" min={0} value={discount} onChange={handleDiscountChange} className="w-full" required />
            </div>
            <Typography variant="h4" className="mt-2 text-gray-800 font-semibold">
              Discount: ₹{calculateDiscount()}
            </Typography>
            <Typography variant="h4" className="mt-2 text-gray-800 font-semibold">
              Net Amount: ₹{calculateNetAmount()}
            </Typography>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2 mr-10">
          <Button color="green" className=" bg-green-500 text-white p-2 rounded-md" onClick={handleSave}>
            Save
          </Button>
          <Button onClick={handlePrintInvoice} disabled={!isInvoiceGenerated} color="deep-orange" className="bg-orange-500 text-white p-2 rounded-md">
            Print
          </Button>
          <Button onClick={handleGenerateInvoice} color="deep-orange" className="bg-orange-500 text-white p-2 rounded-md">
            Generate
          </Button>
          <iframe ref={printIframeRef} style={{ display: "none" }}></iframe>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
