import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { obtenerMovimientos } from "../services/api";
import colores from "../utils/colores";
import { colorEstado } from "../utils/estados";

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    try { setCargando(true); setError(""); setMovimientos(await obtenerMovimientos()); }
    catch (e) { setError(e.message || "No se pudieron cargar los movimientos."); }
    finally { setCargando(false); }
  }, []);
  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.scroll}>
      <View style={styles.encabezado}><View><Text style={styles.titulo}>Movimientos</Text><Text style={styles.subtitulo}>Historial de cambios de estado.</Text></View><TouchableOpacity style={styles.boton} onPress={cargar}><Text style={styles.textoBoton}>Actualizar</Text></TouchableOpacity></View>
      <Text style={styles.fuente}>API: /api/v1/movimientos/</Text>
      {cargando ? <View style={styles.estado}><ActivityIndicator size="large" color={colores.verde} /></View> : error ? <Text style={styles.error}>{error}</Text> : movimientos.map((item) => (
        <View key={item.id_movimiento} style={styles.tarjeta}>
          <View style={styles.filaTitulo}><Text style={styles.guia}>{item.paquete_guia}</Text><View style={[styles.etiqueta, { backgroundColor: colorEstado(item.estado_texto) }]}><Text style={styles.textoEtiqueta}>{item.estado_texto}</Text></View></View>
          <Text style={styles.detalle}>{item.detalle}</Text>
          <Text style={styles.fecha}>{new Date(item.fecha_hora).toLocaleString("es-EC")}</Text>
        </View>
      ))}
      {!cargando && !error && movimientos.length === 0 && <Text style={styles.vacio}>No hay movimientos registrados.</Text>}
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
  tarjeta: { backgroundColor: colores.blanco, borderRadius: 12, borderWidth: 1, borderColor: colores.borde, padding: 14, marginBottom: 12 },
  filaTitulo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  guia: { fontSize: 15, fontWeight: "bold", color: colores.texto },
  etiqueta: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 9, maxWidth: "58%" },
  textoEtiqueta: { color: colores.blanco, fontSize: 10, fontWeight: "bold", textAlign: "center" },
  detalle: { color: colores.texto, fontSize: 13 },
  fecha: { color: colores.textoSuave, fontSize: 11, marginTop: 7 },
  vacio: { color: colores.textoSuave, textAlign: "center", marginTop: 30 },
});
