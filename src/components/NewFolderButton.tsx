import React, { useState } from 'react';
import { FileMetadata, addNewFile } from '../models/FileMetadata';

interface NewFolderButtonProps {
  nodeId: string,
  setFiles: React.Dispatch<React.SetStateAction<FileMetadata[]>>;
}

const NewFolderButton: React.FC<NewFolderButtonProps> = 
  ({nodeId, setFiles}) => {

  const [newFolderName, setNewFolderName] = useState<string>("");

  const handleAddFolder = async () => {
    if (newFolderName === "") {
      console.log("new folder name cannot be blank");
      return;
    }

    const newFileData = await addNewFile(nodeId, newFolderName, false);
    setFiles((prevFiles) => [...prevFiles, newFileData]);
    setNewFolderName("");
  }

  return (
    <>
      <input 
        type="text" 
        value={newFolderName} 
        onChange={(e) => setNewFolderName(e.target.value)} 
        placeholder="New folder name"
      />
      <button onClick={() => handleAddFolder()}>
        Add Folder
      </button>
    </>
  )
}

export default NewFolderButton;