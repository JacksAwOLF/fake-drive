import { useState } from 'react';

interface FileProps {
  fileName: string;
  setPath: React.Dispatch<React.SetStateAction<string>>;
}

const File: React.FC<FileProps> = ({ fileName, setPath }) => {

  const handleClick = () => {
    setPath((prevPath) => prevPath + fileName + "/");
  }

  return (
    <>
      <button onClick={handleClick}>
        {fileName}
      </button>
      <br />
    </>
  );
}

export default File;
