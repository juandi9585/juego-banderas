#!/usr/bin/env node
// Sintetiza los 6 efectos de sonido del juego (docs/design.md §21). Node puro,
// SIN dependencias ni samples: por muestra se suman parciales senoidales (latón)
// u ondas triangulares con transitorio de ruido (madera), se aplica la
// envolvente percutida, se hacen fundidos de 2/3 ms y se PICO-NORMALIZA al dBFS
// objetivo. Salida: WAV mono 22 050 Hz 16-bit PCM en public/sounds/.
//
// Firma sonora: todo afinado a La (A440). Positivos = tríada de La mayor en
// latón cálido; negativos = madera grave en la misma tonalidad; tic = La agudo.
//
// Uso:  node scripts/generate-sounds.mjs   (o  npm run sounds)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const outDir = path.join(repoRoot, "public", "sounds");

const SR = 22050; // frecuencia de muestreo (mono)
const TOTAL_BUDGET = 60 * 1024; // ≤ 60 KB entre los 6 (roadmap §B.1)

const sec = (ms) => ms / 1000;

// dBFS → amplitud lineal (picos objetivo de §21).
const dbfs = (db) => Math.pow(10, db / 20);

// ── Timbres ──────────────────────────────────────────────────────────────────
// Latón: síntesis aditiva de f, 2f, 3f (octava + tercer parcial metálico) con
// inarmonicidad leve (2.01f, 3.02f) para brillo. Ataque cortísimo + decaimiento
// exponencial e^(−t/τ): golpe percutido, sin sustain.
const BRASS_PARTIALS = [
  [1, 1.0],
  [2.01, 0.5],
  [3.02, 0.18],
];

// Ruido blanco con one-pole lowpass (y += k·(x−y), k≈0.4 ≈ 1.4 kHz): da "madera"
// y no siseo. LCG determinista → los WAV son reproducibles byte a byte.
function makeNoise(k) {
  let y = 0;
  let seed = 0x9e3779b1 >>> 0;
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const x = (seed / 0x100000000) * 2 - 1; // [-1, 1)
    y += k * (x - y);
    return y;
  };
}

// Envolvente percutida: rampa lineal de ataque, luego decaimiento exponencial.
function percEnv(t, attack, tau) {
  return t < attack ? t / attack : Math.exp(-(t - attack) / tau);
}

// Nota de LATÓN (aditiva). `extra(t)` opcional aplica un trémolo (récord).
function addBrass(buf, { onsetMs, freq, partials = BRASS_PARTIALS, attackMs, tauMs, level, extra }) {
  const onset = Math.round(sec(onsetMs) * SR);
  const attack = sec(attackMs);
  const tau = sec(tauMs);
  for (let i = onset; i < buf.length; i++) {
    const t = (i - onset) / SR;
    const env = percEnv(t, attack, tau);
    let s = 0;
    for (const [mult, amp] of partials) s += amp * Math.sin(2 * Math.PI * freq * mult * t);
    let a = s * env * level;
    if (extra) a *= extra(t);
    buf[i] += a;
  }
}

// "Toc" de MADERA: onda triangular (armónicos impares suaves) con posible glide
// de tono + transitorio de ruido al ataque (el contacto).
function addWood(buf, {
  onsetMs, freqStart, freqEnd = freqStart, glideMs = 0,
  attackMs, tauMs, level, noiseMs = 0, noiseLevel = 0,
}) {
  const onset = Math.round(sec(onsetMs) * SR);
  const attack = sec(attackMs);
  const tau = sec(tauMs);
  const glide = sec(glideMs);
  const noiseDur = sec(noiseMs);
  const noise = makeNoise(0.4);
  let phase = 0;
  for (let i = onset; i < buf.length; i++) {
    const t = (i - onset) / SR;
    const f = glide > 0 && t < glide ? freqStart + (freqEnd - freqStart) * (t / glide) : freqEnd;
    phase += (2 * Math.PI * f) / SR;
    const tri = (2 / Math.PI) * Math.asin(Math.sin(phase)); // triangular pura
    let a = tri * percEnv(t, attack, tau) * level;
    if (noiseDur > 0 && t < noiseDur) {
      a += noise() * Math.exp(-t / (noiseDur * 0.5)) * noiseLevel; // transitorio del contacto
    }
    buf[i] += a;
  }
}

// ── Post-proceso ─────────────────────────────────────────────────────────────
function applyFades(buf, fadeInMs = 2, fadeOutMs = 3) {
  const fi = Math.round(sec(fadeInMs) * SR);
  const fo = Math.round(sec(fadeOutMs) * SR);
  for (let i = 0; i < fi && i < buf.length; i++) buf[i] *= i / fi;
  for (let i = 0; i < fo && i < buf.length; i++) buf[buf.length - 1 - i] *= i / fo;
}

function peakNormalize(buf, targetLinear) {
  let peak = 0;
  for (let i = 0; i < buf.length; i++) peak = Math.max(peak, Math.abs(buf[i]));
  if (peak === 0) return;
  const g = targetLinear / peak;
  for (let i = 0; i < buf.length; i++) buf[i] *= g;
}

function encodeWav(buf) {
  const n = buf.length;
  const dataSize = n * 2;
  const out = Buffer.alloc(44 + dataSize);
  out.write("RIFF", 0);
  out.writeUInt32LE(36 + dataSize, 4);
  out.write("WAVE", 8);
  out.write("fmt ", 12);
  out.writeUInt32LE(16, 16); // tamaño del sub-chunk fmt
  out.writeUInt16LE(1, 20); // PCM
  out.writeUInt16LE(1, 22); // mono
  out.writeUInt32LE(SR, 24);
  out.writeUInt32LE(SR * 2, 28); // byte rate
  out.writeUInt16LE(2, 32); // block align
  out.writeUInt16LE(16, 34); // bits por muestra
  out.write("data", 36);
  out.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, buf[i]));
    out.writeInt16LE(Math.round(s < 0 ? s * 0x8000 : s * 0x7fff), 44 + i * 2);
  }
  return out;
}

