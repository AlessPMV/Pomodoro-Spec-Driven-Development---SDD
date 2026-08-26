# Feature Specification: Temporizador Pomodoro Web

**Feature Branch**: `001-pomodoro-timer`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "Construye una aplicación web de temporizador Pomodoro. Debe tener un temporizador funcional con ciclos predefinidos de 25 minutos de trabajo (Work) y 5 minutos de descanso (Short Break). Necesita controles para Iniciar, Pausar y Reiniciar la cuenta regresiva. Al finalizar cada ciclo debe emitir una alerta sonora usando la Audio API web y/o un cambio visual de estado en la interfaz. Debe llevar un contador de ciclos persistente en memoria que indique la cantidad de Pomodoros completados durante la sesión. La interfaz debe ser limpia, accesible y adaptativa a dispositivos móviles y de escritorio."

## Clarifications

### Session 2026-08-25

- Q: Cuando termina un ciclo, ¿cómo debe comenzar la siguiente fase? → A: Inicio manual siempre: cada fase espera que el usuario pulse Iniciar.
- Q: ¿Qué debe restablecer exactamente el control Reiniciar cuando se pulsa durante una sesión en curso? → A: Solo la fase actual: devuelve la fase vigente a su duración completa, sin tocar el contador.
- Q: ¿Cuándo debe ponerse a cero el contador de Pomodoros que persiste durante la sesión? → A: Por día natural: sobrevive a recargas y cierres de pestaña del mismo día; arranca en 0 al abrir un nuevo día.
- Q: Si el usuario no interactúa tras el aviso de fin de ciclo, ¿cómo debe comportarse la alerta sonora? → A: Pitido único: suena una vez, breve; el estado visual queda indicando el fin hasta la próxima acción.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Controlar la cuenta regresiva de trabajo (Priority: P1)

Como usuario que quiere aplicar la técnica Pomodoro, abro la aplicación, veo una cuenta
regresiva de 25 minutos lista para el período de trabajo y dispongo de controles claros para
Iniciar, Pausar y Reiniciar. Al pulsar Iniciar, el tiempo restante disminuye segundo a segundo;
al pulsar Pausa, la cuenta se congela conservando el tiempo restante; al pulsar Reiniciar,
la fase actual vuelve a su duración completa detenida.

**Why this priority**: es el núcleo del producto; sin una cuenta regresiva controlable la
aplicación no aporta ningún valor por sí sola.

**Independent Test**: puede probarse por completo iniciando, pausando, reanudando y
reiniciando la cuenta de 25 minutos y observando el tiempo mostrado; entrega valor inmediato
de temporizador funcional.

**Acceptance Scenarios**:

1. **Given** la aplicación recién abierta en fase Work, **When** el usuario pulsa Iniciar, **Then**
   la cuenta regresiva comienza desde 25:00 y disminuye visiblemente cada segundo.
2. **Given** la cuenta en marcha, **When** el usuario pulsa Pausar, **Then** el tiempo restante
   deja de disminuir y conserva el valor mostrado.
3. **Given** la cuenta pausada, **When** el usuario pulsa Iniciar, **Then** la cuenta continúa
   desde el tiempo restante guardado, sin reiniciarse a 25:00.
4. **Given** la cuenta en marcha o pausada con cualquier tiempo restante, **When** el usuario
   pulsa Reiniciar, **Then** la fase actual vuelve a mostrar su duración completa (25:00) y la
   cuenta permanece detenida hasta nuevo inicio.

---

### User Story 2 - Alternancia de ciclos Work y Short Break (Priority: P2)

Como usuario de la técnica Pomodoro, tras completar los 25 minutos de trabajo la aplicación
pasa automáticamente al modo descanso corto de 5 minutos, y tras completarlo vuelve a dejar
preparado el modo trabajo, manteniendo siempre la alternancia Work → Short Break → Work.

**Why this priority**: define la esencia del método Pomodoro (alternancia trabajo/descanso);
depende de la cuenta regresiva pero añade el flujo completo de ciclos predefinidos.

**Independent Test**: puede probarse acortando o esperando la finalización de una fase y
comprobando que la siguiente fase cargada corresponde siempre a la alternancia correcta con
su duración propia (25 o 5 minutos).

**Acceptance Scenarios**:

1. **Given** la cuenta de Work llegando a 00:00, **When** el ciclo termina, **Then** la
   aplicación se prepara en fase Short Break con 05:00 como duración completa.
2. **Given** la cuenta de Short Break llegando a 00:00, **When** el ciclo termina, **Then** la
   aplicación se prepara en fase Work con 25:00 como duración completa.
