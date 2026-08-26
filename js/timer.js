export const DURATIONS = {
  work: 25 * 60_000,
  shortBreak: 5 * 60_000,
};

let phase = "work";
let state = "idle";
let remainingMs = DURATIONS[phase];
let deadlineMs = 0;
let tickIntervalId = null;

const tickSubscribers = [];
const stateSubscribers = [];
const cycleEndSubscribers = [];

function getSnapshot() {
  return { state, phase, remainingMs };
}

function notifyStateChange() {
  const snapshot = getSnapshot();
  stateSubscribers.forEach((callback) => callback(snapshot));
}

function notifyTick() {
  tickSubscribers.forEach((callback) => callback(remainingMs));
}

function notifyCycleEnd(finishedPhase) {
  cycleEndSubscribers.forEach((callback) => callback(finishedPhase));
}

function stopTicking() {
  if (tickIntervalId !== null) {
    clearInterval(tickIntervalId);
    tickIntervalId = null;
  }
}

function switchToNextPhase() {
  phase = phase === "work" ? "shortBreak" : "work";
  remainingMs = DURATIONS[phase];
}

function finishCycle() {
  stopTicking();
  const finishedPhase = phase;
  state = "idle";
  switchToNextPhase();
  notifyCycleEnd(finishedPhase);
  notifyStateChange();
  notifyTick();
}

function runTick() {
  remainingMs = Math.max(0, deadlineMs - Date.now());
  if (remainingMs === 0) {
    finishCycle();
    return;
  }
  notifyTick();
}

export function start() {
  if (state === "running" || remainingMs === 0) {
    return;
  }
  deadlineMs = Date.now() + remainingMs;
  state = "running";
  stopTicking();
  tickIntervalId = setInterval(runTick, 1000);
  notifyStateChange();
  notifyTick();
}

export function pause() {
  if (state !== "running") {
    return;
  }
  remainingMs = Math.max(0, deadlineMs - Date.now());
  stopTicking();
  state = "paused";
  notifyStateChange();
}

export function reset() {
  if (state === "idle") {
    return;
  }
  stopTicking();
  remainingMs = DURATIONS[phase];
  state = "idle";
  notifyStateChange();
  notifyTick();
}

export function onTick(callback) {
  tickSubscribers.push(callback);
}

export function onStateChange(callback) {
  stateSubscribers.push(callback);
}

export function onCycleEnd(callback) {
  cycleEndSubscribers.push(callback);
}
