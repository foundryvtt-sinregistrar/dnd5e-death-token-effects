import { readFile } from "node:fs/promises";

const moduleId = "dnd5e-death-token-effects";
const manifest = JSON.parse(await readFile("module.json", "utf8"));
const required = [
  "id", "title", "description", "version", "authors", "compatibility", "relationships",
  "languages", "esmodules", "url", "manifest", "download", "bugs", "readme", "changelog", "license"
];
const urls = ["url", "manifest", "download", "bugs", "readme", "changelog", "license"];

for (const property of required) {
  if (!manifest[property]) throw new Error(`module.json requiere '${property}'.`);
}
if (manifest.id !== moduleId) throw new Error(`El id debe ser '${moduleId}'.`);
if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(manifest.version)) throw new Error("La version debe ser semver.");
for (const property of urls) {
  if (!/^https:\/\//.test(manifest[property])) throw new Error(`'${property}' debe usar una URL HTTPS publica.`);
}
if (manifest.download !== `${manifest.url}/releases/latest/download/${moduleId}.zip`) {
  throw new Error("La descarga debe apuntar al ZIP alias de la ultima release.");
}
if (!manifest.esmodules.includes("scripts/dnd5e-death-token-effects.js")) throw new Error("Falta el punto de entrada del modulo.");
if (manifest.compatibility.minimum !== "14.367" || manifest.compatibility.verified !== "14.368") {
  throw new Error("La compatibilidad de Foundry no coincide con la politica del proyecto.");
}
const dnd5e = manifest.relationships.systems?.find(({ id }) => id === "dnd5e");
if (dnd5e?.compatibility?.minimum !== "6.0.3" || dnd5e.compatibility.verified !== "6.0.3") {
  throw new Error("La compatibilidad de DnD5e no coincide con la politica del proyecto.");
}
for (const { path } of manifest.languages) await readFile(path, "utf8");
await readFile("scripts/dnd5e-death-token-effects.js", "utf8");
await readFile("CHANGELOG.md", "utf8");
await readFile("LICENSE", "utf8");
console.log(`OK: ${moduleId} ${manifest.version}`);
