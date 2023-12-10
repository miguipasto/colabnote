// apiService.js
const API_BASE_URL = 'http://127.0.0.1:4000';

const apiService = {
  async crearNota({ title2, content2 }) {
    const title = "titulo";
    const content = "# hola";
    try {
      const response = await fetch(`${API_BASE_URL}/notes/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Error al crear la nota: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      throw new Error('Error de red al crear la nota');
    }
  },

  async obtenerNota(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/get/${id}`);

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Error al obtener la nota: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      throw new Error('Error de red al obtener la nota');
    }
  },

};

export default apiService;
