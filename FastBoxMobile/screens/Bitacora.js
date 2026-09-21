import { useCallback, useContext, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { obtenerBitacora } from "../services/api";
import colores from "../utils/colores";
import { SesionContext } from "../utils/session";

export default function Bitacora() {
  const { usuario } = useContext(SesionContext);
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    try { setCargando(true); setError(""); setRegistros(await obtenerBitacora()); }
    catch (e) { setError(e.message || "No se pudo cargar la bitácora."); }
    finally { setCargando(false); }
  }, []);
  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.scroll}>
      <View style={styles.encabezado}><View><Text style={styles.titulo}>Bitácora del sistema</Text><Text style={styles.subtitulo}>Sesión: {usuario?.usuario || ""}</Text></View><TouchableOpacity style={styles.boton} onPress={cargar}><Text style={styles.textoBoton}>Actualizar</Text></TouchableOpacity></View>
      <Text style={styles.fuente}>API: /api/v1/bitacora/</Text>
      {cargando ? <View style={styles.estado}><ActivityIndicator size="large" color={colores.verde} /></View> : error ? <Text style={styles.error}>{error}</Text> : registros.map((item) => (
        <View key={item.id_bitacora} style={styles.fila}>
          <View style={styles.columnaHora}><Text style={styles.hora}>{new Date(item.fecha_hora).toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })}</Text><Text style={styles.fecha}>{new Date(item.fecha_hora).toLocaleDateString("es-EC")}</Text></View>
          <View style={styles.linea} />
          <View style={styles.datos}><Text style={styles.accion}>{item.accion}</Text><Text style={styles.detalle}>{item.descripcion}</Text><Text style={styles.usuario}>Usuario: {item.usuario} · {item.modulo}</Text></View>
        </View>
      ))}
      {!cargando && !error && registros.length === 0 && <Text style={styles.vacio}>No hay registros en la bitácora.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  scroll: { padding: 16, paddingBottom: 30 },
  encabezado: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titulo: { fontSize: 18, fontWeight: "bold", color: colores.texto },
  subtitulo: { color: colores.textoSuave, fontSize: 12, marginTop: 3 },
  fuente: { color: colores.verdeOscuro, fontSize: 11, marginTop: 5, marginBottom: 12 },
  boton: { backgroundColor: colores.verde, borderRadius: 9, paddingVertical: 9, paddingHorizontal: 13 },
  textoBoton: { color: colores.blanco, fontWeight: "bold", fontSize: 12 },
  estado: { paddingVertical: 35, alignItems: "center" },
  error: { color: colores.rojo, textAlign: "center", padding: 20 },
  fila: { flexDirection: "row", marginBottom: 4 },
  columnaHora: { width: 65, paddingTop: 12 },
  hora: { color: colores.texto, fontSize: 13, fontWeight: "bold" },
  fecha: { color: colores.textoSuave, fontSize: 10 },
  linea: { width: 2, backgroundColor: colores.borde, marginRight: 12 },
  datos: { flex: 1, backgroundColor: colores.blanco, borderRadius: 12, borderWidth: 1, borderColor: colores.borde, padding: 12, marginBottom: 10 },
  accion: { color: colores.verdeOscuro, fontSize: 14, fontWeight: "bold" },
  detalle: { color: colores.texto, fontSize: 13, marginTop: 3 },
  usuario: { color: colores.textoSuave, fontSize: 11, marginTop: 5 },
  vacio: { color: colores.textoSuave, textAlign: "center", marginTop: 30 },
});
