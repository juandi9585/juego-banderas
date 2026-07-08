#!/usr/bin/env node
// Genera siluetas de mapa (SVG) por país y por zona desde Natural Earth
// (dominio público). Node puro, SIN dependencias npm nuevas: Douglas-Peucker
// implementado a mano, `fetch` nativo para descargar, caché en scripts/.cache/.
//
// Salida:
//   public/shapes/countries/{code}.svg   (194, para Explorar — caché de runtime)
//   public/shapes/zones/{categoryId}.svg (18, para ledger/chips — precache)
//
// Uso:  node scripts/generate-shapes.mjs   (o  npm run shapes)
//
// Decisiones y trampas resueltas están comentadas junto a su código.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const cacheDir = path.join(scriptDir, ".cache");
const dataPath = path.join(repoRoot, "src", "data", "countries.json");
const outCountries = path.join(repoRoot, "public", "shapes", "countries");
const outZones = path.join(repoRoot, "public", "shapes", "zones");

const DEBUG = process.env.SHAPES_DEBUG === "1";

// ── Presupuestos (bytes en disco) ────────────────────────────────────────────
// Se ENFUERZA algo por debajo del límite del roadmap para que ≤1,5 KB valga
// tanto en KiB (1536) como en KB decimal (1500).
const BUDGET_COUNTRY = 1500; // ≤ 1,5 KB por país
const BUDGET_ZONE = 1500; // ≤ 1,5 KB por zona…
const BUDGET_WORLD = 4000; // …salvo "mundo": hasta 4 KB (roadmap §B.3)
const ZONES_TOTAL_BUDGET = 60 * 1024; // suma de zonas ≤ 60 KB

// Límites de validación final (algo más laxos que el enforce: 1,5 KiB / 4 KiB).
const VALID_COUNTRY = 1536;
const VALID_ZONE = 1536;
const VALID_WORLD = 4096;

// ── Escalas Natural Earth (admin_0 countries) ────────────────────────────────
const SCALES = ["110m", "50m", "10m"]; // base 110m; se completa con 50m y 10m
const NE_URL = (scale) =>
  `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_${scale}_admin_0_countries.geojson`;

const rad = Math.PI / 180;
const deg = 180 / Math.PI;

// ── Catálogo de zonas: espejo EXACTO de src/features/game/categories.ts ──────
// (No se puede importar el .ts desde Node; se replican los 18 matchers. Si
// cambia categories.ts o el dataset, revisar aquí — igual que hacen los Sets
// del propio categories.ts.)
const R_EUROPA_OESTE = new Set(["Europa Occidental", "Europa del Norte", "Europa Meridional"]);
const R_EUROPA_ESTE = new Set(["Europa Oriental", "Europa Central", "Europa Sudoriental"]);
const R_ASIA_OCCIDENTAL = new Set(["Asia Occidental"]);
const R_SUDESTE_ASIATICO = new Set(["Sudeste Asiático"]);
const R_ASIA_MERIDIONAL = new Set(["Asia Meridional"]);
const R_ASIA_ORIENTAL_CENTRAL = new Set(["Asia Oriental", "Asia Central"]);
const R_AFRICA_NORTE_OCCIDENTAL = new Set(["África del Norte", "África Occidental"]);
const R_AFRICA_ORIENTAL = new Set(["África Oriental"]);
const R_AFRICA_CENTRAL_AUSTRAL = new Set(["África Central", "África Austral"]);
const R_CARIBE = new Set(["Caribe"]);
const inR = (set) => (c) => c.region != null && set.has(c.region);

const ZONES = [
  { id: "mundo", matches: () => true },
  { id: "africa", matches: (c) => c.continent === "África" },
  { id: "america", matches: (c) => c.continent === "América del Norte y Centro" || c.continent === "América del Sur" },
  { id: "america-norte-centro", matches: (c) => c.continent === "América del Norte y Centro" },
  { id: "america-sur", matches: (c) => c.continent === "América del Sur" },
  { id: "asia", matches: (c) => c.continent === "Asia" },
  { id: "europa", matches: (c) => c.continent === "Europa" },
  { id: "oceania", matches: (c) => c.continent === "Oceanía" },
  { id: "europa-oeste", matches: inR(R_EUROPA_OESTE) },
  { id: "europa-este", matches: inR(R_EUROPA_ESTE) },
  { id: "asia-occidental", matches: inR(R_ASIA_OCCIDENTAL) },
  { id: "sudeste-asiatico", matches: inR(R_SUDESTE_ASIATICO) },
  { id: "asia-meridional", matches: inR(R_ASIA_MERIDIONAL) },
  { id: "asia-oriental-central", matches: inR(R_ASIA_ORIENTAL_CENTRAL) },
  { id: "africa-norte-occidental", matches: inR(R_AFRICA_NORTE_OCCIDENTAL) },
  { id: "africa-oriental", matches: inR(R_AFRICA_ORIENTAL) },
  { id: "africa-central-austral", matches: inR(R_AFRICA_CENTRAL_AUSTRAL) },
  { id: "caribe", matches: inR(R_CARIBE) },
];

