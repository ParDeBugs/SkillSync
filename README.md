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
    ├── core/                    # Núcleo de la aplicación (Cosas de una sola instancia)
    │   ├── guards/              # Protecciones de rutas
    │   ├── interceptors/        # Interceptores HTTP
    │   └── services/            # Servicios globales
    │
    ├── shared/                  # Elementos visuales y utilidades reutilizables
    │   ├── components/          # Botones, alertas, modales genéricos, mapas interactivos
    │   ├── directives/          # Directivas
    │   ├── pipes/               # Transformadores visuales de datos
    │   └── validators/          # Validaciones personalizadas de formularios
    │
    ├── features/                # Módulos principales de la lógica de negocio
    │   ├── auth/                # Lógica de Inicio de sesión y Registro
    │   ├── onboarding/          # Flujo de registro y verificación con IA
    │   ├── search/              # Motor de búsqueda y geolocalización
    │   ├── specialist/          # Visualización de perfiles técnicos y portafolios
    │   └── reviews/             # Sistema de calificaciones y comentarios
    │
    └── layouts/                 # Estructura visual principal (Navbar, Sidebar, Footer)

```

### Backend (`skillsync-backend`)

```text
src/
├── core/                        # Capas transversales, seguridad y configuración global
│   ├── auth/                    # Lógica central de seguridad y generación de JWT
│   ├── guards/                  # Protecciones de endpoints
│   ├── interceptors/            # Interceptores de respuesta
│   ├── middlewares/             # Middlewares (ej. Rate limiting)
│   └── event-bus/               # Mensajería asíncrona y eventos del sistema
│
├── shared/                      # Herramientas, adaptadores y utilidades compartidas
│   ├── adapters/                # Integraciones con terceros (APIs de IA, correos)
│   ├── decorators/              # Decoradores personalizados
│   ├── filters/                 # Filtros de excepciones globales
│   └── helpers/                 # Funciones utilitarias
│
└── features/                    # Módulos del núcleo del negocio
    ├── users/                   # Gestión base de usuarios
    ├── specialists/             # Gestión de perfiles técnicos, oficios y galerías
    ├── reviews/                 # Gestión de calificaciones
    ├── ai-validation/           # Motor de Inteligencia Artificial (Evaluaciones y OCR)
    └── notifications/           # Sistema de alertas automatizadas

```
