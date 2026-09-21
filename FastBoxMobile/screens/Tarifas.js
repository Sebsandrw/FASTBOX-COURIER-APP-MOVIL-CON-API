import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { obtenerTarifas } from "../services/api";
import colores from "../utils/colores";

export default function Tarifas() {
  const [tarifas, setTarifas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [peso, setPeso] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      const datos = await obtenerTarifas();
      setTarifas(datos);
      if (datos.length && !seleccionada) setSeleccionada(datos[0]);
    } catch (e) {
      setError(e.message || "No se pudieron cargar las tarifas.");
    } finally {
      setCargando(false);
    }
  }, [seleccionada]);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const libras = parseFloat(peso.replace(",", "."));
  const valor = Number(seleccionada?.valor_por_libra || 0);
  const total = Number.isNaN(libras) ? 0 : libras * valor;

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.scroll}>
      <View style={styles.encabezado}><View><Text style={styles.titulo}>Tarifas por libra</Text><Text style={styles.subtitulo}>Valores consultados desde Django.</Text></View><TouchableOpacity style={styles.boton} onPress={cargar}><Text style={styles.textoBoton}>Actualizar</Text></TouchableOpacity></View>
      <Text style={styles.fuente}>API: /api/v1/tarifas/</Text>

      {cargando ? <View style={styles.estado}><ActivityIndicator size="large" color={colores.verde} /></View> : error ? <Text style={styles.error}>{error}</Text> : tarifas.map((item) => {
        const activa = seleccionada?.id_tarifa === item.id_tarifa;
        return (
          <TouchableOpacity key={item.id_tarifa} style={[styles.tarjeta, activa && styles.tarjetaActiva]} onPress={() => setSeleccionada(item)}>
            <View style={styles.datos}><Text style={styles.categoria}>{item.categoria_texto || item.categoria}</Text><Text style={styles.detalle}>{item.descripcion || "Tarifa configurada en el sistema"}</Text></View>
            <Text style={styles.valor}>${Number(item.valor_por_libra).toFixed(2)}</Text>
          </TouchableOpacity>
        );
      })}

      {seleccionada && (
        <View style={styles.calculadora}>
          <Text style={styles.tituloCalculadora}>Cálculo rápido</Text>
          <Text style={styles.etiqueta}>Peso en libras</Text>
          <TextInput style={styles.entrada} value={peso} onChangeText={setPeso} placeholder="Ejemplo: 4.5" placeholderTextColor={colores.textoSuave} keyboardType="decimal-pad" />
          <View style={styles.filaTotal}><Text style={styles.textoTotal}>{seleccionada.categoria_texto || seleccionada.categoria} · ${valor.toFixed(2)} por libra</Text><Text style={styles.total}>${total.toFixed(2)}</Text></View>
        </View>
      )}
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
  tarjeta: { flexDirection: "row", alignItems: "center", backgroundColor: colores.blanco, borderRadius: 12, borderWidth: 1, borderColor: colores.borde, padding: 14, marginBottom: 10 },
  tarjetaActiva: { borderColor: colores.verde, backgroundColor: colores.verdeClaro },
  datos: { flex: 1 },
  categoria: { fontSize: 15, fontWeight: "bold", color: colores.texto },
  detalle: { color: colores.textoSuave, fontSize: 12, marginTop: 2 },
  valor: { fontSize: 18, fontWeight: "bold", color: colores.verde },
  calculadora: { backgroundColor: colores.blanco, borderRadius: 12, borderWidth: 1, borderColor: colores.borde, padding: 16, marginTop: 8 },
  tituloCalculadora: { fontSize: 16, fontWeight: "bold", color: colores.texto, marginBottom: 12 },
  etiqueta: { color: colores.textoSuave, fontSize: 12, fontWeight: "bold", marginBottom: 5 },
  entrada: { borderWidth: 1, borderColor: colores.borde, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: colores.texto, backgroundColor: colores.fondo },
  filaTotal: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colores.verdeClaro, borderRadius: 10, padding: 12, marginTop: 14 },
  textoTotal: { color: colores.verdeOscuro, fontSize: 12, flex: 1 },
  total: { color: colores.verdeOscuro, fontSize: 20, fontWeight: "bold" },
});