// ─────────────────────────────────────────────────────────────────────────────
// Descarga + caché de Natural Earth
// ─────────────────────────────────────────────────────────────────────────────
async function loadScale(scale) {
  const file = path.join(cacheDir, `ne_${scale}_admin_0_countries.geojson`);
  if (fs.existsSync(file) && fs.statSync(file).size > 0) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  }
  fs.mkdirSync(cacheDir, { recursive: true });
  process.stdout.write(`  descargando ne_${scale}… `);
  const t = Date.now();
  const res = await fetch(NE_URL(scale));
  if (!res.ok) throw new Error(`HTTP ${res.status} al descargar ${scale}`);
  const txt = await res.text();
  fs.writeFileSync(file, txt);
  console.log(`${(txt.length / 1024 / 1024).toFixed(1)} MB en ${Date.now() - t} ms → cache`);
  return JSON.parse(txt);
}

// ISO alpha-2 de una feature. TRAMPA: ISO_A2 vale "-99" para Francia, Noruega
// y otros → fallback a ISO_A2_EH.
function isoOf(feature) {
  const p = feature.properties;
  let a2 = p.ISO_A2;
  if (!a2 || a2 === "-99") a2 = p.ISO_A2_EH;
  if (!a2 || a2 === "-99" || a2 === "-99.0") return null;
  return String(a2).toLowerCase();
}

// Índice code→feature de una escala. Si varias features comparten ISO, se
// queda la de mayor área (evita quedarnos con un enclave).
function indexByIso(geojson) {
  const idx = new Map();
  for (const f of geojson.features) {
    const code = isoOf(f);
    if (!code) continue;
    const prev = idx.get(code);
    if (!prev) idx.set(code, f);
    else if (featureArea(f) > featureArea(prev)) idx.set(code, f);
  }
  return idx;
}

// ─────────────────────────────────────────────────────────────────────────────
// Geometría
// ─────────────────────────────────────────────────────────────────────────────
// Anillos EXTERIORES (se descartan los huecos: para un icono relleno no aportan).
function exteriorRings(geometry) {
  const rings = [];
  if (!geometry) return rings;
  if (geometry.type === "Polygon") {
    if (geometry.coordinates[0]) rings.push(geometry.coordinates[0]);
  } else if (geometry.type === "MultiPolygon") {
    for (const poly of geometry.coordinates) if (poly[0]) rings.push(poly[0]);
  }
  return rings;
}

function ringAreaAbs(ring) {
  let a = 0;
  for (let i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
    a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(a) / 2;
}

function featureArea(f) {
  let a = 0;
  for (const r of exteriorRings(f.geometry)) a += ringAreaAbs(r);
  return a;
}

function ringBox(ring) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
}

