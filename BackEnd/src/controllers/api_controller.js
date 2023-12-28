// notesController.js
import { orbitDBInstance } from '../config/db_orbitdb.mjs';
// Procedimientos Bases de datos
import * as CouchBaseProcedures from './couchBase_controller.js'
import * as OrbitDBProcedures from './orbitDB_controller.js'

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    let note_id = ""
    try{
      note_id= req.body.note_id;
    } catch (error){
      note_id = `note_${Date.now()}`;
    }
    
    await CouchBaseProcedures.creteNote(note_id, title, content, false); 

    console.log(`Nota creada exitosamente: ${note_id}`);
    res.status(201).json({ message: 'Note created successfully', note_id: note_id });
  } catch (error) {
    console.error('Error al crear la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getNote = async (req, res) => {
  try {
    const note_id = req.params.id;

    const note = await CouchBaseProcedures.getNote(note_id);

    console.log(`Nota recuperada exitosamente: ${note_id}`);

    res.json({note: note});
  } catch (error) {
    console.error('Error al obtener la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note_id = req.params.id;
    const { title, content, shared } = req.body;
    
    await CouchBaseProcedures.updateNote(note_id, title, content, shared); 

    console.log(`Nota actualizada correctamente`);
    res.status(201).json({ message: 'Note updated successfully', note_id: note_id });
  } catch (error) {
    console.error('Error al actualizar la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/* OrbitDB */
export const shareNote = async (req, res) => {
  try {
    const note_id = req.params.id;

    // Compartimos la nota en IPFS
    const db_address = await OrbitDBProcedures.shareNote(note_id);

    // Guardamos la base de datos en Couchbase
    await CouchBaseProcedures.updateNote(note_id.id, note_id.title, note_id.content, db_address)

    console.log(`Nuevo dato publicado en la base de datos: ${db_address}`);

    res.json({ orbitDB_database: db_address });
  } catch (error) {
    console.error('Error al compartir la nota en OrbitDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSharedNote = async (req, res) => {
  try {
    const orbit_address = req.params.orbit_address;
    const note_id = req.params.id;

    // Recuperamos la nota de orbitDB
    const db_address = orbit_address + "/" + note_id;
    const note_shared = await OrbitDBProcedures.getSharedNote(db_address);

    // La guardamos en nuestra base de datos local couchbase
    await CouchBaseProcedures.creteNote(note_id, note_shared.title, note_shared.content, db_address);

    console.log("Nueva nota recuperada con éxito:\n" + note_shared);
    res.json({ note: note_shared });    
  } catch (error) {
    console.error('Error al compartir la nota en OrbitDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

