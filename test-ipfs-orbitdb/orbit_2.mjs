import * as IPFS from 'ipfs-http-client';
import OrbitDB from 'orbit-db'

const main = async () => {
  
  // Configuraciones de IPFS
  const ipfsOptions = {
    EXPERIMENTAL: {
      pubsub: true
    },
  }

  //Nos conectamos la instancia local de IPFS daemon
  const ipfs = await IPFS.create(ipfsOptions)

  //Creamos una instancia de orbitdb
  const orbitdb = await OrbitDB.createInstance(ipfs);

  //Configuramos la instancia
  const optionsToWrite = {
    accessController: {
      type: 'orbitdb', 
      write: ['*'],
    }
  }
  
  // Creamos la bsae de datos
  const db = await orbitdb.open('/orbitdb/zdpuAzV3L5NSovdmhkXqKqZc8o3mAZMYZMof14J6Y8tG7bxxR/note_1703708080037"');
  await db.load();
  console.log(`Conectado a la base de datos: ${db.address.toString()}`);

  const datos = db.get('zdpuApounySe7VnVyRsiaknarM6KH4RjUSwjbVN4hB5wC1qaW');
  console.log(datos)

  db.events.on('replicate', () => {
    console.log('Replicando cambios...');
  });
  
  db.events.on('replicated', () => {
    console.log('Cambios replicados con éxito.');
    const datos = db.get('');
    console.log(datos)
  });
  
  db.events.on('write', (address, entry) => {
    console.log(`Nuevo dato escrito: ${address}`);
    console.log(entry.payload.value);
  });
  
  // // Añade un nuevo documento a la base de datos
  // const newData = { _id: 'valor', otraClave: 'valor desde 2' };
  // const hash = await db.put(newData);

  // console.log(`Nuevo dato publicado en la base de datos: ${hash}`);

};

main();
