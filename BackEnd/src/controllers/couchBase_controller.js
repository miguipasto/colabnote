import { couchBaseCollection } from '../config/db_couchbase.js';

export const getNote = async (note_id) => {

    // Conectar a Couchbase
    const collection = await couchBaseCollection();

    // Buscar la nota solicitda
    const result = await collection.get(note_id);
    const couchbaseContent = result.content;

    return couchbaseContent;
}

export const creteNote = async (note_id, title, content, shared) => {
    // Conectar a Couchbase
    const collection = await couchBaseCollection();

    // Creamos una nueva entrada
    await collection.upsert(note_id, { id: note_id, title, content, shared });

    return note_id;
}


export const updateNote = async (note_id, title, content, shared) => {
    // Conectar a Couchbase
    const collection = await couchBaseCollection();

    // Actualizamos la entrada
    await collection.upsert(note_id, { id: note_id, title, content, shared : shared });

    return true;
}