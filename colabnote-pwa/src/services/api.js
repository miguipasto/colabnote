// apiService.js
const API_BASE_URL = 'http://localhost:4000';

const apiService = {
  async getNotesSaved() {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/getNotesSaved`);

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

  async getNote(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/getNote/${id}`);

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

  async updateNote(note_id, title, content, shared) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/updateNote/${note_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note_id, title, content, shared }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Error al actualizar la nota: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      throw new Error('Error de red al actualizar la nota');
    }
  },
};

export default apiService;
