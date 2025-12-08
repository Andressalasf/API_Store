# Backend API - Store with JWT Authentication

API REST desarrollada con Express.js que implementa autenticación JWT y gestión de productos, similar a Platzi Fake Store API.

## 🚀 Características

- ✅ Autenticación con JWT (Access Token + Refresh Token)
- ✅ CRUD completo de productos
- ✅ Base de datos PostgreSQL
- ✅ Arquitectura MVC
- ✅ Protección de rutas con middleware
- ✅ Encriptación de contraseñas con bcrypt

## 📋 Requisitos previos

- Node.js >= 14.x
- PostgreSQL >= 12.x
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio e instalar dependencias**

```bash
cd backend
npm install
```

2. **Configurar variables de entorno**

Copiar el archivo `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_db
DB_USER=postgres
DB_PASSWORD=tu_password

JWT_SECRET=tu_clave_secreta_aqui
JWT_ACCESS_EXPIRATION=20d
JWT_REFRESH_EXPIRATION=10h
```

3. **Crear la base de datos**

Ejecutar los comandos SQL del archivo `database_schema.sql` en PostgreSQL:

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE store_db;

# Salir y ejecutar el script
\q
psql -U postgres -d store_db -f database_schema.sql
```

O manualmente ejecutar los comandos del archivo `database_schema.sql`.

4. **Inicializar datos de ejemplo (opcional)**

```bash
npm run init-db
```

Esto creará un usuario de ejemplo:
- Email: `john@mail.com`
- Password: `changeme`

## 🎯 Uso

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

La API estará disponible en: `http://localhost:3000/api/v1`

## 📚 Endpoints

### Autenticación

#### POST `/api/v1/auth/login`
Iniciar sesión y obtener tokens JWT.

**Request:**
```json
{
  "email": "john@mail.com",
  "password": "changeme"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

#### GET `/api/v1/auth/profile`
Obtener perfil del usuario autenticado (requiere token).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "id": 1,
  "email": "john@mail.com",
  "name": "John Doe",
  "role": "customer",
  "avatar": "https://..."
}
```

#### POST `/api/v1/auth/refresh-token`
Refrescar el access token usando el refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

### Productos

#### GET `/api/v1/products`
Obtener todos los productos (público).

**Query params:**
- `limit` (default: 10)
- `offset` (default: 0)

#### GET `/api/v1/products/:id`
Obtener un producto por ID (público).

#### POST `/api/v1/products`
Crear un producto (requiere autenticación).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "title": "Laptop HP",
  "price": 899.99,
  "description": "High performance laptop",
  "category_id": 1,
  "images": ["https://...", "https://..."]
}
```

#### PUT `/api/v1/products/:id`
Actualizar un producto (requiere autenticación).

#### DELETE `/api/v1/products/:id`
Eliminar un producto (requiere autenticación).

## 🏗️ Estructura del proyecto

```
backend/
├── src/
│   ├── config/
│   │   ├── config.js           # Configuración general
│   │   └── database.js         # Configuración de PostgreSQL
│   ├── controllers/
│   │   ├── authController.js   # Controlador de autenticación
│   │   └── productController.js # Controlador de productos
│   ├── middlewares/
│   │   └── authMiddleware.js   # Middleware de autenticación JWT
│   ├── models/
│   │   ├── User.js             # Modelo de usuario
│   │   ├── Product.js          # Modelo de producto
│   │   └── RefreshToken.js     # Modelo de refresh tokens
│   ├── routes/
│   │   ├── authRoutes.js       # Rutas de autenticación
│   │   ├── productRoutes.js    # Rutas de productos
│   │   └── index.js            # Agregador de rutas
│   ├── database/
│   │   └── init.js             # Script de inicialización
│   └── index.js                # Punto de entrada de la aplicación
├── database_schema.sql         # Esquema DDL de la base de datos
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔐 Seguridad

- Las contraseñas se encriptan con bcrypt (salt rounds: 10)
- Los tokens JWT tienen expiración configurable
- Los refresh tokens se almacenan en la base de datos
- Middleware de autenticación protege rutas sensibles

## 📝 Notas

- El access token expira en 20 días
- El refresh token expira en 10 horas
- Los tokens expirados se pueden refrescar usando `/auth/refresh-token`

## 🤝 Integración con Flutter

Esta API está diseñada para funcionar con el proyecto Flutter en la carpeta `deudas`. Solo necesitas cambiar la URL base en el archivo `auth_service.dart`:

```dart
static final url = 'http://tu-servidor:3000/api/v1/auth/login';
```

## 📄 Licencia

ISC
