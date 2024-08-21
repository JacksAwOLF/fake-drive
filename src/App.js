import './App.scss';
import { useEffect, useState } from 'react';

function App() {

  const params = new URLSearchParams(document.location.search);
  const path = params.get("path");
  
  useEffect(() => {
    console.log("load webpage path is ", path);

    
  }, []);

  

  return (
    <>
      <div className="container">
        <div className="sidebar">
          
        </div>
        <div className="header">
          <button>
            New Folder
          </button>
        </div>
        <div className="dragarea">

        </div>
      </div>
    </>
  );
}

export default App;
