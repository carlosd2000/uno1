<template>
  <div class="public-container">
    <!-- Botón volver -->
    <button class="back-button" @click="goBack" :disabled="loading" aria-label="Volver a principal">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e9ecef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>
  
    <!-- Logo UNO -->
    <img src="/img/UNO_Logo.svg" alt="UNO Logo" class="logo">
  
    <div class="lobby-card">
      <!-- Contenido principal -->
      <div class="content">
        <!-- Mitad izquierda: Jugadores -->
        <div class="players-section">
          <h2 class="section-title">Jugadores</h2>
  
          <div class="players-list">
            <div v-for="(player, index) in players" :key="index" class="player-item">
              <img src="/img/avatar.jpg" alt="avatar" class="avatar">
              <input
                v-model="player.name"
                type="text"
                class="player-input"
                placeholder="Nombre"
              />
            </div>
          </div>
        </div>
  
        <!-- Mitad derecha: Código y Botón -->
        <div class="room-section">
          <h2 class="section-title">Código de Sala</h2>
          <p class="room-code">{{ roomCode }}</p>
  
          <button class="action-button start-button" @click="startGame">
            ¡INICIAR!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>  

<script>
export default {
  name: "Lobby",
  data() {
    return {
      players: [
        { name: "Jugador 1", avatar: "avatar1.png" },
        { name: "Jugador 2", avatar: "avatar2.png" },
        { name: "Jugador 3", avatar: "avatar3.png" },
        { name: "Jugador 4", avatar: "avatar4.png" },
      ],
      roomCode: "",
      loading: false
    };
  },
  created() {
    this.roomCode = this.generateRoomCode();
  },
  methods: {
    generateRoomCode() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    },
    startGame() {
      console.log("Iniciar juego con código:", this.roomCode);
    },
    goBack() {
      this.$router.push('/principal')
    }
  }
};
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

.player-input {
  flex-grow: 1;
  border: none;
  background-color: transparent;
  color: #e9ecef;
  font-size: 1rem;
  padding: 8px;
}

.player-input::placeholder {
  color: #aaa;
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
  
  .start-button {
    font-size: 1rem;
    padding: 12px 30px;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
}
</style>