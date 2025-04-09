<template>
    <div class="fondo d-flex justify-content-center align-items-center min-vh-100">
      <div class="container position-relative p-4 bg-dark text-light rounded shadow-lg" style="max-width: 600px;">
        
        <!-- Ícono en esquina superior izquierda -->
        <div class="position-absolute top-0 start-0 m-3">
          <img src="/img/salir.svg" alt="Icono" style="width: 32px; height: 32px;" />
        </div>
  
        <!-- Logo -->
        <div class="text-center mb-4 mt-2">
          <img src="/img/UNO_Logo.svg" alt="Logo del juego Uno" class="img-fluid" style="max-width: 150px" />
        </div>
  
        <!-- Avatar + Input + Guardar -->
        <div class="d-flex align-items-center mb-4 gap-2">
          <!-- Avatar circular -->
          <img
            src="/img/avatar.jpg"
            alt="Avatar"
            class="rounded-circle"
            style="width: 90px; height: 90px; object-fit: cover"
          />
  
          <!-- Input -->
          <input
            type="text"
            class="form-control"
            placeholder="Ingresa tu nombre"
            v-model="nombreJugador"
          />
  
          <!-- Botón Guardar -->
          <button class="btn btn-secondary ms-2" @click="guardarNombre">Guardar</button>
        </div>
  
        <!-- Botones en una fila -->
        <div class="row">
          <div class="col-6">
            <button class="btn custom-yellow w-100 d-flex justify-content-between align-items-center" @click="crearPartida">
              <span>Crear partida</span>
              <img src="/img/mas.svg" alt="Crear" style="width: 20px; height: 20px;" />
            </button>
          </div>
          <div class="col-6">
            <button class="btn custom-yellow w-100 d-flex justify-content-between align-items-center" @click="unirsePartida">
              <span>Unirse a partida</span>
              <img src="/img/flecha-derecha.svg" alt="Unirse" style="width: 20px; height: 20px;" />
            </button>
          </div>
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
        alert('Crear partida (aquí irá la lógica)')
      },
      unirsePartida() {
        alert('Unirse a partida (aquí irá la lógica)')
      }
    }
  }
  </script>
  
  <style scoped>
  .fondo {
    background-color: #bf734f;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
  }
  
  .custom-yellow {
    background-color: #ffd43b;
    color: black;
    border: none;
  }
  
  .custom-yellow:hover {
    background-color: #e6be30;
  }
  </style>
  