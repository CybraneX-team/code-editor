import React, { useState, FC, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, IconButton, Collapse, Tooltip, Input, Button, Typography } from '@mui/material';
import { Folder, AddBox, CreateNewFolder, ExpandLess, ExpandMore, Delete, Check } from '@mui/icons-material';
import JSZip, { JSZipObject } from 'jszip';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { addItem } from "../lib/slices/fileSlice";
import { setCurrentFile } from "../lib/slices/currentFileSlice";
import { FileItem } from "../lib/types";
import { setStructure } from '@/lib/slices/structureSlice';
import { FileIcon, defaultStyles } from 'react-file-icon';

export interface ExtendedFile extends File {
  webkitRelativePath: string | "";
}

const truncateName = (name: string): string => {
  const maxLength: number = 20;
  return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
};

const CodeEditorSidebar: FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({});
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [newFileInputVisible, setNewFileInputVisible] = useState<{ [key: string]: boolean }>({});
  const [newFileName, setNewFileName] = useState<string>('');
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [creatingFolder, setCreatingFolder] = useState<string | null>(null);
  const dispatch = useDispatch();

  const onDrop = async (acceptedFiles: ExtendedFile[]): Promise<void> => {
    const newFiles: FileItem[] = [];
    const fileItems: { name: string, content: string }[] = [];

    for (const file of acceptedFiles) {
      if (file.name.endsWith('.zip')) {
        const zip = new JSZip();
        const content = await zip.loadAsync(file);
        await Promise.all(Object.keys(content.files).map(async (relativePath) => {
          const zipEntry = content.files[relativePath];
          const pathParts = relativePath.split('/');
          const fileName = pathParts.pop() || '';
          const folderPath = pathParts;
          let currentLevel = newFiles;
          folderPath.forEach((folder) => {
            let existingFolder = currentLevel.find((f) => f.name === folder && f.type === 'folder');
            if (!existingFolder) {
              existingFolder = { name: folder, type: 'folder', files: [] };
              currentLevel.push(existingFolder);
            }
            currentLevel = existingFolder.files!;
          });
          if (currentLevel) {
            currentLevel.push({ name: fileName, type: 'file' });
            const fileContent = await zipEntry.async('text');
            fileItems.push({ name: fileName, content: fileContent });
          }
        }));
      } else {
        const pathParts = file.webkitRelativePath ? file.webkitRelativePath.split('/') : [file.name];
        const fileName = pathParts.pop() || '';
        const folderPath = pathParts;
        const reader = new FileReader();
        reader.onload = (e) => {
          fileItems.push({ name: file.name, content: e.target?.result as string });
        };
        reader.readAsText(file);
        let currentLevel = newFiles;
        folderPath.forEach((folder) => {
          let existingFolder = currentLevel.find((f) => f.name === folder && f.type === 'folder');
          if (!existingFolder) {
            existingFolder = { name: folder, type: 'folder', files: [] };
            currentLevel.push(existingFolder);
          }
          currentLevel = existingFolder.files!;
        });
        if (currentLevel) {
          currentLevel.push({ name: fileName, type: 'file' });
        }
      }
    }

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    fileItems.forEach(fileItem => dispatch(addItem(fileItem)));
  };

  const handleAddFile = (folderName: string): void => {
    setNewFileInputVisible({ ...newFileInputVisible, [folderName]: true });
  };

  const handleCreateFile = (folderName: string): void => {
    if (newFileName) {
      const newFile: FileItem = { name: newFileName, type: 'file' };
      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles];
        const addFileToFolder = (folder: FileItem): void => {
          if (folder.name === folderName && folder.type === 'folder') {
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
      setNewFileName('');
      setNewFileInputVisible({ ...newFileInputVisible, [folderName]: false });
    }
  };

  const handleAddFolder = (folderName: string): void => {
    setCreatingFolder(folderName);
  };

  const handleCreateFolder = (): void => {
    if (newFolderName && creatingFolder) {
      const newFolder: FileItem = { name: newFolderName, type: 'folder', files: [] };
      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles];
        const addFolderToFolder = (folder: FileItem): void => {
          if (folder.name === creatingFolder && folder.type === 'folder') {
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
      setNewFolderName('');
      setCreatingFolder(null);
    }
  };

  const handleToggleFolder = (folderName: string): void => {
    setOpenFolders((prevOpenFolders) => ({
      ...prevOpenFolders,
      [folderName]: !prevOpenFolders[folderName],
    }));
    setCurrentFolder((prevFolder) => (prevFolder === folderName ? null : folderName));
  };

  const handleDeleteFile = (fileName: string): void => {
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
  };

  useEffect(() => {
    dispatch(setStructure(files));
  }, [files, dispatch]);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop() || '';
    return <FileIcon extension={ext} {...defaultStyles[ext]} style={{ width: '16px', height: '16px' }} />;
  };
  

  const renderFiles = (fileList: FileItem[], level = 0): JSX.Element[] => (
    fileList.map((file, index) => (
      file.type === 'folder' ? (
        <React.Fragment key={index}>
          <ListItem
            button
            onClick={() => handleToggleFolder(file.name)}
            sx={{
              color: '#fff',
              marginLeft: `${level * 10}px`,
              fontSize: '14px',
              padding: '6px 10px',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease',
              '&:hover': { backgroundColor: '#333' },
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Folder sx={{ fontSize: '24px' }} />
              <ListItemText primary={truncateName(file.name)} sx={{ marginLeft: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Add File">
                <IconButton onClick={() => handleAddFile(file.name)} sx={{ color: '#fff', marginLeft: '5px', padding: '5px' }}>
                  <AddBox sx={{ fontSize: '24px' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add Folder">
                <IconButton onClick={() => handleAddFolder(file.name)} sx={{ color: '#fff', marginLeft: '5px', padding: '5px' }}>
                  <CreateNewFolder sx={{ fontSize: '24px' }} />
                </IconButton>
              </Tooltip>
              {openFolders[file.name] ? <ExpandLess sx={{ fontSize: '24px' }} /> : <ExpandMore sx={{ fontSize: '24px' }} />}
            </Box>
          </ListItem>
          <Collapse in={openFolders[file.name]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderFiles(file.files || [], level + 1)}
              {newFileInputVisible[file.name] && (
                <ListItem sx={{ display: 'flex', alignItems: 'center', paddingLeft: `${level * 10 + 20}px` }}>
                  <Input
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="New File Name"
                    sx={{
                      color: '#fff',
                      flex: 1,
                      backgroundColor: '#333',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      marginRight: '10px',
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateFile(file.name);
                      }
                    }}
                  />
                  <Tooltip title="Create File">
                    <IconButton onClick={() => handleCreateFile(file.name)} sx={{ color: '#fff', padding: '5px' }}>
                      <Check sx={{ fontSize: '24px' }} />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              )}
              {creatingFolder === file.name && (
                <ListItem sx={{ display: 'flex', alignItems: 'center', paddingLeft: `${level * 10 + 20}px` }}>
                  <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="New Folder Name"
                    sx={{
                      color: '#fff',
                      flex: 1,
                      backgroundColor: '#333',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      marginRight: '10px',
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateFolder();
                      }
                    }}
                  />
                  <Tooltip title="Create Folder">
                    <IconButton onClick={handleCreateFolder} sx={{ color: '#fff', padding: '5px' }}>
                      <Check sx={{ fontSize: '24px' }} />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              )}
            </List>
          </Collapse>
        </React.Fragment>
      ) : (
        <ListItem
          key={index}
          onClick={() => {
            dispatch(setCurrentFile(file.name ? file.name : ""));
          }}
          sx={{
            color: '#fff',
            marginLeft: `${level * 10}px`,
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '4px',
            transition: 'background-color 0.3s ease',
            '&:hover': { backgroundColor: '#333' },
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            {getFileIcon(file.name)}
            <ListItemText primary={truncateName(file.name)} sx={{ marginLeft: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />
          </Box>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteFile(file.name)} sx={{ color: '#fff', marginLeft: '5px', padding: '5px' }}>
              <Delete sx={{ fontSize: '24px' }} />
            </IconButton>
          </Tooltip>
        </ListItem>
      )
    ))
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Box
      sx={{
        width: '350px',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        height: '100vh',
        padding: '10px',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" sx={{ color: '#fff', marginBottom: '16px' }}>Code Editor</Typography>
      <Button
        variant="contained"
        sx={{ width: '100%', marginBottom: '10px', backgroundColor: '#007acc', '&:hover': { backgroundColor: '#005f99' } }}
        {...getRootProps()}
      >
        Upload Files
        <input {...getInputProps()} />
      </Button>
      <List>
        {renderFiles(files)}
      </List>
    </Box>
  );
};

export default CodeEditorSidebar;
