// notesController.js

import { couchBaseCollection } from '../config/db_couchbase.js';
import { orbitDBInstance } from '../config/db_orbitdb.mjs';


export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log(`Nueva nota: ${title} - ${content}`);

    // Conectar a Couchbase
    const collection = await couchBaseCollection();

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
    const collection = await couchBaseCollection();

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
    const noteId = req.params.id;

     // Conectar a Couchbase
     const collection = await couchBaseCollection();

     // Obtener y mostrar el contenido del documento de Couchbase
     const result = await collection.get(noteId);
     const couchbaseContent = result.content;

    console.log(couchbaseContent)

    //Configuramos las opciones de la base de datos
    const optionsToWrite = {
      accessController: {
        type: 'orbitdb',
        write: ['*'],
      }
    }

    // Creamos la base de datos
    const orbitdb = await orbitDBInstance();
    const db = await orbitdb.docs(noteId, optionsToWrite); 
    await db.load();

    const db_address = db.address.toString();
    console.log(`Base de datos creada: ${db_address}`);

    // Añadimos el documento a la base de datos
    const newNote = { _id: noteId, title: couchbaseContent.title, content: couchbaseContent.content };
    const hash = await db.put(newNote);

    console.log(`Nuevo dato publicado en la base de datos: ${hash}`);

    db.close()

    res.json({ orbitDB_database: db_address });
  } catch (error) {
    console.error('Error al compartir la nota en OrbitDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const getSharedNote = async (req, res) => {
  try {
    const dbAddress = req.params.dbAddress;
    const noteId = req.params.noteId;

    // Nos conectamos a la base de datos OrbitdB
    const orbitdb = await orbitDBInstance();
    const db = await orbitdb.open(dbAddress);
    await db.load();
    console.log(`Conectado a la base de datos: ${db.address.toString()}`);
    
    let datos =""
    datos = await db.get('');

    // Replicamos los valores que hay en ella
    db.events.on('replicate', () => {
      console.log('Replicando cambios...');
    });
    
    await db.events.on('replicated', () => {
      console.log('Cambios replicados con éxito.');
      datos = db.get('');
      console.log(datos)
    });

    db.close()

    res.json({ orbitDB_database: datos });
  } catch (error) {
    console.error('Error al compartir la nota en OrbitDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};