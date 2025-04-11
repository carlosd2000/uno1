<template>
    <div class="tablero">
      <!-- Fila superior -->
      <div class="fila-superior">
        <div class="historial">Historial de movimiento</div>
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
  <img src="/img/carta-reverso.png" alt="Mazo" />

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
              v-for="(carta, index) in cartasPorJugador[userId] || []"
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
    </div>
  </template>
  
<script>
import { collection, getDoc, getDocs, setDoc, doc, onSnapshot, deleteDoc } from 'firebase/firestore'

  import { db } from '../firebase/config'
  import { gameService } from '../script/GameService'
  import { getAuth } from 'firebase/auth'
  import Card from '../components/Card.vue'
  
  export default {
    name: "Tablero",
    components: {
      Card
    },
    data() {
      return {
        jugadores: [],
        roomCode: '',
        todasLasCartas: [],
        cartasPorJugador: {},
        userId: '',
        cartaActual: null,
juegoComenzado: false
      }
    },
    created() {
  const auth = getAuth();
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (user) {
      this.userId = user.uid;
      this.roomCode = this.$route.query.roomCode;

      if (this.roomCode) {
        await this.fetchCartas();
        this.listenToSala();
      } else {
        this.$router.push('/principal');
      }

      unsubscribe(); // Nos desuscribimos para que no quede escuchando
    } else {
      this.$router.push('/login'); // O lo que quieras hacer si no hay usuario
    }
  });
},
    computed: {
      jugadorActual() {
        return this.jugadores.find(j => j.id_jugador === this.userId) || null
      },
      jugadoresOponentes() {
        return this.jugadores.filter(j => j.id_jugador !== this.userId)
      }
    },
    methods: {
      async asignarCartasSiNoExisten(jugadorId) {
        
        const jugadorRef = doc(db, `salas/${this.roomCode}/jugadores/${jugadorId}`);
        const jugadorDoc = await getDoc(jugadorRef);

        if (jugadorDoc.exists() && jugadorDoc.data().terminado) {
          return []; // No asignar cartas si ya terminó
        }

        const cartasRef = collection(db, `salas/${this.roomCode}/jugadores/${jugadorId}/cartas`);
        const snapshot = await getDocs(cartasRef);

        if (snapshot.empty) {
          const cartas = this.obtenerCartasAleatorias(7);
          for (let carta of cartas) {
            const cartaId = crypto.randomUUID(); // Genera un ID único
            await setDoc(doc(cartasRef, cartaId), carta); // Guardar en Firestore
          }
          return cartas;
        } else {
          return snapshot.docs.map(doc => doc.data());
        }
      },

      async fetchCartas() {
        const cartasSnapshot = await getDocs(collection(db, 'cartasUNO'))
        this.todasLasCartas = cartasSnapshot.docs.map(doc => doc.data())
      },

      async comenzarJuego() {
  const cartaAleatoria = this.obtenerCartasAleatorias(1)[0];

  // Guarda la carta actual y el estado del juego en Firestore
  await setDoc(doc(db, 'salas', this.roomCode), {
    cartaActual: cartaAleatoria,
    juegoComenzado: true
  }, { merge: true }); // Merge para no sobrescribir otros datos
},

async tirarCarta(carta, index) {
  if (!this.juegoComenzado) return;

  const mismaColor = carta.color === this.cartaActual.color;
  const mismoValor = carta.valor === this.cartaActual.valor;
  const esComodin = carta.color === "negro";

  if (mismaColor || mismoValor || esComodin) {
    await setDoc(doc(db, 'salas', this.roomCode), {
      cartaActual: carta
    },{merge: true});
    
    this.cartasPorJugador[this.userId].splice(index, 1);
    
    const jugadorCartasRef = collection(db, `salas/${this.roomCode}/jugadores/${this.userId}/cartas`);
  
    const docs = await getDocs(jugadorCartasRef);
    for (let docu of docs.docs) {
      deleteDoc(docu.ref)
    }
  
    for (let carta of this.cartasPorJugador[this.userId]) {
      const cartaId = crypto.randomUUID();
      await setDoc(doc(jugadorCartasRef, cartaId), carta);
    }
  }


  if (this.cartasPorJugador[this.userId].length === 0) {
    await setDoc(doc(db, `salas/${this.roomCode}/jugadores/${this.userId}`), {
      terminado: true
    }, { merge: true });
  }
},

manejarClickCarta(carta, index) {
  if (this.esCartaValida(carta)) {
    this.tirarCarta(carta, index);
  } else {
    return;
  }
},

esCartaValida(carta){
  if (!this.cartaActual) return false;

  if (carta.tipo === 'comodin' || carta.tipo === '+4') {
    return true;
  }

  if (carta.color === this.cartaActual.color || carta.numero === this.cartaActual.numero){
    return true
  }

  if (carta.tipo && this.cartaActual.tipo && carta.tipo === this.cartaActual.tipo) {
    return true
  }

  return false;
},

listenToSala() {
  gameService.subscribeToSala(this.roomCode, async (salaData) => {
    if (salaData) {
      this.jugadores = salaData.jugadores;

      this.juegoComenzado = !!salaData.juegoComenzado;
      this.cartaActual = salaData.juegoComenzado ? salaData.cartaActual : null;

      if (this.todasLasCartas.length === 0) {
        await this.fetchCartas();
      }  

      for (const jugador of salaData.jugadores) {
        const cartasJugador = this.cartasPorJugador[jugador.id_jugador];

        if (!cartasJugador) {
          const cartas = await this.asignarCartasSiNoExisten(jugador.id_jugador);

          if (this.$set) {
            this.$set(this.cartasPorJugador, jugador.id_jugador, cartas);
          } else {
            this.cartasPorJugador = {
              ...this.cartasPorJugador,
              [jugador.id_jugador]: cartas
            };
          }
        }
      }
    } else {
      this.$router.push('/principal');
    }
  });
},

      obtenerCartasAleatorias(cantidad) {
        const cartasMezcladas = [...this.todasLasCartas].sort(() => Math.random() - 0.5)
        return cartasMezcladas.slice(0, cantidad)
      },
      salirPartida() {
        if (confirm('¿Estás seguro que quieres salir de la partida?')) {
          gameService.cancelSubscription()
          this.$router.push('/principal')
        }
      }
    },
    beforeUnmount() {
      gameService.cancelSubscription()
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
</style>
    