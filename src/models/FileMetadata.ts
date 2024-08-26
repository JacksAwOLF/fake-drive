import { db } from '../firebase/config';
import { 
  addDoc, collection, getDocs, updateDoc,
  query, where, doc, getDoc, deleteDoc,
  Timestamp, serverTimestamp, orderBy, FieldValue
 } from "firebase/firestore";

const fileMetadataCollection = collection(db, "fileMetadata");

export interface FileMetadata {
  id: string,
  parentId: string,
  fileName: string,
  isFile: boolean,
  contentLink: string,
  createdAt?: FieldValue,
};

export const driveRoot = {
  id: '',
  parentId: '',
  fileName: 'My Drive Root',
  isFile: false,
  contentLink: ''
}

export async function deleteFile(id: string) {
  const docRef = doc(fileMetadataCollection, id);
  await deleteDoc(docRef);
}

export async function checkFileExist(id: string): Promise<boolean> {
  const docRef = doc(fileMetadataCollection, id);
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.exists();
}

export async function getAncestors(nodeId: string): Promise<FileMetadata[]> {
  let ancestors = [];  
  let curNode = nodeId;

  while (curNode !== '') {
    const docRef = doc(fileMetadataCollection, curNode);
    const docSnapshot = await getDoc(docRef);
    
    ancestors.push({
      id: docSnapshot.id,
      ...(docSnapshot.data() as Omit<FileMetadata, 'id'>)
    });
    
    curNode = (docSnapshot.data())!.parentId;
  }
  ancestors.push(driveRoot);

  
  return ancestors;
}


export async function getFiles(parentId: string): 
  Promise<FileMetadata[]> {
  const querySnapshot = await getDocs(query(
    fileMetadataCollection, 
    where("parentId", "==", parentId), 
    orderBy("createdAt", "asc")
  ));
  
  const files: FileMetadata[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<FileMetadata, 'id'>)
  }));

  return files;
}

export async function addNewFile(
  parentId: string, folderName: string, isFile: boolean
): Promise<FileMetadata> {

  const newFileData: Omit<FileMetadata, 'id'> = {
    contentLink: "",
    isFile: isFile,
    parentId: parentId,
    fileName: folderName,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(fileMetadataCollection, newFileData);

  return {
    id: docRef.id,
    ...newFileData
  };
}

export async function updateContentLink(fileId: string, contentLink: string) {
  const docRef = doc(fileMetadataCollection, fileId);
  await updateDoc(docRef, {
    contentLink: contentLink
  });
}

export async function updateFilename(fileId: string, fileName: string) {
  const docRef = doc(fileMetadataCollection, fileId);
  await updateDoc(docRef, {
    fileName: fileName
  });
}

export async function updateParentId(fileId: string, parentId: string) {
  const docRef = doc(fileMetadataCollection, fileId);
  await updateDoc(docRef, {
    parentId: parentId
  });
}