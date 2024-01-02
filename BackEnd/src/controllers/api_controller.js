import * as CouchBaseProcedures from './couchBase_controller.js';
import * as OrbitDBProcedures from './orbitDB_controller.js';

export const createNote = async (req, res) => {
  try {
    let { title, content, note_id } = req.body;

    if(!note_id){
      note_id = `note_${Date.now()}`;
    }
    
    await CouchBaseProcedures.creteNote(note_id, title, content, false); 
    
    res.status(201).json({ message: 'Nota creada exitosamente', data: { note_id } });
  } catch (error) {
    console.error('Error al crear la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getNote = async (req, res) => {
  try {
    const note_id = req.params.id;

    const note = await CouchBaseProcedures.getNote(note_id);
    
    res.json({ message: 'Nota recuperada exitosamente', data: { note } });
  } catch (error) {
    console.error('Error al obtener la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note_id = req.params.id;
    const { title, content, shared } = req.body;
    
    const note_to_update = {_id: note_id, title: title, content: content, shared: shared}
    
    if(note_to_update.shared!= ""){
      await OrbitDBProcedures.updateSharedNote(note_to_update, shared);
    } else{
      await CouchBaseProcedures.updateNote(note_to_update);
    }

    res.status(201).json({ message: 'Nota actualizada correctamente', data: { note_id} });
  } catch (error) {
    console.error('Error al actualizar la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const shareNote = async (req, res) => {
  try {
    const note_id = req.params.id;

    const note = await CouchBaseProcedures.getNote(note_id)
    const db_address = await OrbitDBProcedures.shareNote(note);
    
    res.status(201).json({ message: 'Note compartida correctamente', data: { db_address} });
  } catch (error) {
    console.error('Error al compartir la nota en OrbitDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSharedNote = async (req, res) => {
  try {
    const orbit_address = req.params.orbit_address;
    const note_id = req.params.id;

    const db_address = orbit_address + "/" + note_id;
    const note_shared = await OrbitDBProcedures.getsharedNote(db_address);

    await CouchBaseProcedures.creteNote(note_id, note_shared.title, note_shared.content, orbit_address);

    res.status(201).json({ message: 'Note compartida recuperada con éxito', data: { note_shared} }); 
  } catch (error) {
    console.error('Error al recuperar la nota en OrbitDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
