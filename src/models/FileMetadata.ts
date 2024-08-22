import { db } from '../firebase/config';
import { 
  addDoc, collection, getDocs,
  query, where, setDoc, doc
 } from "firebase/firestore";

const fileMetadataCollection = collection(db, "fileMetadata");

export interface FileMetadata {
  id: string,
  parentId: string,
  fileName: string,
  isFile: boolean,
  contentLink: string,
};

export async function getFiles(parentId: string): 
  Promise<FileMetadata[]> {
  const querySnapshot = await getDocs(query(
    fileMetadataCollection, 
    where("parentId", "==", parentId)
  ));
  
  const files: FileMetadata[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<FileMetadata, 'id'>)
  }));

  return files;
}

export async function addNewFolder(
  parentId: string, folderName: string
): Promise<FileMetadata> {

  const newFileData: Omit<FileMetadata, 'id'> = {
    contentLink: "",
    isFile: false,
    parentId: parentId,
    fileName: folderName
  };

  const docRef = await addDoc(fileMetadataCollection, newFileData);

  return {
    id: docRef.id,
    ...newFileData
  };
}
