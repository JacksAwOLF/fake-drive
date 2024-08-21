import './App.scss';
import { useEffect, useState } from 'react';
import { getFilesInPath, addFile } from './firebase/firestore.js';
import Popup from './components/popup.js';
import File from './components/File.js';

function App() {
  const params = new URLSearchParams(document.location.search);

  const [path, setPath] = useState(params.get("path") || "/");
  const [files, setFiles] = useState([]);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // update list of files whenever the path updates
  useEffect(() => {
    let isMounted = true;
    console.log("path udpated", path);
    if (path === null) return;

    const loadFiles = async () => {
      const result = await getFilesInPath(path);
    
      if (isMounted) {
        let fileArray = [];
        result.forEach((doc) => fileArray.push(doc.data()));
        setFiles(fileArray);
      }
    }

    loadFiles();
    return () => isMounted = false; // prevents double execution in StrictMode
  }, [path]);

  const handleAddFolder = async () => {
    setShowNewFolder(false);
    setNewFolderName("");
    const newFileData = await addFile(path, newFolderName);
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