3. **Given** cualquier fase activa, **When** el usuario observa la interfaz, **Then** identifica
   sin ambigüedad si está en Work o en Short Break.

---

### User Story 3 - Aviso al finalizar cada ciclo (Priority: P2)

Como usuario concentrado en otra tarea, cuando un ciclo termina la aplicación me lo notifica
de forma perceptible mediante una señal sonora y un cambio visual evidente del estado de la
interfaz, de modo que no necesito mirar la pantalla constantemente.

**Why this priority**: garantiza que la transición de ciclo se perciba aunque el usuario no
esté mirando; complementa los ciclos sin alterar el núcleo.

**Independent Test**: puede probarse dejando terminar un ciclo y verificando que suena una
alerta y que la interfaz cambia de estado de forma clara dentro del primer segundo tras 00:00.

**Acceptance Scenarios**:

1. **Given** cualquier fase en curso, **When** la cuenta llega a 00:00, **Then** se emite una
   única alerta sonora breve y perceptible.
2. **Given** cualquier fase en curso, **When** la cuenta llega a 00:00, **Then** la interfaz
   muestra un cambio visual claro (nueva fase resaltada y/o indicación de fin de ciclo).
3. **Given** un entorno donde el sonido no pueda reproducirse, **When** un ciclo termina,
   **Then** el aviso visual por sí solo permite al usuario saber que el ciclo terminó.

---

### User Story 4 - Contador de Pomodoros completados (Priority: P3)

Como usuario que quiere medir su avance, veo en todo momento cuántos Pomodoros (ciclos de
trabajo completos) he terminado durante la sesión; el número aumenta exactamente uno cada vez
que finaliza un ciclo de Work y se mantiene estable entre fases y recargas accidentales de la
página dentro de la sesión.

**Why this priority**: aporta motivación y métrica personal; enriquece el producto sin ser
imprescindible para el funcionamiento básico.

**Independent Test**: puede probarse completando uno o varios ciclos de Work y comprobando que
el contador incrementa exactamente una unidad por cada Work terminado y nunca cambia por pausas,
reinicios ni pasos por descanso.

**Acceptance Scenarios**:

1. **Given** el contador en 0, **When** un ciclo de Work llega a 00:00, **Then** el contador
   pasa a 1.
2. **Given** ciclos previos completados, **When** el usuario pausa, reinicia o atraviesa un
   Short Break, **Then** el contador no varía.
3. **Given** un contador con valor N mayor que 0, **When** el usuario cierra y reabre la
   aplicación dentro del mismo día, **Then** el contador vuelve a mostrar N.

---

### Edge Cases

- ¿Qué ocurre si la pestaña queda en segundo plano o el dispositivo se suspende? La cuenta
  regresiva DEBE seguir siendo precisa al volver: el tiempo mostrado refleja el tiempo real
  transcurrido, no se acelera ni se congela.
- ¿Qué ocurre si el navegador bloquea el sonido (p. ej., políticas de reproducción automática)?
  La aplicación no falla: el aviso visual cubre la notificación y el sonido queda disponible
  tras la primera interacción del usuario.
- ¿Qué ocurre si el usuario pulsa controles repetidamente o de forma rápida? Los estados se
  mantienen consistentes: pausar estando pausado o reiniciar estando detenido no corrompe el
  tiempo restante ni el contador.
- ¿Qué ocurre si el usuario recarga la página en mitad de un ciclo? El temporizador vuelve al
  estado inicial listo en fase Work; el contador de Pomodoros conserva su valor de sesión.
- ¿Qué ocurre cuando termina un descanso y el usuario no interactúa? La aplicación permanece
  estable mostrando la nueva fase preparada indefinidamente, sin avanzar sola.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La aplicación MUST presentar al abrirse una cuenta regresiva lista en fase Work
  con duración completa de 25 minutos (25:00).
- **FR-002**: La aplicación MUST decrementar el tiempo mostrado una vez por segundo mientras la
  cuenta esté en marcha, mostrándolo en formato minutos:segundos.
- **FR-003**: El usuario MUST poder iniciar la cuenta regresiva con un único control Iniciar.
- **FR-004**: El usuario MUST poder pausar la cuenta en marcha conservando el tiempo restante.
- **FR-005**: El usuario MUST poder reanudar una cuenta pausada continuando desde el tiempo
  restante conservado.
- **FR-006**: El usuario MUST poder reiniciar en cualquier momento la fase actual a su duración
  completa dejando la cuenta detenida; el reinicio MUST limitarse a la fase vigente, sin alterar
  el contador de Pomodoros ni la secuencia de fases.
