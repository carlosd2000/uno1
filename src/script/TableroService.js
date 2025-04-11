// Importar Firebase
import { db } from '../firebase/config'
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'

class TableroService {
  constructor() {
    this.salasCollection = collection(db, 'salas') // Referencia a la colección de salas
  }

  // ========================
  // 🚀 Funciones de gestión de cartas
  // ========================

  // Cargar todas las cartas UNO desde Firestore
  async fetchCartas() {
    const cartasSnapshot = await getDocs(collection(db, 'cartasUNO'))
    return cartasSnapshot.docs.map(doc => doc.data())
  }

  // Comenzar el juego: repartir cartas, establecer carta inicial y turno
  async comenzarJuego(jugadores, todasLasCartas, roomCode) {
    if (todasLasCartas.length === 0) {
      throw new Error("No hay cartas disponibles")
    }

    const mazoMezclado = [...todasLasCartas].sort(() => Math.random() - 0.5)
    const cartasPorJugador = {}
    const cartasParaRobar = []

    jugadores.forEach(jugador => {
      cartasPorJugador[jugador.id_jugador] = mazoMezclado.splice(0, 7)
    })

    cartasParaRobar.push(...mazoMezclado)

    const cartaInicial = cartasParaRobar.pop()
    if (!cartaInicial) {
      throw new Error("No se pudo obtener carta inicial")
    }

    const salaRef = doc(this.salasCollection, roomCode)
    await updateDoc(salaRef, {
      mazoRobar: cartasParaRobar,
      mazosPorJugador: cartasPorJugador,
      cartaActual: cartaInicial,
      juegoComenzado: true,
      turnoActual: jugadores[0]?.id_jugador || null
    })
  }

  // Validar si una carta es jugable
  esCartaValida(cartaActual, cartaNueva) {
    if (!cartaActual || !cartaNueva) return false
    return (
      cartaNueva.color === cartaActual.color ||
      cartaNueva.valor === cartaActual.valor ||
      cartaNueva.color === 'negro'
    )
  }

  // Robar una carta del mazo
  async robarCarta(roomCode, userId, mazoRobar, cartasJugadorActual) {
    if (mazoRobar.length === 0) {
      throw new Error('No hay más cartas para robar.')
    }

    const cartaRobada = mazoRobar.pop()
    cartasJugadorActual.push(cartaRobada)

    const salaRef = doc(this.salasCollection, roomCode)
    await updateDoc(salaRef, {
      mazoRobar,
      [`mazosPorJugador.${userId}`]: cartasJugadorActual
    })

    return { cartaRobada, mazoRobar, cartasJugadorActual }
  }

  // Procesar el juego de una carta
  async procesarCarta(roomCode, userId, carta, index, cartasJugadorActual, colorElegido = null) {
    if (colorElegido) {
      carta.color = colorElegido
    }

    cartasJugadorActual.splice(index, 1)

    const salaRef = doc(this.salasCollection, roomCode)

    await updateDoc(salaRef, {
      [`mazosPorJugador.${userId}`]: cartasJugadorActual,
      cartaActual: carta
    })

    if (cartasJugadorActual.length === 0) {
      const jugadorRef = doc(db, `salas/${roomCode}/jugadores/${userId}`)
      await updateDoc(jugadorRef, {
        terminado: true
      })
    }

    return cartasJugadorActual
  }

  // Cambiar turno al siguiente jugador
  async pasarTurno(jugadores, userIdActual, roomCode) {
    const jugadoresOrdenados = jugadores.map(j => j.id_jugador)
    const indiceActual = jugadoresOrdenados.indexOf(userIdActual)
    const siguienteIndice = (indiceActual + 1) % jugadoresOrdenados.length
    const siguienteJugador = jugadoresOrdenados[siguienteIndice]

    const salaRef = doc(this.salasCollection, roomCode)
    await updateDoc(salaRef, {
      turnoActual: siguienteJugador
    })

    return siguienteJugador
  }

  // ========================
  // 🚀 Funciones de búsqueda de sala
  // ========================

  async findSalaByUserId(userId) {
    try {
      const salasSnapshot = await getDocs(this.salasCollection)

      for (const salaDoc of salasSnapshot.docs) {
        const salaRef = salaDoc.ref
        const jugadoresCollection = collection(salaRef, 'jugadores')
        const jugadoresSnapshot = await getDocs(jugadoresCollection)

        const jugador = jugadoresSnapshot.docs.find(doc => doc.data().id_user === userId)
        if (jugador) {
          return salaDoc.id
        }
      }

      return null
    } catch (error) {
      console.error('Error buscando sala del usuario:', error)
      throw error
    }
  }
}

// Exportamos una instancia lista
export const tableroService = new TableroService()
