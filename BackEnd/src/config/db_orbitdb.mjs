import * as IPFS from 'ipfs-http-client';
import OrbitDB from 'orbit-db'
import { exec } from 'child_process';

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


const setUpIPFSDaemon = async () => {
  try {
    const command = 'ipfs daemon --enable-pubsub-experiment';

    const ipfsDaemonProcess = exec(command);

    ipfsDaemonProcess.stdout.on('data', (data) => {
      console.log(data);
    });

    ipfsDaemonProcess.stderr.on('data', (data) => {
      console.error(data);
    });

    ipfsDaemonProcess.on('exit', (code, signal) => {
      console.log(`IPFS daemon ha salido con código ${code} y señal ${signal}`);
    });

    // Esperar un momento para asegurar que el daemon se haya iniciado
    await new Promise(resolve => setTimeout(resolve, 5000));

    return ipfsDaemonProcess;
  } catch (error) {
    console.error('Error al iniciar IPFS daemon:', error);
    throw error;
  }
};


export { orbitDBInstance, setUpIPFSDaemon };
