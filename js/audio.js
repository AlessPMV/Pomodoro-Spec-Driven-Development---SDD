let audioContext = null;

function getContextConstructor() {
  return window.AudioContext || window.webkitAudioContext || null;
}

function ensureContext() {
  const ContextConstructor = getContextConstructor();
  if (!ContextConstructor) {
    return null;
  }
  if (!audioContext) {
    audioContext = new ContextConstructor();
  }
  return audioContext;
}

function scheduleBeep(context) {
  const startTime = context.currentTime;
  const duration = 0.5;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  oscillator.connect(gain);
  gain.connect(context.destination);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export async function playCycleEndAlert() {
  const context = ensureContext();
  if (!context) {
    return false;
  }
  try {
    if (context.state === "suspended") {
      await context.resume();
    }
  } catch {
    return false;
  }
  try {
    scheduleBeep(context);
    return true;
  } catch {
    return false;
  }
}
