
import { storage } from '../firebase/config';
import { getStorage, ref, deleteObject } from "firebase/storage";

export async function deleteFileFromStorage(downloadURL: string) {

  const url = new URL(downloadURL);
  const filePath = decodeURIComponent(url.pathname.split('/o/')[1]);
  const fileRef = ref(storage, filePath);

  try {
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}