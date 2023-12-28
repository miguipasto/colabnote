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
    console.log("Conectado a IPFS")

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
        console.log(datos)

        // Añadimos el documento a la base de datos
        const newNote = { _id: note.id, title: note.title, content: note.content};
        db.put(newNote);

        db.close()

    });
    
    return db_address;

}

export const getsharedNote = async (db_address) => {
  
  // Creamos la instancia de orbitdb
  const orbitdb = await orbitDBInstance();

    const db = await orbitdb.open(db_address);
    await db.load();
    console.log(`Conectado a la base de datos: ${db.address.toString()}`);

    let datos = await db.get('');

    // Indicamos que estamos conectados
    if(datos.length == 0){
      const newNote = { _id: 'a', title: "Connected", content: "From Node 2" };
      await db.put(newNote);

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

    db.close();

    return datos;
}