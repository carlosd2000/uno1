<template>
    <div class="card-list-container">
      <h1>Mazo de Cartas UNO</h1>
      <div v-if="loading" class="loading">Cargando cartas...</div>
      <div v-else class="card-grid">
        <Card 
          v-for="(card, index) in cards" 
          :key="index" 
          :card-data="card"
          @click="selectCard(card)"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { getFirestore, collection, getDocs } from 'firebase/firestore';
  import Card from './Card.vue';
  
  export default {
    components: {
      Card
    },
    data() {
      return {
        cards: [],
        loading: true,
        error: null
      }
    },
    async created() {
      await this.fetchCards();
    },
    methods: {
      async fetchCards() {
        try {
          const db = getFirestore();
          const cardsCollection = collection(db, 'cartasUNO');
          const cardsSnapshot = await getDocs(cardsCollection);
          
          this.cards = cardsSnapshot.docs.map(doc => doc.data());
          this.loading = false;
        } catch (error) {
          this.error = 'Error al cargar las cartas: ' + error.message;
          this.loading = false;
          console.error(error);
        }
      },
      selectCard(card) {
        console.log('Carta seleccionada:', card);
        // Aquí puedes agregar lógica para cuando se selecciona una carta
      }
    }
  }
  </script>
  
  <style scoped>
  .card-list-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .loading {
    font-size: 1.2rem;
    color: #666;
    text-align: center;
    margin-top: 50px;
  }
  
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
    padding: 20px 0;
  }
  
  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
  }
  </style>