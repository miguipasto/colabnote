import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onFileSelect }) => {
  const files = ['index.html', 'styles.css', 'script.js'];

  return (
    <div className="sidebar">
      <h2>Explorer</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index} onClick={() => onFileSelect(file)}>
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
