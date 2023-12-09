const { connectCouchbase } = require('../config/db');

exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const documentId = `note_${Date.now()}`;

    const collection = await connectCouchbase();

    // Insertar un documento en el bucket
    await collection.upsert(documentId, { title, content });

    res.status(201).json({ message: 'Note created successfully ' + documentId });
  } catch (error) {
    console.error('Error al crear la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getNote = async (req, res) => {
  try {
    const documentId = req.params.id;

    const collection = await connectCouchbase();

    // Obtener y mostrar el contenido del documento
    const result = await collection.get(documentId);
    res.json(result.content);
  } catch (error) {
    console.error('Error al obtener la nota:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
