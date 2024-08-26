import './App.scss';
import React, { useEffect, useState } from 'react';
import { checkFileExist, getFiles, getAncestors, FileMetadata, driveRoot } from './models/FileMetadata';
import File from './components/File';
import FileUploader from './components/FileUploader';
import { nodeIdURLParam, usePopState } from './util/windowHistory';
import NewFolderButton from './components/NewFolderButton';
import AncestorList from './components/AncestorList';
import { DragProvider } from './contexts/useDragFileContext';

const App: React.FC = () => {
  const url = new URL(window.location.href); 

  // id of the current folder we are in. if not in url, set to root
  const [nodeId, setNodeId] = useState<string>(
    url.searchParams.get(nodeIdURLParam) || driveRoot.id);

  // list of files that are shown on screen right now, children of nodeId
  const [files, setFiles] = useState<FileMetadata[]>([]);

  // list of ancestors of currenet folder nodeId
  const [fileList, setFileList] = useState<FileMetadata[]>([]);

  // custome hook for browser back/forward buttons
  usePopState(nodeId, setNodeId);

  // fetching data
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

      const fileResult = await getFiles(nodeId);
      if (isMounted) setFiles(fileResult);

      const fileListResult = await getAncestors(nodeId);
      if (isMounted) setFileList(fileListResult);
    }

    loadFiles();
    return () => { isMounted = false; }; 
  }, [nodeId]);

  return (
    <div className="container">

      <div className="sidebar">
        <AncestorList
          nodeId={nodeId}
          fileList={fileList}
          setNodeId={setNodeId}
        />
      </div>

      <div className="header">        
        <NewFolderButton 
          nodeId={nodeId}
          setFiles={setFiles}
        />
      </div>

      <div className="dragarea">
        <DragProvider>
          <FileUploader 
            parentId={nodeId} 
            appendFile={(file) => setFiles((prevFiles) => [...prevFiles, file])}
          >
            
              {files.map(file => 
                <File 
                  key={file.id} 
                  file={file} 
                  setNodeId={setNodeId}
                  setFiles={setFiles}
                  setFileList={setFileList}
                />)}
            
          </FileUploader>
        </DragProvider>
      </div>      

    </div>
  );
}

export default App;
