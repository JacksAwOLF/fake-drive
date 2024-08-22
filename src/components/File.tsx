import { useState } from 'react';
import { FileMetadata } from '../models/FileMetadata';

interface FileProps {
  file: FileMetadata
  setNodeId: React.Dispatch<React.SetStateAction<string>>;
}

const File: React.FC<FileProps> = ({ file, setNodeId }) => {

  const handleClick = () => {
    setNodeId(file.id);
  }

  return (
    <>
      <button onClick={handleClick}>
        {file.fileName}
      </button>
      <br />
    </>
  );
}

export default File;
