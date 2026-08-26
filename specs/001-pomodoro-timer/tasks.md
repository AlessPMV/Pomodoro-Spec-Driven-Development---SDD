---

description: "Task list for Temporizador Pomodoro Web"
---

# Tasks: Temporizador Pomodoro Web

**Input**: Design documents from `/specs/001-pomodoro-timer/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md,
data-model.md, contracts/

**Tests**: No se solicitaron frameworks de test (constitución: cero dependencias). La
verificación es manual según `quickstart.md`; cada checkpoint referencia sus escenarios E1–E9.

**Organization**: Tasks grouped by user story (US1–US4 de spec.md) para implementación y
validación independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Proyecto web estático según plan.md: `index.html` en raíz, `css/`, `js/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización del proyecto y estructura base

- [X] T001 Create directory structure `css/` and `js/` per plan.md Project Structure
- [ ] T002 Verify baseline: open placeholder root page in evergreen browser without console errors (no toolchain required)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Contrato UI completo y estilos base que TODAS las historias consumen

**⚠ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Build full semantic accessible markup in `index.html` per `contracts/dom-contract.md`: unique `h1`, `main` landmark, `[data-phase-label]`, `<time id="time-display">` showing 25:00, `#start-btn`, `#pause-btn`, `#reset-btn` with visible Spanish text, `<output id="cycle-counter">`, `[aria-live="polite"]` region, `lang="es"`, viewport meta
- [X] T004 [P] Build base mobile-first layout in `css/styles.css`: centered Flexbox card, buttons at least 44x44 px, visible focus styles, WCAG AA contrast tokens for both phases, `[data-state]`/`[data-phase]` attribute selectors as styling hooks

**Checkpoint**: Estructura y estilos base listos — las historias solo cablean lógica sobre este contrato

---

## Phase 3: User Story 1 - Controlar la cuenta regresiva de trabajo (Priority: P1) ⚡ MVP

**Goal**: Cuenta regresiva de 25:00 funcional con Iniciar/Pausar/Reiniciar, precisa segundo a segundo

**Independent Test**: Abrir la app, iniciar/pausar/reanudar/reiniciar y comparar con un reloj real (escenarios E1–E3 de `quickstart.md`) entrega un temporizador utilizable por sí solo

### Implementation for User Story 1

- [X] T005 [P] [US1] Implement countdown engine in `js/timer.js`: export `DURATIONS` (work=25min, shortBreak=5min), state machine idle|running|paused with absolute-deadline computation per research.md R1, commands start()/pause()/reset(), subscriptions onTick(remainingMs) firing once per second and onStateChange(snapshot)
- [X] T006 [US1] Wire controls and rendering in `js/main.js`: bind click handlers of `#start-btn`, `#pause-btn`, `#reset-btn` to engine commands, render mm:ss into `<time id="time-display">` on every tick, set data-state on root container and toggle button disabled states per `contracts/dom-contract.md` (depends on T005)

**Checkpoint**: User Story 1 fully functional and independently testable (E1–E3 pass; pause preserves remaining time; reset restores 25:00 without touching anything else)

---

## Phase 4: User Story 2 - Alternancia de ciclos Work y Short Break (Priority: P2)

**Goal**: Al llegar a 00:00 la fase alterna Work ⇄ Short Break quedando preparada y detenida

**Independent Test**: Terminar (o simular con duración corta) una fase y verificar que la siguiente carga con su duración propia sin autoarrancar (E4 pasos 4–5)

### Implementation for User Story 2

- [X] T007 [US2] Extend `js/timer.js`: detect timeout when remainingMs reaches 0 in running state, emit new subscription onCycleEnd(finishedPhase), alternate phase work ⇄ shortBreak, load next phase at full duration in idle without auto-start (FR-007, FR-016, research.md R2)
- [X] T008 [US2] Render phase identity in `js/main.js` and `css/styles.css`: update `[data-phase-label]` text ("Trabajo"/"Descanso corto"), toggle root data-phase attribute driving the color scheme, announce phase change through the `[aria-live="polite"]` region (depends on T007)

**Checkpoint**: Stories 1 AND 2 work together: los ciclos alternan indefinidamente esperando siempre inicio manual (E4 pasos 4–5)

---

## Phase 5: User Story 3 - Aviso al finalizar cada ciclo (Priority: P2)

**Goal**: Fin de ciclo perceptible: pitido único breve (Web Audio API) + cambio visual persistente hasta la próxima acción

**Independent Test**: Llegar a 00:00 y comprobar sonido único e indicación visual clara en menos de 1 s (E4 pasos 1–2, E7)

### Implementation for User Story 3

