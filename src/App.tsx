import './App.scss';
import React, { useEffect, useState } from 'react';
import { checkFileExist, getFiles, addNewFolder, getAncestors, FileMetadata, driveRoot } from './models/FileMetadata';
import File from './components/File';
import FileUploader from './components/FileUploader';
import { navToFileId } from './util/windowHistory';

const nodeIdURLParam = "nodeId";

const App: React.FC = () => {
  const url = new URL(window.location.href); 

  // id of the current folder we are in. if not in url, set to root
  const [nodeId, setNodeId] = useState<string>(
    url.searchParams.get(nodeIdURLParam) || driveRoot.id);

  // list of files that are shown on screen right now, children of nodeId
  const [files, setFiles] = useState<FileMetadata[]>([]);

  // list of ancestors of currenet folder nodeId
  const [fileList, setFileList] = useState<FileMetadata[]>([]);

  const [newFolderName, setNewFolderName] = useState<string>("");

  useEffect(() => {
    let isMounted = true;   // avoid double mounting on Strict Mode
    const loadFiles = async () => {

      // if url nodeId is invalid, go to root of folder
      if (nodeId !== driveRoot.id) {
        const fileExists = await checkFileExist(nodeId);
        if (isMounted && !fileExists) {
          console.log("invalid nodeid", nodeId);
          setNodeId(driveRoot.id);
          return;
        }
      }

      if (!isMounted) return;
      console.log("loading files for ", nodeId);

      // load list of files that are shown on screen
      getFiles(nodeId).then(result => {
        if (isMounted) setFiles(result);
      });

      // load list of ancestors
      getAncestors(nodeId).then(result => {
        if (isMounted) setFileList(result);
      });
    }

    loadFiles();
    return () => { isMounted = false; }; 
  }, [nodeId]);

  // enable browswer backbutton event on mount
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setNodeId(event.state.nodeId);
      }
    };

    navToFileId(nodeId, false);

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const handleAddFolder = async () => {
    if (newFolderName === "") {
      console.log("new folder name cannot be blank");
      return;
    }

    const newFileData = await addNewFolder(nodeId, newFolderName);
    setFiles((prevFiles) => [...prevFiles, newFileData]);
    setNewFolderName("");
  }

  

  return (
    <div className="container">

      <div className="sidebar">
        {[...fileList].reverse().map(file => 
          <div key={file.id}>
            <button 
              type="button" 
              onClick={() => {
                if (file.id !== nodeId) {
                  setNodeId(file.id);
                  navToFileId(file.id, true);
                }
              }}
            >
              {file.fileName}
            </button>
            <br />
          </div>
        )}
      </div>

      <div className="header">
        <input 
          type="text" 
          value={newFolderName} 
          onChange={(e) => setNewFolderName(e.target.value)} 
          placeholder="New folder name"
        />
        <button onClick={() => handleAddFolder()}>
          Add Folder
        </button>
      </div>

      <FileUploader 
        parentId={nodeId} 
        appendFile={(file) => setFiles((prevFiles) => [...prevFiles, file])}
      >
        {files.map((file, ind) => 
          <File 
            key={ind} 
            file={file} 
            setNodeId={setNodeId}
            setFiles={setFiles}
            setFileList={setFileList}
          />)}
      </FileUploader>

    </div>
  );
}

export default App;
