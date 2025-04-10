import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Principal from '../components/Principal.vue'
import CrearSala from '../components/CrearSala.vue'
import UnirseSala from '../components/UnirseSala.vue'
import SalaEspera from '../components/SalaEspera.vue'
import Tablero from '../components/Tablero.vue'
import cardList from '../components/CardList.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/principal',
    name: 'Principal',
    component: Principal
  },
  {
    path: '/CrearSala',
    name: 'CrearSala',
    component: CrearSala
  },
  {
    path: '/unirseSala',
    name: 'unirseSala',
    component: UnirseSala
  },
  {
    path: '/SalaEspera',
    name: 'SalaEspera',
    component: SalaEspera
  },
  {
    path: '/tablero',
    name: 'Tablero',
    component: Tablero
  },
  {
    path: '/cardList',
    name: 'Cardlist',
    component: cardList
  }


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
