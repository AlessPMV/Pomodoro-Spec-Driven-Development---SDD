const STORAGE_KEY_PREFIX = "pomodoros:";

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function formatDateKey(date) {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildKey(date) {
  return STORAGE_KEY_PREFIX + formatDateKey(date);
}

function parseCount(raw) {
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) {
    return 0;
  }
  return value;
}

export function readTodayCount(now = new Date()) {
  const storage = getStorage();
  if (!storage) {
    return 0;
  }
  try {
    return parseCount(storage.getItem(buildKey(now)));
  } catch {
    return 0;
  }
}

export function incrementTodayCount(now = new Date()) {
  const next = readTodayCount(now) + 1;
  const storage = getStorage();
  if (!storage) {
    return next;
  }
  try {
    storage.setItem(buildKey(now), String(next));
  } catch {
    return next;
  }
  return next;
}
