// notesController.js

import { connectCouchbase } from '../config/db_couchbase.js';
import { getIPFSInstance, connectOrbitDB } from '../config/db_orbitdb.js';

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log(`Nueva nota: ${title} - ${content}`);

    // Conectar a Couchbase
    const collection = await connectCouchbase();

    // Insertar un documento en el bucket de Couchbase
    const documentId = `note_${Date.now()}`;
    await collection.upsert(documentId, { title, content });

    console.log(`Nota creada exitosamente: ${documentId}`);
    res.status(201).json({ message: 'Note created successfully', note_id: documentId });
  } catch (error) {
    console.error('Error al crear la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getNote = async (req, res) => {
  try {
    const documentId = req.params.id;

    // Conectar a Couchbase
    const collection = await connectCouchbase();

    // Obtener y mostrar el contenido del documento de Couchbase
    const result = await collection.get(documentId);
    const couchbaseContent = result.content;

    console.log(`Nota obtenida exitosamente: ${documentId}`);
    res.json({ couchbaseContent });
  } catch (error) {
    console.error('Error al obtener la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const shareNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    // Obtener la instancia compartida de IPFS
    const ipfs = await getIPFSInstance();

    // Conectar a OrbitDB
    const orbitdb = await connectOrbitDB();

    // Obtener el contenido de la nota desde Couchbase
    const couchbaseCollection = await connectCouchbase();
    const result = await couchbaseCollection.get(noteId);
    const noteContent = result.content;

    // Compartir la nota en OrbitDB
    const hash = await orbitdb.add(noteContent);

    console.log(`Nota compartida en OrbitDB con hash: ${hash}`);
    res.json({ orbitDBHash: hash });
  } catch (error) {
    console.error('Error al compartir la nota en OrbitDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSharedNote = async (req, res) => {
  try {
    const { orbitDBHash } = req.params;

    // Conectar a OrbitDB
    const orbitdb = await connectOrbitDB();

    // Obtener la nota desde OrbitDB utilizando la dirección hash
    const sharedNote = await orbitdb.get(orbitDBHash);

    console.log(`Nota compartida obtenida desde OrbitDB con hash: ${orbitDBHash}`);
    res.json({ sharedNote });
  } catch (error) {
    console.error('Error al obtener la nota compartida desde OrbitDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
