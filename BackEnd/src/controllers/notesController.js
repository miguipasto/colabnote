import { connectCouchbase } from '../config/db_couchbase.js';

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log("Nueva nota" + title + content);

    // Conectar a Couchbase
    const collection = await connectCouchbase();

    // Insertar un documento en el bucket de Couchbase
    const documentId = `note_${Date.now()}`;
    await collection.upsert(documentId, { title, content });

    res.status(201).json({ message: 'Note created successfully', note_id : documentId });
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

    res.json({ couchbaseContent });
  } catch (error) {
    console.error('Error al obtener la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
