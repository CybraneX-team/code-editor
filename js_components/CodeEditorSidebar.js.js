import React, { useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  Typography,
  Tooltip,
  Input,
} from "@mui/material";
import {
  Folder,
  InsertDriveFile,
  AddBox,
  CreateNewFolder,
  ExpandLess,
  ExpandMore,
  Delete,
} from "@mui/icons-material";
import JSZip from "jszip";
import { useDropzone } from "react-dropzone";

const truncateName = (name) => {
  const maxLength = 20;
  return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
};

const CodeEditorSidebar = () => {
  const [files, setFiles] = useState([]);
  const [newFileName, setNewFileName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [openFolders, setOpenFolders] = useState({});
  const [currentFolder, setCurrentFolder] = useState(null);

  const onDrop = async (acceptedFiles) => {
    const newFiles = [];

    for (const file of acceptedFiles) {
      if (file.name.endsWith(".zip")) {
        const zip = new JSZip();
        const zipFolder = { name: file.name, type: "folder", files: [] };

        const content = await zip.loadAsync(file);
        content.forEach(async (relativePath, zipEntry) => {
          const pathParts = relativePath.split("/");
          const fileName = pathParts.pop();
          const folderPath = pathParts;

          let currentLevel = zipFolder.files;

          folderPath.forEach((folder) => {
            let existingFolder = currentLevel.find(
              (f) => f.name === folder && f.type === "folder"
            );
            if (!existingFolder) {
              existingFolder = { name: folder, type: "folder", files: [] };
              currentLevel.push(existingFolder);
            }
            currentLevel = existingFolder.files;
          });

          currentLevel.push({ name: fileName, type: "file" });

          const fileContent = await zipEntry.async("text");
          console.log(`Content of ${relativePath}:`, fileContent);
        });

        newFiles.push(zipFolder);
      } else {
        const pathParts = file.webkitRelativePath
          ? file.webkitRelativePath.split("/")
          : [file.name];
        const fileName = pathParts.pop();
        const folderPath = pathParts;

        let currentLevel = newFiles;

        folderPath.forEach((folder) => {
          let existingFolder = currentLevel.find(
            (f) => f.name === folder && f.type === "folder"
          );
          if (!existingFolder) {
            existingFolder = { name: folder, type: "folder", files: [] };
            currentLevel.push(existingFolder);
          }
          currentLevel = existingFolder.files;
        });

        currentLevel.push({ name: fileName, type: "file" });
      }
    }

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleAddFile = () => {
    if (newFileName) {
      const newFile = { name: newFileName, type: "file" };
      if (currentFolder && openFolders[currentFolder]) {
        setFiles((prevFiles) => {
          const updatedFiles = [...prevFiles];
          const addFileToFolder = (folder) => {
            if (folder.name === currentFolder && folder.type === "folder") {
              folder.files.push(newFile);
            } else if (folder.files) {
              folder.files.forEach(addFileToFolder);
            }
          };
          updatedFiles.forEach(addFileToFolder);
          return updatedFiles;
        });
      } else {
        setFiles((prevFiles) => [...prevFiles, newFile]);
      }
      setNewFileName("");
    }
  };

  const handleAddFolder = () => {
    if (newFolderName) {
      setFiles((prevFiles) => [
        ...prevFiles,
        { name: newFolderName, type: "folder", files: [] },
      ]);
      setNewFolderName("");
    }
  };

  const handleToggleFolder = (folderName) => {
    setOpenFolders((prevOpenFolders) => ({
      ...prevOpenFolders,
      [folderName]: !prevOpenFolders[folderName],
    }));
    setCurrentFolder((prevFolder) =>
      prevFolder === folderName ? null : folderName
    );
  };

  const handleDeleteFile = (fileName) => {
    setFiles((prevFiles) => {
      const deleteFileFromFolder = (folder) => {
        if (folder.files) {
          folder.files = folder.files.filter((file) => file.name !== fileName);
          folder.files.forEach(deleteFileFromFolder);
        }
      };
      const updatedFiles = prevFiles.filter((file) => file.name !== fileName);
      updatedFiles.forEach(deleteFileFromFolder);
      return updatedFiles;
    });
  };

  const renderFiles = (fileList, level = 0) =>
    fileList.map((file, index) =>
      file.type === "folder" ? (
        <React.Fragment key={index}>
          <ListItem
            button
            onClick={() => handleToggleFolder(file.name)}
            sx={{
              color: "#fff",
              marginLeft: `${level * 10}px`,
              fontSize: "14px",
              padding: "6px 10px",
              borderRadius: "4px",
              transition: "background-color 0.3s ease",
              "&:hover": { backgroundColor: "#333" },
              overflow: "hidden",
            }}
          >
            <Folder />
            <ListItemText
              primary={truncateName(file.name)}
              sx={{
                marginLeft: "5px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
            {openFolders[file.name] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openFolders[file.name]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderFiles(file.files, level + 1)}
            </List>
          </Collapse>
        </React.Fragment>
      ) : (
        <ListItem
          key={index}
          sx={{
            color: "#fff",
            marginLeft: `${level * 10}px`,
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "4px",
            transition: "background-color 0.3s ease",
            "&:hover": { backgroundColor: "#333" },
            overflow: "hidden",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}
          >
            <InsertDriveFile />
            <ListItemText
              primary={truncateName(file.name)}
              sx={{
                marginLeft: "5px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
          </Box>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDeleteFile(file.name)}
              sx={{ color: "#fff", marginLeft: "5px" }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </ListItem>
      )
    );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Box
      sx={{
        width: "350px",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        height: "100vh",
        padding: "10px",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" sx={{ color: "#fff", marginBottom: "16px" }}>
        Code Editor
      </Typography>
      <Button
        variant="contained"
        component="label"
        sx={{
          width: "100%",
          marginBottom: "10px",
          backgroundColor: "#007acc",
          "&:hover": { backgroundColor: "#005f99" },
        }}
        {...getRootProps()}
      >
        Upload Files
        <input {...getInputProps()} />
      </Button>
      <Box sx={{ display: "flex", marginBottom: "10px" }}>
        <Input
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="New File Name"
          sx={{
            color: "#fff",
            flex: 1,
            marginRight: "5px",
            fontSize: "14px",
            padding: "8px",
            border: "1px solid #444",
            borderRadius: "4px",
            backgroundColor: "#2e2e2e",
            "&::placeholder": { color: "#aaa" },
          }}
        />
        <Tooltip title="Add File">
          <IconButton onClick={handleAddFile} sx={{ color: "#fff" }}>
            <AddBox />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: "flex", marginBottom: "10px" }}>
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New Folder Name"
          sx={{
            color: "#fff",
            flex: 1,
            marginRight: "5px",
            fontSize: "14px",
            padding: "8px",
            border: "1px solid #444",
            borderRadius: "4px",
            backgroundColor: "#2e2e2e",
            "&::placeholder": { color: "#aaa" },
          }}
        />
        <Tooltip title="Add Folder">
          <IconButton onClick={handleAddFolder} sx={{ color: "#fff" }}>
            <CreateNewFolder />
          </IconButton>
        </Tooltip>
      </Box>
      <List sx={{ flex: 1 }}>{renderFiles(files)}</List>
    </Box>
  );
};

export default CodeEditorSidebar;