- [X] T009 [P] [US3] Implement audio module in `js/audio.js`: export playCycleEndAlert() returning Promise<boolean>, lazy AudioContext creation/resume, single short ~0.5 s beep via OscillatorNode+GainNode, resolve false silently when playback is blocked (FR-009, Q4, research.md R3)
- [X] T010 [US3] Integrate end-of-cycle notification in `js/main.js`: call playCycleEndAlert() inside the onCycleEnd handler, add ephemeral .cycle-ended class to root container removed on next user action, keep visual-only fallback clear when audio resolves false (depends on T008, T009)

**Checkpoint**: Stories 1–3 integradas: cada fin de ciclo se percibe por sonido y vista aunque el usuario no mire la pantalla

---

## Phase 6: User Story 4 - Contador de Pomodoros completados (Priority: P3)

**Goal**: Contador diario visible y persistente que incrementa exactamente +1 por ciclo Work terminado

**Independent Test**: Completar N ciclos, recargar o cerrar pestaña el mismo día y verificar N exacto, inmutable ante pausa/reset/descanso (E6)

### Implementation for User Story 4

- [X] T011 [P] [US4] Implement daily storage module in `js/storage.js`: export readTodayCount(now?) and incrementTodayCount(now?) using key pomodoros:YYYY-MM-DD with local date, normalize corrupt or negative values to 0, never throw (FR-012, Q3, research.md R4)
- [X] T012 [US4] Wire counter display in `js/main.js`: initialize `<output id="cycle-counter">` from readTodayCount() on page load, increment via incrementTodayCount() only when onCycleEnd reports finished phase work, keep value stable across pause/reset/break transitions (FR-010, FR-011) (depends on T010, T011)

**Checkpoint**: All four user stories functional: flujo completo Pomodoro con métrica diaria persistente

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Robustez transversal y validación final

- [ ] T013 Add background-tab precision safeguard in `js/timer.js`: listen to visibilitychange on document and force immediate recomputation and render of remaining time when returning to the tab (FR-015, SC-002)
- [ ] T014 [P] Refine responsive breakpoints and motion in `css/styles.css`: media queries around ~480 px and ~768 px scaling typography with clamp()/relative units, prefers-reduced-motion guard for .cycle-ended transitions (SC-005, research.md R5/R6)
- [ ] T015 Update `README.md` with project description, how to run (open `index.html` or any static server) and a link to `specs/001-pomodoro-timer/quickstart.md`
- [ ] T016 Run full validation per `quickstart.md`: scenarios E1–E9, W3C HTML/CSS validators clean, zero external requests audit via DevTools network tab, keyboard-only pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — starts immediately
- **Foundational (Phase 2)**: Depends on T001 — BLOCKS all user stories (T003 y T004 son independientes entre sí)
- **US1 (Phase 3)**: Depends on Phase 2 — T005 antes de T006
- **US2 (Phase 4)**: Depends on T006 — extiende el motor existente
- **US3 (Phase 5)**: T009 paralelizable desde Phase 2; T010 depende de T008 y T009
- **US4 (Phase 6)**: T011 paralelizable desde Phase 2; T012 depende de T010 y T011
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: independiente tras Foundation — núcleo del producto
- **US2 (P2)**: consume el motor de US1 (onCycleEnd, alternación); no rompe US1
- **US3 (P2)**: módulo de audio aislado; se integra al flujo de fin de ciclo de US2
- **US4 (P3)**: módulo de storage aislado; solo observa eventos de fin de fase work

### Parallel Opportunities

- T003/T004 son archivos distintos pero comparten contrato: hacerlas con `contracts/dom-contract.md` a la vista
- T005 (motor) puede empezar junto a Foundational una vez fijado `contracts/module-api.md`
- T009 y T011 son módulos nuevos sin dependencias cruzadas — paralelizables entre sí
- Entre historias: US3 y US4 pueden desarrollarse en paralelo tras completar US2 (archivos de integración distintos en main.js pero secuenciales sobre él)

---

## Parallel Example: User Story 3 & 4 modules

```text
# Módulos aislados, lanzables juntos:
Task: "T009 [P] [US3] Implement audio module in js/audio.js"
Task: "T011 [P] [US4] Implement daily storage module in js/storage.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — bloquea todo)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: escenarios E1–E3 de quickstart.md
5. Ya existe un temporizador usable — demo listo

### Incremental Delivery

1. Setup + Foundation → contrato UI estable
2. US1 → temporizador funcional (MVP)
3. US2 → ciclos Pomodoro alternados
4. US3 → avisos perceptibles (sonido + vista)
5. US4 → métrica diaria persistente
6. Polish → precisión, responsive fino, validación completa E1–E9

### Notes

- [P] tasks = archivos diferentes sin dependencias
- Los checkpoints usan los escenarios de `quickstart.md` como criterio de aceptación manual
- Commit tras cada tarea o grupo lógico
- Evitar: tareas vagas, conflictos de mismo archivo, dependencias cruzadas que rompan independencia
