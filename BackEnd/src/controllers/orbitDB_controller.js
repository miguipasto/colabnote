import { orbitDBInstance } from '../config/db_orbitdb.mjs';
import * as CouchBaseProcedures from './couchBase_controller.js';

// Opciones para escritura en OrbitDB
const optionsToWrite = {
  accessController: {
    type: 'orbitdb',
    write: ['*'],
  }
}

// Función para compartir una nota en OrbitDB
export const shareNote = async (note) => {
  try {
    // Obtener la instancia de OrbitDB
    const orbitdb = await orbitDBInstance();
    
    // Crear una base de datos de documentos en OrbitDB
    const db = await orbitdb.docs(note._id, optionsToWrite); 
    await db.load();

    // Obtener la dirección de la base de datos en OrbitDB
    const db_address = db.address.toString();
    console.log(`[OrbitDb] : Base de datos creada: ${db_address}`);

    // Crear un objeto con los datos de la nota
    let datos = { _id: note._id, title: note.title, content: note.content };
    
    // Almacenar la nota en la base de datos en OrbitDB
    db.put(datos);

    console.log(`[OrbitDb] : Nuevo dato publicado en la base de datos: ${db_address}`);

    // Actualizar la entrada en CouchBase con la dirección de la base de datos compartida
    note.shared = db_address
    await CouchBaseProcedures.updateNote(note)

    // Configurar eventos para la replicación en OrbitDB
    db.events.on('replicate', () => {
    });

    // Configurar eventos para la replicación exitosa en OrbitDB
    db.events.on('replicated', () => {
      // Obtener los datos replicados y mostrarlos en la consola
      datos = db.get('');
      console.log('[OrbitDb] : Nuevos cambios replicados con éxito');
      console.log(datos[0]);
      // Llamar a la función updateSharedNote con los nuevos datos
      updateSharedNote(null, db_address);
    });

    // Devolver la dirección de la base de datos en OrbitDB
    return db_address;
  } catch (error) {
    console.log('[OrbitDb] : Error al compartir la nota en OrbitDB:', error);
    throw error; 
  }
}

// Función para obtener una nota compartida desde OrbitDB
export const getSharedNote = async (db_address) => {
  try {
    // Obtener la instancia de OrbitDB
    const orbitdb = await orbitDBInstance();
    
    // Abrir la base de datos en OrbitDB usando la dirección proporcionada
    const db = await orbitdb.open(db_address);
    await db.load();

    console.log(`[OrbitDb] : Conexión correcta a la base de datos: ${db_address}`);

    // Obtener los datos de la base de datos
    let datos = await db.get('');

    // Verificar si la base de datos está vacía
    if (datos.length === 0) {
      try {
        // Si está vacía, agregar una nueva nota de conexión
        const newNote = { _id: 'Node 2', title: 'Set Up Connection', content: 'Trying to replicate Database' };
        await db.put(newNote);
      } catch {
        // En caso de error, recargar la base de datos y volver a obtener los datos
        await db.load();
        datos = await db.get('');
      }

      // Configurar eventos para la replicación en OrbitDB
      db.events.on('replicate', () => {
      });

      // Configurar eventos para la replicación exitosa en OrbitDB usando una promesa
      await new Promise((resolve) => {
        db.events.on('replicated', () => {
          // Obtener los datos replicados y mostrarlos en la consola
          datos = db.get('');
          console.log('[OrbitDb] : Nuevos cambios replicados con éxito');
          console.log(datos[0]);
          resolve(); 
        });
      });
    } else {
      console.log('[OrbitDb] : Nuevos cambios replicados con éxito');
      console.log(datos[0]);
    }

    // Devolver la primera nota de la base de datos (si existe)
    return datos[0];
  } catch (error) {
    console.log('Error al recuperar la nota en OrbitDB:', error);
    throw error;
  }
}

// Función para actualizar una nota compartida en OrbitDB
export const updateSharedNote = async (note, db_address) => {
  try {
    // Obtener la instancia de OrbitDB
    const orbitdb = await orbitDBInstance();
    
    // Abrir la base de datos en OrbitDB usando la dirección proporcionada
    const db = await orbitdb.open(db_address);
    await db.load();
    console.log(`[OrbitDb] : Conexión correcta a la base de datos: ${db.address.toString()}`);

    let datos = "";
    
    // Verificar si se proporciona una nota para actualizar
    if (note) {
      // Crear un objeto con los datos de la nota
      datos = { _id: note.id, title: note.title, content: note.content };
      // Almacenar la nota actualizada en la base de datos en OrbitDB
      db.put(datos);
    } else {
      // Si no se proporciona una nota, obtener los datos de la base de datos
      datos = db.get('');
    }

    // Configurar eventos para la replicación en OrbitDB
    db.events.on('replicate', () => {
    });

    // Configurar eventos para la replicación exitosa en OrbitDB
    db.events.on('replicated', () => {
      // Obtener los datos replicados y mostrarlos en la consola
      datos = db.get('');
      console.log('[OrbitDb] : Nuevos cambios replicados con éxito\n' + datos);
    });

    // Devolver la dirección de la base de datos y la primera nota (si existe)
    return { db_address: db_address, note: datos[0] };
  } catch (error) {
    console.log('Error al actualizar la nota en OrbitDB:', error);
    throw error;
  }
}
