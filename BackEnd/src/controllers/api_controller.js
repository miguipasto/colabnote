import * as CouchBaseProcedures from './couchBase_controller.js';
import * as OrbitDBProcedures from './orbitDB_controller.js';

// Ruta para obtener todas las notas guardadas
export const getNotesSaved = async (req, res) => {
  try {
    // Obteniendo datos de notas desde Couchbase
    const notesData = await CouchBaseProcedures.getNotesSaved();
    
    // Respondiendo con los datos de las notas
    res.json({ message: 'Notas recuperadas exitosamente', data: { notesData } });
  } catch (error) {
    console.error('Error al obtener las notas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Ruta para obtener una nota específica por su ID
export const getNote = async (req, res) => {
  try {
    // Obteniendo el ID de la nota desde los parámetros de la solicitud
    const note_id = req.params.id;

    // Obteniendo la nota desde Couchbase
    const note = await CouchBaseProcedures.getNote(note_id);
    
    // Respondiendo con la nota recuperada
    res.json({ message: 'Nota recuperada exitosamente', data: { note } });
  } catch (error) {
    console.error('Error al obtener la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Ruta para crear una nueva nota
export const createNote = async (req, res) => {
  try {
    // Extrayendo datos de la solicitud
    let { title, content, note_id } = req.body;

    // Generando un ID para la nota si no se proporciona
    if (!note_id) {
      note_id = `note_${Date.now()}`;
    }
    
    // Creando la nota en Couchbase
    await CouchBaseProcedures.createNote(note_id, title, content, false); 
    
    // Respondiendo con un mensaje de éxito y el ID de la nota
    res.status(201).json({ message: 'Nota creada exitosamente', data: { note_id } });
  } catch (error) {
    console.error('Error al crear la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Ruta para actualizar una nota existente
export const updateNote = async (req, res) => {
  try {
    // Obteniendo el ID de la nota desde los parámetros de la solicitud
    const note_id = req.params.id;
    
    // Obteniendo datos de la solicitud
    const { title, content, shared } = req.body;
    
    // Creando un objeto con los datos de la nota a actualizar
    const note_to_update = { _id: note_id, title: title, content: content, shared: shared }
    
    // Verificando si se comparte la nota en OrbitDB
    if (note_to_update.shared != false) {
      await OrbitDBProcedures.updateSharedNote(note_to_update, shared);
    } else {
      // Actualizando la nota en Couchbase
      await CouchBaseProcedures.updateNote(note_to_update);
    }

    // Respondiendo con un mensaje de éxito y el ID de la nota
    res.status(201).json({ message: 'Nota actualizada correctamente', data: { note_id } });
  } catch (error) {
    console.error('Error al actualizar la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Ruta para compartir una nota en OrbitDB
export const shareNote = async (req, res) => {
  try {
    // Obteniendo el ID de la nota desde los parámetros de la solicitud
    const note_id = req.params.id;

    // Obteniendo la nota desde Couchbase
    const note = await CouchBaseProcedures.getNote(note_id);
    
    // Compartiendo la nota en OrbitDB y obteniendo la dirección de la base de datos
    const db_address = await OrbitDBProcedures.shareNote(note);
    
    // Respondiendo con un mensaje de éxito y la dirección de la base de datos
    res.status(201).json({ message: 'Note compartida correctamente', data: { db_address } });
  } catch (error) {
    console.error('Error al compartir la nota en OrbitDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Ruta para obtener una nota compartida desde OrbitDB
export const getSharedNote = async (req, res) => {
  try {
    // Obteniendo la dirección OrbitDB y el ID de la nota desde los parámetros de la solicitud
    const orbit_address = req.params.orbit_address;
    const note_id = req.params.id;

    // Construyendo la dirección completa de la base de datos en OrbitDB
    const db_address = `${orbit_address}/${note_id}`;
    
    // Obteniendo la nota compartida desde OrbitDB y creándola en Couchbase
    const note_shared = await OrbitDBProcedures.getSharedNote(db_address);
    await CouchBaseProcedures.createNote(note_id, note_shared.title, note_shared.content, orbit_address);

    // Respondiendo con un mensaje de éxito y la nota compartida
    res.status(201).json({ message: 'Note compartida recuperada con éxito', data: { note_shared } }); 
  } catch (error) {
    console.error('Error al recuperar la nota en OrbitDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Ruta para eliminar una nota
export const deleteNote = async (req, res) => {
  try {
    // Obteniendo el ID de la nota desde los parámetros de la solicitud
    const note_id = req.params.id;

    // Eliminando la nota en Couchbase
    await CouchBaseProcedures.deleteNote(note_id);

    // Respondiendo con un mensaje de éxito y el ID de la nota eliminada
    res.status(200).json({ message: 'Nota eliminada correctamente', data: { note_id } });
  } catch (error) {
    console.error('Error al eliminar la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
