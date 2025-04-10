<template>
    <div class="tablero">
      <!-- Fila superior -->
      <div class="fila-superior">
        <div class="historial">Historial de movimiento</div>
        <div class="contador">Contador +0</div>
      </div>
  
      <!-- Jugador superior (Jugador 4) -->
      <div v-if="jugadores[3]" class="jugador-superior">
        <p>{{ jugadores[3].apodo }}</p>
        <div class="cartas-oponente" v-for="n in 3" :key="'p4' + n"></div>
        <button class="btn-accion">+1</button>
      </div>
      <div v-else class="espacio-vacio-superior"></div>
  
      <!-- Jugadores laterales y centro -->
      <div class="fila-central">
        <div v-if="jugadores[2]" class="jugador-lateral">
          <p>{{ jugadores[2].apodo }}</p>
          <div class="cartas-oponente" v-for="n in 3" :key="'p3' + n"></div>
          <button class="btn-accion">+2</button>
        </div>
        <div v-else class="espacio-vacio"></div>
  
        <div class="zona-central fade-in">
          <div class="mazo-cartas">
            <img src="/img/carta-reverso.png" alt="Mazo" />
            <img src="/img/carta_+4.png" alt="Carta actual" />
          </div>
          <button class="btn-comenzar pulse">COMENZAR</button>
        </div>
  
        <div v-if="jugadores[1]" class="jugador-lateral">
          <p>{{ jugadores[1].apodo }}</p>
          <div class="cartas-oponente" v-for="n in 3" :key="'p2' + n"></div>
          <button class="btn-accion">+3</button>
        </div>
        <div v-else class="espacio-vacio"></div>
      </div>
  
      <!-- Jugador inferior -->
      <div v-if="jugadores[0]" class="jugador-inferior">
        <p>{{ jugadores[0].apodo }}</p>
        <div class="contenedor-jugador">
          <div class="cartas-jugador fade-in-bottom">
            <!-- 🔥 Aquí mostramos las 7 cartas random usando tu componente Card.vue -->
            <Card
              v-for="(carta, index) in cartasPorJugador[jugadores[0]?.id_jugador] || []"
              :key="index"
              :card-data="carta"
            />
          </div>
  
          
        </div>
      </div>
  
      <!-- Botón de audio -->
      <div class="audio-btn">
        <button>🔊 UNO</button>
      </div>
  
      <!-- Botón Salir -->
      <div class="salir-btn">
        <button @click="salirPartida">🚪 Salir</button>
      </div>
    </div>
  </template>
  
  <script>
  import { collection, getDocs } from 'firebase/firestore'
  import { db } from '../firebase/config'
  import { gameService } from '../script/GameService'
  import Card from '../components/Card.vue' // 🚀 Importamos tu componente de cartas
  
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
        cartasPorJugador: {}
      };
    },
    created() {
      this.roomCode = this.$route.query.roomCode
      if (this.roomCode) {
        this.fetchCartas().then(() => {
          this.listenToSala()
        })
      } else {
        this.$router.push('/principal')
      }
    },
    methods: {
      async fetchCartas() {
        const cartasSnapshot = await getDocs(collection(db, 'cartasUNO'))
        this.todasLasCartas = cartasSnapshot.docs.map(doc => doc.data())
      },
      listenToSala() {
        gameService.subscribeToSala(this.roomCode, (salaData) => {
          if (salaData) {
            this.jugadores = salaData.jugadores
  
            this.jugadores.forEach(jugador => {
              this.cartasPorJugador[jugador.id_jugador] = this.obtenerCartasAleatorias(7)
            })
          } else {
            this.$router.push('/principal')
          }
        })
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
  /* Estilos principales */
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
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
    color: white;
    padding: 0.5rem 0;
    min-height: 80px;
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
    gap: 0.4rem;
    color: white;
    width: 150px;
  }
  
  .cartas-oponente {
    width: 30px;
    height: 40px;
    background: black;
    border-radius: 4px;
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
    padding-bottom: 1rem;
    padding-top: 1rem;
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
    padding: 0 0.5rem;
    justify-content: center;
    flex-wrap: nowrap;
    max-width: 100%;
    scroll-behavior: smooth;
  }
  
  .cartas-jugador img {
    height: 60px;
    border-radius: 6px;
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }
  
  .acciones-especiales {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }
  
  .acciones-especiales button,
  .btn-accion {
    background: #fff;
    border: none;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
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
  
  /* Botón Salir */
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
  
  /* Espacios vacíos */
  .espacio-vacio,
  .espacio-vacio-superior {
    width: 150px;
    height: 200px;
  }
  
  .espacio-vacio-superior {
    min-height: 80px;
  }
  
  /* Animaciones */
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
  
  .carta-hover:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  }
  </style>
  