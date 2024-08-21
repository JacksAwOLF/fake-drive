const popupStyle = {
  backgroundColor: "rgba(100, 100, 100, 0.8)",
  position: "absolute",
  width: "100vw",
  height: "100vh",
  top: "0px",
  left: "0px",
}

const contentStyle = {
  borderRadius: "10px",
}

const Popup = (props) => {
  return (
    <> 
      { props.show && 
        <div style={popupStyle}>
          <div style={contentStyle}>
            {props.children}
          </div>
        </div> 
      }
    </>
  );
}

export default Popup;
