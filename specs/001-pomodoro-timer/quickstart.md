# Quickstart: Validación de Temporizador Pomodoro Web

**Feature**: `001-pomodoro-timer` | **Date**: 2026-08-25

Guía de validación end-to-end. Referencias: contratos en `contracts/dom-contract.md` y
`contracts/module-api.md`; estados y reglas en `data-model.md`. No incluye código de
implementación.

## Prerrequisitos

- Navegador evergreen (Chrome, Edge, Firefox o Safari) actualizado.
- Archivos del proyecto servidos desde la raíz (`index.html` en raíz, `css/`, `js/`).
  Ejecución: abrir `index.html` directamente, o servir la carpeta con cualquier servidor
  estático si el navegador restringe módulos en `file://`.

## Comprobaciones previas (puertas de calidad — constitución)

1. **HTML válido**: pasar `index.html` por el validador W3C sin errores.
2. **CSS válido**: pasar `css/styles.css` por el validador W3C sin errores.
3. **Sin dependencias**: verificar que no hay `<link>`/`<script>` hacia orígenes externos ni
   recursos de terceros; solo archivos locales.

## Escenarios funcionales

### E1. Arranque y cuenta regresiva (US1, FR-001/002/003, SC-001)

1. Abrir la aplicación → debe mostrarse "Trabajo" con 25:00, contador "0", estado idle.
2. Pulsar Iniciar → el tiempo disminuye cada segundo.
3. Esperar ~10 s comparando con un reloj real → desviación ≤ 1 s.

**Esperado**: cuenta visible en formato `mm:ss`, decreciente 1×/s.

### E2. Pausar y reanudar (FR-004/005)

1. Con la cuenta en marcha, pulsar Pausar → tiempo congelado, botón Pausar inoperante.
2. Pulsar Iniciar → continúa desde el valor congelado (NO vuelve a 25:00).

### E3. Reiniciar fase (US1, FR-006, Q2)

1. Con cualquier tiempo restante (en marcha o pausada), pulsar Reiniciar → muestra 25:00
   detenido.
2. Verificar que el contador de Pomodoros NO cambia al reiniciar.

### E4. Fin de ciclo Work → aviso y transición (US2/US3, FR-007..010, SC-003)

> Para no esperar 25 min, validar temporalmente acortando la duración en pruebas manuales
> (p. ej., copia local con 5 s) o esperar el ciclo completo; el comportamiento es idéntico.

1. Dejar llegar la cuenta a 00:00 → suena UN pitido breve único (Q4).
2. La interfaz cambia claramente: fase "Descanso corto" resaltada + indicación de fin visible
   hasta la siguiente acción; región viva anuncia el cambio.
3. El contador pasa de N a N+1 exactamente una vez.
4. La cuenta queda detenida en 05:00 (no arranca sola — Q1).
5. Repetir hasta fin del descanso → vuelve a "Trabajo" 25:00 preparado, contador intacto.

### E5. Precisión en segundo plano (FR-015, SC-002)

1. Iniciar un ciclo y cambiar a otra pestaña durante ≥ 2 min.
2. Volver → el tiempo restante refleja el tiempo real transcurrido (±1 s), sin saltos raros.

### E6. Persistencia diaria del contador (FR-012, Q3)

1. Tras completar ≥1 ciclo, recargar la página → contador conserva N.
2. Cerrar pestaña y reabrir el mismo día → sigue N.
3. (Opcional, para simular cambio de día) alterar la fecha del sistema o la clave almacenada
   según `data-model.md` → al abrir, contador = 0.

### E7. Sonido bloqueado (edge case, FR-009)

1. Bloquear audio del sitio en el navegador (permisos) y terminar un ciclo.
2. Sin error visible; el aviso visual basta para enterarse del fin de ciclo.

### E8. Accesibilidad (FR-013, SC-006)

1. Solo con teclado: recorrer Iniciar/Pausar/Reiniciar con Tab, activar con Enter/Espacio;
   foco siempre visible.
2. Recorrido completo de E1–E3 ejecutable sin ratón.
3. Verificar contraste AA de texto y botones en ambas fases (herramienta de contraste).

### E9. Responsive (FR-014, SC-005)

1. DevTools modo responsive: 320 px → sin scroll horizontal, controles táctiles ≥44×44 px.
2. 768 px y 1280–1920 px → layout centrado legible, sin superposiciones.

## Criterio de éxito global

Todos los escenarios E1–E9 superados = feature validada end-to-end conforme a la
especificación y la constitución.
