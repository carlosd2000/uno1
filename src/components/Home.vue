<template>
  <div class="home-container min-vh-100 d-flex flex-column justify-content-center align-items-center p-4" style="background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);">
    <div class="card p-5 shadow-lg rounded-4 text-center">
      <h1 class="text-gradient mb-4">Bienvenidos</h1>

      <div class="d-grid gap-3">
        <button class="btn btn-primary btn-lg fw-bold" @click="goToRegister">
          Registrarse
        </button>
        <button class="btn btn-success btn-lg fw-bold" @click="goToLogin">
          Iniciar sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    goToRegister() {
      this.$router.push('/register');
    },
    goToLogin() {
      this.$router.push('/login');
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

.home-container {
  background-size: cover;
  background-position: center;
}

.card {
  background-color: rgba(255, 255, 255, 0.95);
  border: none;
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
</style>
