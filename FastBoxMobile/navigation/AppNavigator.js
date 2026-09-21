// Aqui se arma toda la navegacion de la aplicacion.
// Stack (Login por API) + Drawer (modulos) + TAB (Inicio, Paquetes, Clientes).

import { useContext } from "react";
import { Text } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ContenidoDrawer from "../components/ContenidoDrawer";

import Bitacora from "../screens/Bitacora";
import Clientes from "../screens/Clientes";
import Envios from "../screens/Envios";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Movimientos from "../screens/Movimientos";
import Paquetes from "../screens/Paquetes";
import Seguimiento from "../screens/Seguimiento";
import Tarifas from "../screens/Tarifas";

import colores from "../utils/colores";
import { SesionContext } from "../utils/session";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Icono con emoji para no depender de librerias externas
function Icono({ simbolo, tamano }) {
  return <Text style={{ fontSize: tamano ? tamano - 4 : 18 }}>{simbolo}</Text>;
}

// TAB inferior: HOME + dos modulos
function TabsPrincipal() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colores.verde,
        tabBarInactiveTintColor: colores.textoSuave,
        tabBarStyle: {
          backgroundColor: colores.blanco,
          borderTopColor: colores.borde,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="InicioTab"
        component={Home}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ size }) => <Icono simbolo={"\u{1F3E0}"} tamano={size} />,
        }}
      />

      <Tab.Screen
        name="PaquetesTab"
        component={Paquetes}
        options={{
          tabBarLabel: "Paquetes",
          tabBarIcon: ({ size }) => <Icono simbolo={"\u{1F4E6}"} tamano={size} />,
        }}
      />

      <Tab.Screen
        name="ClientesTab"
        component={Clientes}
        options={{
          tabBarLabel: "Clientes",
          tabBarIcon: ({ size }) => <Icono simbolo={"\u{1F465}"} tamano={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Menu lateral con todos los modulos del sistema
function MenuLateral() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <ContenidoDrawer {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colores.verde },
        headerTintColor: colores.blanco,
        headerTitleStyle: { fontWeight: "bold" },
        drawerActiveBackgroundColor: colores.verdeClaro,
        drawerActiveTintColor: colores.verdeOscuro,
        drawerInactiveTintColor: colores.texto,
        drawerLabelStyle: { fontSize: 14, marginLeft: -12 },
      }}
    >
      <Drawer.Screen
        name="Principal"
        component={TabsPrincipal}
        options={{
          title: "FastBox Courier",
          drawerLabel: "Inicio",
          drawerIcon: () => <Icono simbolo={"\u{1F3E0}"} />,
        }}
      />

      <Drawer.Screen
        name="Envios"
        component={Envios}
        options={{
          title: "Envios",
          drawerIcon: () => <Icono simbolo={"\u{1F69A}"} />,
        }}
      />

      <Drawer.Screen
        name="Paquetes"
        component={Paquetes}
        options={{
          title: "Paquetes",
          drawerIcon: () => <Icono simbolo={"\u{1F4E6}"} />,
        }}
      />

      <Drawer.Screen
        name="Clientes"
        component={Clientes}
        options={{
          title: "Clientes",
          drawerIcon: () => <Icono simbolo={"\u{1F465}"} />,
        }}
      />

      <Drawer.Screen
        name="Movimientos"
        component={Movimientos}
        options={{
          title: "Movimientos",
          drawerIcon: () => <Icono simbolo={"\u{1F504}"} />,
        }}
      />

      <Drawer.Screen
        name="Seguimiento"
        component={Seguimiento}
        options={{
          title: "Seguimiento",
          drawerIcon: () => <Icono simbolo={"\u{1F4CD}"} />,
        }}
      />

      <Drawer.Screen
        name="Tarifas"
        component={Tarifas}
        options={{
          title: "Tarifas",
          drawerIcon: () => <Icono simbolo={"\u{1F4B0}"} />,
        }}
      />

      <Drawer.Screen
        name="Bitacora"
        component={Bitacora}
        options={{
          title: "Bitacora",
          drawerIcon: () => <Icono simbolo={"\u{1F4D2}"} />,
        }}
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { usuario } = useContext(SesionContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {usuario ? (
        <Stack.Screen name="Sistema" component={MenuLateral} />
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}
