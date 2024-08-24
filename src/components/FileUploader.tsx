import React, { useState, ReactNode } from 'react';
import { storage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FileMetadata, addNewFile, addNewFolder } from '../models/FileMetadata';

interface FileUploaderProps {
  parentId: string,
  children: ReactNode,
  appendFile: (file: FileMetadata) => void;
}

const FileUploader: React.FC<FileUploaderProps> = 
  ({parentId, children, appendFile}) => {

  const [dragging, setDragging] = useState(false);

  // tracker variable, uploading files when > 0
  const [uploading, setUploading] = useState(0);
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
    setUploading(prev => prev + 1);

    const items = e.dataTransfer.items;
    let entries = [];
    for (const item of items) {
      if (item)
        entries.push(item.webkitGetAsEntry());
    }

    await uploadEntries(entries, parentId);
    setUploading(prev => prev - 1);
  };

  // recursive function to upload all folder/files in a list
  const uploadEntries = async (entries: (FileSystemEntry | null)[], parId: string) => {
    for (const entry of entries) {
      if (entry === null) continue;

      if (entry.isFile) {
        // get file from entry, then upload file to storage
        const fileEntry = entry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          await uploadFile(file, parId, parId === parentId);
        }, (error: any) => {
          console.error("error getting file");
        });
      } 

      else if (entry.isDirectory) {
        // create folder entry in firestore and update files
        const folder = await addNewFolder(parId, entry.name);
        if (parId === parentId) {
          appendFile(folder);
        }

        // recurse into the directory DFS style
        const directoryEntry = await readDirectoryEntry(entry as FileSystemDirectoryEntry);
        await uploadEntries(directoryEntry, folder.id);
      }
    }
  };

  const uploadFile = async (file: File, parId: string, updateFiles: boolean) => {
    setUploading(prev => prev + 1);

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
        console.log(file.name, 'available at', downloadURL);
        const newFile = await addNewFile(parId, file.name, downloadURL);
        if (updateFiles) {
          appendFile(newFile);
        }

        setUploading(prev => prev - 1);
      }
    );
  };

  const readDirectoryEntry = async (entry: FileSystemDirectoryEntry) => {

    const readAllDirectoryEntries = (directoryReader: any) => {
      return new Promise<any[]>((resolve, reject) => {
        directoryReader.readEntries((entries: any[]) => {
          resolve(entries);
        }, (error: any) => reject(error));
      });
    };

    const reader = entry.createReader();
    let entries: any[] = [];
    let readEntries = await readAllDirectoryEntries(reader);

    while (readEntries.length > 0) {
      entries = entries.concat(readEntries);
      readEntries = await readAllDirectoryEntries(reader);
    }

    return entries;
  }

  return (
    <div 
      className="fileUploader"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? 'green' : 'gray'}`,
      }}
    >
      <p>
        {uploading > 0 ? 
        `Uploading... ${uploadProgress.toFixed(2)}%` : 
        "Drag and drop files here to upload"}
      </p>

      {/* <div className="files"> */}
        {children}
      {/* </div> */}
    </div>
  )
}

export default FileUploader;