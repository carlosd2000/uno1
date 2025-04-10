[1mdiff --git a/package.json b/package.json[m
[1mindex 8facdc4..c477cd5 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -4,7 +4,7 @@[m
   "version": "0.0.0",[m
   "type": "module",[m
   "scripts": {[m
[31m-    "dev": "vite",[m
[32m+[m[32m    "dev": "vite --host",[m
     "build": "vite build",[m
     "preview": "vite preview"[m
   },[m
[1mdiff --git a/src/components/CrearSala.vue b/src/components/CrearSala.vue[m
[1mindex b862300..ca43342 100644[m
[1m--- a/src/components/CrearSala.vue[m
[1m+++ b/src/components/CrearSala.vue[m
[36m@@ -73,6 +73,7 @@[m [mexport default {[m
     },[m
     async startGame() {[m
       await gameService.startGame(this.roomCode)[m
[32m+[m[32m      this.$router.push('/tablero')[m
     },[m
     goBack() {[m
       gameService.cancelSubscription()[m
[1mdiff --git a/src/components/Principal.vue b/src/components/Principal.vue[m
[1mindex 90b88ec..0db4a21 100644[m
[1m--- a/src/components/Principal.vue[m
[1m+++ b/src/components/Principal.vue[m
[36m@@ -1,3 +1,4 @@[m
[32m+[m
 <template>[m
   <div class="public-container">[m
     <button class="back-button" @click="logout" aria-label="Cerrar sesión">[m
[1mdiff --git a/src/router/index.js b/src/router/index.js[m
[1mindex 1432807..aa1abda 100644[m
[1m--- a/src/router/index.js[m
[1m+++ b/src/router/index.js[m
[36m@@ -6,6 +6,7 @@[m [mimport Principal from '../components/Principal.vue'[m
 import CrearSala from '../components/CrearSala.vue'[m
 import UnirseSala from '../components/UnirseSala.vue'[m
 import SalaEspera from '../components/SalaEspera.vue'[m
[32m+[m[32mimport Tablero from '../components/Tablero.vue'[m
 const routes = [[m
   {[m
     path: '/',[m
[36m@@ -41,7 +42,13 @@[m [mconst routes = [[m
     path: '/SalaEspera',[m
     name: 'SalaEspera',[m
     component: SalaEspera[m
[32m+[m[32m  },[m
[32m+[m[32m  {[m
[32m+[m[32m    path: '/tablero',[m
[32m+[m[32m    name: 'Tablero',[m
[32m+[m[32m    component: Tablero[m
   }[m
[32m+[m
 ][m
 [m
 const router = createRouter({[m
