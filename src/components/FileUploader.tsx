import React, { useState, ReactNode } from 'react';
import { storage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addNewFile, addNewFolder } from '../models/FileMetadata';


interface FileUploaderProps {
  parentId: string,
  children: ReactNode
}

const FileUploader: React.FC<FileUploaderProps> = ({parentId, children}) => {

  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    setUploading(true);

    const items = e.dataTransfer.items;
    let entries = [];
    for (const item of items) {
      if (item)
        entries.push(item.webkitGetAsEntry());
    }

    traverseEntryList(entries, parentId);
    setUploading(false);
  };

  const traverseEntryList = async (entries: (FileSystemEntry | null)[], parId: string) => {
    for (const entry of entries) {
      if (entry === null) continue;

      if (entry.isFile) {
        console.log("file", entry);
        const file = await getFile(entry);
        const ret = await uploadFile(file, parId);
        console.log("uploaded", ret);
      } 
      else if (entry.isDirectory) {
        console.log("folder", entry);
        const folder = await addNewFolder(parId, entry.name);
        const directoryEntry = await readDirectoryEntry(entry as FileSystemDirectoryEntry);
        await traverseEntryList(directoryEntry, folder.id);
      }
    }
  };

  const getFile = (entry: any): Promise<File> => {
    return new Promise((resolve, reject) => {
      entry.file((file: File) => resolve(file), (error: any) => reject(error));
    });
  };

  const uploadFile = async (file: File, parentId: string) => {
    const fileRef = ref(storage, `uploads/${file.name}`);

    const uploadTask = uploadBytesResumable(fileRef, file);

    return uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log(file.name, 'available at', downloadURL);
        addNewFile(parentId, file.name, downloadURL);
        return downloadURL;
      }
    );
  };

  const readDirectoryEntry = async (entry: FileSystemDirectoryEntry) => {
    const reader = entry.createReader();
    let entries: any[] = [];
    let readEntries = await readAllDirectoryEntries(reader);

    while (readEntries.length > 0) {
      entries = entries.concat(readEntries);
      readEntries = await readAllDirectoryEntries(reader);
    }

    return entries;
  }

  const readAllDirectoryEntries = (directoryReader: any) => {
    return new Promise<any[]>((resolve, reject) => {
      directoryReader.readEntries((entries: any[]) => {
        resolve(entries);
      }, (error: any) => reject(error));
    });
  };

  

  return (
    <div 
      className="dragarea"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? 'green' : 'gray'}`
      }}
    >
      {uploading ? (
        <div>Uploading... {uploadProgress.toFixed(2)}%</div>
      ) : (
        <div>Drag and drop files here to upload</div>
      )}

      {children}
    </div>
  )
}

export default FileUploader;