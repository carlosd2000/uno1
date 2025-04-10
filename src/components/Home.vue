<template>
  <div class="public-container">
    <img src="/img/UNO_Logo.svg" alt="Logo UNO" class="logo" />

    <div class="buttons-container">
      <button class="action-button" @click="goToLogin">Login</button>
      <button class="action-button" @click="goToRegister">Registro</button>
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
.public-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;  /* Ocupa toda la pantalla */
  width: 100vw;
  margin: 0;
  padding: 20px;
  text-align: center;
  background-color: #1e1e1e; /* Fondo negro */
  border: 15px solid #bf734f; /* Borde café grueso */
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
}

.logo {
  max-width: 250px;
  height: auto;
  margin-bottom: 40px;
}

.buttons-container {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.action-button {
  padding: 12px 30px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  background-color: #e9ecef; /* Color blanco/gris para el botón de login */
  color: rgb(3, 3, 3);
  border: 2px solid #030303;
}

.register-button {
  background-color: transparent;
  color: #42b983;
  border: 2px solid #42b983;
}

.action-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

@media screen and (min-width: 320px) {
  .public-container {
    padding: 10px;
  }

  .logo {
    max-width: 180px;
    margin-bottom: 30px;
  }

  .action-button {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .buttons-container {
    gap: 15px;
  }
}
</style>
