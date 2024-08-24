import React from 'react';
import { navToFileId } from '../util/windowHistory';
import { FileMetadata } from '../models/FileMetadata';

interface AncestorListProps {
  nodeId: string,
  setNodeId: React.Dispatch<React.SetStateAction<string>>;
  fileList: FileMetadata[];
}

const AncestorList: React.FC<AncestorListProps> = 
  ({nodeId, setNodeId, fileList}) => {

  const handleClick = (fileId: string) => {
    if (fileId !== nodeId) {
      setNodeId(fileId);
      navToFileId(fileId, true);
    }
  }

  return (
    <>
      <p>Click to navigate</p>
      {[...fileList].reverse().map(file => 
        <div key={file.id}>
          <button 
            type="button" 
            onClick={() => handleClick(file.id)}
          >
            {file.fileName}
          </button>
          <br />
        </div>
      )}
    </>
  )
}

export default AncestorList;