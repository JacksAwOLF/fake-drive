import './App.scss';
import React, { useEffect, useState } from 'react';
import { getFiles, addNewFolder, FileMetadata } from './models/FileMetadata';
import Popup from './components/Popup';
import File from './components/File';

const App: React.FC = () => {
  const params = new URLSearchParams(document.location.search);

  const [path, setPath] = useState<string>(params.get("path") || "/");
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [showNewFolder, setShowNewFolder] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");

  // update list of files whenever the path updates
  useEffect(() => {
    let isMounted = true;
    console.log("path updated", path);
    if (path === null) return;

    const loadFiles = async () => {
      const result = await getFiles(path);
    
      if (isMounted) {
        setFiles(result);
      }
    }

    loadFiles();
    return () => { isMounted = false; }; // prevents double execution in StrictMode
  }, [path]);

  const handleAddFolder = async () => {
    setShowNewFolder(false);
    setNewFolderName("");
    const newFileData = await addNewFolder(path, newFolderName);
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
              fileName={file.fileName} 
              setPath={setPath} 
            />)}
        </div>

      </div>

      {/* Uncomment and use Popup as needed */}
      {/* <Popup show={showNewFolder}>
        <input 
          type="text" 
          value={newFolderName} 
          onChange={(e) => setNewFolderName(e.target.value)} 
        />
        <input 
          type="submit" 
          onClick={handleAddFolder} 
        />
      </Popup> */}
    </>
  );
}

export default App;
