# Research: Temporizador Pomodoro Web

**Feature**: `001-pomodoro-timer` | **Date**: 2026-08-25

Todas las decisiones de stack fueron fijadas por el input del usuario y la constitución
(vanilla puro, Web Audio API, Flexbox/Grid). Esta fase resuelve las decisiones de diseño
interno necesarias antes de modelar datos y contratos.

## R1. Mecanismo de cómputo del tiempo restante

- **Decision**: El motor no decrementa un contador visual; calcula el tiempo restante por
  diferencia entre una marca absoluta de fin (`deadline = Date.now() + remainingMs`) y el
  instante actual, refrescando la pantalla una vez por segundo con `setInterval` (1 s).
- **Rationale**: Garantiza FR-015 y SC-002: si la pestaña se congela o el dispositivo se
  suspende, al recuperar el foco el cálculo por marca absoluta muestra el tiempo real
  transcurrido sin deriva acumulada, cosa que fallaría al restar 1 s por tick.
- **Alternatives considered**: Decremento por tick de `setInterval` (rechazado: deriva
  acumulada cuando el navegador limita timers en segundo plano); `requestAnimationFrame`
  como reloj principal (rechazado: se detiene en pestañas ocultas).

## R2. Transición de fases y fin de ciclo

- **Decision**: Máquina de estados explícita: `idle → running → paused`, con fase
  `work | shortBreak`. Al llegar `remainingMs ≤ 0`: disparar aviso sonoro único + cambio
  visual, alternar fase (`work ⇄ shortBreak`), incrementar contador solo si la fase finalizada
  fue `work`, y quedar en `idle` con la nueva fase preparada (FR-016: nunca autoarrancar).
- **Rationale**: Refleja literalmente las aclaraciones Q1/Q2/Q4 de la especificación y hace el
  comportamiento trivialmente testeable.
- **Alternatives considered**: Autoinicio encadenado de fases (rechazado: contradice Q1);
  reinicio que afecte al contador (rechazado: contradice Q2).

## R3. Alerta sonora con Web Audio API

- **Decision**: Oscilador nativo (`OscillatorNode` + `GainNode`) generado bajo demanda, sin
  archivos de audio: pitido único breve (~0,5 s) al finalizar cada ciclo. El `AudioContext` se
  crea/reanuda en la primera interacción del usuario para cumplir las políticas de autoplay;
  si el contexto no puede reproducir, la notificación visual cubre el aviso (FR-009).
- **Rationale**: Cero dependencias (constitución), sin descargas extra, y degradación
  controlada ante bloqueo de audio documentada como edge case.
- **Alternatives considered**: `<audio>` con archivo local (rechazado: recurso binario
  prescindible); repetir pitido hasta confirmación (rechazado: contradice Q4).

## R4. Persistencia del contador por día natural

- **Decision**: Clave `pomodoros:YYYY-MM-DD` (fecha local) en `localStorage`; valor numérico.
  Lectura al iniciar, escritura atómica tras cada fin de ciclo `work`. Un nuevo día produce
  clave distinta → contador arranca en 0 (Q3).
- **Rationale**: Implementa exactamente el ámbito diario acordado; esquema mínimo, sin
  expiraciones ni migraciones; sobrevive recargas y cierres de pestaña del mismo día.
- **Alternatives considered**: Una sola clave con fecha embebida en JSON (equivalente pero más
  frágil de evolucionar); `sessionStorage` (rechazado: muere al cerrar pestaña, contradice Q3).

## R5. Accesibilidad de anuncios dinámicos

- **Decision**: Región `aria-live="polite"` para cambios de fase y avisos de fin de ciclo;
  el tiempo restante se expone en texto legible (`mm:ss`) con etiqueta accesible; controles con
  `aria-pressed`/estado deshabilitado según máquina de estados; respeto de
  `prefers-reduced-motion` para transiciones visuales.
- **Rationale**: Cubre FR-013/II constitucional sin lectores de pantalla propietarios; los
  segundos cambiantes NO se anuncian cada segundo (sería inutilizable), solo eventos
  significativos.
- **Alternatives considered**: Anunciar cada segundo vía `role="timer"` con `aria-live=off` +
  anuncios periódicos forzados (rechazado: ruido excesivo para usuarios de AT).

## R6. Layout responsive

- **Decision**: Mobile-first: tarjeta central con Flexbox vertical en móvil; Grid/Flexbox para
  distribuir controles; Media Queries ascendentes (~480 px, ~768 px) escalando tipografía con
  `clamp()` y unidades relativas; áreas táctiles ≥44×44 px.
- **Rationale**: Cumple principio III y SC-005 con CSS nativo exclusivamente.
- **Alternatives considered**: Framework CSS (prohibido); breakpoints descendentes
  desktop-first (rechazado: contrario a constitución III).
