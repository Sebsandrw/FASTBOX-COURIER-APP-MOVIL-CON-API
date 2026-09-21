// Logo de FastBox armado con Views (una cajita de encomienda).

import { StyleSheet, View } from "react-native";
import colores from "../utils/colores";

export default function LogoFastBox({ tamano = 90 }) {
  return (
    <View
      style={[
        styles.circulo,
        { width: tamano, height: tamano, borderRadius: tamano / 2 },
      ]}
    >
      <View style={styles.caja}>
        <View style={styles.tapa} />
        <View style={styles.cinta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: {
    backgroundColor: colores.verde,
    justifyContent: "center",
    alignItems: "center",
  },

  caja: {
    width: 46,
    height: 38,
    backgroundColor: colores.blanco,
    borderRadius: 6,
    overflow: "hidden",
    alignItems: "center",
  },

  tapa: {
    width: "100%",
    height: 11,
    backgroundColor: colores.verdeClaro,
  },

  cinta: {
    width: 8,
    flex: 1,
    backgroundColor: colores.verdeOscuro,
  },
});
