import './App.scss';
import React, { useEffect, useState } from 'react';
import { getFiles, addNewFolder, FileMetadata } from './models/FileMetadata';
import Popup from './components/Popup';
import File from './components/File';

const App: React.FC = () => {
  const params = new URLSearchParams(document.location.search);

  const [nodeId, setNodeId] = useState<string>(params.get("nodeID") || "");
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [showNewFolder, setShowNewFolder] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");

  // update list of files whenever the path updates
  useEffect(() => {
    let isMounted = true;

    const loadFiles = async () => {
      const result = await getFiles(nodeId);
      if (isMounted) {
        setFiles(result);
      }
    }

    loadFiles();
    return () => { isMounted = false; }; // prevents double execution in StrictMode
  }, [nodeId]);

  const handleAddFolder = async () => {
    setShowNewFolder(false);
    setNewFolderName("");
    const newFileData = await addNewFolder(nodeId, newFolderName);
    setFiles((prevFiles) => [...prevFiles, newFileData]);
  }

  return (
    <>
      <div className="container">

        <div className="sidebar">
          <></>
        </div>

        <div className="header">
          <button onClick={() => setShowNewFolder(true)}>
            New Folder
          </button>
          <button>
            Add File
          </button>
        </div>

        <div className="dragarea">
          {files.map((file, ind) => 
            <File 
              key={ind} 
              file={file} 
              setNodeId={setNodeId}
            />)}
        </div>

      </div>

      <Popup show={showNewFolder}>
        <input 
          type="text" 
          value={newFolderName} 
          onChange={(e) => setNewFolderName(e.target.value)} 
        />
        <input 
          type="submit" 
          onClick={handleAddFolder} 
        />
      </Popup>
    </>
  );
}

export default App;
