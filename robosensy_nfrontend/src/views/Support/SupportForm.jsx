import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../component/constants/defaultValues";

const SupportForm = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = {
      reason,
      description,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(baseURL + "/ticket/customerTicket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Your support request has been submitted successfully.");
        setReason("");
        setDescription("");
        setTimeout(() => {
          navigate("/dashboard/home");
        }, 2000); 
      } else {
        throw new Error("Failed to submit the support request.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-left">
          Support Form
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reason
              </label>
              <select
                id="reason"
                name="reason"
                value={reason}
                onChange={handleReasonChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled>
                  Select Reason
                </option>
                <option value="Feature">Feature</option>
                <option value="Bug">Bug</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="5"
                value={description}
                onChange={handleDescriptionChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Describe your issue or request in detail"
              ></textarea>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-custom-theme hover:bg-custom-theme-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default SupportForm;
