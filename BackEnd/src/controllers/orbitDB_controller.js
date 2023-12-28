import { orbitDBInstance } from '../config/db_orbitdb.mjs';

const optionsToWrite = {
    accessController: {
      type: 'orbitdb',
      write: ['*'],
    }
  }

export const shareNote = async (note) => {
  
    // Creamos la base de datos
    const orbitdb = await orbitDBInstance();
    const db = await orbitdb.docs(note.id , optionsToWrite); 
    await db.load();

    // Guardamos la dirección IPFS de la base de datos
    const db_address = db.address.toString();
    console.log(`Base de datos creada: ${db_address}`);

    // Esperamos la conexión de otro nodo
    db.events.on('replicate', () => {
    console.log('Esperando conexiones');
    });
    
    // Replicamos el contenido
    db.events.on('replicated', () => {
        console.log('Nueva conexion');

        // Verificamos quien se ha conectado
        const datos = db.get('');
        console.log(datos[0])

        // Añadimos el documento a la base de datos
        const newNote = { _id: note.id, title: note.title, content: note.content};
        db.put(newNote);

    });

    db.close();

    return db_address;
}

export const getsharedNote = async (db_address) => {
  
    // Creamos la instancia de orbitdb
    const orbitdb = await orbitDBInstance();

    const db = await orbitdb.open(dbAddress);
    await db.load();
    console.log(`Conectado a la base de datos: ${db.address.toString()}`);

    // Indicamos que estamos conectados
    const newNote = { _id: noteId, title: "Connected", content: "From Node 2" };
    await db.put(newNote);

    // Esperamos los datos
    let datos = ""
    db.events.on('replicate', () => {
      console.log('Replicando cambios...');
    });
    
    db.events.on('replicated', () => {
      console.log('Cambios replicados con éxito.');
      datos = db.get('');
      console.log(datos)

      db.close();
      return datos;   
    });

    return db_address;
}