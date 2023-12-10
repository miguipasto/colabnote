import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Editor from './components/Editor/Editor';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="app-container">
      <Sidebar onFileSelect={handleFileSelect} />
      <Editor selectedFile={selectedFile} />
    </div>
  );
}

export default App;
