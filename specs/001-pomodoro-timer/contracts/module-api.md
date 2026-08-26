# Module API Contracts: Temporizador Pomodoro Web

**Feature**: `001-pomodoro-timer` | **Date**: 2026-08-25

Contratos públicos de los módulos ES nativos bajo `js/`. Solo estas exportaciones son punto de
acoplamiento entre módulos; todo lo demás es privado al módulo.

## js/timer.js — Motor de fases y cuenta regresiva

```ts
// Constantes de dominio
export const DURATIONS = { work: 25 * 60_000, shortBreak: 5 * 60_000 };

// Suscripción a cambios derivados del motor
export function onTick(cb: (remainingMs: number) => void): void
export function onCycleEnd(cb: (finishedPhase: 'work' | 'shortBreak') => void): void
export function onStateChange(cb: (snapshot: {
  state: 'idle' | 'running' | 'paused';
  phase: 'work' | 'shortBreak';
  remainingMs: number;
}) => void): void

// Comandos (implementan las transiciones del data-model)
export function start(): void      // idle|paused → running
export function pause(): void      // running → paused
export function reset(): void      // cualquier estado → idle (misma fase, duración completa)
```

Garantías: cálculo por marca absoluta (R1); precisión ±1 s sobre ciclo completo aunque la
pestaña pase a segundo plano; nunca autoinicia una fase tras `onCycleEnd` (FR-016).

## js/audio.js — Alerta sonora (Web Audio API)

```ts
// Pitido único breve (~0,5 s). Crea/reanuda AudioContext perezosamente;
// resuelve false si el navegador bloquea la reproducción (degrada sin lanzar).
export function playCycleEndAlert(): Promise<boolean>
```

Garantías: cero archivos/recursos externos; volumen del sistema; una sola emisión por fin de
ciclo (Q4); silencio total si el contexto no puede reproducir.

## js/storage.js — Contador diario persistente

```ts
// Clave interna: "pomodoros:<YYYY-MM-DD>" (fecha local)
export function readTodayCount(now?: Date): number        // 0 si ausente/inválido
export function incrementTodayCount(now?: Date): number   // +1 y devuelve nuevo total
```

Garantías: ámbito por día natural local (Q3); tolerante a datos corruptos (normaliza a 0);
sin excepciones hacia el llamador.

## js/main.js — Entry point (no exporta API pública)

Responsabilidades: consultar el DOM según `contracts/dom-contract.md`, cablear comandos del
motor a los botones, renderizar tick/estado/fase/clases, invocar `playCycleEndAlert()` e
`incrementTodayCount()` cuando `onCycleEnd` reporte fase `work`, y actualizar la región viva
en cambios de fase/fin de ciclo.

## Reglas transversales

1. Sin dependencias externas de ningún tipo (constitución I).
2. Comunicación unidireccional: UI → comandos del motor; motor → eventos → UI.
3. Ningún módulo accede al DOM salvo `main.js`.
