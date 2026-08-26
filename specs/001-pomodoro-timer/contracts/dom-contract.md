# DOM Contract: Temporizador Pomodoro Web

**Feature**: `001-pomodoro-timer` | **Date**: 2026-08-25

Contrato de interfaz de usuario: elementos, atributos y estados que `index.html` expone y que
los módulos JS consumen/manipulan. Es el acuerdo estable entre marcado y lógica; cualquier
cambio aquí debe reflejarse en ambos lados.

## Identificadores y roles estables

| Selector / id | Elemento semántico | Rol en el contrato |
|---------------|--------------------|--------------------|
| `[data-phase-label]` | `p` dentro de encabezado de sección | Texto visible del nombre de fase ("Trabajo" / "Descanso corto"); cambia con `phase` |
| `#time-display` | `<time>` | Tiempo restante legible, formato `mm:ss`; contenido actualizado 1×/s en `running` |
| `#start-btn` | `<button>` | Inicia o reanuda (`idle|paused → running`); deshabilitado en `running` |
| `#pause-btn` | `<button>` | Pausa (`running → paused`); deshabilitado si no está `running` |
| `#reset-btn` | `<button>` | Reinicia fase vigente a duración completa y detiene (→ `idle`); siempre habilitado |
| `#cycle-counter` | `output` | Contador de Pomodoros del día: texto "N"; se actualiza solo en timeout de `work` |

## Estados visuales (clases CSS canónicas)

En un contenedor raíz `[data-state]` + `[data-phase]`, con valores `data-state ∈ {idle,
running, paused}` y `data-phase ∈ {work, short-break}`:

- `[data-phase="work"]` vs `[data-phase="short-break"]`: esquema de color/etiqueta distinto por
  fase (identificación inequívoca — FR-008).
- `[data-state="paused"]`: indicación visual clara (p. ej., etiqueta "Pausado").
- Fin de ciclo: clase efímera `.cycle-ended` sobre el contenedor hasta la siguiente acción
  (aviso visual persistente — FR-009/Q4); respetar `prefers-reduced-motion`.

## Accesibilidad contractual

- Jerarquía: único `h1` (título app) + `h2` para regiones.
- Región viva: `[aria-live="polite"]` para anuncios de cambio de fase y fin de ciclo (no para
  cada segundo).
- Todos los `button` con nombre accesible por texto visible; foco visible garantizado por CSS;
  orden de tabulación natural (sin `tabindex` positivos).
- Contraste AA en ambos esquemas de fase y estados.

## Eventos que el JS escucha (fuente de verdad de interacción)

- `click` en los tres botones (funciona también con Enter/Espacio nativos del botón).
- `visibilitychange` en `document` (recalculo de `remainingMs` al volver — FR-015).

## Invariantes

1. El contrato no depende de librerías externas ni atributos generados dinámicamente más allá
   de los listados.
2. Los textos visibles están en español (supuesto de especificación).
3. Ningún elemento se elimina/recrea en runtime: solo cambian textos, clases y atributos de
   estado.
