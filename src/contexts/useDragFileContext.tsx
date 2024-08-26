import React, { ReactNode, createContext, useContext, useState } from 'react';

// Define the shape of the context state
interface DragContextType {
  draggedFileId: string | null;
  setDraggedFileId: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context with default values
const DragContext = createContext<DragContextType | undefined>(undefined);

// Custom hook for using the DragContext
export const useDragContext = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDragContext must be used within a DragProvider');
  }
  return context;
};

interface DragProviderProps {
  children: ReactNode
}

// Provider component
export const DragProvider: React.FC<DragProviderProps> = ({ children }) => {
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null);

  return (
    <DragContext.Provider value={{ draggedFileId, setDraggedFileId }}>
      {children}
    </DragContext.Provider>
  );
};
