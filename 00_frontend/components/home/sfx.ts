// Tiếng kiếm khi hover nút Đấu trường. Dùng Web Audio để phát tức thì, không trễ như <audio>.
const URL = "/sounds/sword.mp3";
const VOLUME = 0.12;
const KEY = "home-sfx-muted";

let ctx: AudioContext | null = null;
let buffer: Promise<AudioBuffer | null> | null = null;
let lastPlay = 0;
let mutedMemo: boolean | null = null; // giữ trạng thái khi localStorage bị chặn
const listeners = new Set<() => void>();

export function isMuted() {
  if (mutedMemo !== null) return mutedMemo;
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean) {
  mutedMemo = muted;
  try {
    localStorage.setItem(KEY, muted ? "1" : "0");
  } catch {}
  listeners.forEach((l) => l());
}

// Cho useSyncExternalStore
export function subscribeMuted(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function playSword(delayMs = 0) {
  // Trình duyệt chặn âm thanh khi người dùng chưa click/gõ phím trên trang
  if (isMuted() || !navigator.userActivation?.hasBeenActive) return;
  const now = performance.now();
  if (now - lastPlay < 300) return; // lướt chuột nhanh không bị dồn tiếng
  lastPlay = now;

  ctx ??= new AudioContext();
  const c = ctx;
  void c.resume();
  buffer ??= fetch(URL)
    .then((r) => r.arrayBuffer())
    .then((b) => c.decodeAudioData(b))
    .catch(() => null);

  void buffer.then((buf) => {
    if (!buf) return;
    const src = c.createBufferSource();
    const g = c.createGain();
    g.gain.value = VOLUME;
    src.buffer = buf;
    src.connect(g).connect(c.destination);
    // Nếu file tải chậm hơn delay thì phát ngay
    src.start(c.currentTime + Math.max(0, delayMs - (performance.now() - now)) / 1000);
  });
}
