<template>
  <div class="public-container">
    <button class="back-button" @click="goBack" :disabled="loading" aria-label="Volver al inicio">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e9ecef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>

    <img src="/img/UNO_Logo.svg" alt="Logo UNO" class="logo" />

    <div class="auth-form">
      <h1 class="form-title">Registrarse</h1>

      <form @submit.prevent="handleSubmit" class="form-container">
        <input
          type="text"
          v-model="formData.nombre"
          @input="validateUsername"
          placeholder="Nombre de usuario"
          required
          pattern="^[a-zA-Z0-9]{3,15}$"
          class="form-input"
        />
        <small class="input-message" v-if="formData.nombre">
          {{ usernameMessage }}
        </small>

        <input
          type="email"
          v-model="formData.correo"
          placeholder="Correo electrónico"
          required
          class="form-input"
        />

        <input
          type="password"
          v-model="formData.contrasena"
          placeholder="Contraseña"
          required
          minlength="6"
          class="form-input"
        />

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="action-button" :disabled="loading || !isValidUsername">
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { AuthService } from '../firebase/auth'

export default {
  name: 'Register',
  data() {
    return {
      formData: {
        nombre: '',
        correo: '',
        contrasena: ''
      },
      loading: false,
      error: null,
      isValidUsername: false,
      usernameMessage: ''
    }
  },
  methods: {
    validateUsername() {
      const username = this.formData.nombre
      const usernameRegex = /^[a-zA-Z0-9]{3,15}$/

      if (!username) {
        this.usernameMessage = ''
        this.isValidUsername = false
        return
      }

      if (!usernameRegex.test(username)) {
        this.usernameMessage = 'El nombre debe tener entre 3 y 15 caracteres, solo letras y números'
        this.isValidUsername = false
        return
      }

      this.usernameMessage = 'Nombre válido'
      this.isValidUsername = true
    },
    async handleSubmit() {
      if (!this.isValidUsername) {
        this.error = 'Por favor, ingresa un nombre de usuario válido'
        return
      }

      this.loading = true
      this.error = null

      const result = await AuthService.register({
        email: this.formData.correo,
        password: this.formData.contrasena,
        userData: {
          nombre: this.formData.nombre
        }
      })

      if (result.success) {
        this.$router.push('/')
      } else {
        this.error = result.error
      }

      this.loading = false
    },
    goBack() {
      this.$router.push('/')
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
  transition: all 0.3s ease;
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

.input-message {
  display: block;
  color: #bf734f;
  font-size: 0.8rem;
  margin-top: 5px;
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

@media (orientation: landscape) and (min-width: 600px) {
  .public-container {
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    padding: 30px;
  }

  .logo {
    margin-bottom: 0;
    max-width: 180px;
  }

  .auth-form {
    max-width: 380px;
  }

  .form-title {
    font-size: 1.4rem;
  }

  .form-input {
    padding: 10px;
    font-size: 0.95rem;
  }

  .action-button {
    padding: 10px 24px;
    font-size: 0.95rem;
  }

  .input-message {
    font-size: 0.75rem;
  }

  .error-message {
    font-size: 0.85rem;
  }
}
@media screen and (max-height: 600px) {
  .public-container {
    padding: 4px;
    border-width: 4px;
    min-height: auto;
    height: 100vh;
    overflow-y: auto;
  }

  .logo {
    max-width: 40px;
    margin-bottom: 6px;
  }

  .form-title {
    font-size: 1rem;
    margin-bottom: 6px;
  }

  .form-container {
    gap: 6px;
    margin-bottom: 10px;
  }

  .form-input {
    padding: 6px;
    font-size: 0.7rem;
  }

  .input-message {
    font-size: 0.6rem;
  }

  .error-message {
    font-size: 0.65rem;
    margin: 6px 0;
  }

  .action-button {
    padding: 6px 12px;
    font-size: 0.7rem;
    margin-top: 6px;
  }

  .back-button {
    top: 4px;
    left: 4px;
    padding: 2px;
  }

  .back-button svg {
    width: 16px;
    height: 16px;
  }
}

@media screen and (min-width: 1024px) {
  .public-container {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  .logo {
    max-width: 180px;
    margin-bottom: 20px;
  }

  .auth-form {
    max-width: 400px;
    width: 100%;
  }

  .form-title {
    font-size: 2rem;
    margin-bottom: 25px;
  }

  .form-input {
    padding: 14px;
    font-size: 1rem;
  }

  .action-button {
    padding: 14px 28px;
    font-size: 1rem;
  }

  .input-message {
    font-size: 0.8rem;
  }

  .error-message {
    font-size: 0.9rem;
  }
}

</style>
