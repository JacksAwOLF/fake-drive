import './App.scss';
import React, { useEffect, useState } from 'react';
import { getFiles, addNewFolder, FileMetadata } from './models/FileMetadata';
import Popup from './components/Popup';
import File from './components/File';
import FileUploader from './components/FileUploader';

const nodeIdURLParam = "nodeId";

const App: React.FC = () => {
  const url = new URL(window.location.href); 

  const [nodeId, setNodeId] = useState<string>(url.searchParams.get(nodeIdURLParam) || "");
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

        // update url
        // if (nodeId !== "") {
        //   url.searchParams.set(nodeIdURLParam, nodeId);
        //   const newURL = url.pathname + '?' + url.searchParams.toString();
        //   console.log("pushing state", nodeId);
        //   window.history.pushState({nodeId: nodeId}, '', newURL);
        // }
      }
    }

    loadFiles();
    return () => { isMounted = false; }; // prevents double execution in StrictMode
  }, [nodeId]);

  // enable browswer backbutton event
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setNodeId(event.state.nodeId);
      }
    };

    const newURL = url.pathname + '?' + url.searchParams.toString();
    window.history.replaceState({nodeId: nodeId}, '', );

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

        <FileUploader>
          {files.map((file, ind) => 
            <File 
              key={ind} 
              file={file} 
              setNodeId={setNodeId}
            />)}
        </FileUploader>

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
