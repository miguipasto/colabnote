import React from 'react';
import './Sidebar.css';

const Sidebar = ({ notes, onNoteSelect }) => {
  return (
    <div className="sidebar">
      <h2>Explorer</h2>
      <ul>
        {notes.map((note, index) => (
          <li key={index} onClick={() => onNoteSelect(note)}>
            {note.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
