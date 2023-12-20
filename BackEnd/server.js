import express from 'express';
import cors from 'cors';
import { connectCouchbase } from './src/config/db_couchbase.js';
import { connectOrbitDB } from './src/config/db_orbitdb.js';
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
    const couchbaseCollection = await connectCouchbase();
    app.set('couchbaseCollection', couchbaseCollection);

    const orbitdb = await connectOrbitDB();
    app.set('orbitdb', orbitdb);

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
  const packageJson = require('./package.json');

  const apiInfo = {
    version: packageJson.version,
    description: 'API para la aplicación ColabNote',
    author: 'Miguel Pastoriza Santaclara',
    status: 'running',
  };

  res.json(apiInfo);
});
