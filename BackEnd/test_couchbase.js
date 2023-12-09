async function main() {
  try {
    // Conectarse a Couchbase
    const cluster = await couchbase.connect(
      'couchbase://127.0.0.1',
      {
        username: 'miguel',
        password: 'abc123.',
      }
    );

    // Obtener el bucket por defecto
    const bucket = cluster.bucket('colabnotes_bucket');

    // Obtener la colección por defecto del bucket
    const coll = bucket.defaultCollection();

    // Insertar un documento en el bucket
    await coll.upsert('testdoc', { foo: 'bar' });

    // Obtener y mostrar el contenido del documento
    const res = await coll.get('testdoc');
    console.log('Contenido del documento:', res.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecutar la función principal
main()
  .then(() => {
    console.log('Éxito!');
  })
  .catch((err) => {
    console.log('ERR:', err);
  });

