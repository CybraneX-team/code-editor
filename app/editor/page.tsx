"use client";
import { languageOptions } from "@/constants/languageOptions";
import { defineTheme } from "@/lib/defineTheme";
import { useKeyPress } from "@/lib/useKeyPress";
import React, { SetStateAction, useEffect, useState } from "react";
import LanguagesDropdown from "@/components/languagesDropdown";
import ThemeDropdown from "@/components/themeDropdown";
import CodeEditorWindow from "@/components/codeEditor";
import OutputWindow from "@/components/outputWindow";
import Footer from "@/components/footer";
import axios from "axios";
import OutputDetails from "@/components/outputDetails";
import { classnames } from "@/utils/general";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch } from 'react-redux';
import { FileItem } from '@/lib/types'; 
import CodeEditorSidebar from "@/components/sidebar";

const pythonDefault = "#Start writing\n";

function Editor() {
  const [configDropdownOpen, setConfigDropdownOpen] = useState(false);
  const [code, setCode] = useState(pythonDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState({});
  const [processing, setProcessing] = useState(false);
  const [theme, setTheme] = useState({ value: "cobalt", label: "Cobalt" });
  const [language, setLanguage] = useState(languageOptions[0]);
  const [snackbar, setSnackbar] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const dispatch = useDispatch();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [error, setError] = useState(false);
  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const onSelectChange = (
    sl: SetStateAction<{
      id: number;
      name: string;
      label: string;
      value: string;
    }>
  ) => {
    setLanguage(sl);
  };

  const handleAddFile = (newFile: FileItem) => {
    setFiles(prevFiles => [...prevFiles, newFile]);
  };

  // type ConfigDropdownProps = {
  //   onSelectChange: (sl: LanguageOption) => void;
  //   handleThemeChange: (theme: any) => void;
  //   theme: { value: string; label: string };
  // };

  // const ConfigDropdown = ({ onSelectChange, handleThemeChange, theme }) => {
  //   return (
  //     <div className="absolute mt-2 mb-4 w-100 bg-[#1e1e1e] shadow-sm rounded-md z-10">
  //       <div className="flex p-2">
  //         <div className="w-1/2 pr-2">
  //           <LanguagesDropdown onSelectChange={onSelectChange} />
  //         </div>
  //         <div className="w-1/2 pl-2">
  //           <ThemeDropdown
  //             handleThemeChange={handleThemeChange}
  //             theme={theme}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const handleSnackbarClose = () => {
    setSnackbar(false);
  };

  const showSnackbar = (variant: string, message: string) => {
    setSnackbar(true);
    setSnackbarMessage(message);
    if (variant === "success") {
      setError(false);
    } else if (variant === "error") {
      setError(true);
    }
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("Enter pressed", enterPress);
      console.log("ctrl pressed", ctrlPress);
    }
  }, [ctrlPress, enterPress]);

  useEffect(() => {
    console.log(code);
  }, [code]);

  const onChange = (action: any, data: SetStateAction<string>) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("Case not handled", action, data);
      }
    }
  };

  const handleSave = () => {
    // Save functionality implementation
  };

  const handleCompile = async () => {
    setProcessing(true);
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: {
        base64_encoded: true,
        wait: false,
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": "215b5f2942msh500fa27eb32f9fcp192b42jsn9e4cae21929d",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        language_id: 92,
        source_code: btoa(code),
        stdin: btoa(customInput),
      },
    };

    try {
      const res = await axios.request(options);
      const token = res.data.token;
      checkStatus(token);
    } catch (e: any) {
      let error = e.response ? e.response.data : e;
      setProcessing(false);
      console.log(error);
    }
  };

  const checkStatus = async (token: string) => {
    const options = {
      method: "GET",
      url: "https://judge0-ce.p.rapidapi.com/submissions/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "x-rapidapi-key": "215b5f2942msh500fa27eb32f9fcp192b42jsn9e4cae21929d",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSnackbar("success", "Your program compiled successfully!");
        return;
      }
    } catch (err) {
      setProcessing(false);
      showSnackbar("error", "There was an error with compiling your program.");
    }
  };

  function handleThemeChange(th: any) {
    const theme = th;
    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }

  useEffect(() => {
    defineTheme("oceanic-next").then((_) => {
      setTheme({ value: "oceanic-next", label: "Oceanic Next" });
    });
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center w-full space-x-4 px-4 py-2 bg-[#1e1e1e]">
        <button
          onClick={toggleSidebar}
          className="text-white px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
        >
          {sidebarVisible ? '◀' : '▶'}
        </button>
        {/* <div className="relative">
          {configDropdownOpen && (
            <ConfigDropdown
              onSelectChange={onSelectChange}
              handleThemeChange={handleThemeChange}
              theme={theme}
            />
          )}
        </div> */}
        <button
          onClick={handleCompile}
          disabled={!code}
          className={classnames(
            "bg-green-500 text-white px-5 py-2 rounded-md",
            !code ? "opacity-50" : ""
          )}
        >
          {processing ? "Processing..." : "Run"}
        </button>
        <button className="bg-green-500 text-white px-5 py-2 rounded-md">
          Save
        </button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div 
          className={`transition-all duration-300 ease-in-out ${
            sidebarVisible ? "w-64" : "w-0"
          } flex-shrink-0 overflow-hidden`}
        >
          <CodeEditorSidebar
            files={files}
            setFiles={setFiles}
            dispatch={dispatch}
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex flex-1 space-x-4 px-4 overflow-hidden">
            <div className={sidebarVisible ? "w-2/3" : "w-3/4"}>
            <CodeEditorWindow
              code={code}
              onChange={onChange}
              language={language?.value}
              theme={theme.value}
              onAddFile={handleAddFile}
            />

            </div>
            
            <div className={sidebarVisible ? "w-1/3" : "w-1/4"}>
              <OutputWindow outputDetails={outputDetails} />
            </div>
          </div>
          <Footer />
        </div>
      </div>
      
      <Snackbar
        open={snackbar}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={error ? "error" : "success"}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Editor;