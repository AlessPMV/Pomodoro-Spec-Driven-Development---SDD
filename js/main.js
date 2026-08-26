import { onTick, onStateChange, onCycleEnd, start, pause, reset } from "./timer.js";
import { playCycleEndAlert } from "./audio.js";

const appRoot = document.querySelector(".app");
const timeDisplay = document.getElementById("time-display");
const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");
const resetButton = document.getElementById("reset-btn");
const phaseLabel = document.querySelector("[data-phase-label]");
const liveRegion = document.getElementById("live-region");

const PHASE_LABELS = {
  work: "Trabajo",
  shortBreak: "Descanso corto",
};

const PHASE_ATTRIBUTE = {
  work: "work",
  shortBreak: "short-break",
};

function formatTime(totalMs) {
  const totalSeconds = Math.round(totalMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return { text: `${minutes}:${seconds}`, iso: `PT${minutes}M${seconds}S` };
}

function renderTime(remainingMs) {
  const formatted = formatTime(remainingMs);
  timeDisplay.textContent = formatted.text;
  timeDisplay.setAttribute("datetime", formatted.iso);
}

function updateControls(state) {
  startButton.disabled = state === "running";
  pauseButton.disabled = state !== "running";
}

function announcePhase(phaseKey, remainingMs) {
  const minutes = Math.round(remainingMs / 60000);
  liveRegion.textContent = `${PHASE_LABELS[phaseKey]}: ${minutes} minutos preparados`;
}

let currentPhase = "work";

onTick(renderTime);

onStateChange((snapshot) => {
  appRoot.dataset.state = snapshot.state;
  if (snapshot.phase !== currentPhase) {
    currentPhase = snapshot.phase;
    appRoot.dataset.phase = PHASE_ATTRIBUTE[snapshot.phase];
    phaseLabel.textContent = PHASE_LABELS[snapshot.phase];
    announcePhase(snapshot.phase, snapshot.remainingMs);
  }
  updateControls(snapshot.state);
  renderTime(snapshot.remainingMs);
});

onCycleEnd(() => {
  appRoot.classList.add("cycle-ended");
  playCycleEndAlert();
});

function clearCycleEndedFlag() {
  appRoot.classList.remove("cycle-ended");
}

startButton.addEventListener("click", () => {
  clearCycleEndedFlag();
  start();
});

pauseButton.addEventListener("click", () => {
  clearCycleEndedFlag();
  pause();
});

resetButton.addEventListener("click", () => {
  clearCycleEndedFlag();
  reset();
});
