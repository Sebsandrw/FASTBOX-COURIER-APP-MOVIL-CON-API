import { useContext, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import LogoFastBox from "../components/LogoFastBox";
import { iniciarSesionApi } from "../services/api";
import colores from "../utils/colores";
import { SesionContext } from "../utils/session";

export default function Login() {
  const { entrar } = useContext(SesionContext);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function ingresar() {
    setError("");

    if (!usuario.trim() || !password.trim()) {
      setError("Escriba el usuario y la contraseña.");
      return;
    }

    try {
      setCargando(true);
      const respuesta = await iniciarSesionApi(usuario.trim(), password);
      await entrar(respuesta.usuario);
    } catch (e) {
      setError(e.message || "No fue posible iniciar sesión.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colores.verdeOscuro} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.encabezado}>
          <LogoFastBox tamano={94} />
          <Text style={styles.titulo}>
            FastBox <Text style={styles.tituloVerde}>Courier</Text>
          </Text>
          <Text style={styles.subtitulo}>
            Sistema de envíos e importaciones por peso
          </Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.tituloTarjeta}>Iniciar sesión</Text>
          <Text style={styles.descripcion}>
            Ingrese con un usuario registrado en el sistema Django.
          </Text>

          <Text style={styles.etiqueta}>Usuario</Text>
          <TextInput
            style={styles.entrada}
            value={usuario}
            onChangeText={setUsuario}
            placeholder="Ejemplo: admin"
            placeholderTextColor={colores.textoSuave}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.etiqueta}>Contraseña</Text>
          <View style={styles.filaClave}>
            <TextInput
              style={styles.entradaClave}
              value={password}
              onChangeText={setPassword}
              placeholder="Ingrese su contraseña"
              placeholderTextColor={colores.textoSuave}
              secureTextEntry={!verClave}
              autoCapitalize="none"
              onSubmitEditing={ingresar}
            />
            <TouchableOpacity onPress={() => setVerClave(!verClave)}>
              <Text style={styles.verClave}>{verClave ? "Ocultar" : "Ver"}</Text>
            </TouchableOpacity>
          </View>

          {error !== "" && (
            <View style={styles.cajaError}>
              <Text style={styles.textoError}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.boton, cargando && styles.botonDeshabilitado]}
            onPress={ingresar}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color={colores.blanco} />
            ) : (
              <Text style={styles.textoBoton}>INGRESAR</Text>
            )}
          </TouchableOpacity>

          <View style={styles.infoApi}>
            <Text style={styles.infoTitulo}>Autenticación en línea</Text>
            <Text style={styles.infoTexto}>
              Las credenciales se validan directamente en Django / AlwaysData.
            </Text>
          </View>
        </View>

        <Text style={styles.pie}>FastBox Courier · Aplicación móvil</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 22 },
  encabezado: { alignItems: "center", marginBottom: 24 },
  titulo: { fontSize: 28, fontWeight: "bold", color: colores.texto, marginTop: 14 },
  tituloVerde: { color: colores.verde },
  subtitulo: { color: colores.textoSuave, fontSize: 13, marginTop: 4, textAlign: "center" },
  tarjeta: {
    backgroundColor: colores.blanco,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colores.borde,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  tituloTarjeta: { fontSize: 19, fontWeight: "bold", color: colores.texto },
  descripcion: { fontSize: 12, color: colores.textoSuave, marginTop: 4, marginBottom: 16 },
  etiqueta: { color: colores.textoSuave, fontSize: 13, marginBottom: 6, fontWeight: "bold" },
  entrada: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colores.texto,
    backgroundColor: colores.fondo,
    marginBottom: 14,
  },
  filaClave: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    backgroundColor: colores.fondo,
    paddingRight: 12,
  },
  entradaClave: { flex: 1, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, color: colores.texto },
  verClave: { color: colores.verde, fontWeight: "bold", fontSize: 13 },
  cajaError: { backgroundColor: "#FDECEA", borderRadius: 8, padding: 10, marginTop: 12 },
  textoError: { color: colores.rojo, fontSize: 13, textAlign: "center" },
  boton: { backgroundColor: colores.verde, borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 18 },
  botonDeshabilitado: { opacity: 0.7 },
  textoBoton: { color: colores.blanco, fontWeight: "bold", fontSize: 15, letterSpacing: 1 },
  infoApi: { backgroundColor: colores.verdeClaro, borderRadius: 10, padding: 12, marginTop: 18 },
  infoTitulo: { color: colores.verdeOscuro, fontSize: 12, fontWeight: "bold", textAlign: "center" },
  infoTexto: { color: colores.verdeOscuro, fontSize: 11, textAlign: "center", marginTop: 3 },
  pie: { textAlign: "center", color: colores.textoSuave, fontSize: 12, marginTop: 18 },
});
