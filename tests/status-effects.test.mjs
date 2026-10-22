import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile("scripts/dnd5e-death-token-effects.js", "utf8");

function loadModule(statusEffects) {
  const context = { Hooks: { once() {} }, CONFIG: { statusEffects } };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context;
}

test("recognizes DnD5e 6 status effects keyed by ID", () => {
  const module = loadModule({ dead: { id: "dead", statuses: ["dead"] } });
  assert.equal(module.getStatusDefinition("dead").id, "dead");
  assert.equal(module.getStatusToggleId("dead"), "dead");
  assert.equal(module.effectMatchesStatus({ statuses: new Set(["dead"]) }, "dead"), true);
});

test("continues to recognize Foundry array status effects", () => {
  const module = loadModule([{ id: "bloodied", statuses: ["bloodied"] }]);
  assert.equal(module.getStatusDefinition("bloodied").id, "bloodied");
});
