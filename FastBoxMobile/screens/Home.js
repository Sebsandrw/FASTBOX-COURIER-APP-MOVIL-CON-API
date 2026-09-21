import { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  obtenerBitacora,
  obtenerClientes,
  obtenerMovimientos,
  obtenerPaquetes,
  obtenerTarifas,
} from "../services/api";
import colores from "../utils/colores";
import { SesionContext } from "../utils/session";

const accesos = [
  { nombre: "Envíos", icono: "🚚", pantalla: "Envios" },
  { nombre: "Seguimiento", icono: "📍", pantalla: "Seguimiento" },
  { nombre: "Tarifas", icono: "💰", pantalla: "Tarifas" },
  { nombre: "Bitácora", icono: "📒", pantalla: "Bitacora" },
];

export default function Home({ navigation }) {
  const { usuario } = useContext(SesionContext);
  const [resumen, setResumen] = useState([]);
  const [actividad, setActividad] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      const [clientes, paquetes, movimientos, tarifas, bitacora] = await Promise.all([
        obtenerClientes(),
        obtenerPaquetes(),
        obtenerMovimientos(),
        obtenerTarifas(),
        obtenerBitacora(),
      ]);

      setResumen([
        { titulo: "Clientes", valor: clientes.length, detalle: "Casilleros registrados" },
        { titulo: "Paquetes", valor: paquetes.length, detalle: "Guías registradas" },
        { titulo: "Movimientos", valor: movimientos.length, detalle: "Cambios de estado" },
        { titulo: "Tarifas", valor: tarifas.length, detalle: "Categorías configuradas" },
      ]);
      setActividad(bitacora.slice(0, 4));
    } catch (e) {
      setError(e.message || "No se pudieron cargar los datos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.scroll}>
      <View style={styles.saludo}>
        <Text style={styles.hola}>
          Hola {usuario?.nombre ? usuario.nombre.split(" ")[0] : usuario?.usuario || ""}
        </Text>
        <Text style={styles.subtitulo}>Resumen obtenido desde las API de AlwaysData.</Text>
      </View>

      {cargando ? (
        <View style={styles.estado}><ActivityIndicator size="large" color={colores.verde} /><Text style={styles.textoEstado}>Consultando información...</Text></View>
      ) : error ? (
        <View style={styles.error}><Text style={styles.textoError}>{error}</Text><TouchableOpacity onPress={cargar} style={styles.boton}><Text style={styles.textoBoton}>Reintentar</Text></TouchableOpacity></View>
      ) : (
        <>
          <View style={styles.grilla}>
            {resumen.map((item) => (
              <View key={item.titulo} style={styles.tarjetaResumen}>
                <Text style={styles.tituloResumen}>{item.titulo}</Text>
                <Text style={styles.valorResumen}>{item.valor}</Text>
                <Text style={styles.detalleResumen}>{item.detalle}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.tituloSeccion}>Accesos rápidos</Text>
          <View style={styles.grilla}>
            {accesos.map((item) => (
              <TouchableOpacity key={item.nombre} style={styles.acceso} onPress={() => navigation.navigate(item.pantalla)}>
                <Text style={styles.iconoAcceso}>{item.icono}</Text>
                <Text style={styles.textoAcceso}>{item.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.tituloSeccion}>Actividad reciente</Text>
          <View style={styles.tarjeta}>
            {actividad.length === 0 ? <Text style={styles.vacio}>No hay actividad registrada.</Text> : actividad.map((item, indice) => (
              <View key={item.id_bitacora} style={[styles.filaActividad, indice === actividad.length - 1 && styles.filaFinal]}>
                <View style={styles.punto} />
                <View style={styles.datosActividad}>
                  <Text style={styles.textoActividad}>{item.accion}</Text>
                  <Text style={styles.fechaActividad}>{item.descripcion}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity onPress={cargar} style={styles.refrescar}><Text style={styles.refrescarTexto}>Actualizar datos</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  scroll: { padding: 16, paddingBottom: 30 },
  saludo: { marginBottom: 16 },
  hola: { fontSize: 22, fontWeight: "bold", color: colores.texto },
  subtitulo: { color: colores.textoSuave, fontSize: 13, marginTop: 4 },
  estado: { paddingVertical: 40, alignItems: "center" },
  textoEstado: { color: colores.textoSuave, marginTop: 10 },
  error: { backgroundColor: "#FDECEA", padding: 14, borderRadius: 10, marginBottom: 12 },
  textoError: { color: colores.rojo, textAlign: "center" },
  boton: { alignSelf: "center", backgroundColor: colores.verde, paddingVertical: 9, paddingHorizontal: 16, borderRadius: 9, marginTop: 10 },
  textoBoton: { color: colores.blanco, fontWeight: "bold" },
  grilla: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  tarjetaResumen: { width: "48%", backgroundColor: colores.blanco, borderRadius: 12, borderWidth: 1, borderColor: colores.borde, padding: 14, marginBottom: 12 },
  tituloResumen: { color: colores.textoSuave, fontSize: 13 },
  valorResumen: { color: colores.verde, fontSize: 26, fontWeight: "bold", marginVertical: 2 },
  detalleResumen: { color: colores.textoSuave, fontSize: 11 },
  tituloSeccion: { fontSize: 16, fontWeight: "bold", color: colores.texto, marginTop: 8, marginBottom: 10 },
  acceso: { width: "48%", backgroundColor: colores.verdeClaro, borderRadius: 12, paddingVertical: 16, alignItems: "center", marginBottom: 12 },
  iconoAcceso: { fontSize: 22, marginBottom: 6 },
  textoAcceso: { color: colores.verdeOscuro, fontWeight: "bold", fontSize: 13 },
  tarjeta: { backgroundColor: colores.blanco, borderRadius: 12, borderWidth: 1, borderColor: colores.borde, paddingHorizontal: 14 },
  filaActividad: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colores.borde },
  filaFinal: { borderBottomWidth: 0 },
  punto: { width: 9, height: 9, borderRadius: 5, backgroundColor: colores.verde, marginTop: 5, marginRight: 10 },
  datosActividad: { flex: 1 },
  textoActividad: { color: colores.texto, fontSize: 14, fontWeight: "600" },
  fechaActividad: { color: colores.textoSuave, fontSize: 11, marginTop: 2 },
  vacio: { color: colores.textoSuave, paddingVertical: 14, textAlign: "center" },
  refrescar: { marginTop: 16, alignSelf: "center", paddingVertical: 8, paddingHorizontal: 14 },
  refrescarTexto: { color: colores.verde, fontWeight: "bold", fontSize: 12 },
});
