import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Principal from '../components/Principal.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
