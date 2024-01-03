import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Editor from './components/Editor/Editor';
import apiService from './services/api';

function App() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await apiService.getNotesSaved();

        if (response && response.data) {
          setNotes(response.data.notesData);
        }
      } catch (error) {
        console.error('Error al obtener las notas:', error.message);
      }
    };

    fetchNotes();
  }, []);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
  };

  return (
    <div className="app-container">
      <Sidebar notes={notes} onNoteSelect={handleNoteSelect} />
      <Editor selectedNote={selectedNote} />
    </div>
  );
}

export default App;
