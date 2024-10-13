import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export function DefaultPagination({ totalPages, currentPage, onPageChange }) {
  const prev = () => {
    if (currentPage === 1) return;
    onPageChange(currentPage - 1);
  };

  const next = () => {
    if (currentPage === totalPages) return;
    onPageChange(currentPage + 1);
  };

  return (
    <div className="mt-8 flex items-center gap-4">
      <Button variant="text" className="flex items-center gap-2" onClick={prev} disabled={currentPage === 1}>
        <FaArrowLeft />
        Previous
      </Button>
      <div className="flex items-center gap-2">
        {[...Array(totalPages)].map((_, index) => (
          <IconButton
            key={index + 1}
            variant={currentPage === index + 1 ? "filled" : "outlined"}
            style={{ background: "#3b97dc", width: "30px", height: "35px" }} // Pass the custom blue color as a prop
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </IconButton>
        ))}
      </div>
      <Button variant="text" className="flex items-center gap-2" onClick={next} disabled={currentPage === totalPages}>
        Next
        <FaArrowRight />
      </Button>
    </div>
  );
}
