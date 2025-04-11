// Importar Firebase
import { db } from '../firebase/config'
import { collection, doc, getDoc, getDocs, updateDoc, setDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore'

class TableroService {
  constructor() {
    this.salasCollection = collection(db, 'salas')
  }

  // ========================
  // 🚀 Funciones de gestión de cartas
  // ========================

  async fetchCartas() {
    const cartasSnapshot = await getDocs(collection(db, 'cartasUNO'))
    return cartasSnapshot.docs.map(doc => doc.data())
  }

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
      juegoComenzado: true,
      turnoActual: jugadores[0]?.id_jugador || null
    })

    await this.inicializarMazos(roomCode, jugadores, cartasParaRobar, cartasPorJugador, cartaInicial)

    return { cartasParaRobar, cartasPorJugador }
  }

  async inicializarMazos(roomCode, jugadores, cartasParaRobar, cartasPorJugador, cartaInicial) {
    const mazosCollection = collection(db, `salas/${roomCode}/mazos`)

    await setDoc(doc(mazosCollection, 'mazorobar'), {
      cantidad: cartasParaRobar.length,
      cartas: cartasParaRobar
    })

    await setDoc(doc(mazosCollection, 'mazopartida'), {
      cantidad: 1,
      cartas: [cartaInicial]
    })

    for (const jugador of jugadores) {
      await setDoc(doc(mazosCollection, `mazojugador_${jugador.id_jugador}`), {
        id_jugador: jugador.id_jugador,
        cantidad: 7,
        cartas: cartasPorJugador[jugador.id_jugador] || []
      })
    }
  }

  esCartaValida(cartaActual, cartaNueva) {
    if (!cartaActual || !cartaNueva) return false
    return (
      cartaNueva.color === cartaActual.color ||
      cartaNueva.valor === cartaActual.valor ||
      cartaNueva.color === 'negro'
    )
  }

  async actualizarMazoRobarYJugador(roomCode, idJugador) {
    const mazorobarRef = doc(db, `salas/${roomCode}/mazos/mazorobar`)
    const mazojugadorRef = doc(db, `salas/${roomCode}/mazos/mazojugador_${idJugador}`)

    const mazorobarDoc = await getDoc(mazorobarRef)
    const mazojugadorDoc = await getDoc(mazojugadorRef)

    if (mazorobarDoc.exists() && mazojugadorDoc.exists()) {
      const datosMazorobar = mazorobarDoc.data()
      const datosMazoJugador = mazojugadorDoc.data()

      if (datosMazorobar.cantidad > 0 && datosMazorobar.cartas.length > 0) {
        const cartaRobada = datosMazorobar.cartas.pop()

        await updateDoc(mazorobarRef, {
          cantidad: datosMazorobar.cantidad - 1,
          cartas: datosMazorobar.cartas
        })
        await updateDoc(mazojugadorRef, {
          cantidad: datosMazoJugador.cantidad + 1,
          cartas: arrayUnion(cartaRobada)
        })
      } else {
        throw new Error('No hay más cartas para robar.')
      }
    }
  }

  async actualizarMazoJugadorYPartida(roomCode, idJugador, cartaJugado) {
    const mazopartidaRef = doc(db, `salas/${roomCode}/mazos/mazopartida`)
    const mazojugadorRef = doc(db, `salas/${roomCode}/mazos/mazojugador_${idJugador}`)

    const mazopartidaDoc = await getDoc(mazopartidaRef)
    const mazojugadorDoc = await getDoc(mazojugadorRef)

    if (mazopartidaDoc.exists() && mazojugadorDoc.exists()) {
      const datosMazopartida = mazopartidaDoc.data()
      const datosMazoJugador = mazojugadorDoc.data()

      await updateDoc(mazopartidaRef, {
        cantidad: datosMazopartida.cantidad + 1,
        cartas: arrayUnion(cartaJugado)
      })

      await updateDoc(mazojugadorRef, {
        cantidad: datosMazoJugador.cantidad - 1,
        cartas: arrayRemove(cartaJugado)
      })
    }
  }

  async loadCartasJugador(roomCode, idJugador) {
    const mazojugadorRef = doc(db, `salas/${roomCode}/mazos/mazojugador_${idJugador}`)
    const mazojugadorSnap = await getDoc(mazojugadorRef)

    if (mazojugadorSnap.exists()) {
      const data = mazojugadorSnap.data()
      return data.cartas || []
    }
    return []
  }

  async loadCartasMesa(roomCode) {
    const mazopartidaRef = doc(db, `salas/${roomCode}/mazos/mazopartida`)
    const mazopartidaSnap = await getDoc(mazopartidaRef)

    if (mazopartidaSnap.exists()) {
      const data = mazopartidaSnap.data()
      return data.cartas || []
    }
    return []
  }

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
  // 🎯 Funciones de ayuda
  // ========================

  clonarCartaConColor(carta, color) {
    const copia = { ...carta }
    copia.color = color
    return copia
  }

  async jugarCarta(roomCode, userId, cartaParaMostrar, cartaParaEliminar) {
    const cartaFinal = cartaParaEliminar || cartaParaMostrar
    await this.actualizarMazoJugadorYPartida(roomCode, userId, cartaFinal)
  }

  async jugarComodinConColor(roomCode, userId, cartaOriginal, color, jugadores) {
    const cartaConColor = this.clonarCartaConColor(cartaOriginal, color)
    await this.jugarCarta(roomCode, userId, cartaConColor, cartaOriginal)
    await this.actualizarColorUltimaCartaMazopartida(roomCode, color) // 🔥 Aquí nuevo
    await this.pasarTurno(jugadores, userId, roomCode)
  }

  async actualizarColorUltimaCartaMazopartida(roomCode, nuevoColor) {
    const mazopartidaRef = doc(db, `salas/${roomCode}/mazos/mazopartida`)
    const mazopartidaDoc = await getDoc(mazopartidaRef)

    if (mazopartidaDoc.exists()) {
      const data = mazopartidaDoc.data()
      const cartas = data.cartas || []

      if (cartas.length > 0) {
        const ultimaCarta = { ...cartas[cartas.length - 1] }
        ultimaCarta.color = nuevoColor

        cartas[cartas.length - 1] = ultimaCarta

        await updateDoc(mazopartidaRef, {
          cartas: cartas
        })
      }
    }
  }

  // ========================
  // 🔥 Listeners en tiempo real
  // ========================

  escucharMazoJugador(roomCode, userId, callback) {
    const mazojugadorRef = doc(db, `salas/${roomCode}/mazos/mazojugador_${userId}`)
    return onSnapshot(mazojugadorRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        callback(data.cartas || [])
      }
    })
  }

  escucharMazoPartida(roomCode, callback) {
    const mazopartidaRef = doc(db, `salas/${roomCode}/mazos/mazopartida`)
    return onSnapshot(mazopartidaRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        callback(data.cartas || [])
      }
    })
  }
}

export const tableroService = new TableroService()
