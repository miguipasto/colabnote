import * as CouchBaseConfig from '../config/db_couchbase.js';

// Función para obtener todas las notas guardadas desde Couchbase
export const getNotesSaved = async () => {
  try {
    // Obteniendo la conexión al cluster Couchbase
    const cluster = await CouchBaseConfig.couchBaseConnection();

    // Definiendo la consulta para obtener todas las notas
    const query = `SELECT * FROM colabnote_bucket`;

    // Ejecutando la consulta en el cluster Couchbase
    const result = await cluster.query(query);

    // Extrayendo "id" y "title" de cada documento
    const notesData = result.rows.map(row => {
      return {
        _id: row.colabnote_bucket._id,
        title: row.colabnote_bucket.title
      };
    });
    console.log('[CouchBase] : Notas recuperadas correctamente');
    return notesData;
  } catch (error) {
    console.error('[CouchBase] : Error al obtener las notas de Couchbase:', error);
    throw error;
  }
};

// Función para obtener una nota específica desde Couchbase por su ID
export const getNote = async (note_id) => {
  try {
    // Obteniendo la colección Couchbase
    const collection = await CouchBaseConfig.couchBaseCollection();

    // Obteniendo la nota por su ID
    const result = await collection.get(note_id);
    const couchbaseContent = result.content;

    console.log(`[CouchBase] : Nota recuperada exitosamente: ${note_id}`);
    return couchbaseContent;
  } catch (error) {
    
    console.log(`[CouchBase] : Error al obtener la nota ${note_id} de Couchbase:`, error);
    throw error;
  }
}

// Función para crear una nueva nota en Couchbase
export const createNote = async (note_id, title, content, shared) => {
  try {
    // Obteniendo la colección Couchbase
    const collection = await CouchBaseConfig.couchBaseCollection();

    // Creando la nota en Couchbase
    await collection.upsert(note_id, { _id: note_id, title, content, shared });

    console.log(`[CouchBase] : Nota creada exitosamente: ${note_id}`);
    return note_id;
  } catch (error) {
    console.log(`[CouchBase] : Error al crear la nota ${note_id} en Couchbase:`, error);
    throw error;
  }
}

// Función para actualizar una nota existente en Couchbase
export const updateNote = async (note_to_update) => {
  try {
    // Obteniendo la colección Couchbase
    const collection = await CouchBaseConfig.couchBaseCollection();

    // Actualizando la nota en Couchbase
    await collection.upsert(note_to_update._id, note_to_update);

    console.log(`[CouchBase] : Nota actualizada correctamente: ${note_to_update._id}`);
    return true;
  } catch (error) {
    console.log(`[CouchBase] : Error al actualizar la nota ${note_id} en Couchbase:`, error);
    throw error;
  }
}