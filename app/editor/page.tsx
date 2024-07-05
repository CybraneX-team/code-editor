"use client"
import { languageOptions } from "@/constants/languageOptions";
import { defineTheme } from "@/lib/defineTheme";
import { useKeyPress } from "@/lib/useKeyPress";
import React, { SetStateAction, useEffect, useState } from "react";
import LanguagesDropdown from "@/components/languagesDropdown";
import ThemeDropdown from "@/components/themeDropdown";
import CodeEditorWindow from "@/components/codeEditor";
import OutputWindow from "@/components/outputWindow";
import CustomInput from "@/components/customInput";
import Footer from "@/components/footer";
import axios from "axios";
import OutputDetails from "@/components/outputDetails";
import { classnames } from "@/utils/general";
import { Alert, Snackbar } from "@mui/material";
import CodeEditorSidebar from "@/components/sidebar";

const pythonDefault = '#Start writing\n';
function Editor() {
  const [code, setCode] = useState(pythonDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState({});
  const [processing, setProcessing] = useState(false);
  const [theme, setTheme] = useState({ value: "cobalt", label: "Cobalt" });
  const [language, setLanguage] = useState(languageOptions[0]);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [error, setError] = useState(false);
  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl: SetStateAction<{ id: number; name: string; label: string; value: string; }>) => {
    setLanguage(sl);
  }

  const handleSnackbarClose = () => {
    setSnackbar(false);
  }

  const showSnackbar = (variant: string, message: string) => {
    setSnackbar(true);
    setSnackbarMessage(message);
    if (variant === "success") {
      setSnackbar(true);
      setSnackbarMessage(message);
      setError(false);
    } else if (variant === "error") {
      setError(true);
    }
  }

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("Enter pressed", enterPress);
      console.log("ctrl pressed", ctrlPress);
    }
  }, [ctrlPress, enterPress]);

  useEffect(() => {
    console.log(code);
  }, [code])

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
  }

  const handleSave = () => {

  }

  const handleCompile = async () => {
    setProcessing(true);
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: {
        base64_encoded: true,
        wait: false,
        fields: "*"
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
      }
    }

    try {
      const res = await axios.request(options);
      const token = res.data.token;
      checkStatus(token);
    }
    catch (e: any) {
      let error = e.response ? e.response.data : e;
      setProcessing(false);
      console.log(error);
    }
  }

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
          checkStatus(token)
        }, 2000)
        return
      } else {
        setProcessing(false)
        setOutputDetails(response.data)
        showSnackbar("success", "Your program compiled succesfully!");
        return
      }
    } catch (err) {
      setProcessing(false);
      showSnackbar("error", "There was an error with compiling your program.")
    }
  }

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
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    })
  }, []);

  return (
    <div className="flex">
      <CodeEditorSidebar />
      <div className="flex flex-col w-full">
        <Snackbar open={snackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={error ? "error" : "success"} variant="filled">
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <div className="flex items-center space-x-4 p-4">
          <LanguagesDropdown onSelectChange={onSelectChange} />
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
          <button className="bg-blue-800 text-white px-5 py-2 rounded-md">Save</button>
        </div>
        <div className="flex flex-row space-x-4 p-4">
          <div className="w-3/5">
            <CodeEditorWindow code={code} onChange={onChange} language={language?.value} theme={theme.value} />
          </div>
          <div className="w-2/5 space-y-4">
            <OutputWindow outputDetails={outputDetails} />
            <CustomInput customInput={customInput} setCustomInput={setCustomInput} />
            <button
              onClick={handleCompile}
              disabled={!code}
              className={classnames(
                "w-full bg-blue-500 text-white py-2 rounded-md",
                !code ? "opacity-50" : ""
              )}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
            <OutputDetails outputDetails={outputDetails} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Editor;
