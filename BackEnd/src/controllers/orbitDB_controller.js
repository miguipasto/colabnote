import { orbitDBInstance } from '../config/db_orbitdb.mjs';
import * as CouchBaseProcedures from './couchBase_controller.js';

const optionsToWrite = {
  accessController: {
    type: 'orbitdb',
    write: ['*'],
  }
}

export const shareNote = async (note) => {
  try {
    const orbitdb = await orbitDBInstance();
    const db = await orbitdb.docs(note._id , optionsToWrite); 
    await db.load();

    const db_address = db.address.toString();
    console.log(`[OrbitDb] : Base de datos creada: ${db_address}`);

    let datos = { _id: note._id, title: note.title, content: note.content};
    db.put(datos);

    console.log(`[OrbitDb] : Nuevo dato publicado en la base de datos: ${db_address}`);

    // Actualizamos la entrada en CouchBase
    note.shared = db_address
    await CouchBaseProcedures.updateNote(note)

    db.events.on('replicate', () => {
    });

    db.events.on('replicated', () => {
      datos = db.get('');
      console.log('[OrbitDb] :  Nuevos cambios replicados con éxito\n' + datos);
      updateSharedNote(null,db_address);
    });

    return db_address;
  } catch (error) {
    console.log('[OrbitDb] : Error al compartir la nota en OrbitDB:', error);
    throw error; 
  }
}

export const getsharedNote = async (db_address) => {
  try {
    const orbitdb = await orbitDBInstance();
    const db = await orbitdb.open(db_address);
    await db.load();
    console.log(`[OrbitDb] : Conexión correcta a la base de datos: ${db_address}`);

    let datos = await db.get('');

    if (datos.length === 0) {
      try {
        const newNote = { _id: 'Node 2', title: 'Set Up Connection', content: 'Trying to replicate Database' };
        await db.put(newNote);
      } catch {
        await db.load();
        datos = await db.get('');
      }

      db.events.on('replicate', () => {
      });

      await new Promise((resolve) => {
        db.events.on('replicated', () => {
          datos = db.get('');
          console.log('[OrbitDb] :  Nuevos cambios replicados con éxito\n' + datos);
          resolve(); 
        });
      });
    }

    return datos[0];
  } catch (error) {
    console.log('Error al recuperar la nota en OrbitDB:', error);
    throw error;
  }
}

export const updateSharedNote = async (note, db_address) => {
  try {
    const orbitdb = await orbitDBInstance();
    const db = await orbitdb.open(db_address);
    await db.load();
    console.log(`[OrbitDb] : Conexión correcta a la base de datos: ${db.address.toString()}`);

    let datos = "";
    if (note) {
      datos = { _id: note.id, title: note.title, content: note.content};
      db.put(datos);
    } else {
      datos = db.get('');
    }

    db.events.on('replicate', () => {
    });

    db.events.on('replicated', () => {
      datos = db.get('');
      console.log('[OrbitDb] :  Nuevos cambios replicados con éxito\n' + datos);
    });

    return { db_address: db_address, note: datos[0] };
  } catch (error) {
    console.log('Error al actualizar la nota en OrbitDB:', error);
    throw error;
  }
}
