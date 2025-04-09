<template>
  <div class="public-container">
    <button class="back-button" @click="$router.push('/principal')" aria-label="Volver a principal">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e9ecef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>

    <img src="/img/UNO_Logo.svg" alt="UNO Logo" class="logo" />

    <div class="auth-form">
      <h2 class="form-title">Unirse a partida</h2>

      <div class="form-container">
        <input v-model="codigoIngresado" type="text" class="form-input" placeholder="Código de la partida" />

        <div v-if="mensaje" class="error-message">{{ mensaje }}</div>

        <button class="action-button" @click="unirseAPartida">
          Unirse
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { gameService } from '../script/GameService'
import { getAuth } from 'firebase/auth'

export default {
  name: "UnirseSala",
  data() {
    return {
      codigoIngresado: '',
      mensaje: '',
      apodo: ''
    }
  },
  created() {
    this.apodo = this.$route.query.apodo
  },
  methods: {
    async unirseAPartida() {
      if (!this.codigoIngresado.trim()) {
        this.mensaje = 'Por favor ingresa un código válido.'
        return
      }

      const user = getAuth().currentUser
      if (!user) {
        this.mensaje = 'No estás autenticado.'
        return
      }

      if (!this.apodo) {
        this.mensaje = 'No tienes un apodo configurado.'
        return
      }

      try {
        await gameService.joinSala(this.codigoIngresado, user.uid, this.apodo)
        this.$router.push({ path: '/salaespera', query: { roomCode: this.codigoIngresado } })
      } catch (error) {
        this.mensaje = error.message
      }
    }
  }
}
</script>

<style scoped>
  /* Estilos base (igual que en las otras vistas) */
  .public-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 20px;
    text-align: center;
    background-color: #1e1e1e;
    border: 15px solid #bf734f;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
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
    max-width: 250px;
    height: auto;
    margin-bottom: 20px;
  }
  
  .auth-form {
    width: 100%;
    max-width: 400px;
  }
  
  .form-title {
    color: #e9ecef;
    margin-bottom: 25px;
    font-size: 1.8rem;
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .form-input {
    width: 100%;
    padding: 12px;
    border-radius: 6px;
    border: 2px solid #444;
    background-color: #3d3d3d;
    color: #fff;
    font-size: 1rem;
    text-align: center;
  }
  
  .form-input::placeholder {
    color: #aaa;
  }
  
  .error-message {
    color: #ff6b6b;
    margin: 15px 0;
    font-weight: 500;
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
    width: 100%;
    margin-top: 10px;
  }
  
  .action-button:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  
  .action-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .loading-spinner {
    margin-top: 20px;
  }
  
  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #bf734f;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>