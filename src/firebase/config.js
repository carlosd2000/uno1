import { initializeApp } from "firebase/app";//modulos de firebase 
import { getFirestore } from "firebase/firestore";//traer base de datos
import { getAuth } from "firebase/auth";// autentificacion
//las variables de entorno conexion
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
//se establese la conecion con app
const app = initializeApp(firebaseConfig);
//base de datos
const db = getFirestore(app);
// le pasa los datos de la autentificacion
const auth = getAuth(app);

export { db, auth };
