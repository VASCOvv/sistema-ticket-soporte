# Sistema de Gestión de Soporte Técnico

Aplicación web full stack para registrar, consultar, actualizar y eliminar **tickets de soporte técnico**, reemplazando el registro manual en mensajes y planillas. La información se guarda en una base de datos MySQL, por lo que se mantiene después de recargar la página o reiniciar la API.

**Evaluación N.° 2 – Electivo Angular – Instituto Profesional Virginio Gómez, sede Chillán.**

## Autor

- **Nombre:** vasco zambrano
- **Carrera:** Ingeniería en Informática
- **Repositorio:** https://github.com/VASCOvv/sistema-ticket-soporte

## Tecnologías utilizadas

| Capa | Tecnología |
|---|---|
| Frontend | Angular 22 (componentes standalone, signals, Router, HttpClient, Reactive Forms) |
| Backend | Node.js + Express 5 (API REST) |
| Base de datos | MySQL / MariaDB 10.4 (XAMPP) con la librería `mysql2` |
| Otros | `cors`, `dotenv`, Git y GitHub |

### Elección de la base de datos

Se eligió **MySQL** porque los datos de un ticket tienen una estructura fija y bien definida (siempre los mismos campos), lo que se ajusta a una tabla relacional. Además permite restringir valores con `ENUM` (categoría, prioridad y estado), asignar el id con `AUTO_INCREMENT` y la fecha con `CURRENT_TIMESTAMP`. Se utilizó la versión incluida en XAMPP por su facilidad de instalación.

## Estructura del proyecto

```
sistema-tickets-soporte/
├── frontend/                       # Aplicación Angular
│   └── src/app/
│       ├── models/ticket.ts        # Interfaz Ticket y listas de opciones
│       ├── services/ticket.service.ts  # Comunicación HTTP con la API (HttpClient)
│       ├── components/
│       │   ├── ticket-list/        # Listado, filtro por estado y eliminación
│       │   ├── ticket-detail/      # Consulta del detalle de un ticket
│       │   └── ticket-form/        # Formulario de creación y edición con validaciones
│       ├── app.routes.ts           # Rutas de la aplicación
│       └── app.config.ts           # Configuración (Router y HttpClient)
│
├── backend/                        # API REST con Express
│   ├── database/schema.sql         # Script de creación de la BD con datos de ejemplo
│   ├── .env.example                # Plantilla de variables de entorno
│   └── src/
│       ├── server.js               # Inicia el servidor y verifica la conexión a MySQL
│       ├── app.js                  # Middlewares, rutas, 404 y manejo de errores
│       ├── config/db.js            # Pool de conexiones a MySQL
│       ├── routes/tickets.routes.js        # Endpoints REST
│       ├── controllers/tickets.controller.js # Lógica de cada endpoint y respuestas HTTP
│       ├── validators/ticket.validator.js  # Validación de datos en el servidor
│       └── models/ticket.model.js  # Consultas SQL parametrizadas
│
└── README.md
```

**Arquitectura:** `Angular (puerto 4200)` → HTTP/JSON → `API Express (puerto 3000)` → SQL → `MySQL (puerto 3306)`

## Instalación

### Requisitos previos
- Node.js 22 o superior (probado con Node.js 24)
- Angular CLI 22: `npm install -g @angular/cli@22`
- XAMPP (MySQL/MariaDB) o MySQL Server
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/VASCOvv/sistema-ticket-soporte.git
cd sistema-ticket-soporte
```

### 2. Crear la base de datos
Encender **MySQL** desde el panel de XAMPP y ejecutar el script (desde la carpeta `backend`):

**Opción A – terminal (PowerShell):**
```powershell
cmd /c "C:\xampp\mysql\bin\mysql.exe -u root --default-character-set=utf8mb4 < database\schema.sql"
```

**Opción B – phpMyAdmin:** abrir http://localhost/phpmyadmin → pestaña **Importar** → seleccionar `backend/database/schema.sql` → **Continuar**.

El script crea la base de datos `soporte_tickets`, la tabla `tickets` y 4 tickets de ejemplo.

### 3. Configurar e instalar el backend
```powershell
cd backend
copy .env.example .env
npm install
```
Si el usuario de MySQL tiene contraseña, editar `DB_PASSWORD` en el archivo `.env`.

### 4. Instalar el frontend
```powershell
cd ../frontend
npm install
```

## Ejecución

Se necesitan **dos terminales** y MySQL encendido.

**Terminal 1 – API:**
```powershell
cd backend
npm run dev
```
Debe mostrar: `API escuchando en http://localhost:3000` y `Conectado a MySQL`.

