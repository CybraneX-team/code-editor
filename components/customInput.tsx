import React from "react";
import { classnames } from "../utils/general";

const CustomInput: React.FC<{ customInput: string; setCustomInput: React.Dispatch<React.SetStateAction<string>> }> =
  ({ customInput, setCustomInput }) => {
    return (
      <textarea
        rows={5}
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder="Custom input"
        className={classnames(
          "w-full border-2 border-black rounded-md p-2 mt-2"
        )}
      ></textarea>
    );
  };

export default CustomInput;