- **FR-007**: La aplicación MUST alternar las fases predefinidas en orden Work (25 minutos) →
  Short Break (5 minutos) → Work, sin permitir duraciones distintas a las definidas.
- **FR-008**: La aplicación MUST indicar en todo momento la fase vigente (Work o Short Break)
  de forma inequívoca.
- **FR-009**: Al llegar cualquier fase a 00:00 la aplicación MUST notificar el fin de ciclo
  mediante una señal sonora única y breve junto con un cambio visual claro del estado; el
  indicador visual MUST permanecer hasta la siguiente acción del usuario y, ante imposibilidad
  de sonar, MUST resultar suficiente por sí solo.
- **FR-010**: La aplicación MUST llevar un contador de Pomodoros completados visible en todo
  momento, incrementado exactamente en uno por cada ciclo de Work que llegue a 00:00.
- **FR-011**: El contador MUST permanecer invariable ante pausas, reanudaciones, reinicios y
  pasos por fases de descanso.
- **FR-012**: El contador MUST conservar su valor ante recargas de página y cierres o
  reaperturas de pestaña ocurridos dentro del mismo día natural; al iniciarse un nuevo día
  natural MUST arrancar en cero.
- **FR-013**: Todos los controles y la información esencial MUST ser operables y legibles
  mediante teclado únicamente, con foco visible y textos accesibles.
- **FR-014**: La interfaz MUST adaptarse a pantallas de móvil y escritorio sin pérdida de
  funcionalidad ni desbordes de contenido.
- **FR-015**: La cuenta en marcha MUST mantener la precisión respecto al tiempo real aunque la
  pestaña pase a segundo plano o el dispositivo se suspenda y recupere.
- **FR-016**: Al finalizar cualquier ciclo la aplicación MUST dejar la siguiente fase preparada
  y detenida; ninguna fase MAY comenzar su cuenta sin acción explícita del usuario.

### Key Entities *(include if feature involves data)*

- **Sesión de temporizador**: representa el estado vivo del temporizador; atributos: fase
  vigente (Work o Short Break), tiempo restante de la fase, estado de marcha (detenida, en
  marcha, pausada).
- **Contador de Pomodoros**: representa el total de ciclos de trabajo completados en la sesión;
  atributos: cantidad acumulada; relación: se incrementa únicamente por eventos de fin de fase
  Work; ciclo de vida: ámbito por día natural (arranca en 0 cada nuevo día).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario primerizo localiza y pulsa Iniciar en menos de 10 segundos desde la
  apertura de la aplicación, sin instrucciones.
- **SC-002**: El tiempo mostrado coincide con el tiempo real transcurrido con una desviación
  máxima de 1 segundo a lo largo de un ciclo completo.
- **SC-003**: El 100% de las finalizaciones de ciclo producen un aviso perceptible (sonoro o
  visual) en menos de 1 segundo desde el instante de 00:00.
- **SC-004**: Tras completar N ciclos de trabajo, el contador muestra exactamente N en el 100%
  de los casos verificados.
- **SC-005**: En un viewport de 320 px de ancho y en escritorio de 1280 px o más, la totalidad
  de funciones es accesible sin desplazamiento horizontal ni superposición de elementos.
- **SC-006**: El 100% de las acciones (iniciar, pausar, reiniciar) pueden ejecutarse usando
  solo el teclado.
- **SC-007**: El 90% de usuarios de prueba completan el flujo iniciar → pausar → reanudar →
  reiniciar correctamente en su primer intento.

## Assumptions

- Duraciones fijas: no se contempla configuración personalizada de duraciones ni descansos
  largos tras varios Pomodoros; solo Work 25 min y Short Break 5 min, según lo solicitado.
- Las fases NO arrancan solas: al terminar un ciclo la siguiente fase queda preparada y el
  usuario decide cuándo iniciarla.
- "Persistente en memoria" quedó aclarado: el contador tiene alcance por día natural
  (sobrevive a recargas y cierres de pestaña del mismo día y arranca en 0 en un día nuevo);
  no requiere histórico entre días ni exportación.
- El sonido de alerta será breve y usará el volumen del sistema; no hay selección de tono.
- Aplicación de usuario único, sin cuentas, sin conexión a servicios externos y utilizable sin
  red tras cargarla.
- Idioma de la interfaz: español.
- El cumplimiento de la constitución del proyecto (tecnologías web nativas, cero dependencias)
  aplica como restricción de implementación, sin condicionar los requisitos funcionales aquí
  descritos.
