
<template>
  <div class="public-container">
    <button class="back-button" @click="logout" aria-label="Cerrar sesión">
      <img src="/img/salir.svg" alt="Cerrar sesión" class="icono-salir" />
    </button>

    <img src="/img/UNO_Logo.svg" alt="Logo UNO" class="logo" />

    <div class="auth-form">
      <div class="avatar-section">
        <img src="/img/avatar.jpg" alt="Avatar" class="avatar" />

        <input
          type="text"
          v-model="nombreJugador"
          placeholder="Ingresa tu apodo"
          class="form-input"
        />

        <div class="button-group">
          <button class="btn custom-yellow" @click="crearPartida">
            Crear partida
            <img src="/img/mas.svg" alt="Crear" class="icono-boton" />
          </button>

          <button class="btn custom-yellow" @click="unirsePartida">
            Unirse a partida
            <img src="/img/flecha-derecha.svg" alt="Unirse" class="icono-boton" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from 'firebase/auth'

export default {
  name: 'Principal',
  data() {
    return {
      nombreJugador: ''
    }
  },
  methods: {
    crearPartida() {
      if (!this.nombreJugador.trim()) {
        alert('Por favor ingresa tu apodo')
        return
      }
      // Redirige pasando el apodo como query
      this.$router.push({ path: '/crearsala', query: { apodo: this.nombreJugador } })
    },
    unirsePartida() {
      if (!this.nombreJugador.trim()) {
        alert('Por favor ingresa tu apodo')
        return
      }
      // Redirige pasando el apodo como query
      this.$router.push({ path: '/unirseSala', query: { apodo: this.nombreJugador } })
    },
    logout() {
      const auth = getAuth()
      auth.signOut().then(() => {
        this.$router.push('/')
      })
    }
  }
}
</script>

<style scoped>
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
.icono-salir {
  width: 32px;
  height: 32px;
}

.logo {
  max-width: 150px;
  height: auto;
  margin-bottom: 20px;
}

.auth-form {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #bf734f;
}

.form-input {
  width: 100%;
  max-width: 300px;
  padding: 12px;
  border-radius: 6px;
  border: 2px solid #444;
  background-color: #3d3d3d;
  color: #e9ecef;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 15px;
}

.form-input::placeholder {
  color: #aaa;
}

.form-input:focus {
  outline: none;
  border-color: #bf734f;
  box-shadow: 0 0 5px rgba(191, 115, 79, 0.5);
}

.button-group {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.custom-yellow {
  background-color: #ffd43b;
  color: black;
  border: none;
  padding: 12px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  gap: 8px;
  border-radius: 6px;
  transition: 0.3s;
  cursor: pointer;
}

.custom-yellow:hover {
  background-color: #e6be30;
}

.icono-boton {
  width: 20px;
  height: 20px;
}

@media screen and (max-height: 480px) and (orientation: landscape) {
  .public-container {
    flex-direction: row;
    justify-content: space-around;
    padding: 10px;
    border-width: 10px;
  }

  .logo {
    max-width: 100px;
    margin-bottom: 0;
  }

  .auth-form {
    max-width: 300px;
  }

  .avatar-section {
    gap: 12px;
  }

  .form-input {
    max-width: 250px;
    padding: 10px;
    font-size: 0.9rem;
  }

  .button-group {
    flex-direction: column;
    gap: 10px;
  }

  .custom-yellow {
    padding: 10px;
    font-size: 0.9rem;
  }

  .icono-boton {
    width: 18px;
    height: 18px;
  }
}
</style>
