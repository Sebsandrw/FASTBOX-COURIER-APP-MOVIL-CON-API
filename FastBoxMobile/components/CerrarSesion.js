// Boton para cerrar sesion. Se usa en el menu lateral.

import { useContext } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import colores from "../utils/colores";
import { SesionContext } from "../utils/session";

export default function CerrarSesion() {
  const { salir } = useContext(SesionContext);

  function confirmar() {
    Alert.alert("Cerrar sesion", "Se cerrara la sesion actual.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesion", onPress: salir },
    ]);
  }

  return (
    <TouchableOpacity style={styles.boton} onPress={confirmar}>
      <Text style={styles.texto}>Cerrar sesion</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    borderWidth: 1,
    borderColor: colores.rojo,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 22,
  },

  texto: {
    color: colores.rojo,
    fontWeight: "bold",
    fontSize: 14,
  },
});
