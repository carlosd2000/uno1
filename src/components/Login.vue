<template>
  <div class="public-container">
    <button class="back-button" @click="goBack" :disabled="loading" aria-label="Volver al inicio">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e9ecef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>

    <img src="../../public/img/UNO_Logo.svg" alt="Logo UNO" class="logo" />

    <h1 class="title">Iniciar Sesión</h1>

    <div v-if="error" class="alert" role="alert">
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-row">
        <div class="form-labels">
          <label class="input-label">correo:</label>
          <label class="input-label">contraseña:</label>
        </div>

        <div class="form-inputs">
          <input
            type="email"
            v-model="formData.correo"
            placeholder="Correo electrónico"
            required
            class="input"
          />
          <input
            type="password"
            v-model="formData.contrasena"
            placeholder="Contraseña"
            required
            class="input"
          />
        </div>
      </div>

      <button type="submit" class="action-button" :disabled="loading">
        {{ loading ? 'Iniciando...' : 'Iniciar sesión' }}
      </button>
    </form>
  </div>
</template>

<script>
import { AuthService } from '../firebase/auth'

export default {
  name: 'Login',
  data() {
    return {
      formData: {
        correo: '',
        contrasena: ''
      },
      loading: false,
      error: null
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.error = null

      const result = await AuthService.login({
        email: this.formData.correo,
        password: this.formData.contrasena
      })

      if (result.success) {
        this.$router.push('/about')
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
/* Estilos generales */
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

/* Logo UNO */
.logo {
  max-width: 250px;
  height: auto;
  margin-bottom: 20px;
}

/* Botón volver */
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

/* Título */
.title {
  font-size: 2rem;
  margin-bottom: 20px;
  background: linear-gradient(to right, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

/* Formulario */
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
}

/* Dos columnas */
.form-row {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

/* Columna de etiquetas */
.form-labels {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: right;
}

/* Columna de inputs */
.form-inputs {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

/* Texto de etiquetas */
.input-label {
  color: #ffffff;
  font-weight: bold;
  width: 100px;
}

/* Inputs */
.input {
  flex: 1;
  padding: 12px;
  border: 2px solid #000;
  border-radius: 12px; /* Borde redondeado como quieres */
  font-size: 1rem;
  background-color: #fff;
  text-align: center;
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: #ff4b2b;
  box-shadow: 0 0 5px rgba(255, 75, 43, 0.5);
}

/* Botón Iniciar Sesión */
.action-button {
  padding: 12px 30px;
  border-radius: 6px;
  font-weight: 600;
  background-color: #e9ecef;
  color: rgb(3, 3, 3);
  border: 2px solid #030303;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Mensaje de error */
.alert {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8d7da;
  border: 2px solid #000;
  color: #721c24;
  border-radius: 8px;
  font-weight: bold;
  max-width: 400px;
  width: 100%;
}
</style>
