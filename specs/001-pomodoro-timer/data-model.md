# Data Model: Temporizador Pomodoro Web

**Feature**: `001-pomodoro-timer` | **Date**: 2026-08-25

Entidades extraídas de la especificación (`specs/001-pomodoro-timer/spec.md`, sección Key
Entities). Persistencia local única: `localStorage`.

## Entidad 1: Sesión de temporizador (en memoria, no persistente)

Estado vivo del temporizador durante la ejecución de la página.

| Campo | Tipo | Reglas / Valores |
|-------|------|------------------|
| `phase` | enum `work \| shortBreak` | Duración canónica: `work` = 25 min; `shortBreak` = 5 min. Alterna estrictamente work → shortBreak → work (FR-007) |
| `remainingMs` | entero ≥ 0 | Milisegundos restantes de la fase; derivado por marca absoluta `deadlineMs − now` mientras corre (R1) |
| `state` | enum `idle \| running \| paused` | Transiciones válidas según diagrama inferior |
| `deadlineMs` | entero | Marca absoluta de fin; definida solo en `running`; fuente de verdad del tiempo |

### Transiciones de estado

```text
idle --start--> running          (fijar deadlineMs)
running --pause--> paused        (congelar remainingMs)
paused --start--> running        (recalcular deadlineMs desde remainingMs)
running --timeout--> idle        (fin de ciclo: avisar, alternar fase, contador si era work)
idle/paused/running --reset--> idle  (remainingMs = duración completa de la fase vigente;
                                      sin tocar el contador — FR-006/Q2)
```

Reglas invariables:

- Ninguna transición pasa de `idle` a `running` sin acción explícita del usuario (FR-016/Q1).
- El timeout solo ocurre en `running`.
- Reset siempre deja `state=idle` con la MISMA fase y su duración completa.

## Entidad 2: Contador de Pomodoros (persistente, ámbito diario)

Total de ciclos de trabajo completados.

| Campo | Tipo | Reglas |
|-------|------|--------|
| `dateKey` | string `YYYY-MM-DD` (fecha local) | Parte de la clave de almacenamiento: `pomodoros:<dateKey>` |
| `count` | entero ≥ 0 | Se incrementa exactamente +1 por cada timeout de fase `work` (FR-010); inmutable ante pause/resume/reset/descansos (FR-011) |

Ciclo de vida: arranca en 0 cuando no existe clave para el día actual; sobrevive a recargas y
cierres/reaperturas dentro del mismo día natural; un nuevo día implica clave nueva → 0
(FR-012/Q3).

Operaciones de almacenamiento (implementadas en `js/storage.js`):

- `leer(dateKey) → count` (0 si ausente o valor inválido → tratar como 0, nunca fallar)
- `incrementar(dateKey) → count` (+1 atómico)

Validación defensiva: valor no numérico o negativo en almacenamiento se normaliza a 0.

## Relación entre entidades

1:N implícita — una Sesión puede producir cero o muchos incrementos del Contador a lo largo
del día; el Contador nunca modifica a la Sesión.
