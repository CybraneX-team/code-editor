import React, { useState, FC, useEffect, useRef } from "react";
import JSZip from "jszip";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { addItem } from "../lib/slices/fileSlice";
import { setCurrentFile } from "../lib/slices/currentFileSlice";
import { FileItem } from "../lib/types";
import { setStructure } from "@/lib/slices/structureSlice";
import "../app/globals.css";
import {
  Box,
  List,
  ListItem,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Input,
  Collapse,
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import { IconType } from "react-icons";
import { AiFillFileAdd, AiFillFolderAdd } from "react-icons/ai";
import {
  Folder,
  AddBox,
  CreateNewFolder,
  ExpandMore,
  ExpandLess,
  ChevronRight,
  Delete,
  Check,
  Code,
  Description,
  InsertDriveFile,
} from "@mui/icons-material";
import {
  SiJavascript,
  SiPython,
  SiHtml5,
  SiCss3,
  SiJson,
  SiMarkdown,
  SiJava,
  SiCsharp,
  SiCplusplus,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiGo,
  SiRust,
  SiTypescript,
  SiDart,
  SiScala,
  SiPerl,
  SiLua,
  SiHaskell,
  SiMatlab,
  SiVim,
  SiShell,
  SiBash,
  SiPowershell,
  SiObjectivec,
  SiSolidity,
  SiR,
  SiFiles,
} from "react-icons/si";
import { BsFiletypeJson, BsFiletypeTxt } from "react-icons/bs";

export interface ExtendedFile extends File {
  webkitRelativePath: string | "";
}

const truncateName = (name: string): string => {
  const maxLength: number = 20;
  return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
};

const CodeEditorSidebar: FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState<string>("");
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [newFileInputVisible, setNewFileInputVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [creatingFolder, setCreatingFolder] = useState<string | null>(null);
  const onDrop = async (acceptedFiles: ExtendedFile[]): Promise<void> => {
    const newFiles: FileItem[] = [];
    const fileItems: { name: string; content: string }[] = [];

    for (const file of acceptedFiles) {
      if (file.name.endsWith(".zip")) {
        // Handle zip files
        const zip = new JSZip();
        const content = await zip.loadAsync(file);
        await Promise.all(
          Object.keys(content.files).map(async (relativePath) => {
            // ... (zip file handling logic)
          })
        );
      } else {
        // Handle regular files and folders
        const pathParts = file.webkitRelativePath
          ? file.webkitRelativePath.split("/")
          : [file.name];
        const fileName = pathParts.pop() || "";
        const folderPath = pathParts;

        // Read file content
        const reader = new FileReader();
        reader.onload = (e) => {
          fileItems.push({
            name: file.name,
            content: e.target?.result as string,
          });
        };
        reader.readAsText(file);

        // Create folder structure
        let currentLevel = newFiles;
        folderPath.forEach((folder) => {
          let existingFolder = currentLevel.find(
            (f) => f.name === folder && f.type === "folder"
          );
          if (!existingFolder) {
            existingFolder = { name: folder, type: "folder", files: [] };
            currentLevel.push(existingFolder);
          }
          currentLevel = existingFolder.files!;
        });
        if (currentLevel) {
          currentLevel.push({ name: fileName, type: "file" });
        }
      }
    }

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    fileItems.forEach((fileItem) => dispatch(addItem(fileItem)));
  };

  const handleContextMenu = (event: React.MouseEvent, item: FileItem) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null
    );
    setSelectedItem(item);
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleAddFile = (folderName: string) => {
    setNewFileInputVisible({ ...newFileInputVisible, [folderName]: true });
    handleClose();
  };

  const handleCreateFile = (folderName: string): void => {
    if (newFileName) {
      const newFile: FileItem = { name: newFileName, type: "file" };
      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles];
        const addFileToFolder = (folder: FileItem): void => {
          if (folder.name === folderName && folder.type === "folder") {
            if (!folder.files?.find((file) => file.name === newFile.name)) {
              folder.files!.push(newFile);
              dispatch(addItem({ name: newFileName, content: "" }));
            }
          } else if (folder.files) {
            folder.files.forEach(addFileToFolder);
          }
        };
        updatedFiles.forEach(addFileToFolder);
        return updatedFiles;
      });
      setNewFileName("");
      setNewFileInputVisible({ ...newFileInputVisible, [folderName]: false });
    }
  };

  const handleAddFolder = (folderName: string) => {
    setCreatingFolder(folderName);
    handleClose();
  };

  const handleFolderUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFolderSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onDrop(Array.from(files) as ExtendedFile[]);
    }
  };

  const handleCreateFolder = (): void => {
    if (newFolderName && creatingFolder) {
      const newFolder: FileItem = {
        name: newFolderName,
        type: "folder",
        files: [],
      };
      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles];
        const addFolderToFolder = (folder: FileItem): void => {
          if (folder.name === creatingFolder && folder.type === "folder") {
            if (!folder.files?.find((file) => file.name === newFolder.name)) {
              folder.files!.push(newFolder);
            }
          } else if (folder.files) {
            folder.files.forEach(addFolderToFolder);
          }
        };
        updatedFiles.forEach(addFolderToFolder);
        return updatedFiles;
      });
      setNewFolderName("");
      setCreatingFolder(null);
    }
  };

  const handleToggleFolder = (folderName: string): void => {
    setOpenFolders((prevOpenFolders) => ({
      ...prevOpenFolders,
      [folderName]: !prevOpenFolders[folderName],
    }));
    setCurrentFolder((prevFolder) =>
      prevFolder === folderName ? null : folderName
    );
  };

  const handleDeleteFile = (fileName: string) => {
    setFiles((prevFiles) => {
      const deleteFileFromFolder = (folder: FileItem): void => {
        if (folder.files) {
          folder.files = folder.files.filter((file) => file.name !== fileName);
          folder.files.forEach(deleteFileFromFolder);
        }
      };
      const updatedFiles = prevFiles.filter((file) => file.name !== fileName);
      updatedFiles.forEach(deleteFileFromFolder);
      return updatedFiles;
    });
    handleClose();
  };

  useEffect(() => {
    dispatch(setStructure(files));
  }, [files, dispatch]);

  const getFileIcon = (fileName: string): React.ReactElement => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    const iconMap: { [key: string]: IconType } = {
      js: SiJavascript,
      py: SiPython,
      html: SiHtml5,
      css: SiCss3,
      json: BsFiletypeJson,
      java: SiJava,
      cs: SiCsharp,
      php: SiPhp,
      rb: SiRuby,
      txt: BsFiletypeTxt,
      swift: SiSwift,
      kt: SiKotlin,
      ts: SiTypescript,
      // Add more file types here
    };

    const IconComponent = iconMap[ext] || Code;
    return <IconComponent style={{ fontSize: 18, color: "#c8c8c8" }} />;
  };

  const renderFiles = (fileList: FileItem[], level = 0): JSX.Element[] =>
    fileList.map((file, index) => (
      <React.Fragment key={index} sx={{ marginTop: "20px" }}>
        <ListItem
          button
          onContextMenu={(e) => handleContextMenu(e, file)}
          onClick={() =>
            file.type === "folder"
              ? handleToggleFolder(file.name)
              : dispatch(setCurrentFile(file.name))
          }
          sx={{
            color: "#cccccc",
            paddingLeft: `${level * 16 + 8}px`,
            fontSize: "13px",
            padding: "2px 8px",
            transition: "background-color 0.2s ease",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              flexGrow: 1,
            }}
          >
            {file.type === "folder" ? (
              <Folder sx={{ fontSize: 18, marginRight: 1, color: "#dcb67a" }} />
            ) : (
              getFileIcon(file.name)
            )}
            <Typography
              sx={{
                marginLeft: "5px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: '"Segoe WPC", "Segoe UI", sans-serif',
              }}
            >
              {file.name}
            </Typography>
          </Box>
          {file.type === "folder" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Add File">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddFile(file.name);
                  }}
                  size="small"
                  sx={{ color: "#cccccc", padding: "2px" }}
                >
                  <AiFillFileAdd sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add Folder">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddFolder(file.name);
                  }}
                  size="small"
                  sx={{ color: "#cccccc", padding: "2px" }}
                >
                  <AiFillFolderAdd sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              {openFolders[file.name] ? (
                <ExpandMore sx={{ fontSize: 18 }} />
              ) : (
                <ChevronRight sx={{ fontSize: 18 }} />
              )}
            </Box>
          )}
          {/* {file.type === "file" && (
            <Tooltip title="Delete">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(file.name);
                }}
                size="small"
                sx={{ color: "#cccccc", padding: "2px" }}
              >
                <MdDelete sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )} */}
        </ListItem>
        {file.type === "folder" && (
          <Collapse in={openFolders[file.name]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderFiles(file.files || [], level + 1)}
              {newFileInputVisible[file.name] && (
                <ListItem
                  sx={{ paddingLeft: `${level * 16 + 24}px`, paddingY: "4px" }}
                >
                  <Input
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="New File Name"
                    sx={{
                      color: "#cccccc",
                      fontSize: "13px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      padding: "2px 8px",
                      borderRadius: "2px",
                      marginRight: "8px",
                      "&::before, &::after": { display: "none" },
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleCreateFile(file.name);
                      }
                    }}
                  />
                  <Tooltip title="Create File">
                    <IconButton
                      onClick={() => handleCreateFile(file.name)}
                      size="small"
                      sx={{ color: "#cccccc", padding: "2px" }}
                    >
                      <Check sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              )}
              {creatingFolder === file.name && (
                <ListItem
                  sx={{ paddingLeft: `${level * 16 + 24}px`, paddingY: "4px" }}
                >
                  <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="New Folder Name"
                    sx={{
                      color: "#cccccc",
                      fontSize: "13px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      padding: "2px 8px",
                      borderRadius: "2px",
                      marginRight: "8px",
                      "&::before, &::after": { display: "none" },
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleCreateFolder();
                      }
                    }}
                  />
                  <Tooltip title="Create Folder">
                    <IconButton
                      onClick={handleCreateFolder}
                      size="small"
                      sx={{ color: "#cccccc", padding: "2px" }}
                    >
                      <Check sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    ));

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
      {/* <button className="button" {...getRootProps()}>
        <svg xmlns="http://www.w3.org/2000/svg">
          <rect className="border" pathLength="100"></rect>
          <rect className="loading" pathLength="100"></rect>
          <svg
            className="done-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              className="done done-cloud"
              pathLength="100"
              d="M 6.5,20 Q 4.22,20 2.61,18.43 1,16.85 1,14.58 1,12.63 2.17,11.1 3.35,9.57 5.25,9.15 5.88,6.85 7.75,5.43 9.63,4 12,4 14.93,4 16.96,6.04 19,8.07 19,11 q 1.73,0.2 2.86,1.5 1.14,1.28 1.14,3 0,1.88 -1.31,3.19 Q 20.38,20 18.5,20 Z"
            ></path>
            <path
              className="done done-check"
              pathLength="100"
              d="M 7.515,12.74 10.34143,15.563569 15.275,10.625"
            ></path>
          </svg>
        </svg>
        <div className="txt-upload">Upload</div>
        <input {...getInputProps()} />
      </button> */}

      {/* <Button
        variant="contained"
        sx={{ width: '100%', marginBottom: '10px', backgroundColor: '#007acc', '&:hover': { backgroundColor: '#005f99' } }}
        onClick={handleFolderUpload}
      >
        Upload Folder
      </Button> */}
      {/* <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        webkitdirectory=""
        directory=""
        onChange={handleFolderSelected}
      /> */}
      <span sx={{ marginTop: "50px" }}>Files</span>
      <List sx={{ flexGrow: 2, overflowY: "auto" }}>{renderFiles(files)}</List>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {selectedItem?.type === "file" && (
          <div className="p-[-10x]">
            <MenuItem>Copy</MenuItem>
            <MenuItem>Cut</MenuItem>
            <MenuItem>Paste</MenuItem>
            <MenuItem>Rename</MenuItem>
            <MenuItem onClick={() => handleDeleteFile(selectedItem.name)}>
              Delete
            </MenuItem>
          </div>
        )}
        {selectedItem?.type === "folder" && (
          <>
            <MenuItem onClick={() => handleAddFile(selectedItem.name)}>
              Add File
            </MenuItem>
            <MenuItem onClick={() => handleAddFolder(selectedItem.name)}>
              Add Folder
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default CodeEditorSidebar;
