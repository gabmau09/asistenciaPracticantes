# Sistema de Registro de Asistencia para Practicantes

Una aplicación web diseñada para el control y seguimiento de las horas de prácticas pre-profesionales en el Instituto de Informática de la Universidad Nacional de Piura (UNP). 

Este proyecto optimiza la gestión del tiempo de los practicantes mediante una interfaz moderna que se conecta directamente a Google Sheets, funcionando como base de datos en tiempo real y eliminando la necesidad de registros manuales en papel.

## Características Principales

*   **Carga Dinámica de Usuarios:** Se conecta con Google Sheets para cargar automáticamente la lista de practicantes activos al iniciar la aplicación.
*   **Monitoreo de Horas Acumuladas:** Al seleccionar a un practicante, el sistema consulta y muestra al instante el total de horas que lleva acumuladas hasta la fecha.
*   **Gestión Precisa del Tiempo:** Permite registrar la fecha exacta, hora de inicio y hora de fin (en formato de 24 horas) para cada sesión de prácticas.
*   **Prevención de Duplicados:** Bloqueo automático del botón de registro mientras se procesa la solicitud hacia el servidor de Google Apps Script, garantizando la integridad de los datos.
*   **Diseño UI/UX Moderno:** Interfaz responsiva con efectos "glassmorphism" (cristal), uso de la tipografía Inter, iconografía de FontAwesome y la paleta de colores institucional.

## Tecnologías Utilizadas

*   **Frontend:** HTML5, CSS3 (Variables nativas, Flexbox), JavaScript (Vanilla).
*   **Backend:** Google Apps Script (JavaScript) para la lógica del servidor y endpoints.
*   **Base de Datos:** Google Sheets (actuando como el repositorio centralizado de datos y cálculo de horas).
*   **Despliegue (Hosting):** Google Apps Script Web App enmascarada a través de Iframe para alojamiento en cualquier servidor web.


## Estructura del Proyecto

El proyecto está diseñado para ser implementado en el entorno de Google Apps Script. La estructura de archivos sugerida es la siguiente:

```text
├── Index.html       # Archivo de enmascarado (Iframe) utilizado para el despliegue web público.
├── README.md        # Documentación del proyecto.
└── src/             # Código fuente implementado en Google Apps Script.
    ├── Code.gs      # Backend (Lógica de conexión con Google Sheets, lectura y escritura de asistencia).
    └── Index.html   # Frontend de la Web App (Estructura UI, estilos y conexión con el backend).
```

## Autor

*   **Gabriela Tahis Mauriola Valdiviezo**
*   **Organización:** Instituto de Informática - Universidad Nacional de Piura (UNP)

---
*Proyecto desarrollado en el año 2026 para la automatización y mejora continua de los procesos internos.*
