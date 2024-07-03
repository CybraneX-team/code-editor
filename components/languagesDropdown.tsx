import React from "react";
import Select from "react-select";
import { customStyles } from "@/constants/customStyles";
import { languageOptions } from "../constants/languageOptions";

type LanguagesDropdownProps = {
    onSelectChange: (selectedOption: any) => void;
}

const LanguagesDropdown: React.FC<LanguagesDropdownProps> = ({ onSelectChange }) => {
  return (
    <Select
      placeholder={`Filter By Category`}
      options={languageOptions}
      styles={customStyles}
      defaultValue={languageOptions[0]}
      onChange={(selectedOption) => onSelectChange(selectedOption)}
    />
  );
};

export default LanguagesDropdown;