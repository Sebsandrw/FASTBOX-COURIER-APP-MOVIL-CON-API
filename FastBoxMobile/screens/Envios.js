import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { obtenerPaquetes } from "../services/api";
import colores from "../utils/colores";
import { colorEstado } from "../utils/estados";

export default function Envios() {
  const [envios, setEnvios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const cargar = useCallback(async () => {
    try { setCargando(true); setError(""); setEnvios(await obtenerPaquetes()); }
    catch (e) { setError(e.message || "No se pudieron cargar los envíos."); }
    finally { setCargando(false); }
  }, []);
  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.scroll}>
      <View style={styles.encabezado}><View><Text style={styles.titulo}>Envíos</Text><Text style={styles.subtitulo}>Vista móvil de las guías registradas.</Text></View><TouchableOpacity style={styles.boton} onPress={cargar}><Text style={styles.textoBoton}>Actualizar</Text></TouchableOpacity></View>
      <Text style={styles.fuente}>Datos desde API de paquetes</Text>
      {cargando ? <View style={styles.estado}><ActivityIndicator size="large" color={colores.verde} /></View> : error ? <Text style={styles.error}>{error}</Text> : envios.map((item) => (
        <View key={item.id_paquete} style={styles.tarjeta}>
          <View style={styles.filaTitulo}><Text style={styles.codigo}>{item.guia_fastbox}</Text><View style={[styles.etiqueta,{backgroundColor: colorEstado(item.estado_texto)}]}><Text style={styles.textoEtiqueta}>{item.estado_texto}</Text></View></View>
          <View style={styles.fila}><Text style={styles.campo}>Cliente</Text><Text style={styles.valor}>{item.cliente_nombre}</Text></View>
          <View style={styles.fila}><Text style={styles.campo}>Tienda</Text><Text style={styles.valor}>{item.tienda_origen}</Text></View>
          <View style={styles.fila}><Text style={styles.campo}>Tracking</Text><Text style={styles.valor}>{item.tracking_original || "No registrado"}</Text></View>
        </View>
      ))}
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
  tarjeta: { backgroundColor: colores.blanco, borderRadius: 12, borderWidth: 1, borderColor: colores.borde, borderLeftWidth: 4, borderLeftColor: colores.verde, padding: 14, marginBottom: 12 },
  filaTitulo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  codigo: { fontSize: 16, fontWeight: "bold", color: colores.texto },
  etiqueta: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 9, maxWidth: "58%" },
  textoEtiqueta: { color: colores.blanco, fontSize: 10, fontWeight: "bold", textAlign: "center" },
  fila: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  campo: { color: colores.textoSuave, fontSize: 13 },
  valor: { color: colores.texto, fontSize: 12, fontWeight: "bold", flexShrink: 1, textAlign: "right", maxWidth: "68%" },
});
