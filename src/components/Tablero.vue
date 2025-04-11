<template>
  <div class="tablero">
    <!-- Fila superior -->
    <div class="fila-superior">
      <router-link 
        to="/historial" 
        class="historial-link"
        title="Ver historial de partidas"
      >
        Historial de partidas
      </router-link>
      <div class="contador">Contador +0</div>
    </div>

    <!-- Jugador superior -->
    <div v-if="jugadoresOponentes[0]" class="jugador-superior">
      <p>{{ jugadoresOponentes[0].apodo }}</p>
      <div class="cartas-oponente">
        <div v-for="n in 7" :key="'top' + n" class="carta-oculta"></div>
      </div>
    </div>
    <div v-else class="espacio-vacio-superior"></div>

    <!-- Laterales y centro -->
    <div class="fila-central">
      <!-- Jugador izquierdo -->
      <div v-if="jugadoresOponentes[1]" class="jugador-lateral">
        <p>{{ jugadoresOponentes[1].apodo }}</p>
        <div class="cartas-lateral">
          <div v-for="n in 7" :key="'left' + n" class="carta-oculta"></div>
        </div>
      </div>
      <div v-else class="espacio-vacio"></div>

      <!-- Zona central -->
      <div class="zona-central fade-in">
        <div class="mazo-cartas">
          <img src="/img/carta-reverso.png" alt="Mazo" class="mazo-imagen" @click="robarCarta" />
          <div v-if="!juegoComenzado">
            <img src="/img/carta_+4.png" alt="Carta actual" />
          </div>
          <div v-else-if="juegoComenzado && cartaActual">
            <Card :card-data="cartaActual" class="carta-central" />
          </div>
        </div>
        <button
          v-if="!juegoComenzado"
          class="btn-comenzar pulse"
          @click="comenzarJuego"
        >
          COMENZAR
        </button>
      </div>

      <!-- Jugador derecho -->
      <div v-if="jugadoresOponentes[2]" class="jugador-lateral">
        <p>{{ jugadoresOponentes[2].apodo }}</p>
        <div class="cartas-lateral">
          <div v-for="n in 7" :key="'right' + n" class="carta-oculta"></div>
        </div>
      </div>
      <div v-else class="espacio-vacio"></div>
    </div>

    <!-- Jugador inferior (yo) -->
    <div v-if="jugadorActual" class="jugador-inferior">
      <p>{{ jugadorActual.apodo }}</p>
      <div class="contenedor-jugador">
        <div class="cartas-jugador fade-in-bottom">
          <Card
            v-for="(carta, index) in cartasJugadorActual"
            :key="index"
            :card-data="carta"
            @click="manejarClickCarta(carta, index)"
          />
        </div>
      </div>
    </div>

    <!-- Botón de audio -->
    <div class="audio-btn">
      <button>🔊 UNO</button>
    </div>

    <!-- Botón salir -->
    <div class="salir-btn">
      <button @click="salirPartida">🚪 Salir</button>
    </div>

    <!-- Modal para elegir color -->
    <div v-if="mostrarModalColor" class="modal-color">
      <div class="modal-contenido">
        <h3 class="titulo-modal">Selecciona un color</h3>
        <div class="colores">
          <div class="color-item"><button class="color-btn rojo" @click="elegirColor('rojo')"></button></div>
          <div class="color-item"><button class="color-btn verde" @click="elegirColor('verde')"></button></div>
          <div class="color-item"><button class="color-btn amarillo" @click="elegirColor('amarillo')"></button></div>
          <div class="color-item"><button class="color-btn azul" @click="elegirColor('azul')"></button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from 'firebase/auth'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { tableroService } from '../script/TableroService'
import Card from '../components/Card.vue'

