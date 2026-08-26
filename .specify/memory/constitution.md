<!--
=== SYNC IMPACT REPORT ===
Version change: (scaffold sin ratificar) → 1.0.0
Modified principles:
  - [PRINCIPLE_1_NAME] → I. Solo Web Nativa (Vanilla)
  - [PRINCIPLE_2_NAME] → II. HTML Semántico y Accesible
  - [PRINCIPLE_3_NAME] → III. Diseño Responsive y Adaptativo
  - [PRINCIPLE_4_NAME] → IV. Código Limpio y Cero Dependencias
  - [PRINCIPLE_5_NAME] → eliminado (no requerido; los 4 mandatos del usuario cubren el alcance)
Added sections: Restricciones Tecnológicas Adicionales; Flujo de Desarrollo y Puertas de Calidad; Governance (rellenado)
Removed sections: ninguna (los comentarios de ejemplo del scaffold se eliminaron tras su sustitución)
Follow-up TODOs: ninguno
===
-->

# Pomodoro SDD Constitution

## Core Principles

### I. Solo Web Nativa (Vanilla)

La aplicación DEBE desarrollarse usando ÚNICAMENTE HTML5, CSS3 y JavaScript Vanilla.
Está terminantemente prohibido el uso de frameworks (React, Angular, Vue o cualquier otro),
de librerías externas de interfaz o lógica, y de dependencias externas de cualquier tipo
(CDN, paquetes npm, fuentes o iconotecas de terceros, polyfills descargados).

- Todo el código DEBE ejecutarse directamente en el navegador, sin paso de compilación,
  bundling ni transpilación.
- Solo se permiten las APIs nativas del navegador (DOM, Web Storage, timers, Media Queries).
- Cualquier propuesta que requiera una dependencia externa DEBE tramitarse como enmienda
  de esta constitución antes de implementarse.

**Rationale**: cero dependencias elimina riesgos de supply chain, garantiza longevidad del
código, rendimiento predecible y control total sobre cada línea entregada.

### II. HTML Semántico y Accesible

El marcado DEBE ser HTML5 semántico y accesible.

- Usar elementos semánticos (`header`, `nav`, `main`, `section`, `footer`, `button`,
  `time`, etc.) en lugar de `div`/`span` genéricos cuando exista un elemento apropiado.
- Mantener una jerarquía de encabezados correcta y un único `h1` por página.
- Cumplir como mínimo WCAG 2.1 nivel AA: navegación completa por teclado, contraste
  suficiente, estados de foco visibles, textos alternativos y etiquetas asociadas a todos
  los controles de formulario.
- Los atributos ARIA se usan SOLO cuando la semántica nativa no alcance el objetivo.

**Rationale**: la semántica y la accesibilidad son requisitos funcionales, no decoración;
garantizan usabilidad con tecnologías de asistencia y robustez del DOM que maneja el JS.

### III. Diseño Responsive y Adaptativo

La interfaz DEBE ser responsive y adaptativa a dispositivos móviles y de escritorio.

- Enfoque mobile-first: los estilos base se escriben para móvil y se amplían mediante
  Media Queries hacia escritorio.
- Usar unidades fluidas (`rem`, `em`, `%`, `vh`, `vw`) y layout con Flexbox/Grid nativos.
- La UI DEBE verificarse en puntos de ruptura representativos desde 320px hasta 1920px
  de ancho, sin desbordes horizontales ni contenido inaccesible.
- Las áreas táctiles DEBEN tener un tamaño mínimo utilizable en móvil (~44×44 px).

**Rationale**: una app Pomodoro se usa en contextos muy distintos (móvil en movimiento,
escritorio en trabajo enfocado); el diseño debe servir a ambos sin duplicar código.

### IV. Código Limpio y Cero Dependencias

El código DEBE ser limpio, legible y mantenible, sin dependencias externas de ningún tipo.

- Nombres descriptivos en español o inglés consistentes; funciones pequeñas con una única
  responsabilidad; evitar repetición innecesaria (DRY) sin sobre-abstraer (YAGNI).
- Estructura de proyecto explícita y estable: `index.html`, hojas de estilo en `css/`,
  módulos JS en `js/`; ningún archivo huérfano ni código muerto.
- El estado de la aplicación vive en estructuras claras y documentadas por su propio nombre;
  se prohíbe la magia oculta (eval, strings-código, mutación global indiscriminada).
- La legibilidad prima sobre la brevedad: si hay que elegir, se elige el código más claro.

**Rationale**: sin framework que imponga estructura, la disciplina de código limpio es la
única salvaguarda de mantenibilidad a medio y largo plazo.

## Restricciones Tecnológicas Adicionales

- **Stack cerrado**: HTML5, CSS3 y JavaScript Vanilla (sintaxis ES moderna soportada por
  navegadores evergreen). Nada más entra al repositorio.
- **Sin toolchain obligatoria**: no se requiere Node, gestores de paquetes, bundlers ni
  servidores de desarrollo para construir o ejecutar; basta abrir `index.html` o servir
  la carpeta con cualquier servidor estático.
- **Modularidad nativa**: usar ES Modules (`<script type="module">`) para organizar el JS.
- **Persistencia local**: los datos (p. ej., sesiones y ajustes del temporizador) se guardan
  con `localStorage`; prohibido enviar datos a servicios de terceros.
- **Recursos embebidos o locales**: fuentes del sistema e iconos SVG inline; prohibido
  cargar recursos desde CDN.

## Flujo de Desarrollo y Puertas de Calidad

Ningún cambio se considera completo sin superar estas puertas:

1. **Validez del marcado y estilos**: el HTML y el CSS pasan los validadores oficiales del
   W3C sin errores.
2. **Accesibilidad verificada**: recorrido completo por teclado, foco visible y lectura
   coherente con lector de pantalla en las pantallas modificadas.
3. **Responsive verificado**: comprobación visual en móvil (≤480px), tablet (~768px) y
   escritorio (≥1280px).
4. **Comportamiento verificado**: los flujos afectados del temporizador se prueban a mano
   (inicio, pausa, reinicio, ciclos) y, si aplica, con scripts de prueba nativos que no
   introduzcan dependencias.
5. **Revisión contra principios**: toda revisión de código verifica explícitamente el
   cumplimiento de los principios I–IV; cualquier excepción debe justificarse por escrito
   en la descripción del cambio.

## Governance

- Esta constitución es el documento rector del proyecto y prevalece sobre cualquier otra
  práctica, convención o instrucción no formalizada como enmienda.
- **Procedimiento de enmienda**: toda modificación DEBE documentarse en este archivo,
  indicar fecha, versión nueva y un plan de migración para el código afectado.
- **Política de versiones**: versionado semántico MAJOR.MINOR.PATCH. MAJOR: eliminación o
  redefinición incompatible de principios; MINOR: nuevo principio, sección o expansión
  sustancial de la guía; PATCH: aclaraciones y correcciones sin impacto semántico.
- **Cumplimiento**: cada PR y revisión incluye la verificación de conformidad con esta
  constitución; la complejidad añadida debe justificarse frente al principio IV.
- Para guía de desarrollo en tiempo de ejecución, consultar los artefactos generados por
  el flujo Spec Kit (especificaciones, planes y tareas), siempre subordinados a este documento.

**Version**: 1.0.0 | **Ratified**: 2026-08-25 | **Last Amended**: 2026-08-25
