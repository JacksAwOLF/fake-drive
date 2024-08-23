import { useState } from 'react';
import { FileMetadata } from '../models/FileMetadata';

interface FileProps {
  file: FileMetadata
  setNodeId: React.Dispatch<React.SetStateAction<string>>;
}

const nodeIdURLParam = "nodeId";

const File: React.FC<FileProps> = ({ file, setNodeId }) => {

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
