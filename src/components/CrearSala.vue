<template>
    <div class="lobby-container">
      
      <!-- Botón volver -->
    <button class="back-button" @click="goBack" :disabled="loading" aria-label="Volver a principal">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e9ecef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
    </button>
  
      <!-- Logo UNO -->
    <img src="../../public/img/UNO_Logo.svg" alt="UNO Logo" class="uno-logo">
  
      <div class="lobby-card">
        <!-- Contenido principal -->
        <div class="content">
          <!-- Mitad izquierda: Jugadores -->
          <div class="players-section">
            <h2>Jugadores</h2>
  
            <div class="players-list">
              <div v-for="(player, index) in players" :key="index" class="player-item">
                <img :src="player.avatar" alt="avatar" class="avatar">
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
            <h2>Código de Sala</h2>
            <p class="room-code">{{ roomCode }}</p>
  
            <button class="start-button" @click="startGame">
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
        { name: "Jugador 1", avatar: "/avatar1.png" },
        { name: "Jugador 2", avatar: "/avatar2.png" },
        { name: "Jugador 3", avatar: "/avatar3.png" },
        { name: "Jugador 4", avatar: "/avatar4.png" },
      ],
      roomCode: "",
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
.lobby-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #1c1c1c;
    border: 10px solid #a0522d;
}

.lobby-card {
  position: relative;
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  background-color: #1c1c1c;
  color: white;
  padding: 20px;
  border-radius: 12px;
  overflow: hidden;
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

.uno-logo {
  position: absolute;
  top: 25px;
  right: 25px;
  width: 120px;
  padding: 5px;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  gap: 500px;
}

.players-section, .room-section {
  width: 45%;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.player-item {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.player-input {
  flex-grow: 1;
  border: none;
  background-color: transparent;
  color: black;
  font-weight: bold;
}

.room-code {
  font-size: 40px;
  font-weight: bold;
  margin: 30px 0;
}

.start-button {
  background-color: white;
  color: rgb(3, 3, 3);
  font-weight: bold;
  border: 2px solid #030303;
  padding: 15px 40px;
  border-radius: 6px;
  font-size: 22px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-button:hover {
    opacity: 0.9;
    transform: translateY(-2px);
}

@media (max-width: 1024px) and (orientation: landscape) {
  .content {
    gap: 200px;
  }

  .uno-logo {
    width: 100px;
  }

  .room-code {
    font-size: 28px;
  }

  .start-button {
    font-size: 18px;
    padding: 12px 20px;
  }

  .player-input {
    font-size: 16px;
  }

  .back-button {
    font-size: 24px;
  }
}
</style>