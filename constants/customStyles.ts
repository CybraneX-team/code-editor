export const customStyles = {
  control: (styles: any) => ({
    ...styles,
    width: "100%",
    maxWidth: "14rem",
    minWidth: "12rem",
    borderRadius: "5px",
    color: "#000",
    fontSize: "0.8rem",
    lineHeight: "1.75rem",
    backgroundColor: "#1e1e1e",
    cursor: "pointer",
    border: "1px solid #000000",
    // boxShadow: "5px 5px 0px 0px rgba(0,0,0);",
    ":hover": {
      boxShadow: "none",
    },
  }),
  option: (styles: any) => {
    return {
      ...styles,
      color: "#fff",
      fontSize: "0.8rem",
      lineHeight: "1.75rem",
      width: "100%",
      background: "#1e1e1e",
      ":hover": {
        backgroundColor: "#1e1e1e",
        color: "#000",
        cursor: "pointer",
      },
    };
  },
  menu: (styles: any) => {
    return {
      ...styles,
      backgroundColor: "#1e1e1e",
      maxWidth: "14rem",
      borderRadius: "5px",
    };
  },

  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: "#fff",
      fontSize: "0.8rem",
      lineHeight: "1.75rem",
    };
  },
};
