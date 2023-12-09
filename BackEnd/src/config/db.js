const couchbase = require('couchbase');

const connectCouchbase = async () => {
  try {
    // Conectarse a Couchbase
    const cluster = await couchbase.connect(
      'couchbase://127.0.0.1',
      {
        username: 'miguel',
        password: 'abc123.',
      }
    );

    // Obtener el bucket 
    const bucket = cluster.bucket('colabnotes_bucket');

    // Obtener la colección del bucket
    const collection = bucket.defaultCollection();

    return collection;
  } catch (error) {
    console.error('Error de conexión a Couchbase:', error);
    throw error;
  }
};

module.exports = { connectCouchbase };
