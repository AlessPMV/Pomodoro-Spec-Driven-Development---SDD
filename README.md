# Pomodoro-Spec-Driven-Development---SDD

Temporizador Pomodoro web construido exclusivamente con HTML5, CSS3 y JavaScript Vanilla,
sin frameworks ni dependencias externas de ningún tipo. Desarrollado con el flujo
Spec-Driven-Development (`/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → implement).

## Funcionalidades

- Cuenta regresiva de 25 minutos (Work) alternada con descansos de 5 minutos (Short Break)
- Controles Iniciar / Pausar / Reiniciar con precisión de ±1 s incluso en pestaña en segundo plano
- Aviso de fin de ciclo: pitido único (Web Audio API) + indicación visual persistente
- Contador diario de Pomodoros completados persistente en `localStorage`
- Interfaz semántica y accesible (WCAG 2.1 AA), responsive de 320 px a escritorio

## Ejecución

No hay toolchain: abre `index.html` directamente en un navegador evergreen, o sirve la
carpeta con cualquier servidor estático si tu navegador restringe módulos ES en `file://`:

```sh
python -m http.server 8000
```

y visita `http://localhost:8000`.

## Estructura

```text
index.html        Marcado semántico accesible
css/styles.css    Estilos mobile-first (Flexbox, Media Queries, tokens AA)
js/main.js        Entry point: cablea DOM con los módulos
js/timer.js       Motor de cuenta regresiva y fases (marca absoluta)
js/audio.js       Alerta sonora única vía Web Audio API
js/storage.js     Contador diario persistente
```

## Validación

La guía completa de validación manual (escenarios E1–E9) está en
[`specs/001-pomodoro-timer/quickstart.md`](specs/001-pomodoro-timer/quickstart.md).

## Gobernanza

Los principios rectores del proyecto están en
[`.specify/memory/constitution.md`](.specify/memory/constitution.md): solo web nativa,
HTML semántico y accesible, diseño responsive adaptativo y cero dependencias.
