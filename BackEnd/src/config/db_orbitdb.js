// db_orbitdb.js

import * as IPFS from 'ipfs-core';
import { createOrbitDB, OrbitDBAccessController } from '@orbitdb/core';

let ipfsInstance; // Variable para almacenar la instancia de IPFS
let orbitDBInstance; // Variable para almacenar la instancia de OrbitDB
let orbitDBLock = false; // Variable de bloqueo para gestionar el acceso a OrbitDB

// Función para crear o devolver la instancia de IPFS
const getIPFSInstance = async () => {
  if (!ipfsInstance) {
    try {
      ipfsInstance = await IPFS.create();
    } catch (error) {
      console.error('Error al crear la instancia de IPFS:', error);
      throw error;
    }
  }
  return ipfsInstance;
};

// Función para conectar a OrbitDB
const connectOrbitDB = async () => {
  try {
    if (orbitDBLock) {
      console.log('Otra instancia de OrbitDB ya está en proceso. Esperando...');
      while (orbitDBLock) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    orbitDBLock = true; // Adquirir el bloqueo

    if (!orbitDBInstance) {
      const ipfs = await getIPFSInstance(); // Obtener la instancia de IPFS
      const orbitdb = await createOrbitDB({ ipfs });
      orbitDBInstance = await orbitdb.open("couchbase_orbitdb");
    }

    return orbitDBInstance;
  } catch (error) {
    console.error('Error de conexión a OrbitDB:', error);
    throw error;
  } finally {
    orbitDBLock = false; // Liberar el bloqueo después de la operación
  }
};

export { connectOrbitDB, getIPFSInstance };
