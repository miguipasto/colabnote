import { couchBaseCollection } from '../config/db_couchbase.js';

export const getNote = async (note_id) => {
  try {
    const collection = await couchBaseCollection();

    const result = await collection.get(note_id);
    const couchbaseContent = result.content;

    console.log(`[CouchBase] : Nota recuperada exitosamente: ${note_id}`);

    return couchbaseContent;
  } catch (error) {
    console.log(`[CouchBase] : Error al obtener la nota ${note_id} de Couchbase:`, error);
    throw error;
  }
}

export const creteNote = async (note_id, title, content, shared) => {
  try {
    const collection = await couchBaseCollection();

    await collection.upsert(note_id, { _id: note_id, title, content, shared });

    console.log(`[CouchBase] : Nota creada exitosamente: ${note_id}`);

    return note_id;
  } catch (error) {
    console.log(`[CouchBase] : Error al crear la nota ${note_id} en Couchbase:`, error);
    throw error;
  }
}

export const updateNote = async (note_to_update) => {
  try {
    const collection = await couchBaseCollection();

    await collection.upsert(note_to_update._id, note_to_update);

    console.log(`[CouchBase] : Nota actualizada correctamente: ${note_to_update._id}`);

    return true;
  } catch (error) {
    console.log(`[CouchBase] : Error al actualizar la nota ${note_id} en Couchbase:`, error);
    throw error;
  }
}
