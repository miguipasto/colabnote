const express = require('express');
const cors = require('cors');
const { connectCouchbase } = require('./src/config/db');
const app = express();
const port = 4000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to Couchbase before starting the server
(async () => {
  try {
    const collection = await connectCouchbase();

    // Agregar la conexión a la instancia de Express
    app.set('couchbaseCollection', collection);

    // Iniciar el servidor después de conectar a Couchbase
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error de conexión a Couchbase:', error);
    process.exit(1); // Salir del proceso si hay un error en la conexión
  }
})();

// Routes
const notesRoutes = require('./src/routes/notes');
app.use('/notes', notesRoutes);
