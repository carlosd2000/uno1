<template>
    <div class="pantalla">
      <div class="encabezado">
        <button class="flecha" @click="goBack" aria-label="Volver">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e9ecef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2>Historial de Movimientos</h2>
        <img src="../../public/img/UNO_Logo.svg" alt="UNO Logo" class="logo" />
      </div>
  
      <div class="tabla-container">
        <table class="tabla-movimientos">
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Acción</th>
              <th>Detalle</th>
              <th>Origen</th>
              <th>Destino</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(movimiento, index) in movimientos" :key="index">
              <td>{{ movimiento.jugador }}</td>
              <td>{{ movimiento.accion }}</td>
              <td>{{ movimiento.detalle }}</td>
              <td>{{ movimiento.origen }}</td>
              <td>{{ movimiento.destino }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { getFirestore, collection, getDocs, onSnapshot } from 'firebase/firestore';
  
  export default {
    name: "Historial",
    data() {
      return {
        movimientos: [],
        loading: true,
        error: null
      };
    },
    async created() {
      await this.cargarMovimientos();
      this.suscribirMovimientos();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      async cargarMovimientos() {
        try {
          const db = getFirestore();
          const movimientosRef = collection(db, 'movimientos');
          const snapshot = await getDocs(movimientosRef);
          this.movimientos = snapshot.docs.map(doc => doc.data());
          this.loading = false;
        } catch (error) {
          this.error = "Error al cargar movimientos";
          console.error(error);
          this.loading = false;
        }
      },
      suscribirMovimientos() {
        const db = getFirestore();
        const movimientosRef = collection(db, 'movimientos');
        onSnapshot(movimientosRef, (snapshot) => {
          this.movimientos = snapshot.docs.map(doc => doc.data());
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .pantalla {
    background-color: #1e1e1e;
    border: 8px solid #b05d33;
    width: 100vw;
    height: 100vh;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    color: white;
    overflow: hidden;
  }
  
  .encabezado {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    flex-shrink: 0;
  }
  
  .flecha {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
  }
  
  .logo {
    width: 40px;
    height: auto;
  }
  
  h2 {
    font-family: "Comic Sans MS", cursive;
    font-size: 1.1rem;
    text-align: center;
    margin: 0 10px;
  }
  
  .tabla-container {
    flex-grow: 1;
    overflow: auto;
    margin: 0 -5px;
    padding: 0 5px;
  }
  
  .tabla-movimientos {
    width: 100%;
    border-collapse: collapse;
    font-family: "Comic Sans MS", cursive;
    background-color: white;
    color: black;
    border-radius: 8px;
    overflow: hidden;
    table-layout: fixed;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px 5px;
    text-align: center;
    font-size: 0.75rem;
    word-break: break-word;
  }
  
  th {
    background-color: #4c4948;
    color: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  
  /* Estilos para móviles horizontales */
  @media (max-width: 768px) and (orientation: landscape) {
    th, td {
      font-size: 0.65rem;
      padding: 5px 3px;
    }
    
    h2 {
      font-size: 0.9rem;
    }
    
    .logo {
      width: 30px;
    }
  }
  
  /* Estilo para cuando no hay movimientos */
  .no-movimientos {
    text-align: center;
    padding: 20px;
    color: #666;
  }
  

  </style>