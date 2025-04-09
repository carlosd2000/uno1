<template>
  <div class="login-container min-vh-100 d-flex flex-column justify-content-center align-items-center p-4"
       style="background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);">
    <div class="card p-5 shadow-lg rounded-4 text-center" style="max-width: 500px; width: 100%;">
      <h1 class="text-gradient mb-4">Iniciar Sesión</h1>

      <div v-if="error" class="alert alert-danger mb-3" role="alert">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-3">
        <div class="form-group">
          <input type="email" class="form-control text-center" v-model="formData.correo" placeholder="Correo electrónico" required />
        </div>

        <div class="form-group">
          <input type="password" class="form-control text-center" v-model="formData.contrasena" placeholder="Contraseña" required />
        </div>

        <button type="submit" class="btn btn-primary btn-lg fw-bold mt-3" :disabled="loading">
          {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
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
.text-gradient {
  background: linear-gradient(to right, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

.login-container {
  background-size: cover;
  background-position: center;
}

.card {
  background-color: rgba(255, 255, 255, 0.95);
  border: none;
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
