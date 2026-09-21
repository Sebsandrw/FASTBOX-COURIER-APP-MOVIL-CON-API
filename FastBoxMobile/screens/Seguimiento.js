import { useState } from "react";
import { ActivityIndicator, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { buscarPaquetes } from "../services/api";
import colores from "../utils/colores";
import { colorEstado } from "../utils/estados";

export default function Seguimiento() {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function buscar() {
    Keyboard.dismiss();
    const texto = codigo.trim();
    if (!texto) { setResultado(null); setMensaje("Escriba el número de guía."); return; }
    try {
      setCargando(true); setMensaje(""); setResultado(null);
      const encontrados = await buscarPaquetes(texto);
      const exacto = encontrados.find((p) => p.guia_fastbox?.toUpperCase() === texto.toUpperCase()) || encontrados[0];
      if (!exacto) setMensaje("No se encontró la guía indicada.");
      else setResultado(exacto);
    } catch (e) { setMensaje(e.message || "No fue posible consultar la guía."); }
    finally { setCargando(false); }
  }

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.scroll}>
      <View style={styles.tarjeta}>
        <Text style={styles.tituloTarjeta}>Consultar guía</Text>
        <Text style={styles.fuente}>Consulta directa a /api/v1/paquetes/</Text>
        <TextInput style={styles.entrada} value={codigo} onChangeText={setCodigo} placeholder="Ejemplo: FBX-5252" placeholderTextColor={colores.textoSuave} autoCapitalize="characters" autoCorrect={false} onSubmitEditing={buscar} />
        <TouchableOpacity style={styles.boton} onPress={buscar}><Text style={styles.textoBoton}>Buscar</Text></TouchableOpacity>
        {cargando && <ActivityIndicator style={styles.indicador} color={colores.verde} />}
        {mensaje !== "" && <Text style={styles.mensaje}>{mensaje}</Text>}
      </View>

      {resultado && (
        <View style={styles.tarjeta}>
          <View style={styles.filaTitulo}><Text style={styles.guia}>{resultado.guia_fastbox}</Text><View style={[styles.etiqueta, { backgroundColor: colorEstado(resultado.estado_texto) }]}><Text style={styles.textoEtiqueta}>{resultado.estado_texto}</Text></View></View>
          <Text style={styles.detalle}><Text style={styles.negrita}>Cliente:</Text> {resultado.cliente_nombre}</Text>
          <Text style={styles.detalle}><Text style={styles.negrita}>Casillero:</Text> {resultado.cliente_casillero}</Text>
          <Text style={styles.detalle}><Text style={styles.negrita}>Tienda:</Text> {resultado.tienda_origen}</Text>
          <Text style={styles.detalle}><Text style={styles.negrita}>Descripción:</Text> {resultado.descripcion}</Text>
          <Text style={styles.detalle}><Text style={styles.negrita}>Peso:</Text> {resultado.peso_libras} lb</Text>
          <Text style={styles.detalle}><Text style={styles.negrita}>Costo:</Text> ${Number(resultado.costo_estimado).toFixed(2)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  scroll: { padding: 16, paddingBottom: 30 },
  tarjeta: { backgroundColor: colores.blanco, borderRadius: 12, borderWidth: 1, borderColor: colores.borde, padding: 16, marginBottom: 14 },
  tituloTarjeta: { fontSize: 16, fontWeight: "bold", color: colores.texto, marginBottom: 3 },
  fuente: { color: colores.verdeOscuro, fontSize: 11, marginBottom: 12 },
  entrada: { borderWidth: 1, borderColor: colores.borde, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, color: colores.texto, backgroundColor: colores.fondo },
  boton: { backgroundColor: colores.verde, borderRadius: 10, paddingVertical: 12, alignItems: "center", marginTop: 12 },
  textoBoton: { color: colores.blanco, fontWeight: "bold", fontSize: 14 },
  indicador: { marginTop: 12 },
  mensaje: { color: colores.rojo, fontSize: 13, textAlign: "center", marginTop: 12 },
  filaTitulo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  guia: { fontSize: 17, fontWeight: "bold", color: colores.texto },
  etiqueta: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 9, maxWidth: "58%" },
  textoEtiqueta: { color: colores.blanco, fontSize: 10, fontWeight: "bold", textAlign: "center" },
  detalle: { color: colores.textoSuave, fontSize: 13, marginBottom: 5 },
  negrita: { color: colores.texto, fontWeight: "bold" },
});
