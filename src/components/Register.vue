<template>
  <div class="register-container min-vh-100 d-flex flex-column justify-content-center align-items-center p-4" style="background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);">
    <div class="card p-5 shadow-lg rounded-4 text-center" style="max-width: 500px; width: 100%;">

      <h1 class="text-gradient mb-4">Registrarse</h1>

      <div v-if="error" class="alert alert-danger mb-3" role="alert">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-3">
        <div class="form-group">
          <input 
            type="text" 
            class="form-control text-center"
            v-model="formData.nombre"
            @input="validateUsername"
            placeholder="Nombre de usuario"
            required
            pattern="^[a-zA-Z0-9]{3,15}$"
            title="El nombre debe tener entre 3 y 15 caracteres, solo letras y números"
          />
          <small class="text-info" v-if="formData.nombre">
            {{ usernameMessage }}
          </small>
        </div>

        <div class="form-group">
          <input 
            type="email" 
            class="form-control text-center"
            v-model="formData.correo"
            placeholder="Correo electrónico"
            required
          />
        </div>

        <div class="form-group">
          <input 
            type="password" 
            class="form-control text-center"
            v-model="formData.contrasena"
            placeholder="Contraseña"
            required
            minlength="6"
          />
        </div>

        <button 
          type="submit" 
          class="btn btn-primary btn-lg fw-bold mt-3"
          :disabled="loading || !isValidUsername"
        >
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>

        <button type="button" class="btn btn-success btn-lg fw-bold" @click="goBack" :disabled="loading">
          Volver
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
.text-gradient {
  background: linear-gradient(to right, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

.register-container {
  background-size: cover;
  background-position: center;
}

.card {
  background-color: rgba(255, 255, 255, 0.95);
  border: none;
}

.monopoly-logo {
  width: 100%;
  max-width: 150px;
  height: auto;
  margin-bottom: 1rem;
}

input.form-control {
  height: 50px;
  font-size: 1.1rem;
  border-radius: 12px;
  border: 2px solid #000;
  background-color: white;
}

input.form-control:focus {
  box-shadow: 0 0 0 0.25rem rgba(255, 215, 0, 0.25);
  border-color: #000;
}

small.text-info {
  font-weight: bold;
  display: block;
  margin-top: 5px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  color: #fff !important;
}

.btn-primary {
  background-color: #ff4b2b;
  border: none;
}

.btn-primary:hover {
  background-color: #ff416c;
}

.btn-success {
  background-color: #198754;
  border: none;
}

.btn-success:hover {
  background-color: #157347;
}

.alert {
  border: 2px solid #000;
  font-weight: bold;
}
</style>
