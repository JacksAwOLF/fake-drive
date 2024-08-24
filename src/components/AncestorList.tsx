import React, { useState } from 'react';
import { FileMetadata } from "../models/FileMetadata";
import { navToFileId } from '../util/windowHistory';

interface AncestorNodeProps {
  file: FileMetadata;
  setNodeId: React.Dispatch<React.SetStateAction<string>>;
};

const AncestorNode: React.FC<AncestorNodeProps> = ({file, setNodeId}) => {
  const handleClick = () => {
    setNodeId(file.id);
  }

  return (
    <button type="button" onClick={handleClick}>
      {file.fileName}
    </button>
  );
}

interface AncestorListProps {
  fileList: FileMetadata[];
  setNodeId: React.Dispatch<React.SetStateAction<string>>;
};

const AncestorList: React.FC<AncestorListProps> = 
  ({fileList, setNodeId}) => {

  return (
    <>
      {[...fileList].reverse().map(fileNode => 
        <div key={fileNode.id}>
          <AncestorNode      
            file={fileNode}
            setNodeId={setNodeId}
          />
          <br />
        </div>
      )}
    </>
  )
}

export default AncestorList;