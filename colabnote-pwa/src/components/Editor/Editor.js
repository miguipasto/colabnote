// Editor.js
import React, { useState, useEffect } from 'react';
import Markdown from 'marked-react';
import apiService from '../../services/api';
import './Editor.css';

const Editor = ({ selectedNote }) => {
  const [note, setNote] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        if (selectedNote) {
          const response = await apiService.getNote(selectedNote._id);
          if (response && response.data) {
            setNote(response.data.note);
            setEditedContent(response.data.note.content);
          }
        }
      } catch (error) {
        console.error('Error al obtener el contenido de la nota:', error.message);
      }
    };

    fetchNote();
  }, [selectedNote]);

  const handleEditChange = (event) => {
    setEditedContent(event.target.value);
  };

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const saveContent = async () => {
    try {
      await apiService.updateNote(note._id, note.title, editedContent, note.shared);
      const updatedNoteResponse = await apiService.getNote(note._id); // Refetch the updated note
      if (updatedNoteResponse && updatedNoteResponse.data) {
        setNote(updatedNoteResponse.data.note);
        setEditedContent(updatedNoteResponse.data.note.content);
      }
      setEditing(false);
    } catch (error) {
      console.error('Error al guardar el contenido:', error.message);
    }
  };

  return (
    <div className={`editor ${editing ? 'editing' : ''}`}>
      {note ? (
        <>
          <h2>{note.title}</h2>
          {editing ? (
            <textarea
              value={editedContent}
              onChange={handleEditChange}
              placeholder="Edita tu nota aquí"
              rows={10}
              cols={50}
            />
          ) : (
            <Markdown>{note.content}</Markdown>
          )}
          <div className="editor-buttons">
            {editing && (
              <button className="save-button" onClick={saveContent}>
                Guardar
              </button>
            )}
            <button className="edit-button" onClick={toggleEditing}>
              {editing ? 'Cancelar' : 'Editar'}
            </button>
          </div>
        </>
      ) : (
        <p>Selecciona una nota</p>
      )}
    </div>
  );
};

export default Editor;
