import React from "react";

const CharacterCounter = ({
  limit,
  placeholder,
  value,
  onChange,
  isTextArea,
  name,
}) => {
  return (
    <div className="flex flex-col">
      {isTextArea ? (
        <textarea
          className="border rounded p-2 mb-2"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          rows="4"
        />
      ) : (
        <input
          type="text"
          className="border rounded p-2 mb-2"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
        />
      )}
      <div className="text-right text-[0.7em] text-gray-600">
        {value.length}/{limit} characters
      </div>
      {value.length >= limit && (
        <div className="text-red-500 text-xs">Character limit reached!</div>
      )}
    </div>
  );
};

export default CharacterCounter;
