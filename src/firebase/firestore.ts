// import { db } from './config';
// import { 
//   addDoc, collection, getDocs,
//   query, where, setDoc, doc
//  } from "firebase/firestore";

// const fileMetadataCollection = collection(db, "files");

// const getFilesInPath = async (parentPath) => {
//   const q = query(
//     fileMetadataCollection, 
//     where("parentPath", "==", parentPath)
//   );

//   const querySnapshot = await getDocs(q);
//   return querySnapshot;
// }

// const addFile = async (parentPath, fileName) => {
//   const newFileData = {
//     contentLink: "",
//     isFile: false,
//     parentPath: parentPath,
//     fileName: fileName
//   };

//   await addDoc(fileMetadataCollection, newFileData);
//   return newFileData;
// }

// export { getFilesInPath, addFile }
