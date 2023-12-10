// Editor.js
import React, { useState } from 'react';
import Markdown from 'marked-react';
import apiService from '../../services/api';
import './Editor.css';

const Editor = ({ selectedFile }) => {
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const handleEditChange = (event) => {
    setEditedContent(event.target.value);
  };

  const renderContent = () => {
    return (
      <Markdown>
        {editing ? editedContent : selectedFile?.content || ''}
      </Markdown>
    );
  };

  const saveContent = async () => {
    try {
      // Llama a la función de guardar en el servicio API
      const respuesta = await apiService.crearNota('titulo','# hola');
      console.log(respuesta)
    } catch (error) {
      console.error('Error al guardar el contenido:', error.message);
    }
  };

  return (
    <div className="editor">
      <h2>{selectedFile || 'Selecciona un archivo'}</h2>
      {renderContent()}
      {editing && (
        <div>
          <textarea
            placeholder="Escribe tu código aquí"
            value={editedContent}
            onChange={handleEditChange}
          ></textarea>
          <div className="editor-buttons">
            <button onClick={saveContent}>Guardar</button>
          </div>
        </div>
      )}
      <div className="editor-buttons">
        <button onClick={toggleEditing}>{editing ? 'Cancelar' : 'Editar'}</button>
      </div>
    </div>
  );
};

export default Editor;
