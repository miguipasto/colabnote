import { orbitDBInstance } from '../config/db_orbitdb.mjs';
import * as CouchBaseProcedures from './couchBase_controller.js'

const optionsToWrite = {
    accessController: {
      type: 'orbitdb',
      write: ['*'],
    }
  }


  export const shareNote = async (note) => {
  
    // Creamos la base de datos
    const orbitdb = await orbitDBInstance();
    console.log("Conectado a IPFS")

    const db = await orbitdb.docs(note.id , optionsToWrite); 
    await db.load();

    // Guardamos la dirección IPFS de la base de datos
    const db_address = db.address.toString();
    console.log(`Base de datos creada: ${db_address}`);

    // Añadimos el documento a la base de datos
    let datos = { _id: note.id, title: note.title, content: note.content};
    db.put(datos);

    // Esperamos los datos
    db.events.on('replicate', () => {
      console.log('Replicando cambios...');
    });
    
    // Creamos una promesa para esperar hasta que los cambios se repliquen
    db.events.on('replicated', () => {
      console.log('Cambios replicados con éxito.');
      datos = db.get('');
    });


    //db.close();

    return { db_address : db_address, note: datos};
}

export const getsharedNote = async (db_address) => {
  //Creamos una instancia de orbitdb
  const orbitdb = await orbitDBInstance();
  const db = await orbitdb.open(db_address);
  await db.load();
  console.log(`Conectado a la base de datos: ${db.address.toString()}`);

  let datos = await db.get('');

  // Indicamos que estamos conectados
  if(datos.length == 0){
    try{
      const newNote = { _id: 'Node 2', title: "Set Up Connection", content: "Trying to replicate Database" };
      await db.put(newNote);
    }catch {
      await db.load();
      datos = await db.get('');
    }
    
    // Esperamos los datos
    db.events.on('replicate', () => {
      console.log('Replicando cambios...');
    });
    
    // Creamos una promesa para esperar hasta que los cambios se repliquen
    await new Promise((resolve) => {
      db.events.on('replicated', () => {
        console.log('Cambios replicados con éxito.');
        datos = db.get('');
        console.log(datos);
        
        resolve(); 
      });
    });
  }
  //db.close()

  return datos;
}



export const updateSharedNote = async (note,db_address) => {
  
  //Creamos una instancia de orbitdb
  //console.log(note)
  const orbitdb = await orbitDBInstance();
  const db = await orbitdb.open(db_address);
  await db.load();
  console.log(`Conectado a la base de datos: ${db.address.toString()}`);

  let datos = ""
  if(note){
      // Añadimos el documento a la base de datos
    datos = { _id: note.id, title: note.title, content: note.content};
    db.put(datos);
  }else{
    datos = db.get('');
  }
   
   // Esperamos los datos
   db.events.on('replicate', () => {
     console.log('Replicando cambios...');
   });
   
   // Creamos una promesa para esperar hasta que los cambios se repliquen
   db.events.on('replicated', () => {
     console.log('Cambios replicados con éxito.');
     datos = db.get('');
     console.log(datos)
     CouchBaseProcedures.updateNote(datos[0]._id, datos[0].title, datos[0].content, datos[0].shared);
   });

   return { db_address : db_address, note: datos[0]};
}