export default {
  name: "Tablero",
  components: { Card },
  data() {
    return {
      jugadores: [],
      roomCode: '',
      todasLasCartas: [],
      cartasJugadorActual: [],
      userId: '',
      cartaActual: null,
      juegoComenzado: false,
      mostrarModalColor: false,
      cartaPendiente: null,
      turnoActual: null,
      mazoRobar: [],
      mazosPorJugador: {}
    }
  },
  created() {
    const auth = getAuth()
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.userId = user.uid
        this.roomCode = this.$route.query.roomCode
        if (this.roomCode) {
          this.todasLasCartas = await tableroService.fetchCartas()
          this.listenToSala()
        } else {
          this.$router.push('/principal')
        }
        unsubscribe()
      } else {
        this.$router.push('/login')
      }
    })
  },
  computed: {
    jugadorActual() {
      return this.jugadores.find(j => j.id_jugador === this.userId) || null
    },
    jugadoresOponentes() {
      return this.jugadores.filter(j => j.id_jugador !== this.userId)
    },
    esMiTurno() {
      return this.turnoActual === this.userId
    }
  },
  methods: {
    listenToSala() {
      const salaRef = doc(db, 'salas', this.roomCode)
      onSnapshot(salaRef, (docSnap) => {
        const data = docSnap.data()
        if (data) {
          this.cartaActual = data.cartaActual
          this.juegoComenzado = data.juegoComenzado
          this.turnoActual = data.turnoActual
          this.mazoRobar = data.mazoRobar || []
          this.mazosPorJugador = data.mazosPorJugador || {}
          this.cartasJugadorActual = this.mazosPorJugador[this.userId] || []
        }
      })

      const jugadoresRef = collection(db, `salas/${this.roomCode}/jugadores`)
      onSnapshot(jugadoresRef, (snapshot) => {
        this.jugadores = snapshot.docs.map(doc => ({ id_jugador: doc.id, ...doc.data() }))
      })
    },
    async comenzarJuego() {
      await tableroService.comenzarJuego(this.jugadores, this.todasLasCartas, this.roomCode)
    },
    esCartaValida(carta) {
      return tableroService.esCartaValida(this.cartaActual, carta)
    },
    async manejarClickCarta(carta, index) {
      if (!this.esMiTurno || !this.juegoComenzado) return

      if (this.esCartaValida(carta)) {
        if (carta.tipo === "comodín" || carta.valor === "comodín +4") {
          this.cartaPendiente = { carta, index }
          this.mostrarModalColor = true
        } else {
          this.cartasJugadorActual = await tableroService.procesarCarta(this.roomCode, this.userId, carta, index, this.cartasJugadorActual)
          await tableroService.pasarTurno(this.jugadores, this.userId, this.roomCode)
        }
      }
    },
    async elegirColor(color) {
      if (!this.cartaPendiente) return

      const { carta, index } = this.cartaPendiente
      this.mostrarModalColor = false
      this.cartaPendiente = null

      this.cartasJugadorActual = await tableroService.procesarCarta(this.roomCode, this.userId, carta, index, this.cartasJugadorActual, color)
      await tableroService.pasarTurno(this.jugadores, this.userId, this.roomCode)
    },
    async robarCarta() {
      if (!this.esMiTurno || !this.juegoComenzado) return
      const result = await tableroService.robarCarta(this.roomCode, this.userId, this.mazoRobar, this.cartasJugadorActual)
      this.mazoRobar = result.mazoRobar
      this.cartasJugadorActual = result.cartasJugadorActual

      await tableroService.pasarTurno(this.jugadores, this.userId, this.roomCode)
    },
    salirPartida() {
      this.$router.push('/principal')
    }
  }
}
</script>

<style scoped>
/* 🔥 ESTILOS 🔥 */
.tablero {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  background-color: #b06e3d;
  padding: 0.5rem;
  box-sizing: border-box;
  font-family: sans-serif;
  position: relative;
  overflow-y: auto;
}

.fila-superior {
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  font-weight: bold;
  color: white;
}

.historial {
  background: #d32f2f;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
}

.contador {
  background: #ffc107;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  color: black;
}

.jugador-superior {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: white;
  padding: 0.5rem 0;
  min-height: 80px;
}

.cartas-oponente {
  display: flex;
  gap: 4px;
}

.carta-oculta {
  width: 60px;
  height: 90px;
  background-color: gray;
  border-radius: 6px;
}

.fila-central {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding: 1rem 0;
}

.jugador-lateral {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  width: 140px;
  height: auto;
  flex: none;
}

.cartas-lateral {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
  padding: 0;
  width: 140px;
  height: 100%;
  overflow: hidden;
}

.cartas-lateral .carta-oculta {
  transform: rotate(90deg);
  width: 60px;
  height: 90px;
}

.zona-central {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 100%;
}

.mazo-cartas {
  display: flex;
  gap: 0.5rem;
}

.mazo-imagen {
  cursor: pointer;
  transition: transform 0.2s;
}

.mazo-imagen:hover {
  transform: scale(1.1);
}

.mazo-cartas img {
  height: 100px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.btn-comenzar {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.jugador-inferior {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0;
}

.contenedor-jugador {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.cartas-jugador {
  display: flex;
  overflow-x: auto;
  gap: 0.3rem;
  justify-content: center;
  max-width: 100%;
  scroll-behavior: smooth;
}

.cartas-jugador img {
  height: 60px;
  border-radius: 6px;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.audio-btn {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
}

.audio-btn button {
  background: #ffeb3b;
  border: none;
  border-radius: 8px;
  padding: 0.3rem 0.8rem;
  font-weight: bold;
  cursor: pointer;
}

.salir-btn {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
}

.salir-btn button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
}

.salir-btn button:hover {
  background-color: #d9363e;
}

.espacio-vacio,
.espacio-vacio-superior {
  width: 150px;
  height: 200px;
}

.pulse {
  animation: pulseAnim 1.5s infinite;
}

.modal-color {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0,0,0,0.7);
display: flex;
align-items: center;
justify-content: center;
z-index: 1000;
}

.modal-contenido {
background: #a86b41; /* marrón clarito */
padding: 30px;
border-radius: 20px;
text-align: center;
width: 300px;
}

.titulo-modal {
font-family: 'Comic Sans MS', cursive, sans-serif;
font-size: 24px;
margin-bottom: 20px;
color: #3b210d;
}

.colores {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 20px;
justify-items: center;
margin: 20px 0;
}

.color-btn {
width: 80px;
height: 80px;
border: 3px solid #333;
border-radius: 20%;
cursor: pointer;
transition: transform 0.2s;
}

.color-btn:hover {
transform: scale(1.2);
}

.color-btn.rojo { background: #ff4c4c; }
.color-btn.verde { background: #3adb76; }
.color-btn.amarillo { background: #ffcc00; }
.color-btn.azul { background: #3498db; }

@keyframes pulseAnim {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

.fade-in {
  animation: fadeIn 1s ease-in forwards;
  opacity: 0;
}

.fade-in-bottom {
  animation: fadeInBottom 0.8s ease-in forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInBottom {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.historial-link {
  background: #d32f2f;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.historial-link:hover {
  background: #b71c1c;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
</style>
  