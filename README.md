# SkillSync - Plataforma Web Inteligente para la Vinculación de Oficios

SkillSync es una plataforma web inteligente diseñada para la vinculación y validación de oficios técnicos y manuales. Su objetivo es modernizar y profesionalizar el proceso de contratación local, conectando de manera segura a trabajadores especializados con clientes mediante herramientas de búsqueda, perfiles digitales y validaciones automatizadas.

A diferencia de un directorio tradicional, este sistema incorpora procesos de auditoría impulsados por Inteligencia Artificial para evitar fraudes, validar identidades y evaluar competencias técnicas antes de otorgar insignias de verificación.

---

## Arquitectura del Sistema

El proyecto está diseñado bajo un enfoque de **Monolito Modular Orientado a Eventos (EDA)**, dividido en 5 capas para garantizar alta cohesión, bajo acoplamiento y escalabilidad:

* **Capa de Cliente e Interfaz:** Desarrollada en React/Next.js, optimizada para SEO y rendimiento.
* **Capa de Acceso y Seguridad:** API Gateway que centraliza autenticación (JWT), limitación de peticiones (rate limiting) y control de acceso.
* **Capa de Núcleo de Negocio:** Lógica central gestionada con NestJS, con persistencia de datos en PostgreSQL.
* **Capa de Integración IA:** Orquesta servicios de OCR, modelos de lenguaje (OpenAI) y Visión Computacional para validar certificados y trabajos mediante los patrones Strategy y Adapter.
* **Capa de Eventos y Notificaciones:** Utiliza RabbitMQ para procesar tareas en segundo plano de forma asíncrona mediante el patrón Observer.

---

## Tecnologías y Herramientas

**Frontend**

* **Framework:** Next.js (React)
* **Estilos:** Tailwind CSS (Tema Claro con acentos Neón Cyan/Indigo)

**Backend**

* **Framework:** NestJS (Node.js)
* **Base de Datos:** PostgreSQL
* **Mensajería:** RabbitMQ

**Infraestructura y DevOps**

* **Contenedores:** Docker y Docker Compose
* **Nube:** AWS (ECS, RDS, CloudWatch)
* **Calidad de Código:** ESLint, Prettier, Husky, GitHub Actions

---

## Estructura de Carpetas

El repositorio está dividido en dos aplicaciones principales (`skillsync-frontend` y `skillsync-backend`) que mantienen sus dependencias de forma independiente.

### Frontend (`skillsync-frontend`)

```text
src/
└── app/
    ├── core/                    # El núcleo de la aplicación (Cosas de una sola instancia)
    │   ├── guards/              # Protecciones de rutas (ej. bloquear accesos sin login)
    │   ├── interceptors/        # Interceptores HTTP (ej. adjuntar tokens, manejo global de errores)
    │   └── services/            # Servicios globales (ej. control de estado de la sesión)
    │
    ├── shared/                  # Elementos visuales y utilidades reutilizables en cualquier parte
    │   ├── components/          # Botones, alertas, modales genéricos, mapas interactivos
    │   ├── directives/          # Directivas (ej. para prevenir inyección en inputs o dar formato)
    │   ├── pipes/               # Transformadores visuales de datos (ej. formato de fechas o moneda)
    │   └── validators/          # Validaciones personalizadas y complejas de formularios
    │
    ├── features/                # Módulos principales de la lógica de negocio (Arquitectura por Funcionalidad)
    │   ├── auth/                # Lógica de Inicio de sesión y Registro
    │   │   ├── components/      # Formularios de acceso
    │   │   └── services/        # Peticiones a la API de autenticación
    │   │
    │   ├── onboarding/          # Flujo de registro y verificación del especialista con IA
    │   │   ├── components/      # Pasos del asistente de registro (carga de documentos)
    │   │   └── services/        # Peticiones a la API de validación
    │   │
    │   ├── search/              # Motor de búsqueda y geolocalización de oficios
    │   │   ├── components/      # Vistas de resultados y filtros por categoría
    │   │   └── services/        # Peticiones de búsqueda a la API
    │   │
    │   ├── specialist/          # Visualización de perfiles técnicos y portafolios
    │   │   ├── components/      # Vista pública del perfil y galería de trabajos
    │   │   └── services/        # Obtención de datos del especialista
    │   │
    │   └── reviews/             # Sistema de calificaciones y comentarios
    │       ├── components/      # Listado de estrellas y formulario de reseña
    │       └── services/        # Peticiones para enviar o leer comentarios
    │
    └── layouts/                 # Estructura visual principal (Navbar, Sidebar, Footer)
```

### Backend (`skillsync-backend`)

```text
src/
├── core/                        # Capas transversales, seguridad y configuración global del servidor
│   ├── auth/                    # Lógica central de seguridad y generación de JWT
│   ├── guards/                  # Protecciones de endpoints (ej. validación de roles y permisos)
│   ├── interceptors/            # Interceptores de respuesta (ej. formateo unificado de JSON)
│   ├── middlewares/             # Middlewares (ej. Rate limiting para prevenir ataques DDoS)
│   └── event-bus/               # Infraestructura de mensajería asíncrona y eventos del sistema
│
├── shared/                      # Herramientas, adaptadores y utilidades compartidas
│   ├── adapters/                # Integraciones con terceros (APIs de IA, envío de correos)
│   ├── decorators/              # Decoradores personalizados (ej. extraer usuario del token)
│   ├── filters/                 # Filtros de excepciones globales (manejo de errores HTTP 400, 500)
│   └── helpers/                 # Funciones utilitarias (ej. algoritmos de encriptación o cálculo)
│
└── features/                    # Módulos del núcleo del negocio (Feature-Driven Backend)
    ├── users/                   # Gestión base de usuarios (clientes)
    │   ├── controllers/         # Definición de rutas REST para usuarios
    │   ├── services/            # Lógica de negocio de usuarios
    │   └── repositories/        # Consultas a la base de datos de usuarios
    │
    ├── specialists/             # Gestión de perfiles técnicos, oficios y galerías
    │   ├── controllers/         # Definición de rutas REST para especialistas
    │   ├── services/            # Lógica de negocio de especialistas
    │   └── repositories/        # Consultas a la base de datos de oficios
    │
    ├── reviews/                 # Gestión de calificaciones de clientes a especialistas
    │   ├── controllers/         # Definición de rutas REST para reseñas
    │   ├── services/            # Lógica de negocio y cálculo de promedios
    │   └── repositories/        # Consultas a la base de datos de reseñas
    │
    ├── ai-validation/           # Motor de Inteligencia Artificial (Evaluaciones y OCR)
    │   ├── controllers/         # Definición de rutas para iniciar validaciones
    │   ├── services/            # Lógica de generación de Quizzes y lectura de documentos
    │   └── strategies/          # Lógica condicional (ej. estrategia para Plomero vs. Electricista)
    │
    └── notifications/           # Sistema de alertas automatizadas (Emails, notificaciones de sistema)
        ├── services/            # Lógica de construcción de notificaciones
        └── subscribers/         # Escuchadores de eventos (ej. enviar correo al aprobar perfil)
```
