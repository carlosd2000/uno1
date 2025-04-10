<template>
  <div class="public-container">
    <button class="back-button" @click="goBack" aria-label="Volver al principal">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e9ecef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>

    <img src="/img/UNO_Logo.svg" alt="UNO Logo" class="logo" />

    <div class="lobby-card">
      <div class="content">
        <div class="players-section">
          <h2 class="section-title">Jugadores</h2>
          <div class="players-list">
            <div v-for="jugador in jugadores" :key="jugador.id_jugador" class="player-item">
              <img src="/img/avatar.jpg" alt="avatar" class="avatar" />
              <p class="player-name">{{ jugador.apodo }}</p>
            </div>
          </div>
        </div>

        <div class="room-section">
          <h2 class="section-title">Código de Sala</h2>
          <p class="room-code">{{ roomCode }}</p>

          <button class="action-button" @click="copyCode">Copiar Código</button>
          <button class="action-button start-button" @click="startGame">¡INICIAR PARTIDA!</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gameService } from '../script/GameService'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default {
  name: "CrearSala",
  data() {
    return {
      jugadores: [],
      roomCode: '',
      apodo: ''
    }
  },
  created() {
    const auth = getAuth()

    // 🔥 Esperar a que Firebase confirme el usuario
    onAuthStateChanged(auth, async (user) => {
      this.apodo = this.$route.query.apodo
      this.roomCode = this.$route.query.roomCode || ''

      if (user) {
        if (this.roomCode) {
          // 🔥 Si ya hay roomCode en URL (por recarga)
          this.listenToSala()
        } else if (this.apodo) {
          // 🔥 Si no hay roomCode (primer creación)
          await gameService.createSala(user.uid, this.apodo)
          this.roomCode = gameService.roomCode

          // 🔥 Actualizar URL para agregar el roomCode
          this.$router.replace({ path: '/crearsala', query: { apodo: this.apodo, roomCode: this.roomCode } })

          this.listenToSala()
        } else {
          this.$router.push('/principal')
        }
      } else {
        this.$router.push('/principal')
      }
    })
  },
  methods: {
    listenToSala() {
      gameService.subscribeToSala(this.roomCode, (salaData) => {
        if (salaData) {
          this.jugadores = salaData.jugadores
        } else {
          this.$router.push('/principal')
        }
      })
    },
    copyCode() {
      navigator.clipboard.writeText(this.roomCode)
      alert('Código copiado: ' + this.roomCode)
    },
    async startGame() {
      await gameService.startGame(this.roomCode)
      // 🔥 Iniciar partida ➔ Ir al tablero
      this.$router.push({ path: '/tablero', query: { roomCode: this.roomCode } })
    },
    goBack() {
      gameService.cancelSubscription()
      this.$router.push('/principal')
    }
  },
  beforeUnmount() {
    gameService.cancelSubscription()
  }
}
</script>

<style scoped>
.public-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #1e1e1e;
  border: 15px solid #bf734f;
  box-sizing: border-box;
  padding: 20px;
}

.back-button {
  position: absolute;
  top: 25px;
  left: 25px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 10;
}

.back-button svg {
  transition: transform 0.3s ease;
}

.back-button:hover svg {
  transform: translateX(-3px);
}

.logo {
  position: absolute;
  top: 25px;
  right: 25px;
  width: 120px;
  height: auto;
}

.lobby-card {
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  background-color: transparent;
  color: #e9ecef;
  padding: 20px;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  gap: 50px;
}

.players-section, .room-section {
  width: 45%;
}

.section-title {
  color: #e9ecef;
  font-size: 1.8rem;
  margin-bottom: 30px;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.player-item {
  display: flex;
  align-items: center;
  background-color: #3d3d3d;
  border-radius: 8px;
  padding: 12px;
  border: 2px solid #444;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
  border: 2px solid #bf734f;
}

.room-code {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 30px 0;
  color: #bf734f;
  letter-spacing: 3px;
}

.action-button {
  padding: 12px 30px;
  border-radius: 6px;
  background-color: #e9ecef;
  color: #030303;
  border: 2px solid #030303;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-button {
  font-size: 1.2rem;
  padding: 15px 40px;
}

.action-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .content {
    flex-direction: column;
    gap: 30px;
  }

  .players-section, .room-section {
    width: 100%;
  }

  .logo {
    width: 100px;
  }

  .room-code {
    font-size: 2rem;
    margin: 20px 0;
  }

  .section-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
}
@media screen and (max-height: 480px) and (orientation: landscape) {
  .public-container {
    flex-direction: row;
    padding: 10px;
    border-width: 10px;
  }

  .lobby-card {
    height: auto;
    padding: 10px;
  }

  .content {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
  }

  .players-section, .room-section {
    width: 48%;
  }

  .logo {
    width: 90px;
    top: 15px;
    right: 15px;
  }

  .section-title {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }

  .room-code {
    font-size: 1.8rem;
    margin: 20px 0;
  }

  .action-button {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .start-button {
    font-size: 1rem;
    padding: 12px 25px;
  }

  .avatar {
    width: 35px;
    height: 35px;
  }

  .player-item {
    padding: 10px;
  }
}
</style>
