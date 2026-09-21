// Direccion publica del proyecto Django publicado en AlwaysData.
const API_BASE = "https://sebaesco.alwaysdata.net/api/v1";

async function peticion(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_BASE}${ruta}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(opciones.headers || {}),
    },
  });

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    const mensaje =
      datos?.detail || datos?.detalle || "No se pudo consultar el servidor.";
    throw new Error(mensaje);
  }

  return datos;
}

export function normalizarLista(datos) {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.results)) return datos.results;
  return [];
}

export async function iniciarSesionApi(usuario, password) {
  return peticion("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username: usuario, password }),
  });
}

export async function obtenerClientes() {
  return normalizarLista(await peticion("/clientes/?format=json"));
}

export async function obtenerPaquetes() {
  return normalizarLista(await peticion("/paquetes/?format=json"));
}

export async function buscarPaquetes(texto) {
  return normalizarLista(
    await peticion(`/paquetes/?buscar=${encodeURIComponent(texto)}&format=json`)
  );
}

export async function obtenerTarifas() {
  return normalizarLista(await peticion("/tarifas/?format=json"));
}

export async function obtenerMovimientos() {
  return normalizarLista(await peticion("/movimientos/?format=json"));
}

export async function obtenerBitacora() {
  return normalizarLista(await peticion("/bitacora/?format=json"));
}

export { API_BASE };