**Terminal 2 – Angular:**
```powershell
cd frontend
ng serve
```
Abrir **http://localhost:4200** en el navegador.

## Endpoints de la API

| Método | Endpoint | Descripción | Respuesta exitosa |
|---|---|---|---|
| GET | `/api/tickets` | Lista todos los tickets | 200 |
| GET | `/api/tickets/:id` | Obtiene un ticket | 200 |
| POST | `/api/tickets` | Crea un ticket | 201 |
| PUT | `/api/tickets/:id` | Actualiza un ticket | 200 |
| DELETE | `/api/tickets/:id` | Elimina un ticket | 204 |
| GET | `/api/salud` | Verifica que la API está activa | 200 |

Errores: **400** (datos inválidos o id incorrecto), **404** (ticket o ruta inexistente), **503** (base de datos no disponible), **500** (error interno). Todos responden con `{ "mensaje": "..." }`.

## Funcionalidades implementadas

- Listado de tickets obtenidos desde la base de datos, con filtro por estado.
- Registro de nuevos tickets mediante formulario.
- Consulta del detalle de cada ticket.
- Edición de tickets existentes con persistencia de los cambios.
- Eliminación con confirmación previa.
- Distinción visual de **prioridad** y **estado** mediante etiquetas de colores.
- Validaciones en el formulario (campos obligatorios, largo mínimo y máximo, textos con solo espacios) y también en la API.
- Mensajes al usuario ante errores de comunicación (API apagada, base de datos no disponible, ticket inexistente).
- Mensajes de confirmación al crear, editar y eliminar.
- Consultas SQL parametrizadas para evitar inyección SQL.
- Persistencia real: los datos se mantienen al recargar Angular y al reiniciar la API.

## Pruebas realizadas

| Prueba | Procedimiento | Resultado |
|---|---|---|
| Inicio | Se levantó MySQL, la API y Angular siguiendo este README | ✅ Los tres componentes inician correctamente |
| GET | Se abrió el listado en Angular | ✅ Se muestran los tickets guardados en MySQL |
| POST | Se creó un ticket desde el formulario | ✅ Aparece en el listado y en la tabla `tickets` |
| PUT | Se editó un ticket y se recargó la página | ✅ El cambio se mantiene |
| DELETE | Se eliminó un ticket confirmando el mensaje | ✅ Desaparece de la interfaz y de la base de datos |
| Validación | Se intentó guardar el formulario vacío / con textos cortos o solo espacios | ✅ Se muestran los errores y no se envía la petición |
| Error de API | Se detuvo la API y se recargó Angular | ✅ Se muestra "No se pudo conectar con el servidor..." |
| Error de BD | Se detuvo MySQL en XAMPP y se recargó Angular | ✅ Se muestra "No se pudo conectar con la base de datos..." (503) |
| Persistencia | Se reinició la API y se recargó Angular | ✅ Los registros permanecen |

## Declaración de uso de Inteligencia Artificial

**1. Herramienta utilizada:** Claude (Anthropic), como asistente durante el desarrollo.

**2. Actividades en que se utilizó:**
- Lectura e interpretación de los requisitos de la evaluación y planificación del trabajo por etapas (una por commit).
- Propuesta de la arquitectura y de la estructura de carpetas (frontend, backend por capas y base de datos).
- Solución de problemas del entorno: puerto 4200 ocupado y caída de MySQL en XAMPP por un archivo `multi-master.info` dañado.

**3. Elementos que recibieron apoyo de IA:**
- **Frontend (Angular):** el modelo, el servicio, los componentes, las rutas y los estilos fueron generados por la IA y luego revisados y probados por mí.
- **Backend (Express):** la IA propuso el código de cada archivo junto con su explicación, y yo lo escribí archivo por archivo en el proyecto.
- **Base de datos:** el script `schema.sql`, la configuración del pool y las consultas parametrizadas.
- **Manejo de errores** (respuesta 503 y verificación de conexión) y la redacción de este README.

**4. Modificaciones y verificaciones realizadas por mí:**
- Creé y configuré el proyecto (Angular CLI, npm, Git, repositorio en GitHub, XAMPP) y ejecuté cada paso en mi equipo.
- Escribí los archivos del backend uno a uno, revisando la función de cada capa (rutas, controlador, validador, modelo).
- Probé manualmente todas las operaciones CRUD, las validaciones, los mensajes de error y la persistencia (tabla de pruebas).

