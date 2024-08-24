import { CSSProperties, useState } from 'react';
import { FileMetadata, deleteFile, getFiles } from '../models/FileMetadata';
import fileIcon from '../imgs/file.png';
import folderIcon from '../imgs/folder.png';
import { deleteFileFromStorage } from '../models/fileStorage';
import { navToFileId } from '../util/windowHistory';

interface FileProps {
  file: FileMetadata;
  setNodeId: React.Dispatch<React.SetStateAction<string>>;
  setFiles: React.Dispatch<React.SetStateAction<FileMetadata[]>>;
  setFileList: React.Dispatch<React.SetStateAction<FileMetadata[]>>;
}

const containerStyle: CSSProperties  = {
  border: "1px solid white",
  borderRadius: "0px",
  display: "inline-block",
  position: "relative"
}

const imgStyle: CSSProperties = {
  width: "100px",
  height: "100px"
}

const delStyle: CSSProperties = {
  position: "absolute",
  right: "0px",
  top: "0px"
}

const File: React.FC<FileProps> = 
  ({ file, setNodeId, setFiles, setFileList }) => {

  const handleClick = () => {
    if (file.isFile) {
      // open up download link
      window.open(file.contentLink, "_blank");
    } else {
      setNodeId(file.id);
    }
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteFileOrFolder(file);
    setFiles((prevFiles) => prevFiles.filter(prevFile => prevFile.id !== file.id));
  }

  const deleteFileOrFolder = async (file: FileMetadata) => {

    // if folder, recurse into every file in the folder
    if (!file.isFile) {
      const filesInFolder = await getFiles(file.id);
      for (const nextFile of filesInFolder) {
        deleteFileOrFolder(nextFile);
      }
    }

    // if file, remove stored data from firebase storage
    else {
      deleteFileFromStorage(file.contentLink);
    }
    
    // delete the file itself
    deleteFile(file.id)
  }

  return (
    <div style={containerStyle} onClick={handleClick}>
      <img 
        src={file.isFile ? fileIcon : folderIcon} 
        alt={file.fileName} 
        style={imgStyle}
      />
      <p> {file.fileName} </p>
      <button type="button" onClick={handleDelete} style={delStyle}>
        delete
      </button>
    </div>
  );
}

export default File;
