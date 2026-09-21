// Guarda solamente la sesion que ya fue validada por la API de Django.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext } from "react";

const CLAVE = "sesion_fastbox_api_v2";

export const SesionContext = createContext(null);

export async function guardarSesion(usuario) {
  await AsyncStorage.setItem(CLAVE, JSON.stringify(usuario));
}

export async function obtenerSesion() {
  const datos = await AsyncStorage.getItem(CLAVE);
  return datos ? JSON.parse(datos) : null;
}

export async function borrarSesion() {
  await AsyncStorage.removeItem(CLAVE);
}
