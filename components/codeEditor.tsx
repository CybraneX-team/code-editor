import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { Editor } from "@monaco-editor/react";
import React, { useEffect, useState } from "react";
import { CodeEditorWindowProps, FileItem } from "@/lib/types";
import { Box, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Tabs, Tab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { addItem } from "@/lib/slices/fileSlice";
import { setCurrentFile } from "@/lib/slices/currentFileSlice";

interface ExtendedCodeEditorWindowProps extends CodeEditorWindowProps {
  onAddFile: (newFile: FileItem) => void;
}

const CodeEditorWindow: React.FC<CodeEditorWindowProps> = ({ onChange, language, code, theme, onAddFile  }) => {
  const [value, setValue] = useState(code || "");
  const fileData = useAppSelector(state => state.fileContent);
  const currentFile = useAppSelector(state => state.currentFile);
  const dispatch = useAppDispatch();
  const [openFiles, setOpenFiles] = useState<FileItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) {
      return;
    }
    setValue(value);
    onChange("code", value);
  };

  useEffect(() => {
    if (fileData && currentFile) {
      const currentContent = fileData.find(file => file.name === currentFile.value);
      if (currentContent) {
        setValue(currentContent.content || "");
        if (!openFiles.some(file => file.name === currentContent.name)) {
          setOpenFiles(prevOpenFiles => [...prevOpenFiles, currentContent as FileItem]);
        }
      }
    }
  }, [currentFile, fileData]);

  const handleNewFile = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewFileName("");
  };

  const handleCreateFile = () => {
    if (newFileName) {
      const newFile: FileItem = { name: newFileName, type: "file", content: "" };
      dispatch(addItem(newFile));
      dispatch(setCurrentFile(newFileName));
      setOpenFiles([...openFiles, newFile]);
      onAddFile(newFile); // Update sidebar file list
      handleDialogClose();
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    dispatch(setCurrentFile(newValue));
  };

  const handleCloseTab = (fileName: string) => {
    const updatedOpenFiles = openFiles.filter(file => file.name !== fileName);
    setOpenFiles(updatedOpenFiles);
    if (currentFile.value === fileName && updatedOpenFiles.length > 0) {
      dispatch(setCurrentFile(updatedOpenFiles[updatedOpenFiles.length - 1].name));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '635px' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        paddingBottom: '0.25rem', 
        backgroundColor: '#1e1e1e', 
        borderBottom: '1px solid #333'
      }}>
        <Tabs 
          value={currentFile.value} 
          onChange={handleTabChange} 
          variant="scrollable" 
          scrollButtons="auto"
          sx={{ minHeight: "20px",'& .MuiTabs-indicator': {
      display: 'none', // Remove the indicator line if you don't want it
    }, }}
        >
          {openFiles.map((file) => (
            <Tab 
              className="rounded-md bg-[#1e1e1e] h-[0] mr-2"
              key={file.name} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ marginRight: 1, fontSize: '0.8rem', color: "white" }}>{file.name}</Typography>
                  <IconButton size="small" onClick={() => handleCloseTab(file.name)}>
                    <CloseIcon fontSize="small"sx={{ fontSize: '0.8rem', color: "white" }} />
                  </IconButton>
                </Box>
              } 
              value={file.name} 
              sx={{
                minHeight: '35px', // Decrease this value to reduce tab height
                padding: '2px 8px', // Adjust padding to your preference
                '&.Mui-selected': {
                  backgroundColor: '#3c5a6b', // Change the background color for the selected tab
                },
              }}
            />
          ))}
        </Tabs>
        <IconButton onClick={handleNewFile} size="small" sx={{ color: '#cccccc', padding: '2px', '& .MuiSvgIcon-root': {
      fontSize: '1rem', // Decrease icon size
    }, }}>
          <AddIcon className="my-2 text-7xl" />
        </IconButton>
      </Box>
      <Box className="rounded-md" sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          width="100%"
          language={language || "python"}
          value={value}
          theme={theme}
          defaultValue="#Start writing"
          onChange={handleEditorChange}
        />
      </Box>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Create New File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="File Name"
            type="text"
            fullWidth
            variant="standard"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleCreateFile}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CodeEditorWindow;