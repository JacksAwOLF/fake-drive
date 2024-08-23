import React, { useState, ReactNode } from 'react';
import { storage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


interface FileUploaderProps {
  children: ReactNode
}

const FileUploader: React.FC<FileUploaderProps> = ({children}) => {

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

    const items = e.dataTransfer.items;
    setUploading(true);

    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) {
        if (item.isFile) {
          const file = await getFile(item);
          await uploadFile(file);
        } else if (item.isDirectory) {
          await traverseDirectory(item);
        }
      }
    }

    setUploading(false);
  };

  const getFile = (entry: any): Promise<File> => {
    return new Promise((resolve, reject) => {
      entry.file((file: File) => resolve(file), (error: any) => reject(error));
    });
  };

  const traverseDirectory = async (directoryEntry: any) => {
    const reader = directoryEntry.createReader();
    let entries: any[] = [];
    let readEntries = await readAllDirectoryEntries(reader);

    while (readEntries.length > 0) {
      entries = entries.concat(readEntries);
      readEntries = await readAllDirectoryEntries(reader);
    }

    for (const entry of entries) {
      if (entry.isFile) {
        const file = await getFile(entry);
        await uploadFile(file);
      } else if (entry.isDirectory) {
        await traverseDirectory(entry);
      }
    }
  };

  const readAllDirectoryEntries = (directoryReader: any) => {
    return new Promise<any[]>((resolve, reject) => {
      directoryReader.readEntries((entries: any[]) => {
        resolve(entries);
      }, (error: any) => reject(error));
    });
  };

  const uploadFile = async (file: File) => {
    const fileRef = ref(storage, `uploads/${file.name}`);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
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
        console.log('File available at', downloadURL);
      }
    );
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