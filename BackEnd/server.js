import express from 'express';
import cors from 'cors';
import { couchBaseConnection } from './src/config/db_couchbase.js';
import { setUpIPFSDaemon } from './src/config/db_orbitdb.mjs'

// Routes
import notesRoutes from './src/routes/notes.js';

const app = express();
const port = 4000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Rutas
app.use('/notes', notesRoutes);

// Iniciamos la conexión con la base de datos couchbase
(async () => {
  try {
    const couchBaseCluster = await couchBaseConnection();
    console.log('Connection with Couchbase success');

    const ipfsDaemon = await setUpIPFSDaemon();
    console.log('IPFS daemon iniciado');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Manejar la terminación del servidor para cerrar el daemon de IPFS
    process.on('SIGINT', () => {
      console.log('Cerrando el daemon de IPFS...');
      ipfsDaemon.kill();
      process.exit(0);
    });

  } catch (error) {
    console.error('Error de conexión:', error);
    process.exit(1);
  }
})(); 

// Middleware para la ruta /api
app.use('/api', (req, res) => {

  const apiInfo = {
    description: 'API para la aplicación ColabNote',
    author: 'Miguel Pastoriza Santaclara',
    status: 'running',
  };

  res.json(apiInfo);
});
