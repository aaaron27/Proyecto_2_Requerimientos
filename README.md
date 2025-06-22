# 🚌 BusFinder - Sistema de Control de Buses

Este proyecto es una plataforma web que permite gestionar un pequeño sistema de buses, incluyendo usuarios, agencias y horarios. El backend está desarrollado con **FastAPI** y una base de datos **PostgreSQL**, mientras que el frontend utiliza **Astro** y **React**, con manejo de **cookies** para persistencia y autenticación.

---

## 📦 Tecnologías Utilizadas

### Backend
- 🐍 **FastAPI** – API REST moderna y rápida con Python.
- 🐘 **PostgreSQL** – Sistema de base de datos relacional robusto.
- 🔐 **Cookies** – Para autenticación segura.

### Frontend
- 🚀 **Astro** – Framework moderno para construir sitios rápidos.
- ⚛️ **React** – Librería para construir interfaces interactivas.
- 🎨 **TailwindCSS** – Framework CSS utility-first.
- 💾 **localStorage** y 🍪 **Cookies** – Para almacenamiento y sesión del usuario.

---

## 🛠️ Funcionalidades Principales

### 🧑‍💼 Usuarios
- Registro y login de usuarios.
- Almacenamiento de sesión mediante cookies.
- Diferenciación de roles (administrador, agencia, usuario).

### 🏢 Agencias
- Creación, edición y eliminación de agencias.
- Creacion, edición y eliminación de horarios, notas y precios

### 🗺️ Rutas por origen y destino
- Encontrar todas las agencias que pasen por una ruta

### 🕒 Horarios
- Control y edición de horarios de salida y llegada, y precios

---

## 🧰 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone [https://github.com/tu_usuario/sistema-buses.git](https://github.com/aaaron27/Proyecto_2_Requerimientos.git)
cd sistema-buses
```
### 2. Instalar dependencias de **FastApi**

```bash
cd API
pip install -r requirements.txt
```

### 3. Configurar .env

Crear un archivo llamada `.evn` en él, introducir lo siguiente
```dotenv
DB_PASSWORD=YOUR_PASSWORD
```

Después puedes iniciar la api

```bash
uvicorn main:app --reload
```

### 4. Instalar dependencias de la web

Debería abrir un link al puerto `4321` en el localhost al terminar la instalación

```bash
cd WEB
npm install
npm run dev
```
