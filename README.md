# FASTBOX-COURIER-APP-MOVIL-CON-API
Aplicativo web para android usando como idea fastbox courier para revisar envios y pedidos.

FASTBOX COURIER - APP MOVIL CON API
==================================

Esta version reemplaza la autenticacion local SQLite por una validacion contra Django/AlwaysData.
Tambien consulta informacion real en los modulos:

- Paquetes:     /api/v1/paquetes/
- Clientes:     /api/v1/clientes/
- Tarifas:      /api/v1/tarifas/
- Movimientos:  /api/v1/movimientos/
- Bitacora:     /api/v1/bitacora/

El Login usa:
- /api/v1/auth/login/

IMPORTANTE:
Antes de probar el Login movil debe subir a Django los dos archivos del ZIP
FastBoxDjango_AuthAPI_Patch.zip y reiniciar el sitio en AlwaysData.

INSTALACION EN PC
-----------------
1. Descomprima FastBoxMobile_API_Final.zip.
2. Abra CMD dentro de FastBoxMobile.
3. Ejecute: npm install
4. Ejecute: npx expo-doctor
5. Ejecute: npx expo start -c
6. Abra Expo Go en Android y ejecute el proyecto como acostumbra.

PRUEBA RECOMENDADA
------------------
1. Ingrese con admin u operador creados en Django.
2. Abra Paquetes y compruebe que aparecen los mismos registros de AlwaysData.
3. Abra Clientes.
4. Abra Tarifas.
5. Registre o cambie un dato en Django, vuelva a la app y pulse Actualizar.

InfinityFree no necesita cambios para esta parte.
