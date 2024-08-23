import { CSSProperties, useState } from 'react';
import { FileMetadata } from '../models/FileMetadata';
import fileIcon from '../imgs/file.png';
import folderIcon from '../imgs/folder.png';

interface FileProps {
  file: FileMetadata
  setNodeId: React.Dispatch<React.SetStateAction<string>>;
}

const nodeIdURLParam = "nodeId";

const containerStyle: CSSProperties  = {
  border: "1px solid white",
  borderRadius: "0px",
  display: "inline-block"
}

const imgStyle: CSSProperties = {
  width: "100px",
  height: "100px"
}

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
    <div style={containerStyle} onClick={handleClick}>
      <img 
        src={file.isFile ? fileIcon : folderIcon} 
        alt={file.fileName} 
        style={imgStyle}
      />
      <p> {file.fileName} </p>
    </div>
  );
}

export default File;
