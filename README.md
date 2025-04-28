# Data Entry Application

## Configuración del Frontend

### Requisitos Previos

- Node.js (versión 20.x o superior)
- npm (versión 10.x o superior)

### Pasos de Instalación

1. **Instalar Angular CLI globalmente:**

```bash
npm install -g @angular/cli@18
```

2. **Navegar a la carpeta del proyecto angular:**
cd frontend

cd template

cd package

3. **Instalar dependencias adicionales:**

npm install
### Estructura del Proyecto

El proyecto sigue una estructura modular con los siguientes componentes:

- **Módulos**: Cada entidad tiene su propio módulo
- **Componentes**: Componentes CRUD para cada entidad
- **Servicios**: Servicios HTTP para comunicación con el backend
- **Modelos**: Interfaces TypeScript basadas en las entidades
- **Rutas**: Configuración de rutas para navegación

### Ejecución del Proyecto Angular

**Navega hasta la carpeta principal del proyecto angular:**
cd src
# Iniciar el servidor de desarrollo
ng serve

La aplicación estará disponible en `http://localhost:4200`

### Ejecución del proyecto Spring boot

# Ejecuta la clase 'DataEntryAppication'

El proyecto estara disponible en 'http://localhost:8080'

### Características Principales

- Interfaz de usuario moderna con Angular Material
- Formularios dinámicos con NGX-Formly
- Operaciones CRUD completas para cada entidad

# Primera versión del proyecto Nómina

El día 26 de marzo del 2025 se presentó una primera versión del proyecto "Nómina"
generada a partir de los requisitos tomados previamente con el cliente.
Esta versión del proyecto fue 100% código generado por Jarvis, sin intervención manual.

De ahi se tomaron algunas correcciones para realizar de forma manual, más personalizada,
las cuales fueron:

- Quitar la campana de notificaciones, ya que no se está empleando.
- El color del botón de la alerta de error sean igual a los colores de la pagina.
- Quitar las opciones que no se utilizan en el botón del usuario.
- Ajustar los estilos de los encabezados en tablas de información de las entidades.
- Revisión y ajuste a los nombres de los encabezados de las tablas
- Mejoras en estilos visuales
- Se añadieron campos adicionales requeridos en algunas entidades.
- Se modificaron algunos campos adicionales en algunas entidades.
- Se asignaron filtros personalizados para diferentes campos de los formularios.

Estas mejoras fueron realizadas por dos desarrolladores (Alison Arroyave y Daniel Jaramillo)
y tomaron 11 dias para ser implementadas.

El día 10 de abril del 2025 se presentó la segunda versión de la aplicación con estos cambios 
implementados y se tomaron otros requerimientos específicos del negocio, estos requisitos fueron:
- En el tema de los contratos, permitir creación de contratos para personas que no estén vinculadas a un proyecto en específico.
- Agregar en cuenta de cobro campo de observaciones (solo visible para gerente y contador) y campo para adjuntar archivo con la planilla de la seguridad social
- En crear personas, adjuntar campos para documentos varios.

Estas mejoras fueron realizadas por dos desarrolladores (Alison Arroyave y Daniel Jaramillo) 
y tomaron 4 dias para ser implementadas.

El día 23 de abril del 2025 se presentó esta última versión del proyecto, con las funcionalidades implementadas y funcionando correctamente.

# Despliegue de la aplicación en un servidor

en la raiz del proyecto se encuentra una carpeta llamada despliegue, la cual contiene los archivos requeridos para el respectivo despliegue
(app.jar para el backend y dist para el frontend)

## Requisitos previos del servidor

- Java 21 o superior
- NGINX instalado
- Puerto 8080 disponible para el backend
- Puerto 80 (o el que definas) para el frontend vía NGINX

## Subir archivos al servidor

- Para el backend, se sube el archivo app.jar al servidor y se ejecuta con el comando:
  - java -jar /ruta/app.jar  (se busca el archivo en la ruta en la que se subió)
- Para el frontend, se sube la carpeta dist al servidor

## Configurar NginX para servir Angular y redireccionar al backend

- Se modifica (o crea si es requerido) el archivo de configuracion Nginx con algo como lo siguiente:

```
server {
listen 80;
server_name dominio.com; #o tu dirección IP pública

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Redirige las peticiones del frontend al backend
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
- Luego puedes probar la configuración y reiniciar el Nginx con los siguientes comandos:
  - sudo nginx -t
  - sudo systemctl restart nginx
