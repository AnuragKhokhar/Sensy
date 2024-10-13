export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: "red", // Change border color based on validation
    boxShadow: state.isFocused ? "0 0 0 1px red" : provided.boxShadow,
    "&:hover": {
      borderColor: "red" // Change border color on hover
    }
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999 // Ensure the dropdown menu is above other elements
  })
};
