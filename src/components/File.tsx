import { useEffect, useState } from 'react';
import { FileMetadata, deleteFile, getFiles, updateFilename } from '../models/FileMetadata';
import fileIcon from '../imgs/file.png';
import folderIcon from '../imgs/folder.png';
import { deleteFileFromStorage } from '../models/fileStorage';
import { navToFileId } from '../util/windowHistory';
import EditableParagraph from './EditableParagraph';

interface FileProps {
  file: FileMetadata;
  setNodeId: React.Dispatch<React.SetStateAction<string>>;
  setFiles: React.Dispatch<React.SetStateAction<FileMetadata[]>>;
  setFileList: React.Dispatch<React.SetStateAction<FileMetadata[]>>;
}

const File: React.FC<FileProps> = 
  ({ file, setNodeId, setFiles, setFileList }) => {

  const [text, setText] = useState(file.fileName);

  useEffect(() => {

    const updateFile = async () => {

      console.log("updating file name");

      // update filename in files list
      setFiles((prevFiles) => {
        return prevFiles.map(curFile => {
          if (curFile.id === file.id) {
            curFile.fileName = text;
          }
          return curFile;
        })
      });

      // update firestore
      await updateFilename(file.id, text);
    };

    if (text !== file.fileName) {
      updateFile();
    }
    
  }, [text]);

  const handleClickImage = () => {
    if (file.isFile) {
      // open up download link
      window.open(file.contentLink, "_blank");
    } else {
      // go inside folder
      setNodeId(file.id);
      navToFileId(file.id, true);
    }
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteFileOrFolder(file);

    // remove self from files
    setFiles((prevFiles) => prevFiles.filter(prevFile => prevFile.id !== file.id));
  }

  const deleteFileOrFolder = async (file: FileMetadata) => {

    // if folder, recurse into every file in the folder
    if (!file.isFile) {
      const filesInFolder = await getFiles(file.id);
      for (const nextFile of filesInFolder) {
        deleteFileOrFolder(nextFile);
      }
    }

    // if file, remove stored data from firebase storage
    else {
      deleteFileFromStorage(file.contentLink);
    }
    
    // delete the file itself
    deleteFile(file.id)
  }

  

  return (
    <div 
      className="file" 
    >
      <img 
        src={file.isFile ? fileIcon : folderIcon} 
        alt={file.fileName}
        onClick={handleClickImage}
      />
      
      <EditableParagraph 
        text={text}
        setText={setText}
      />
      <button 
        type="button" 
        onClick={handleDelete}
      >
        delete
      </button>
    </div>
  );
}

export default File;
