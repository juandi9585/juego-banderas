#!/usr/bin/env node
// Valida el dataset de países. Node puro, sin dependencias.
// Comprueba: sin códigos duplicados, campos obligatorios presentes,
// >=2 hechos por país, y que cada bandera referenciada exista en public/flags/.
//
// Uso: node scripts/validate-data.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const dataPath = path.join(repoRoot, "src", "data", "countries.json");
const flagsDir = path.join(repoRoot, "public", "flags");

const errors = [];
const warnings = [];

// --- Cargar datos ---
let countries;
try {
  countries = JSON.parse(fs.readFileSync(dataPath, "utf8"));
} catch (e) {
  console.error(`No se pudo leer ${dataPath}: ${e.message}`);
  process.exit(1);
}
if (!Array.isArray(countries)) {
  console.error("countries.json no contiene un array.");
  process.exit(1);
}

const requiredFields = ["code", "name", "continent", "capital", "flag", "facts"];
// Debe coincidir con la union `Continent` de src/features/game/types.ts.
const validContinents = new Set([
  "África",
  "América del Norte",
  "América del Sur",
  "Asia",
  "Europa",
  "Oceanía",
]);
const seen = new Map();

for (let i = 0; i < countries.length; i++) {
  const c = countries[i];
  const id = c && c.code ? c.code : `#${i}`;

  // Campos obligatorios
  for (const f of requiredFields) {
    const v = c[f];
    const empty =
      v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
    if (empty) errors.push(`[${id}] falta el campo obligatorio '${f}'`);
  }

  // Código ISO alpha-2 en minúsculas
  if (typeof c.code === "string" && !/^[a-z]{2}$/.test(c.code)) {
    errors.push(`[${id}] código inválido (se espera alpha-2 minúsculas): '${c.code}'`);
  }

  // Continente dentro de la union que espera la app
  if (typeof c.continent === "string" && c.continent !== "" && !validContinents.has(c.continent)) {
    errors.push(`[${id}] continente fuera de la union esperada: '${c.continent}'`);
  }

  // Duplicados
  if (c.code) {
    if (seen.has(c.code)) errors.push(`[${c.code}] código duplicado (también en índice ${seen.get(c.code)})`);
    else seen.set(c.code, i);
  }

  // Hechos: al menos 2
  if (Array.isArray(c.facts)) {
    if (c.facts.length < 2) errors.push(`[${id}] tiene ${c.facts.length} hecho(s); se requieren >= 2`);
    c.facts.forEach((f, j) => {
      if (typeof f !== "string" || f.trim() === "") errors.push(`[${id}] hecho[${j}] vacío o no es texto`);
      else if (f.length > 140) warnings.push(`[${id}] hecho[${j}] supera 140 caracteres (${f.length})`);
    });
  } else {
    errors.push(`[${id}] 'facts' no es un array`);
  }

  // Población coherente si está presente
  if (c.population !== undefined && (typeof c.population !== "number" || c.population <= 0)) {
    warnings.push(`[${id}] población sospechosa: ${c.population}`);
  }

  // Bandera: ruta esperada y archivo existente
  if (typeof c.flag === "string" && c.code) {
    const expected = `/flags/${c.code}.svg`;
    if (c.flag !== expected) warnings.push(`[${id}] ruta de bandera '${c.flag}' no coincide con '${expected}'`);
    const file = path.join(flagsDir, path.basename(c.flag));
    if (!fs.existsSync(file)) {
      errors.push(`[${id}] la bandera ${c.flag} no existe en public/flags/`);
    } else if (fs.statSync(file).size === 0) {
      errors.push(`[${id}] la bandera ${c.flag} está vacía`);
    }
  }
}

// --- Banderas huérfanas (opcional, aviso) ---
if (fs.existsSync(flagsDir)) {
  const referenced = new Set(countries.map((c) => path.basename(c.flag || "")));
  for (const file of fs.readdirSync(flagsDir)) {
    if (file.endsWith(".svg") && !referenced.has(file)) {
      warnings.push(`bandera sin usar en el dataset: public/flags/${file}`);
    }
  }
}

// --- Informe ---
console.log(`Países en el dataset: ${countries.length}`);
console.log(`Banderas referenciadas presentes: ${countries.length - errors.filter((e) => e.includes("no existe")).length}`);
if (warnings.length) {
  console.log(`\nAvisos (${warnings.length}):`);
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length) {
  console.log(`\nERRORES (${errors.length}):`);
  for (const e of errors) console.log(`  x ${e}`);
  console.log("\nValidación FALLIDA.");
  process.exit(1);
}
console.log("\nValidación OK: sin errores.");
process.exit(0);
