import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { obtenerPaquetes } from "../services/api";
import colores from "../utils/colores";
import { colorEstado } from "../utils/estados";

export default function Paquetes() {
  const [paquetes, setPaquetes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      setPaquetes(await obtenerPaquetes());
    } catch (e) {
      setError(e.message || "No se pudieron cargar los paquetes.");
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const texto = busqueda.trim().toLowerCase();
  const filtrados = paquetes.filter((item) => {
    if (!texto) return true;
    return [item.guia_fastbox, item.cliente_nombre, item.tienda_origen, item.descripcion]
      .filter(Boolean)
      .some((valor) => String(valor).toLowerCase().includes(texto));
  });

  return (
    <View style={styles.contenedor}>
      <View style={styles.barra}>
        <TextInput style={styles.entrada} value={busqueda} onChangeText={setBusqueda} placeholder="Buscar guía, cliente o tienda" placeholderTextColor={colores.textoSuave} />
        <TouchableOpacity style={styles.boton} onPress={cargar}><Text style={styles.textoBoton}>Recargar</Text></TouchableOpacity>
      </View>

      {cargando ? (
        <View style={styles.estado}><ActivityIndicator size="large" color={colores.verde} /><Text style={styles.textoEstado}>Consultando paquetes...</Text></View>
      ) : error ? (
        <View style={styles.estado}><Text style={styles.textoError}>{error}</Text><TouchableOpacity style={styles.botonReintentar} onPress={cargar}><Text style={styles.textoBoton}>Reintentar</Text></TouchableOpacity></View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.fuente}>API: /api/v1/paquetes/</Text>
          <Text style={styles.conteo}>{filtrados.length} paquetes registrados</Text>
          {filtrados.map((item) => (
            <View key={item.id_paquete} style={styles.tarjeta}>
              <View style={styles.filaTitulo}>
                <Text style={styles.guia}>{item.guia_fastbox}</Text>
                <View style={[styles.etiqueta, { backgroundColor: colorEstado(item.estado_texto) }]}><Text style={styles.textoEtiqueta}>{item.estado_texto}</Text></View>
              </View>
              <Text style={styles.cliente}>{item.cliente_nombre}</Text>
              <Text style={styles.casillero}>Casillero: {item.cliente_casillero}</Text>
              <Text style={styles.descripcion}>{item.descripcion}</Text>
              <View style={styles.separador} />
              <View style={styles.filaDatos}>
                <View style={styles.dato}><Text style={styles.etiquetaDato}>Tienda</Text><Text style={styles.valorDato}>{item.tienda_origen}</Text></View>
                <View style={styles.dato}><Text style={styles.etiquetaDato}>Peso</Text><Text style={styles.valorDato}>{item.peso_libras} lb</Text></View>
                <View style={styles.dato}><Text style={styles.etiquetaDato}>Costo</Text><Text style={styles.valorCosto}>${Number(item.costo_estimado).toFixed(2)}</Text></View>
              </View>
            </View>
          ))}
          {filtrados.length === 0 && <Text style={styles.vacio}>No se encontraron paquetes.</Text>}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  barra: { flexDirection: "row", padding: 14, backgroundColor: colores.blanco, borderBottomWidth: 1, borderBottomColor: colores.borde },
  entrada: { flex: 1, borderWidth: 1, borderColor: colores.borde, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, color: colores.texto, backgroundColor: colores.fondo },
  boton: { backgroundColor: colores.verde, borderRadius: 10, paddingHorizontal: 12, justifyContent: "center", marginLeft: 8 },
  textoBoton: { color: colores.blanco, fontWeight: "bold", fontSize: 12 },
  estado: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  textoEstado: { color: colores.textoSuave, marginTop: 10 },
  textoError: { color: colores.rojo, textAlign: "center" },
  botonReintentar: { backgroundColor: colores.verde, borderRadius: 9, paddingVertical: 9, paddingHorizontal: 15, marginTop: 12 },
  scroll: { padding: 16, paddingBottom: 30 },
  fuente: { color: colores.verdeOscuro, fontSize: 11, marginBottom: 5 },
  conteo: { color: colores.textoSuave, fontSize: 13, marginBottom: 10 },
  tarjeta: { backgroundColor: colores.blanco, borderRadius: 12, borderWidth: 1, borderColor: colores.borde, padding: 14, marginBottom: 12 },
  filaTitulo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  guia: { fontSize: 16, fontWeight: "bold", color: colores.texto },
  etiqueta: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 9, maxWidth: "55%" },
  textoEtiqueta: { color: colores.blanco, fontSize: 10, fontWeight: "bold", textAlign: "center" },
  cliente: { color: colores.texto, fontSize: 14, marginTop: 6 },
  casillero: { color: colores.textoSuave, fontSize: 12, marginTop: 2 },
  descripcion: { color: colores.textoSuave, fontSize: 12, marginTop: 3 },
  separador: { height: 1, backgroundColor: colores.borde, marginVertical: 10 },
  filaDatos: { flexDirection: "row", justifyContent: "space-between" },
  dato: { flex: 1 },
  etiquetaDato: { color: colores.textoSuave, fontSize: 11 },
  valorDato: { color: colores.texto, fontSize: 12, fontWeight: "bold", marginTop: 2 },
  valorCosto: { color: colores.verde, fontSize: 12, fontWeight: "bold", marginTop: 2 },
  vacio: { textAlign: "center", color: colores.textoSuave, marginTop: 20 },
});
