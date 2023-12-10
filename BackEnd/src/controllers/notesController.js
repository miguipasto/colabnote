/*const { connectCouchbase, connectOrbitDB } = require('../config/db');

exports.createNote = async (req, res) => {
  try {
    const { title, content, share } = req.body;

    // Conectar a Couchbase
    const collection = await connectCouchbase();

    // Insertar un documento en el bucket de Couchbase
    const documentId = `note_${Date.now()}`;
    await collection.upsert(documentId, { title, content });

    if (share) {
      // Conectar a OrbitDB
      const orbitdb = await connectOrbitDB();

      // Crear o abrir una base de datos en modo local
      const db = await orbitdb.docs('colabnotes_database', { create: true });

      // Insertar un documento en la base de datos de OrbitDB
      await db.put({ _id: documentId, title, content });
    }

    res.status(201).json({ message: 'Note created successfully ' + documentId });
  } catch (error) {
    console.error('Error al crear la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getNote = async (req, res) => {
  try {
    const documentId = req.params.id;

    // Conectar a Couchbase
    const collection = await connectCouchbase();

    // Obtener y mostrar el contenido del documento de Couchbase
    const result = await collection.get(documentId);
    const couchbaseContent = result.content;

    // Conectar a OrbitDB
    const orbitdb = await connectOrbitDB();

    // Crear o abrir una base de datos en modo local
    const db = await orbitdb.docs('colabnotes_database');

    // Obtener el contenido del documento de OrbitDB
    const orbitdbResult = await db.get(documentId);
    const orbitdbContent = orbitdbResult ? orbitdbResult.content : null;

    res.json({ couchbaseContent, orbitdbContent });
  } catch (error) {
    console.error('Error al obtener la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
*/

const { connectCouchbase } = require('../config/db');
exports.createNote = async (req, res) => {
  try {
    
    const { title, content } = req.body;
    console.log("Nueva nota" + title +content);
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

exports.getNote = async (req, res) => {
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