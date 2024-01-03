import * as IPFS from 'ipfs-http-client';
import OrbitDB from 'orbit-db'

// Función para obtener una instancia de OrbitDB conectada a IPFS
const orbitDBInstance = async () => {
  try {
    // Configuraciones de IPFS, habilitando la característica experimental de pubsub
    const ipfsOptions = {
      EXPERIMENTAL: {
        pubsub: true
      },
    }
    
    // Nos conectamos a la instancia local de IPFS daemon
    const ipfs = await IPFS.create(ipfsOptions)
    
    // Creamos una instancia de OrbitDB utilizando la instancia de IPFS
    const orbitdb = await OrbitDB.createInstance(ipfs);

    // Devolvemos la instancia de OrbitDB
    return orbitdb;

  } catch (error) {
    console.error('Error de conexión a IPFS:', error);
    throw error;
  }
};

export { orbitDBInstance };
