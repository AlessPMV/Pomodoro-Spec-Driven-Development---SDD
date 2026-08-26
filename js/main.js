import { onTick, onStateChange, start, pause, reset } from "./timer.js";

const appRoot = document.querySelector(".app");
const timeDisplay = document.getElementById("time-display");
const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");
const resetButton = document.getElementById("reset-btn");

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

onTick(renderTime);

onStateChange((snapshot) => {
  appRoot.dataset.state = snapshot.state;
  updateControls(snapshot.state);
  renderTime(snapshot.remainingMs);
});

startButton.addEventListener("click", () => {
  start();
});

pauseButton.addEventListener("click", () => {
  pause();
});

resetButton.addEventListener("click", () => {
  reset();
});
