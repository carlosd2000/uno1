// Importamos la configuración de Firebase
import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'

class TableroService {
  constructor() {
    this.salasCollection = collection(db, 'salas') // Referencia a la colección de salas
  }

  /**
   * Buscar la sala en la que está un usuario.
   * @param {string} userId - ID del usuario (Firebase Auth UID)
   * @returns {Promise<string|null>} - Devuelve el roomCode de la sala o null si no está en ninguna.
   */
  async findSalaByUserId(userId) {
    try {
      const salasSnapshot = await getDocs(this.salasCollection)

      for (const salaDoc of salasSnapshot.docs) {
        const salaRef = salaDoc.ref
        const jugadoresCollection = collection(salaRef, 'jugadores')
        const jugadoresSnapshot = await getDocs(jugadoresCollection)

        // Verificar si el jugador está en esta sala
        const jugador = jugadoresSnapshot.docs.find(doc => doc.data().id_user === userId)
        if (jugador) {
          return salaDoc.id // Retorna el roomCode
        }
      }

      // No encontró ninguna sala
      return null
    } catch (error) {
      console.error('Error buscando la sala del usuario:', error)
      throw error
    }
  }
}

// Exportamos una instancia lista para usar en el proyecto
export const tableroService = new TableroService()
