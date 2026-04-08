# 📚 Proyecto: Sistema de Gestión de Activos de TI (ITAMSys)

## UNIVERSIDAD PRIVADA DOMINGO SAVIO
### FACULTAD DE INGENIERÍA | CARRERA DE INGENIERÍA DE SISTEMAS
### PROGRAMACIÓN WEB II - SEXTO SEMESTRE

---

**ESTUDIANTES:**
* Osmar Aruquipa Pari
* Leonardo Cusi Laura

**DOCENTE:** * Albino Chambi Andrés Grover

**FECHA:** 04/08/2026 | **UBICACIÓN:** La Paz - Bolivia

---

## 1. INTRODUCCIÓN

### 1.1. Contexto General
En la actualidad, las organizaciones dependen críticamente de su infraestructura tecnológica para operar. La gestión de estos recursos (hardware, licencias de software, servidores) es vital. Actualmente, muchas instituciones gestionan sus activos de TI de manera manual o mediante hojas de cálculo, lo que genera descontrol en las asignaciones de equipos a los empleados y pérdida de trazabilidad sobre el ciclo de vida del hardware.

### 1.2. Problemática
El problema central es la **falta de un sistema automatizado y centralizado** para gestionar el inventario, la asignación y el estado de los activos tecnológicos de la empresa.

**Subproblemas identificados:**
1. **Control de Equipos:** La información del hardware (laptops, monitores) carece de una estructura definida y no se actualiza en tiempo real.
2. **Gestión de Asignaciones:** No existe un historial claro de qué empleado tiene qué equipo, dificultando la recuperación de activos en caso de desvinculación.
3. **Seguridad y Accesos:** Ausencia de un control de roles que separe a los administradores de TI de los usuarios regulares.

### 1.3. Justificación
* **Técnica:** Se aplican tecnologías modernas como **.NET 9** y **Angular 21** bajo Arquitectura Limpia, integrando **Keycloak** para robustecer la seguridad (OAuth2) y **Docker** para la portabilidad.
* **Operativa:** Automatiza el seguimiento del hardware, reduciendo el riesgo de pérdida de equipos costosos.
* **Económica:** Optimiza el presupuesto de TI al evitar compras innecesarias mediante un control exacto del stock disponible.

---

## 2. OBJETIVOS

### 2.1. Objetivo General
Desarrollar un Sistema de Gestión de Activos de TI (ITAMSys) que permita controlar de manera eficiente y segura el inventario, asignación y ciclo de vida del hardware y software, utilizando .NET Core 9, Angular 21, Keycloak v26 y PostgreSQL.

### 2.2. Objetivos Específicos (Seleccionados)
* Implementar el backend con .NET Core siguiendo Arquitectura Limpia.
* Implementar el frontend con Angular para la gestión visual del inventario.
* Configurar Keycloak para la autenticación centralizada y autorización basada en roles.
* Diseñar el modelo relacional en PostgreSQL utilizando identificadores seguros.

---

## 4. ANÁLISIS DEL SISTEMA

### 4.1. Requerimientos Funcionales (Historias de Usuario)

A continuación, se detallan los requerimientos utilizando el estándar definido para el proyecto:

#### Módulo de Inventario (Activos)
* **COMO:** Administrador de TI **QUIERO:** registrar un nuevo activo (laptop, servidor) con su número de serie **PARA:** mantener el inventario actualizado.
* **COMO:** Técnico de Soporte **QUIERO:** modificar el estado de un activo a "En Reparación" **PARA:** evitar que sea asignado a un empleado por error.
* **COMO:** Administrador de TI **QUIERO:** listar todos los activos filtrando por categoría **PARA:** conocer el stock disponible de manera rápida.

#### Módulo de Asignaciones
* **COMO:** Administrador de TI **QUIERO:** registrar la asignación de un equipo a un empleado **PARA:** tener trazabilidad de los responsables del hardware.

### 4.2. Tareas de Usuario (Estimaciones)

Para cumplir con las historias de usuario, se definen las siguientes tareas técnicas de desarrollo:

**Tarea 1: Desarrollo del CRUD de Activos de TI (Backend)**
* **Descripción:** Creación de los endpoints, servicios y repositorios en .NET para gestionar la tabla de activos.
* **Sub-tareas:**
  * 1.1 Configurar entidad y DTOs de Activos (1.5 horas)
  * 1.2 Implementar ActivoService con lógica de negocio (2.0 horas)
  * 1.3 Crear ActivosController y documentar en Swagger (1.5 horas)
* **Tiempo Total Estimado:** 5.0 horas

**Tarea 2: Interfaz de Asignación de Equipos (Frontend)**
* **Descripción:** Maquetación e integración del formulario en Angular para vincular un activo a un área de la empresa. *(Nota: Se utiliza `id_area` para evitar términos obsoletos o ambiguos).*
* **Sub-tareas:**
  * 2.1 Crear componente y servicio de Asignaciones en Angular (2.0 horas)
  * 2.2 Integrar validaciones de formulario reactivo (1.0 horas)
  * 2.3 Consumir endpoint de guardado y manejar alertas (1.5 horas)
* **Tiempo Total Estimado:** 4.5 horas

---

## 5. DISEÑO DEL SISTEMA

### 5.1. Diccionario de Datos (Modelo Relacional)

Para garantizar la integridad y seguridad del sistema, se han omitido nomenclaturas vulnerables en los campos (ej. uso de relaciones directas descriptivas y códigos patrimoniales seguros).

#### Tabla: Activos

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| Id | UUID | PK | Identificador único del equipo |
| CodigoPatrimonial | VARCHAR(50) | UNIQUE, NOT NULL | Código interno de la empresa |
| NombreEquipo | VARCHAR(100) | NOT NULL | Marca y modelo (ej. ThinkPad T14) |
| CategoriaId | UUID | FK -> Categorias(Id) | Relación con el tipo de equipo |
| Estado | VARCHAR(20) | NOT NULL | Disponible, Asignado, Mantenimiento |

#### Tabla: Asignaciones

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| Id | UUID | PK | Identificador de la transacción |
| ActivoId | UUID | FK -> Activos(Id) | Equipo que se está entregando |
| EmpleadoId | UUID | FK -> Empleados(Id) | Persona que recibe el equipo |
| FechaEntrega | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Momento exacto de la entrega |
| AreaId | UUID | FK -> Areas(Id) | Departamento al que pertenece |

---

## 6. IMPLEMENTACIÓN

### 6.1. Configuración de Entorno (Docker Compose)
El sistema se orquesta mediante contenedores para garantizar la paridad entre desarrollo y producción:
* **Base de Datos:** Contenedor `postgres:18-alpine` persistiendo datos en volúmenes.
* **Seguridad:** Contenedor `quay.io/keycloak/keycloak:26.0` configurado con variables de entorno para el usuario `admin`.
* **Backend:** Imagen generada a partir del Dockerfile en la carpeta `/ItamBackend.Api` exponiendo el puerto 5000.
* **Frontend:** Imagen generada a partir del Dockerfile en `/itam-frontend` utilizando Nginx.

---

## 8. CONCLUSIONES

1. **Arquitectura Robusta:** La implementación de Arquitectura Limpia en .NET 9 garantizó un código escalable y fácil de testear para ITAMSys.
2. **Seguridad Moderna:** La delegación de la autenticación a Keycloak eliminó la necesidad de gestionar contraseñas directamente en la base de datos, cumpliendo con estándares empresariales.
3. **Trazabilidad:** El diseño de la base de datos permite conocer exactamente el ciclo de vida de un activo tecnológico desde su compra hasta su baja.
