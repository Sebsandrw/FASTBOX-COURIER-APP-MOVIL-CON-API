import colores from "./colores";

export function colorEstado(estado = "") {
  const valor = String(estado).toLowerCase();
  if (valor.includes("entregado")) return colores.verde;
  if (valor.includes("listo para entrega")) return colores.verdeOscuro;
  if (valor.includes("tránsito") || valor.includes("transito")) return colores.azul;
  if (valor.includes("bodega")) return colores.naranja;
  if (valor.includes("ecuador")) return "#7B61A8";
  return colores.gris;
}
