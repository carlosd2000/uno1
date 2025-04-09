// Importar Firebase y Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBXlt5vrE7rtmJkoQGQYIL0SGYyBftg4NI",
    authDomain: "uno1-25873.firebaseapp.com",
    projectId: "uno1-25873",
    storageBucket: "uno1-25873.firebasestorage.app",
    messagingSenderId: "8506978390",
    appId: "1:8506978390:web:bbd92cecd066e3ce928bf7"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Definir las cartas UNO
const colores = ["rojo", "amarillo", "verde", "azul"];
const cartasUNO = [];

// Crear cartas numéricas
colores.forEach(color => {
  // Un 0 por color
  cartasUNO.push({
    color: color,
    valor: 0,
    tipo: "número"
  });

  // Dos cartas por cada número del 1 al 9
  for (let i = 1; i <= 9; i++) {
    cartasUNO.push(
      { color: color, valor: i, tipo: "número" },
      { color: color, valor: i, tipo: "número" }
    );
  }

  // Dos cartas por cada acción: roba 2, reversa, salta
  const acciones = ["roba 2", "reversa", "salta"];
  acciones.forEach(accion => {
    cartasUNO.push(
      { color: color, valor: accion, tipo: "acción" },
      { color: color, valor: accion, tipo: "acción" }
    );
  });
});

// Agregar comodines (negro)
const comodines = [
  { valor: "comodín", tipo: "comodín" },
  { valor: "comodín +4", tipo: "comodín" }
];
comodines.forEach(({ valor, tipo }) => {
  for (let i = 0; i < 4; i++) { // 4 cartas de cada uno
    cartasUNO.push({
      color: "negro",
      valor,
      tipo
    });
  }
});

// Función para subir las cartas UNO
const subirCartasUNO = async () => {
  try {
    const refCartas = collection(db, "cartasUNO");

    for (const carta of cartasUNO) {
      console.log("Subiendo carta:", carta.color, carta.valor);
      await addDoc(refCartas, carta);
    }

    console.log("¡Todas las cartas de UNO fueron subidas correctamente!");
  } catch (error) {
    console.error("Error al subir cartas UNO:", error);
  }
};

subirCartasUNO();
