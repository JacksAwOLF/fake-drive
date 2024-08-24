import { CSSProperties, useState } from 'react';
import { FileMetadata, deleteFile, getFiles } from '../models/FileMetadata';
import fileIcon from '../imgs/file.png';
import folderIcon from '../imgs/folder.png';
import { deleteFileFromStorage } from '../models/fileStorage';

interface FileProps {
  file: FileMetadata
  setNodeId: React.Dispatch<React.SetStateAction<string>>;
  setFiles: React.Dispatch<React.SetStateAction<FileMetadata[]>>;
}

const nodeIdURLParam = "nodeId";

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

const File: React.FC<FileProps> = ({ file, setNodeId, setFiles }) => {

  const handleClick = () => {
    if (file.isFile) {
      // open up download link
      window.open(file.contentLink, "_blank");
    } else {
      // navigate inside the folder and update screen
      setNodeId(file.id);
      const url = new URL(window.location.href); 
      url.searchParams.set(nodeIdURLParam, file.id);
      const newURL = url.pathname + '?' + url.searchParams.toString();
      console.log("pushing state", file.id);
      window.history.pushState({nodeId: file.id}, '', newURL);
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
    console.log("deleting", file.id);
    
    deleteFile(file.id)

  }
  https://firebasestorage.googleapis.com/v0/b/fake-drive-63156.appspot.com/o/uploads%2F.DS_Store?alt=media&token=cf69090c-c844-4e9a-bf59-4b9143ea77bd
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
