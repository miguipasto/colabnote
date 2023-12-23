// orbit.mjs
import * as IPFS from 'ipfs-core';

async function connectNodes() {
  const node = await IPFS.create();

  // Conectar al primer nodo
  await node.swarm.connect('/ip4/91.116.194.130/tcp/4001');

  // Conectar al segundo nodo
  await node.swarm.connect('/ip4/83.37.111.89/tcp/4001');

  // Esperar un tiempo para permitir que se establezcan las conexiones
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Imprimir información sobre los pares conectados
  const peers = await node.swarm.peers();
  console.log('Peers conectados:', peers.map(peer => peer.addr.toString()));
}

connectNodes();
