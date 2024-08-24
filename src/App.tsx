import './App.scss';
import React, { useEffect, useState } from 'react';
import { checkFileExist, getFiles, addNewFolder, getAncestors, FileMetadata, driveRoot } from './models/FileMetadata';
import File from './components/File';
import FileUploader from './components/FileUploader';
import { navToFileId } from './util/windowHistory';
import AncestorList from './components/AncestorList';

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
      if (!isMounted) return;
      console.log("mount");

      // if url nodeId is invalid, go to root of folder
      if (nodeId !== driveRoot.id) {
        const fileExists = await checkFileExist(nodeId);
        if (!fileExists) {
          setNodeId(driveRoot.id);
          return;
        }
      }
      
      navToFileId(nodeId, true);

      // get list of files that are shown on screen
      const result = await getFiles(nodeId);
      setFiles(result);

      // get list of ancestors
      const ancestorList = await getAncestors(nodeId);
      setFileList(ancestorList);
    }

    loadFiles();
    return () => { isMounted = false; }; 
  }, [nodeId]);

  // enable browswer backbutton event
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setNodeId(event.state.nodeId);
        setFileList(prevList => {
          const ind = prevList.findIndex(val => val === event.state.nodeId);
          return prevList.slice(0, ind);
        })
      }
    };

    const newURL = url.pathname + '?' + url.searchParams.toString();
    window.history.replaceState({nodeId: nodeId}, '', );

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleAddFolder = async () => {
    if (newFolderName === "") {
      console.log("new folder name cannot be blank");
      return;
    }

    setNewFolderName("");
    const newFileData = await addNewFolder(nodeId, newFolderName);
    setFiles((prevFiles) => [...prevFiles, newFileData]);
  }

  

  return (
    <div className="container">

      <div className="sidebar">
        <AncestorList 
          fileList={fileList}
          setNodeId={setNodeId}
        />
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
