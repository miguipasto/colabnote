import * as IPFS from 'ipfs-http-client';
import OrbitDB from 'orbit-db'

const orbitDBInstance = async () => {
  try {

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

    return orbitdb

  } catch (error) {
    console.error('Error de conexión a IPFS:', error);
    throw error;
  }
};


export { orbitDBInstance };
