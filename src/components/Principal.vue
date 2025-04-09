<template>
  <div class="public-container">
    <!-- Botón salir (icono en esquina superior izquierda) -->
    <button class="back-button" aria-label="Salir">
      <img src="/img/salir.svg" alt="Salir" class="icono-salir" />
    </button>

    <!-- Logo UNO -->
    <img src="/img/UNO_Logo.svg" alt="Logo del juego Uno" class="logo" />

    <!-- Contenedor principal -->
    <div class="auth-form">
      <!-- Avatar + Input + Botón Guardar -->
      <div class="avatar-section">
        <img src="/img/avatar.jpg" alt="Avatar" class="avatar" />
        <input
          type="text"
          v-model="nombreJugador"
          placeholder="Ingresa tu nombre"
          class="form-input"
        />
        <button class="btn-guardar" @click="guardarNombre">Guardar</button>
      </div>

      <!-- Botones Crear y Unirse -->
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
</template>

<script>
export default {
  name: 'Principal',
  data() {
    return {
      nombreJugador: ''
    }
  },
  methods: {
    guardarNombre() {
      if (this.nombreJugador.trim()) {
        alert(`Nombre guardado: ${this.nombreJugador}`)
      } else {
        alert('Por favor, ingresa tu nombre.')
      }
    },
    crearPartida() {
      this.$router.push('/crearsala')
    },
    unirsePartida() {
      this.$router.push('/UnirseSala')
      
    }
  }
}
</script>

<style scoped>
/* Fondo tipo tablero */
.public-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 20px;
  background-color: #1e1e1e;
  border: 15px solid #bf734f;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
}

/* Botón salir */
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

/* Logo UNO */
.logo {
  max-width: 150px;
  height: auto;
  margin-bottom: 20px;
}

/* Contenedor principal del formulario */
.auth-form {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Sección avatar + input + guardar */
.avatar-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

/* Avatar circular */
.avatar {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 50%;
}

/* Input de nombre */
.form-input {
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  border: 2px solid #444;
  background-color: #3d3d3d;
  color: #fff;
  font-size: 1rem;
  text-align: center;
  width: 100%;
}

.form-input::placeholder {
  color: #aaa;
}

/* Botón guardar nombre */
.btn-guardar {
  background-color: #42b983;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.btn-guardar:hover {
  background-color: #369b6b;
}

/* Botones de Crear/Unirse */
.button-group {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

/* Botones amarillos */
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
}

.custom-yellow:hover {
  background-color: #e6be30;
}

/* Iconos dentro de botones */
.icono-boton {
  width: 20px;
  height: 20px;
}
</style>
