<template>
    <div class="card" :class="[cardData.color, { 'wild-card': isWildCard }]">
      <div class="card-content">
        <span class="card-value">{{ displayValue }}</span>
        <span v-if="!isWildCard" class="card-color-indicator"></span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      cardData: {
        type: Object,
        required: true
      }
    },
    computed: {
      isWildCard() {
        return this.cardData.color === 'negro';
      },
      displayValue() {
        if (this.cardData.tipo === 'acción') {
          return this.cardData.valor.charAt(0).toUpperCase() + this.cardData.valor.slice(1);
        }
        return this.cardData.valor;
      }
    }
  }
  </script>
  
  <style scoped>
  .card {
    width: 80px;
    height: 120px;
    border-radius: 8px;
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
    position: relative;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .card:hover {
    transform: translateY(-5px);
  }
  
  /* Colores de las cartas */
  .rojo { background-color: #E74C3C; }
  .amarillo { background-color: #F1C40F; color: #333; }
  .verde { background-color: #2ECC71; }
  .azul { background-color: #3498DB; }
  .negro { background-color: #2C3E50; }
  
  /* Indicador de color para cartas normales */
  .card-color-indicator {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
  }
  
  .rojo .card-color-indicator { background-color: #E74C3C; }
  .amarillo .card-color-indicator { background-color: #F1C40F; border-color: #333; }
  .verde .card-color-indicator { background-color: #2ECC71; }
  .azul .card-color-indicator { background-color: #3498DB; }
  
  /* Estilo especial para comodines */
  .wild-card .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .wild-card .card-value {
    font-size: 1rem;
  }
  </style>