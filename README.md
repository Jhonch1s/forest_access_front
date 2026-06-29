# Guía de Instalación y Configuración Local - Forestal AG

Pasos necesarios para configurar el entorno de desarrollo y ejecutar la plataforma Forestal AG (Frontend y Backend) de forma local.

---

## 1. Prerrequisitos del Sistema

Antes de comenzar, asegúrate de tener instalado el siguiente software en tu computadora:

*   **Git:** Para clonar los repositorios. ([Descargar Git](https://git-scm.com/))
*   **Java JDK 24:** Entorno de desarrollo para el backend. ([Descargar JDK](https://jdk.java.net/))
*   **Node.js (v20 o superior):** Entorno de ejecución para el frontend y NPM. ([Descargar Node.js](https://nodejs.org/))
*   **Base de Datos Relacional:** PostgreSQL instalado y corriendo localmente (puerto por defecto 5432).
*   **IDE (Opcional pero recomendado):** IntelliJ IDEA / Eclipse para el backend y Visual Studio Code para el frontend.

---

## 2. Configuración de la Base de Datos

Antes de levantar el backend, necesitas crear una base de datos vacía. Spring Boot (Hibernate) se encargará de crear las tablas automáticamente.

1. Abre tu gestor de base de datos (Ej. DBeaver, pgAdmin).
2. Ejecuta el siguiente comando SQL para crear la base:
   ```sql
   CREATE DATABASE forest_access_db;
   ```
---

## 3. Instalación y Ejecución del Backend (Spring Boot)

El backend expone la API REST en el puerto `8081` (bajo el contexto `/forest_access`) y se conecta a la base de datos PostgreSQL.

### Paso 3.1: Clonar el repositorio
Abre tu terminal y ejecuta (el flag `-b test` clona directamente la rama test):
```bash
git clone https://github.com/Jhonch1s/forest_access.git
cd forest_access
```

### Paso 3.2: Configurar Variables de Entorno / Base de Datos
El proyecto utiliza un archivo `application.yaml` parametrizado. Para conectarse a tu base de datos local, **es obligatorio** configurar las variables de entorno antes de ejecutar.

Tienes dos opciones:

**Opción A: Terminal (Recomendado)**
*En Windows (PowerShell):*
```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/forest_access_db"
$env:USERNAME="postgres"
$env:PASSWORD="tu_contraseña"
$env:JWT_SECRET="TIP2026"
```
*En Linux/Mac:*
```bash
export DB_URL="jdbc:postgresql://localhost:5432/forest_access_db"
export USERNAME="postgres"
export PASSWORD="tu_contraseña"
export JWT_SECRET="TIP2026"
```

**Opción B: IntelliJ IDEA**
Añade en *Edit Configurations* -> *Environment variables*:
`DB_URL=jdbc:postgresql://localhost:5432/forest_access_db;USERNAME=postgres;PASSWORD=tu_contraseña;JWT_SECRET=TIP2026;`

### Paso 3.3: Ejecutar el Servidor Backend
Si usas Maven, ejecuta en la terminal de la carpeta `forest_access` (después de setear las variables):
```bash
./mvnw spring-boot:run
```
*Si estás en Windows usa `mvnw.cmd spring-boot:run`.*
Si todo es correcto, verás en la consola que Tomcat se inició en el puerto `8081`. 

*(Para probar que funciona, puedes abrir tu navegador en: `http://localhost:8081/forest_access/swagger-ui/index.html`)*

---

## 4. Instalación y Ejecución del Frontend (React + Vite)

El frontend está configurado para ejecutarse en el puerto `5173` y tiene un proxy interno que redirige las peticiones al backend en el puerto 8081 para evitar errores de CORS durante el desarrollo.

### Paso 4.1: Clonar el repositorio
```bash
git clone -b test https://github.com/Jhonch1s/forest_access_front.git
cd forest_access_front
```

### Paso 4.2: Instalar las dependencias
Ejecuta el gestor de paquetes NPM para instalar React, Vite, Axios, react-leaflet y demás librerías:
```bash
npm install
```

### Paso 4.3: Iniciar el servidor de desarrollo
Una vez finalizada la instalación, levanta la aplicación cliente con:
```bash
npm run dev
```

La consola te indicará que el servidor Vite está corriendo.

---

## 5. Acceso al Sistema

Con ambos servidores (Backend y Frontend) corriendo simultáneamente:

1. Abre tu navegador web favorito (Chrome, Firefox, Edge).
2. Ingresa a la URL: **`http://localhost:5173`**
3. Verás la pantalla de Login del sistema.

¡Tu entorno local de Forestal AG ya está completamente operativo!
