// Contenido del menu lateral (Drawer).
// Arriba van los datos del usuario, luego las opciones y al final cerrar sesion.

import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { StyleSheet, Text, View } from "react-native";
import colores from "../utils/colores";
import CerrarSesion from "./CerrarSesion";
import UserHeader from "./UserHeader";

export default function ContenidoDrawer(props) {
  return (
    <View style={styles.contenedor}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        <UserHeader />

        <Text style={styles.titulo}>MODULOS</Text>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <CerrarSesion />

      <Text style={styles.version}>FastBox Courier v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.blanco,
  },

  scroll: {
    paddingTop: 0,
  },

  titulo: {
    color: colores.textoSuave,
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 18,
    marginTop: 16,
    marginBottom: 6,
    letterSpacing: 1,
  },

  version: {
    color: colores.textoSuave,
    fontSize: 11,
    textAlign: "center",
    marginBottom: 14,
  },
});
