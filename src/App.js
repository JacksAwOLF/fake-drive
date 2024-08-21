import './App.scss';
import { useEffect, useState } from 'react';
import { getFilesInPath, addFile } from './firebase/firestore.js';
import Popup from './components/popup.js';

function App() {

  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const params = new URLSearchParams(document.location.search);
  const path = params.get("path") || "/";
  
  useEffect(() => {
    const loadFiles = async () => {
      console.log("load webpage path is ", path);

      const result = await getFilesInPath(path);
      console.log(result);
    }

    loadFiles();

    // deal with useEffect cleanup later with useRef
  }, []);

  const handleAddFolder = () => {
    setShowNewFolder(false);
    setNewFolderName("");
    addFile(path, newFolderName);
  }

  return (
    <>
      <div className="container">
        <div className="sidebar">
          
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
          {}
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
