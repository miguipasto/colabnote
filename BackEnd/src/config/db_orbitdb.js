import * as IPFS from 'ipfs-core';
import { createOrbitDB, OrbitDBAccessController } from '@orbitdb/core';

const connectOrbitDB = async () => {
  try {
    const ipfs = await IPFS.create();
    const orbitdb = await createOrbitDB({ ipfs });

    const db_orbit = await orbitdb.open("couchbase_orbitdb");

    return db_orbit;
  } catch (error) {
    console.error('Error de conexión a OrbitDB:', error);
    throw error;
  }
};

export { connectOrbitDB };
