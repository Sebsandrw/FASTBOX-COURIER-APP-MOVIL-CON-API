import "react-native-gesture-handler";

import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LogoFastBox from "./components/LogoFastBox";
import AppNavigator from "./navigation/AppNavigator";
import colores from "./utils/colores";
import {
  SesionContext,
  borrarSesion,
  guardarSesion,
  obtenerSesion,
} from "./utils/session";

export default function App() {
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    revisarSesion();
  }, []);

  async function revisarSesion() {
    // La sesion se guarda solo despues de validar las credenciales en Django.
    const guardado = await obtenerSesion();
    setUsuario(guardado);
    setCargando(false);
  }

  async function entrar(datosUsuario) {
    await guardarSesion(datosUsuario);
    setUsuario(datosUsuario);
  }

  async function salir() {
    await borrarSesion();
    setUsuario(null);
  }

  if (cargando) {
    return (
      <View style={styles.splash}>
        <LogoFastBox tamano={100} />
        <Text style={styles.titulo}>FastBox Courier</Text>
        <Text style={styles.subtitulo}>Preparando la aplicación...</Text>
        <ActivityIndicator
          size="large"
          color={colores.verde}
          style={styles.indicador}
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.raiz}>
      <SafeAreaProvider>
        <SesionContext.Provider value={{ usuario, entrar, salir }}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SesionContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  splash: {
    flex: 1,
    backgroundColor: colores.fondo,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: colores.texto,
    marginTop: 16,
  },
  subtitulo: {
    color: colores.textoSuave,
    fontSize: 13,
    marginTop: 4,
  },
  indicador: { marginTop: 20 },
});
