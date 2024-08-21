import { db } from './config';
import { 
  addDoc, collection, getDocs,
  query, where, setDoc, doc
 } from "firebase/firestore"; 

const getFilesInPath = async (parentPath) => {
  const q = query(
    collection(db, "files"), 
    where("parentPath", "==", parentPath)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

const addFile = async (parentPath, fileName) => {
  const newFileData = {
    contentLink: "",
    isFile: false,
    parentPath: parentPath,
    fileName: fileName
  };

  await addDoc(collection(db, "files"), newFileData);
  return newFileData;
}

export { getFilesInPath, addFile }