// TRAMPA antimeridiano (Rusia, Fiyi, EE. UU./Aleutianas, Nueva Zelanda…):
// se desenrollan todas las longitudes a una ventana de ±180° alrededor de la
// MEDIA CIRCULAR de longitudes del conjunto, de modo que cada país (o zona)
// quede contiguo en vez de partido en dos por el ±180°.
function unwrapRings(rings) {
  let sx = 0, sy = 0;
  for (const ring of rings) {
    for (const [lon] of ring) {
      sx += Math.cos(lon * rad);
      sy += Math.sin(lon * rad);
    }
  }
  const meanLon = Math.atan2(sy, sx) * deg;
  return rings.map((ring) =>
    ring.map(([lon, lat]) => {
      let L = lon;
      while (L - meanLon > 180) L -= 360;
      while (L - meanLon <= -180) L += 360;
      return [L, lat];
    }),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Douglas-Peucker (iterativo, para no desbordar la pila en costas largas)
// ─────────────────────────────────────────────────────────────────────────────
function perpDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / Math.hypot(dx, dy);
}

function douglasPeucker(pts, eps) {
  const n = pts.length;
  if (n < 3) return pts.slice();
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const stack = [[0, n - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let maxD = -1, idx = -1;
    for (let i = s + 1; i < e; i++) {
      const d = perpDist(pts[i], pts[s], pts[e]);
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (idx !== -1 && maxD > eps) {
      keep[idx] = 1;
      stack.push([s, idx], [idx, e]);
    }
  }
  const out = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(pts[i]);
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Proyección + encaje en viewBox 100×100
// ─────────────────────────────────────────────────────────────────────────────
// Equirrectangular con corrección de latitud: x = lon·cos(latMedia), y = -lat.
// Así las formas son reconocibles como iconos sin estirarse por el meridiano.
function projectFit(rings, pad) {
  let latSum = 0, latN = 0;
  for (const r of rings) for (const [, lat] of r) { latSum += lat; latN++; }
  const latMean = latN ? latSum / latN : 0;
  const cosP = Math.max(0.05, Math.cos(latMean * rad));

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const proj = rings.map((r) =>
    r.map(([lon, lat]) => {
      const px = lon * cosP;
      const py = -lat;
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
      return [px, py];
    }),
  );
  const spanX = Math.max(maxX - minX, 1e-6);
  const spanY = Math.max(maxY - minY, 1e-6);
  const inner = 100 - 2 * pad;
  const scale = inner / Math.max(spanX, spanY);
  const offX = pad + (inner - spanX * scale) / 2;
  const offY = pad + (inner - spanY * scale) / 2;
  return proj.map((r) =>
    r.map(([px, py]) => [offX + (px - minX) * scale, offY + (py - minY) * scale]),
  );
}

function roundRing(ring) {
  const out = [];
  let px = null, py = null;
  for (const [x, y] of ring) {
    const rx = Math.min(100, Math.max(0, Math.round(x)));
    const ry = Math.min(100, Math.max(0, Math.round(y)));
    if (rx === px && ry === py) continue; // dedup de puntos consecutivos
    out.push([rx, ry]);
    px = rx; py = ry;
  }
  // quita el cierre duplicado (la Z del path ya cierra el anillo)
  if (out.length > 1 && out[0][0] === out[out.length - 1][0] && out[0][1] === out[out.length - 1][1]) {
    out.pop();
  }
  return out;
}

function buildPath(rings) {
  const parts = [];
  for (const ring of rings) {
    if (ring.length < 3) continue; // descarta anillos degenerados
    let d = "M" + ring[0][0] + " " + ring[0][1];
    for (let i = 1; i < ring.length; i++) d += " " + ring[i][0] + " " + ring[i][1];
    d += "Z";
    parts.push(d);
  }
  return parts.join("");
}

// xmlns OBLIGATORIO: como recurso de imagen externa (url() en mask-image / <img>)
// el navegador NO renderiza un SVG sin el namespace. El presupuesto de bytes se
// mide sobre ESTE string final (buildShape hace Buffer.byteLength(svgWrap(d))),
// así que la tolerancia itera contando ya el xmlns.
function svgWrap(d) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor"><path d="${d}"/></svg>`;
}

// Culling geográfico: solo cuando hay un continente DOMINANTE (una isla/masa
// que es > mitad del área total). Descarta territorios lejanos y pequeños
// (Guayana Francesa colgando de Francia) pero conserva Alaska (lejana pero
// grande) y NO se aplica a naciones-archipiélago (Filipinas, Indonesia,
// Bahamas) donde ninguna isla domina → allí solo actúa el umbral de área.
const DIST_K = 3.5; // "lejano" = a > DIST_K radios de la masa principal
const FAR_KEEP_FRAC = 0.25; // un territorio lejano solo se conserva si es grande
const DOMINANCE = 0.5;

function cullRings(rings, areas, frac) {
  const total = areas.reduce((s, a) => s + a, 0) || 1;
  let mainIdx = 0;
  for (let i = 1; i < areas.length; i++) if (areas[i] > areas[mainIdx]) mainIdx = i;
  const maxA = areas[mainIdx];
  const dominant = maxA / total > DOMINANCE;
  const mb = ringBox(rings[mainIdx]);
  const Rm = Math.max(0.5, 0.5 * Math.hypot(mb.maxX - mb.minX, mb.maxY - mb.minY));

  const kept = [];
  for (let i = 0; i < rings.length; i++) {
    if (i === mainIdx) { kept.push(rings[i]); continue; }
    if (dominant) {
      const b = ringBox(rings[i]);
      const dist = Math.hypot(b.cx - mb.cx, b.cy - mb.cy);
      const far = dist > DIST_K * Rm;
      if (far && areas[i] < FAR_KEEP_FRAC * maxA) continue; // lejano y pequeño → fuera
    }
    if (areas[i] >= frac * maxA) kept.push(rings[i]);
  }
  return kept;
}

// Construye el SVG de un conjunto de anillos (un país o una zona) iterando
// tolerancia DP + umbral de área hasta caber en `budget`.
function buildShape(rawRings, budget) {
  const rings = unwrapRings(rawRings);
  const areas = rings.map(ringAreaAbs);
  const PAD = 6;
  const TOL0 = 0.5, TOLK = 1.35;
  const FRAC0 = 0.0015, FRACK = 1.5, FRAC_CAP = 0.6;

  let last = null;
  for (let i = 0; i < 90; i++) {
    const tol = TOL0 * Math.pow(TOLK, i);
    const frac = Math.min(FRAC_CAP, FRAC0 * Math.pow(FRACK, i));
    const kept = cullRings(rings, areas, frac);
    const projected = projectFit(kept, PAD);
    const simplified = projected
      .map((r) => roundRing(douglasPeucker(r, tol)))
      .filter((r) => r.length >= 3);
    if (simplified.length === 0) continue;
    const d = buildPath(simplified);
    const svg = svgWrap(d);
    const bytes = Buffer.byteLength(svg, "utf8");
    last = { svg, bytes, points: simplified.reduce((s, r) => s + r.length, 0), rings: simplified.length, iter: i };
    if (bytes <= budget) return last;
  }
  return last; // devuelve el mejor intento (no debería superar el presupuesto)
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const countries = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  console.log(`Dataset: ${countries.length} países.\n`);

  // 1) Cargar escalas (perezoso: 110m siempre; 50m/10m solo si hacen falta).
  console.log("Natural Earth (dominio público):");
  const loaded = {};
  const getIndex = async (scale) => {
    if (!loaded[scale]) loaded[scale] = indexByIso(await loadScale(scale));
    return loaded[scale];
  };
  const idx110 = await getIndex("110m");

  // 2) Elegir feature por país (110m → 50m → 10m) y anotar de qué escala salió.
  const chosen = new Map(); // code → { feature, scale }
  const fromScale = { "110m": [], "50m": [], "10m": [] };
  const missing = [];
  for (const c of countries) {
    let picked = null;
    for (const scale of SCALES) {
      const index = await getIndex(scale);
      if (index.has(c.code)) { picked = { feature: index.get(c.code), scale }; break; }
    }
    if (!picked) { missing.push(c.code); continue; }
    chosen.set(c.code, picked);
    fromScale[picked.scale].push(c.code);
  }

  console.log(
    `\nCobertura por escala: 110m=${fromScale["110m"].length}, ` +
      `50m=${fromScale["50m"].length}, 10m=${fromScale["10m"].length}.`,
  );
  if (fromScale["50m"].length) console.log(`  · completados con 50m: ${fromScale["50m"].join(", ")}`);
  if (fromScale["10m"].length) console.log(`  · completados con 10m: ${fromScale["10m"].join(", ")}`);
  if (missing.length) console.log(`  · SIN silueta (hueco): ${missing.join(", ")}`);

  // 3) Limpiar y crear directorios de salida.
  for (const dir of [outCountries, outZones]) {
    fs.mkdirSync(dir, { recursive: true });
    for (const f of fs.readdirSync(dir)) if (f.endsWith(".svg")) fs.unlinkSync(path.join(dir, f));
  }

  // 4) SVG por país.
  console.log("\nGenerando siluetas de país…");
  let maxCountry = { code: null, bytes: 0 };
  for (const c of countries) {
    const pick = chosen.get(c.code);
    if (!pick) continue;
    const rings = exteriorRings(pick.feature.geometry);
    const res = buildShape(rings, BUDGET_COUNTRY);
    fs.writeFileSync(path.join(outCountries, `${c.code}.svg`), res.svg);
    if (res.bytes > maxCountry.bytes) maxCountry = { code: c.code, bytes: res.bytes };
    if (DEBUG) console.log(`  ${c.code}: ${res.bytes} B, ${res.points} pts, ${res.rings} anillos, iter ${res.iter}, ${pick.scale}`);
  }

  // 5) SVG por zona: concatena los anillos de todos los países miembros y los
  //    proyecta como un único mini-mapa (la "unión" es visual, sin geometría).
  console.log("Generando siluetas de zona…");
  let zonesTotal = 0;
  let maxZone = { id: null, bytes: 0 };
  const zoneSizes = [];
  for (const z of ZONES) {
    const members = countries.filter((c) => z.matches(c) && chosen.has(c.code));
    const rings = [];
    for (const c of members) rings.push(...exteriorRings(chosen.get(c.code).feature.geometry));
    const budget = z.id === "mundo" ? BUDGET_WORLD : BUDGET_ZONE;
    const res = buildShape(rings, budget);
    fs.writeFileSync(path.join(outZones, `${z.id}.svg`), res.svg);
    zonesTotal += res.bytes;
    zoneSizes.push({ id: z.id, bytes: res.bytes, members: members.length });
    if (res.bytes > maxZone.bytes) maxZone = { id: z.id, bytes: res.bytes };
    if (DEBUG) console.log(`  ${z.id}: ${res.bytes} B, ${members.length} países, ${res.points} pts, iter ${res.iter}`);
  }

  // 6) VALIDACIÓN FINAL (lee del disco, fuente de verdad).
  console.log("\n── Validación ──────────────────────────────────────────────");
  const problems = [];

  const countryFiles = fs.readdirSync(outCountries).filter((f) => f.endsWith(".svg"));
  const haveCodes = new Set(countryFiles.map((f) => f.replace(/\.svg$/, "")));
  for (const c of countries) if (!haveCodes.has(c.code)) problems.push(`falta silueta de país: ${c.code}`);
  console.log(`Países con SVG: ${haveCodes.size}/${countries.length}`);

  const zoneFiles = fs.readdirSync(outZones).filter((f) => f.endsWith(".svg"));
  const haveZones = new Set(zoneFiles.map((f) => f.replace(/\.svg$/, "")));
  for (const z of ZONES) if (!haveZones.has(z.id)) problems.push(`falta silueta de zona: ${z.id}`);
  console.log(`Zonas con SVG:  ${haveZones.size}/${ZONES.length}`);

  // Tamaños reales en disco + chequeo de presupuestos.
  let countryTotal = 0;
  let overCountry = null;
  for (const f of countryFiles) {
    const size = fs.statSync(path.join(outCountries, f)).size;
    countryTotal += size;
    if (size > VALID_COUNTRY) {
      problems.push(`país ${f} pesa ${size} B (> ${VALID_COUNTRY})`);
      if (!overCountry || size > overCountry.size) overCountry = { f, size };
    }
  }
  let zonesDiskTotal = 0;
  for (const s of zoneSizes) {
    zonesDiskTotal += s.bytes;
    const lim = s.id === "mundo" ? VALID_WORLD : VALID_ZONE;
    if (s.bytes > lim) problems.push(`zona ${s.id} pesa ${s.bytes} B (> ${lim})`);
  }
  if (zonesDiskTotal > ZONES_TOTAL_BUDGET) {
    problems.push(`suma de zonas ${zonesDiskTotal} B (> ${ZONES_TOTAL_BUDGET})`);
  }

  console.log(`SVG de país más pesado: ${maxCountry.code} = ${maxCountry.bytes} B`);
  console.log(`SVG de zona más pesada:  ${maxZone.id} = ${maxZone.bytes} B`);
  console.log(`Total países: ${(countryTotal / 1024).toFixed(1)} KB (${countryFiles.length} archivos)`);
  console.log(`Total zonas:  ${(zonesDiskTotal / 1024).toFixed(1)} KB / ${(ZONES_TOTAL_BUDGET / 1024).toFixed(0)} KB`);
  console.log("Zonas (bytes):");
  for (const s of [...zoneSizes].sort((a, b) => b.bytes - a.bytes)) {
    console.log(`  ${s.id.padEnd(24)} ${String(s.bytes).padStart(5)} B  (${s.members} países)`);
  }

  if (missing.length) problems.push(`huecos sin silueta: ${missing.join(", ")}`);

  if (problems.length) {
    console.log(`\nVALIDACIÓN FALLIDA (${problems.length}):`);
    for (const p of problems) console.log(`  x ${p}`);
    process.exit(1);
  }
  console.log("\nValidación OK: 194/194 países, 18/18 zonas, todo dentro de presupuesto.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