function makeBuffer(durMs) {
  return new Float32Array(Math.round(sec(durMs) * SR));
}

// ── Las 6 recetas (§21) ──────────────────────────────────────────────────────
// Notas de La mayor: La4 440 · Do♯5 554.37 · Mi5 659.25 · Sol♯5 830.61 · La5 880.
function build() {
  const sounds = {};

  // 1) Acierto — un "ting" de latón limpio (Do♯5). 150 ms, pico −3 dBFS.
  {
    const buf = makeBuffer(150);
    addBrass(buf, { onsetMs: 0, freq: 554.37, attackMs: 3, tauMs: 55, level: 1.0 });
    applyFades(buf);
    peakNormalize(buf, dbfs(-3));
    sounds.acierto = buf;
  }

  // 2) Hito de racha — el acierto que SUBE una quinta (Do♯5 → Sol♯5, 2.ª a 55 ms).
  {
    const buf = makeBuffer(130);
    addBrass(buf, { onsetMs: 0, freq: 554.37, attackMs: 2, tauMs: 40, level: 0.85 });
    addBrass(buf, { onsetMs: 55, freq: 830.61, attackMs: 2, tauMs: 40, level: 0.85 });
    applyFades(buf);
    peakNormalize(buf, dbfs(-4));
    sounds.racha = buf;
  }

  // 3) Fallo — "toc" de madera grave con glide 147→110 en 40 ms. 180 ms, −4 dBFS.
  {
    const buf = makeBuffer(180);
    addWood(buf, {
      onsetMs: 0, freqStart: 147, freqEnd: 110, glideMs: 40,
      attackMs: 2, tauMs: 45, level: 0.8, noiseMs: 15, noiseLevel: 0.5,
    });
    applyFades(buf);
    peakNormalize(buf, dbfs(-4));
    sounds.fallo = buf;
  }

  // 4) Timeout — hermano del fallo: dos toques de madera ↓ (165, luego 110 a 110 ms).
  {
    const buf = makeBuffer(240);
    addWood(buf, { onsetMs: 0, freqStart: 165, attackMs: 2, tauMs: 50, level: 0.8, noiseMs: 12, noiseLevel: 0.45 });
    addWood(buf, { onsetMs: 110, freqStart: 110, attackMs: 2, tauMs: 50, level: 0.8, noiseMs: 12, noiseLevel: 0.45 });
    applyFades(buf);
    peakNormalize(buf, dbfs(-4));
    sounds.timeout = buf;
  }

  // 5) Tic de urgencia — escape de latón corto y muy bajo (La5). 55 ms, −8 dBFS.
  {
    const buf = makeBuffer(55);
    addBrass(buf, {
      onsetMs: 0, freq: 880, partials: [[1, 1.0], [2.01, 0.2]],
      attackMs: 1, tauMs: 18, level: 0.45,
    });
    applyFades(buf);
    peakNormalize(buf, dbfs(-8));
    sounds.tick = buf;
  }

  // 6) Récord — arpegio de La mayor ascendente; la última nota florece con
  //    trémolo 5 Hz y un parcial 4f (el "sheen"). 520 ms, −2 dBFS (el más fuerte).
  {
    const buf = makeBuffer(520);
    const notes = [440, 554.37, 659.25]; // La4 · Do♯5 · Mi5 (onsets ~70 ms)
    notes.forEach((freq, k) => {
      addBrass(buf, { onsetMs: k * 70, freq, attackMs: 4, tauMs: 70, level: 0.9 });
    });
    // La5 final: ataque más largo, cola larga, trémolo 5 Hz (prof. 12%) y 4.º parcial.
    const tremolo = (t) => 1 - 0.06 * (1 - Math.cos(2 * Math.PI * 5 * t));
    addBrass(buf, {
      onsetMs: 210, freq: 880,
      partials: [[1, 1.0], [2.01, 0.5], [3.02, 0.18], [4, 0.1]],
      attackMs: 8, tauMs: 180, level: 0.9, extra: tremolo,
    });
    applyFades(buf);
    peakNormalize(buf, dbfs(-2));
    sounds.record = buf;
  }

  return sounds;
}

// ── Main ─────────────────────────────────────────────────────────────────────
function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const sounds = build();

  let total = 0;
  const rows = [];
  for (const [id, buf] of Object.entries(sounds)) {
    const wav = encodeWav(buf);
    fs.writeFileSync(path.join(outDir, `${id}.wav`), wav);
    total += wav.length;
    rows.push({ id, bytes: wav.length, ms: Math.round((buf.length / SR) * 1000) });
  }

  console.log("Sonidos generados (WAV mono 22 050 Hz 16-bit):");
  for (const r of rows) {
    console.log(`  ${r.id.padEnd(9)} ${String(r.bytes).padStart(6)} B  (${r.ms} ms)`);
  }
  console.log(`\nTotal: ${(total / 1024).toFixed(1)} KB / ${(TOTAL_BUDGET / 1024).toFixed(0)} KB`);
  if (total > TOTAL_BUDGET) {
    console.error(`\nPRESUPUESTO SUPERADO: ${total} B > ${TOTAL_BUDGET} B`);
    process.exit(1);
  }
  console.log("Presupuesto OK.");
}

main();
