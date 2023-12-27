import express from 'express';
import cors from 'cors';
import { couchBaseCollection } from './src/config/db_couchbase.js';
import { orbitDBInstance } from './src/config/db_orbitdb.mjs';
// Routes
import notesRoutes from './src/routes/notes.js';

const app = express();
const port = 4000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Rutas
app.use('/notes', notesRoutes);

// Connect to Couchbase and OrbitDB before starting the server
(async () => {
  try {
    const couchbaseCollection = await couchBaseCollection();
    app.set('couchbaseCollection', couchbaseCollection);
    console.log('Connection with Couchbase success');

    // const orbitdb = await orbitDBInstance();
    // app.set('orbitdb', orbitdb);
    // console.log('Connection with OrbitDB success');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
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
