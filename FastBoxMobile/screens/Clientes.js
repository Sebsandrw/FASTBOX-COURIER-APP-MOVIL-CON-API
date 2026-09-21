import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { obtenerClientes } from "../services/api";
import colores from "../utils/colores";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      setClientes(await obtenerClientes());
    } catch (e) {
      setError(e.message || "No se pudieron cargar los clientes.");
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  if (cargando) return <View style={styles.estado}><ActivityIndicator size="large" color={colores.verde} /><Text style={styles.textoEstado}>Consultando clientes...</Text></View>;
  if (error) return <View style={styles.estado}><Text style={styles.textoError}>{error}</Text><TouchableOpacity style={styles.boton} onPress={cargar}><Text style={styles.textoBoton}>Reintentar</Text></TouchableOpacity></View>;

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.scroll}>
      <View style={styles.encabezado}><View><Text style={styles.titulo}>Clientes</Text><Text style={styles.subtitulo}>Datos registrados en Django.</Text></View><TouchableOpacity style={styles.boton} onPress={cargar}><Text style={styles.textoBoton}>Actualizar</Text></TouchableOpacity></View>
      <Text style={styles.fuente}>API: /api/v1/clientes/</Text>
      {clientes.map((item) => {
        const nombre = `${item.nombres || ""} ${item.apellidos || ""}`.trim();
        return (
          <View key={item.id_cliente} style={styles.tarjetaCliente}>
            <View style={styles.avatar}><Text style={styles.inicial}>{nombre.charAt(0) || "C"}</Text></View>
            <View style={styles.datos}>
              <Text style={styles.nombre}>{nombre}</Text>
              <Text style={styles.detalle}>Casillero: {item.casillero}</Text>
              <Text style={styles.detalle}>Correo: {item.correo}</Text>
              <Text style={styles.detalle}>Teléfono: {item.telefono || "No registrado"}</Text>
            </View>
            <View style={[styles.estadoTag, { backgroundColor: item.estado ? colores.verdeClaro : "#FDECEA" }]}><Text style={[styles.estadoTexto, { color: item.estado ? colores.verdeOscuro : colores.rojo }]}>{item.estado ? "Activo" : "Inactivo"}</Text></View>
          </View>
        );
      })}
      {clientes.length === 0 && <Text style={styles.vacio}>No hay clientes registrados.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  scroll: { padding: 16, paddingBottom: 30 },
  encabezado: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  titulo: { fontSize: 18, fontWeight: "bold", color: colores.texto },
  subtitulo: { color: colores.textoSuave, fontSize: 12, marginTop: 3 },
  fuente: { color: colores.verdeOscuro, fontSize: 11, marginBottom: 12 },
  boton: { backgroundColor: colores.verde, borderRadius: 9, paddingVertical: 9, paddingHorizontal: 13 },
  textoBoton: { color: colores.blanco, fontWeight: "bold", fontSize: 12 },
  estado: { flex: 1, backgroundColor: colores.fondo, justifyContent: "center", alignItems: "center", padding: 24 },
  textoEstado: { color: colores.textoSuave, marginTop: 10 },
  textoError: { color: colores.rojo, textAlign: "center", marginBottom: 12 },
  tarjetaCliente: { flexDirection: "row", alignItems: "center", backgroundColor: colores.blanco, borderRadius: 12, borderWidth: 1, borderColor: colores.borde, padding: 12, marginBottom: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colores.verdeClaro, justifyContent: "center", alignItems: "center", marginRight: 12 },
  inicial: { color: colores.verdeOscuro, fontWeight: "bold", fontSize: 18 },
  datos: { flex: 1 },
  nombre: { color: colores.texto, fontSize: 15, fontWeight: "bold" },
  detalle: { color: colores.textoSuave, fontSize: 11, marginTop: 2 },
  estadoTag: { borderRadius: 10, paddingVertical: 4, paddingHorizontal: 7, marginLeft: 6 },
  estadoTexto: { fontSize: 10, fontWeight: "bold" },
  vacio: { textAlign: "center", color: colores.textoSuave, marginTop: 30 },
});
