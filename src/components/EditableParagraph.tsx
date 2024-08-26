import React, { useState } from 'react';

interface EditableParagraphProps {
  text: string,
  setText: React.Dispatch<React.SetStateAction<string>>,
}

const EditableParagraph: React.FC<EditableParagraphProps> = ({text, setText}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  // Toggle edit mode on and off
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          autoFocus
        />
      ) : (
        <p onClick={handleEdit}>{text}</p>
      )}
    </div>
  );
};

export default EditableParagraph;
