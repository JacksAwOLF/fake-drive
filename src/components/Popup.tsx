import React, { CSSProperties, ReactNode } from 'react';

const popupStyle: CSSProperties = {
  backgroundColor: "rgba(100, 100, 100, 0.8)",
  position: "absolute",
  width: "100vw",
  height: "100vh",
  top: "0px",
  left: "0px",
};

const contentStyle: CSSProperties = {
  borderRadius: "10px",
};

interface PopupProps {
  show: boolean;
  children: ReactNode;
}

const Popup: React.FC<PopupProps> = ({ show, children }) => {
  return (
    <>
      {show && (
        <div style={popupStyle}>
          <div style={contentStyle}>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
