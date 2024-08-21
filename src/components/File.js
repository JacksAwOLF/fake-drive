import { useState } from 'react';

const File = ({fileName, setPath}) => {

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