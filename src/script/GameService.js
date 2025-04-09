import { db } from '../firebase/config'
import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot, getDocs, serverTimestamp, deleteDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

class GameService {
  constructor() {
    this.salasCollection = collection(db, 'salas')
    this.auth = getAuth()

    this.roomCode = ''
    this.jugadores = []
    this.userId = ''
    this.loading = false
    this.unsubscribe = null
  }

  // Verificar autenticación
  checkAuth() {
    if (!this.auth.currentUser) {
      throw new Error('Debes estar autenticado para realizar esta acción')
    }
    return this.auth.currentUser
  }

  // Generar código aleatorio de sala
  generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const length = 6
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
  }

  // Crear sala y guardar jugador anfitrión
  async createSala(userId, apodo) {
    this.checkAuth()
    this.loading = true

    try {
      const roomCode = this.generateRoomCode()
      this.roomCode = roomCode
      this.userId = userId

      const salaRef = doc(this.salasCollection, roomCode)
      const jugadoresCollection = collection(salaRef, 'jugadores')

      await setDoc(salaRef, {
        roomCode,
        hostId: userId,
        status: 'waiting',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        jugadorCount: 1,
        maxJugadores: 10
      })

      await setDoc(doc(jugadoresCollection, userId), {
        id_jugador: userId,
        id_user: userId,
        apodo: apodo
      })

      this.loading = false
      return this.roomCode
    } catch (error) {
      console.error('Error al crear la sala:', error)
      this.loading = false
      throw error
    }
  }

  // Unirse a una sala existente
  async joinSala(roomCode, userId, apodo) {
    this.checkAuth()
    this.loading = true

    if (!roomCode || !userId) {
      throw new Error('Código de sala y ID de usuario son requeridos')
    }

    try {
      const salaRef = doc(this.salasCollection, roomCode)
      const salaDoc = await getDoc(salaRef)

      if (!salaDoc.exists()) {
        throw new Error('La sala no existe')
      }

      const salaData = salaDoc.data()

      if (salaData.status !== 'waiting') {
        throw new Error('No puedes unirte a una partida en curso')
      }

      if (salaData.jugadorCount >= salaData.maxJugadores) {
        throw new Error('La sala está llena')
      }

      const jugadoresCollection = collection(salaRef, 'jugadores')
      const jugadoresSnapshot = await getDocs(jugadoresCollection)

      const existingJugador = jugadoresSnapshot.docs.find(doc => doc.data().id_user === userId)
      if (existingJugador) {
        throw new Error('Ya estás en esta sala')
      }

      await setDoc(doc(jugadoresCollection, userId), {
        id_jugador: userId,
        id_user: userId,
        apodo: apodo
      })

      await updateDoc(salaRef, {
        jugadorCount: salaData.jugadorCount + 1,
        updatedAt: serverTimestamp()
      })

      this.roomCode = roomCode
      this.userId = userId
      this.loading = false
    } catch (error) {
      console.error('Error al unirse a la sala:', error)
      this.loading = false
      throw error
    }
  }

  // Iniciar el juego (cambiar estado a "in_progress")
  async startGame(roomCode) {
    this.checkAuth()

    try {
      const salaRef = doc(this.salasCollection, roomCode)
      await updateDoc(salaRef, {
        status: 'in_progress',
        startedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error al iniciar el juego:', error)
      throw error
    }
  }

  // Escuchar en tiempo real los cambios en una sala
  subscribeToSala(roomCode, callback) {
    if (!roomCode || typeof callback !== 'function') {
      throw new Error('Código de sala y callback son requeridos')
    }

    const salaRef = doc(this.salasCollection, roomCode)
    const jugadoresCollection = collection(salaRef, 'jugadores')

    this.unsubscribe = onSnapshot(salaRef, async (salaDoc) => {
      if (!salaDoc.exists()) {
        callback(null)
        return
      }

      try {
        const jugadoresSnapshot = await getDocs(jugadoresCollection)
        this.jugadores = jugadoresSnapshot.docs.map(doc => ({
          ...doc.data(),
          docId: doc.id
        }))

        callback({
          ...salaDoc.data(),
          jugadores: this.jugadores
        })
      } catch (error) {
        console.error('Error al obtener jugadores:', error)
        callback(null)
      }
    }, error => {
      console.error('Error en la suscripción:', error)
      callback(null)
    })

    return () => {
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
      }
    }
  }

  // Cancelar la suscripción a la sala
  cancelSubscription() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }

  // Salir de la sala
  async leaveSala(roomCode, userId) {
    this.checkAuth()

    if (!roomCode || !userId) {
      throw new Error('Código de sala e ID de usuario son requeridos')
    }

    try {
      const salaRef = doc(this.salasCollection, roomCode)
      const jugadoresCollection = collection(salaRef, 'jugadores')
      const jugadorRef = doc(jugadoresCollection, userId)

      await deleteDoc(jugadorRef)

      const salaDoc = await getDoc(salaRef)
      if (salaDoc.exists()) {
        const salaData = salaDoc.data()
        await updateDoc(salaRef, {
          jugadorCount: Math.max(0, salaData.jugadorCount - 1),
          updatedAt: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('Error al salir de la sala:', error)
      throw error
    }
  }
}

export const gameService = new GameService()
