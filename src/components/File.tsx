import { useState } from 'react';
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

const File: React.FC<FileProps> = 
  ({ file, setNodeId, setFiles, setFileList }) => {

  const handleClick = () => {
    if (file.isFile) {
      // open up download link
      window.open(file.contentLink, "_blank");
    } else {
      // go inside folder
      setNodeId(file.id);
      navToFileId(file.id, true);
    }
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteFileOrFolder(file);

    // remove self from files
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
    <div 
      className="file" 
      onClick={handleClick}
    >
      <img 
        src={file.isFile ? fileIcon : folderIcon} 
        alt={file.fileName}
      />
      <div> <p>{file.fileName}</p> </div>
      <button 
        type="button" 
        onClick={handleDelete}
      >
        delete
      </button>
    </div>
  );
}

export default File;
