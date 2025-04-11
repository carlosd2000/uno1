// tableroService.js
import { db } from '../firebase/config'
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore'

class TableroService {
  constructor() {
    this.salasCollection = collection(db, 'salas')
  }

  // 🔥 Escuchar el mazo de un jugador
  escucharMazoJugador(roomCode, userId, callback) {
    const ref = doc(db, `salas/${roomCode}/mazos/mazojugador_${userId}`)
    return onSnapshot(ref, (snap) => {
      const data = snap.data()
      callback(data?.cartas || [])
    })
  }

  // 🔥 Escuchar el mazo de la partida
  escucharMazoPartida(roomCode, callback) {
    const ref = doc(db, `salas/${roomCode}/mazos/mazopartida`)
    return onSnapshot(ref, (snap) => {
      const data = snap.data()
      callback(data?.cartas || [])
    })
  }

  // 🔥 Traer todas las cartas UNO (una sola vez)
  async fetchCartas() {
    const snapshot = await getDocs(collection(db, 'cartasUNO'))
    return snapshot.docs.map(doc => doc.data())
  }

  // 🔥 Empezar la partida
  async comenzarJuego(jugadores, cartas, roomCode) {
    const mazoMezclado = [...cartas].sort(() => Math.random() - 0.5)
    const cartasPorJugador = {}
    const cartasParaRobar = []

    jugadores.forEach(jugador => {
      cartasPorJugador[jugador.id_jugador] = mazoMezclado.splice(0, 7)
    })
    cartasParaRobar.push(...mazoMezclado)

    const cartaInicial = cartasParaRobar.pop()

    const batch = []

    // Guardar mazo del jugador
    for (const idJugador in cartasPorJugador) {
      const mazoJugadorRef = doc(db, `salas/${roomCode}/mazos/mazojugador_${idJugador}`)
      batch.push(setDoc(mazoJugadorRef, {
        cartas: cartasPorJugador[idJugador],
        cantidad: cartasPorJugador[idJugador].length
      }))
    }

    // Guardar mazo para robar
    const mazoRobarRef = doc(db, `salas/${roomCode}/mazos/mazorobar`)
    batch.push(setDoc(mazoRobarRef, {
      cartas: cartasParaRobar,
      cantidad: cartasParaRobar.length
    }))

    // Guardar mazo de partida
    const mazoPartidaRef = doc(db, `salas/${roomCode}/mazos/mazopartida`)
    batch.push(setDoc(mazoPartidaRef, {
      cartas: [cartaInicial],
      cantidad: 1
    }))

    // Actualizar sala
    const salaRef = doc(db, 'salas', roomCode)
    batch.push(updateDoc(salaRef, {
      juegoComenzado: true,
      turnoActual: jugadores[0]?.id_jugador || null,
      contador: 0
    }))

    await Promise.all(batch)
  }

  // 🔥 Validar si una carta puede ser jugada
  esCartaValida(cartaActual, cartaSeleccionada) {
    if (!cartaActual) return false
    return cartaSeleccionada.color === cartaActual.color || 
           cartaSeleccionada.valor === cartaActual.valor || 
           cartaSeleccionada.color === 'negro'
  }

  // 🔥 Jugar una carta normal
  async jugarCarta(roomCode, userId, carta) {
    const mazoJugadorRef = doc(db, `salas/${roomCode}/mazos/mazojugador_${userId}`)
    const mazoPartidaRef = doc(db, `salas/${roomCode}/mazos/mazopartida`)

    await updateDoc(mazoJugadorRef, {
      cartas: arrayRemove(carta)
    })

    await updateDoc(mazoPartidaRef, {
      cartas: arrayUnion(carta)
    })
  }

  // 🔥 Jugar un comodín y elegir color
  async jugarComodinConColor(roomCode, userId, cartaOriginal, colorNuevo) {
    const cartaConColor = { ...cartaOriginal, color: colorNuevo }
    await this.jugarCarta(roomCode, userId, cartaOriginal)
    await this.actualizarUltimaCartaMazopartida(roomCode, cartaConColor)
  }

  // 🔥 Actualizar el color de la última carta de mazo partida (comodín)
  async actualizarUltimaCartaMazopartida(roomCode, nuevaCarta) {
    const mazoPartidaRef = doc(db, `salas/${roomCode}/mazos/mazopartida`)
    const mazoPartidaSnap = await getDoc(mazoPartidaRef)
    if (mazoPartidaSnap.exists()) {
      const datos = mazoPartidaSnap.data()
      const cartas = datos.cartas || []
      cartas[cartas.length - 1] = nuevaCarta
      await updateDoc(mazoPartidaRef, { cartas })
    }
  }

  // 🔥 Pasar turno
  async pasarTurno(jugadores, userId, roomCode) {
    const orden = jugadores.map(j => j.id_jugador)
    const actualIndex = orden.indexOf(userId)
    const siguienteIndex = (actualIndex + 1) % orden.length
    const siguienteJugador = orden[siguienteIndex]

    const salaRef = doc(db, 'salas', roomCode)
    await updateDoc(salaRef, { turnoActual: siguienteJugador })
  }

  // 🔥 Robar una carta
  async robarCarta(roomCode, userId) {
    const mazoRobarRef = doc(db, `salas/${roomCode}/mazos/mazorobar`)
    const mazoJugadorRef = doc(db, `salas/${roomCode}/mazos/mazojugador_${userId}`)

    const mazoRobarSnap = await getDoc(mazoRobarRef)
    const mazoJugadorSnap = await getDoc(mazoJugadorRef)

    const mazoRobarData = mazoRobarSnap.data()
    const mazoJugadorData = mazoJugadorSnap.data()

    if (!mazoRobarData || !mazoRobarData.cartas.length) {
      throw new Error('No hay cartas para robar.')
    }

    const cartaRobada = mazoRobarData.cartas.pop()

    await updateDoc(mazoRobarRef, {
      cartas: mazoRobarData.cartas,
      cantidad: mazoRobarData.cartas.length
    })

    await updateDoc(mazoJugadorRef, {
      cartas: arrayUnion(cartaRobada),
      cantidad: mazoJugadorData.cartas.length + 1
    })

    return cartaRobada
  }

  // 🔥 Robar varias cartas (cuando hay acumulado +2 o +4)
  async comerAcumulado(roomCode, userId, acumulado) {
    const mazoRobarRef = doc(db, `salas/${roomCode}/mazos/mazorobar`)
    const mazoJugadorRef = doc(db, `salas/${roomCode}/mazos/mazojugador_${userId}`)

    const mazoRobarSnap = await getDoc(mazoRobarRef)
    const mazoJugadorSnap = await getDoc(mazoJugadorRef)

    const mazoRobarData = mazoRobarSnap.data()
    const mazoJugadorData = mazoJugadorSnap.data()

    const cartasRobadas = []
    for (let i = 0; i < acumulado; i++) {
      if (mazoRobarData.cartas.length === 0) break
      cartasRobadas.push(mazoRobarData.cartas.pop())
    }

    await updateDoc(mazoRobarRef, {
      cartas: mazoRobarData.cartas,
      cantidad: mazoRobarData.cartas.length
    })

    await updateDoc(mazoJugadorRef, {
      cartas: arrayUnion(...cartasRobadas),
      cantidad: mazoJugadorData.cartas.length + cartasRobadas.length
    })
  }

  // 🔥 Actualizar contador de acumulado
  async actualizarContador(roomCode, nuevoContador) {
    const salaRef = doc(db, 'salas', roomCode)
    await updateDoc(salaRef, { contador: nuevoContador })
  }
}

export const tableroService = new TableroService()
