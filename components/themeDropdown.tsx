import Select from "react-select";
//import * as monacoThemes from "monaco-themes";
import { monacoThemes } from "@/lib/defineTheme";
import { customStyles } from "@/constants/customStyles";

interface ThemeDropdownProps {
    handleThemeChange: (selectedOption: any) => void;
    theme: any;
  }

const ThemeDropdown: React.FC<ThemeDropdownProps> = ({ handleThemeChange, theme }) => {
  return (
    <Select
      placeholder={`Select Theme`}
      // options={languageOptions}
      options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
        label: themeName,
        value: themeId,
        key: themeId,
      }))}
      value={theme}
      styles={customStyles}
      onChange={handleThemeChange}
    />
  );
};

export default ThemeDropdown;