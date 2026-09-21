import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import colores from "../utils/colores";
import { SesionContext } from "../utils/session";

export default function UserHeader() {
  const { usuario } = useContext(SesionContext);
  const nombre = usuario?.nombre || usuario?.usuario || "Usuario";
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <View style={styles.contenedor}>
      <View style={styles.foto}><Text style={styles.inicial}>{inicial}</Text></View>
      <Text style={styles.nombre}>{nombre}</Text>
      <Text style={styles.dato}>Usuario: {usuario?.usuario || ""}</Text>
      <View style={styles.etiquetaRol}><Text style={styles.textoRol}>{usuario?.rol || "Usuario"}</Text></View>
      <Text style={styles.origen}>Cuenta validada en Django</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { backgroundColor: colores.verde, paddingVertical: 26, paddingHorizontal: 18 },
  foto: { width: 66, height: 66, borderRadius: 33, backgroundColor: colores.blanco, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  inicial: { color: colores.verdeOscuro, fontSize: 30, fontWeight: "bold" },
  nombre: { color: colores.blanco, fontSize: 18, fontWeight: "bold" },
  dato: { color: colores.verdeClaro, fontSize: 13, marginTop: 3 },
  etiquetaRol: { backgroundColor: colores.verdeOscuro, alignSelf: "flex-start", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, marginTop: 10 },
  textoRol: { color: colores.blanco, fontSize: 12, fontWeight: "bold" },
  origen: { color: colores.verdeClaro, fontSize: 10, marginTop: 8 },
});
