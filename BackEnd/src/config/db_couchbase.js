import couchbase from 'couchbase';

// Variable para almacenar la instancia del cluster Couchbase
let cluster;

// Función para establecer una conexión a Couchbase
export const couchBaseConnection = async () => {
  try {
    // Verificar si ya estamos conectados antes de intentar nuevamente
    if (!cluster) {
      // Conectarse a Couchbase con la información de conexión
      cluster = await couchbase.connect(
        'couchbase://127.0.0.1', 
        {
          username: 'Administrator',
          password: 'admin123',
        }
      );
    }
    return cluster;
  } catch (error) {
    console.error('Error de conexión a Couchbase:', error);
    throw error;
  }
};

// Función para obtener el bucket de Couchbase
export const couchBaseBucket = async () => {
  try {
    // Obtener la instancia del cluster
    const connectedCluster = await couchBaseConnection();

    // Obtener el bucket específico (en este caso, 'colabnote_bucket')
    const bucket = connectedCluster.bucket('colabnote_bucket');

    return bucket;
  } catch (error) {
    console.error('Error al obtener el bucket de Couchbase:', error);
    throw error;
  }
};

// Función para obtener la colección predeterminada de Couchbase
export const couchBaseCollection = async () => {
  try {
    // Obtener el bucket de Couchbase
    const bucket = await couchBaseBucket();

    // Obtener la colección predeterminada del bucket
    const collection = bucket.defaultCollection();

    return collection;
  } catch (error) {
    console.error('Error al obtener la colección de Couchbase:', error);
    throw error;
  }
};
