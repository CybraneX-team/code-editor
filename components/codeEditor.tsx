import { useAppSelector } from "@/lib/hooks";
import {Editor} from "@monaco-editor/react";
import React, { useEffect, useState } from "react"
import { CodeEditorWindowProps } from "@/lib/types";

const CodeEditorWindow: React.FC<CodeEditorWindowProps> = ({onChange, language, code, theme}) => {
    const [value, setValue] = useState(code || "");
    const fileData = useAppSelector(state => state.fileContent);
    const currentFile = useAppSelector(state => state.currentFile);

    const handleEditorChange = (value: string | undefined) =>  {
        if(value == undefined){
            return;
        }
        setValue(value);
        onChange("code", value);
    }

    useEffect(()=>{
        console.log(currentFile);
        const currentContent = fileData.filter(file => file.name === currentFile.value)[0];
     //   setCode(currentFile.value !== "" ? currentContent.content : "");
      //  console.log(currentContent?.content)
      setValue(currentContent?.content);
      }, [currentFile]);

    return(
        <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
            <Editor 
            height="90vh"
            width={"100%"}
            language={language || "python"}
            value={value}
            theme={theme}
            defaultValue="#Start writing"
            onChange={handleEditorChange}
            />
        </div>
    )
}

export default CodeEditorWindow;