const MODULE_ID = "dnd5e-death-token-effects";
const DEFAULT_DEAD_IMAGE = "systems/dnd5e/icons/svg/statuses/dead.svg";
const LEGACY_DEAD_IMAGES = new Set(["icons/svg/skull.svg", "/icons/svg/skull.svg"]);
const DEFAULT_DEAD_COLOR = "#8B0000";
const HP_PATH = "system.attributes.hp.value";
const DEATH_FAILURE_PATH = "system.attributes.death.failure";
const OVERLAY_PREFIX = `${MODULE_ID}-overlay`;
const BORDER_PREFIX = `${MODULE_ID}-border`;
const OVERLAY_MARGIN_PX = 3;
const BORDER_LINE_WIDTH = 4;

const STATUS_KEYS = {
  DEAD: "dead",
  BLOODIED: "bloodied"
};

const LEGACY_FLAGS = {
  ORIGINAL_IMAGE: "originalImage",
  ORIGINAL_ROTATION: "originalRotation",
  ORIGINAL_SCALE_X: "originalScaleX",
  ORIGINAL_SCALE_Y: "originalScaleY"
};

const pendingStatusActors = new Set();
const pendingBloodiedRemovalActors = new Set();

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "deadImage", {
    name: "DND5EDEATH.settings.deadImage.name",
    hint: "DND5EDEATH.settings.deadImage.hint",
    scope: "world",
    config: true,
    type: String,
    default: DEFAULT_DEAD_IMAGE
  });

  game.settings.register(MODULE_ID, "overlayColor", {
    name: "DND5EDEATH.settings.overlayColor.name",
    hint: "DND5EDEATH.settings.overlayColor.hint",
    scope: "world",
    config: true,
    type: String,
    default: DEFAULT_DEAD_COLOR
  });

  game.settings.register(MODULE_ID, "alphaFailure1", {
    name: "DND5EDEATH.settings.alphaFailure1.name",
    hint: "DND5EDEATH.settings.alphaFailure1.hint",
    scope: "world",
    config: true,
    type: Number,
    default: 0.25,
    range: { min: 0.05, max: 1, step: 0.05 }
  });

  game.settings.register(MODULE_ID, "alphaFailure2", {
    name: "DND5EDEATH.settings.alphaFailure2.name",
    hint: "DND5EDEATH.settings.alphaFailure2.hint",
    scope: "world",
    config: true,
    type: Number,
    default: 0.50,
    range: { min: 0.05, max: 1, step: 0.05 }
  });

  game.settings.register(MODULE_ID, "alphaFailure3", {
    name: "DND5EDEATH.settings.alphaFailure3.name",
    hint: "DND5EDEATH.settings.alphaFailure3.hint",
    scope: "world",
    config: true,
    type: Number,
    default: 0.80,
    range: { min: 0.05, max: 1, step: 0.05 }
  });

  game.settings.register(MODULE_ID, "showAtZeroFailures", {
    name: "DND5EDEATH.settings.showAtZeroFailures.name",
    hint: "DND5EDEATH.settings.showAtZeroFailures.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "alphaFailure0", {
    name: "DND5EDEATH.settings.alphaFailure0.name",
    hint: "DND5EDEATH.settings.alphaFailure0.hint",
    scope: "world",
    config: true,
    type: Number,
    default: 0.12,
    range: { min: 0.05, max: 1, step: 0.05 }
  });

  game.settings.register(MODULE_ID, "fitDeadImageToGrid", {
    name: "DND5EDEATH.settings.fitDeadImageToGrid.name",
    hint: "DND5EDEATH.settings.fitDeadImageToGrid.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "overlaySizeRatio", {
    name: "DND5EDEATH.settings.overlaySizeRatio.name",
    hint: "DND5EDEATH.settings.overlaySizeRatio.hint",
    scope: "world",
    config: true,
    type: Number,
    default: 0.50,
    range: { min: 0.10, max: 0.50, step: 0.05 }
  });

  game.settings.register(MODULE_ID, "applyDeadAtThreeFailures", {
    name: "DND5EDEATH.settings.applyDeadAtThreeFailures.name",
    hint: "DND5EDEATH.settings.applyDeadAtThreeFailures.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "removeBloodiedAtDeath", {
    name: "DND5EDEATH.settings.removeBloodiedAtDeath.name",
    hint: "DND5EDEATH.settings.removeBloodiedAtDeath.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "deadStatusAsOverlay", {
    name: "DND5EDEATH.settings.deadStatusAsOverlay.name",
    hint: "DND5EDEATH.settings.deadStatusAsOverlay.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "removeDeadWhenHealed", {
    name: "DND5EDEATH.settings.removeDeadWhenHealed.name",
    hint: "DND5EDEATH.settings.removeDeadWhenHealed.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Legacy settings kept registered to avoid warnings when upgrading from v1.0.x/v1.1.x.
  game.settings.register(MODULE_ID, "hpPath", {
    name: "DND5EDEATH.settings.legacyHpPath.name",
    scope: "world",
    config: false,
    type: String,
    default: HP_PATH
  });

  game.settings.register(MODULE_ID, "overlayAlpha", {
    name: "DND5EDEATH.settings.legacyOverlayAlpha.name",
    scope: "world",
    config: false,
    type: Number,
    default: 0.55
  });

  game.settings.register(MODULE_ID, "restoreOnHeal", {
    name: "DND5EDEATH.settings.legacyRestoreOnHeal.name",
    scope: "world",
    config: false,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "keepDeadImageUpright", {
    name: "DND5EDEATH.settings.legacyKeepDeadImageUpright.name",
    scope: "world",
    config: false,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "npcOnly", {
    name: "DND5EDEATH.settings.legacyNpcOnly.name",
    scope: "world",
    config: false,
    type: Boolean,
    default: false
  });
});

Hooks.once("ready", async () => {
  if (game.system?.id !== "dnd5e") {
    console.warn(`${MODULE_ID} | Este módulo está preparado para el sistema D&D5e. Sistema actual: ${game.system?.id ?? "desconocido"}`);
  }

  await migrateWorldSettings();

  Hooks.on("updateActor", async (actor, changes) => {
    if (!actor || !didRelevantActorDataChange(changes)) return;
    await updateTokensForActor(actor);
  });

  Hooks.on("updateToken", async (tokenDocument) => {
    await updateTokenDeathState(tokenDocument.object ?? tokenDocument);
  });

  Hooks.on("createToken", async (tokenDocument) => {
    await updateTokenDeathState(tokenDocument.object ?? tokenDocument);
  });

  Hooks.on("deleteToken", (tokenDocument) => {
    removeOverlayForTokenDocument(tokenDocument);
  });

  Hooks.on("drawToken", async (token) => {
    await updateTokenDeathState(token);
  });

  // refreshToken puede dispararse muchas veces durante renderizados. Aquí solo recolocamos el overlay.
  Hooks.on("refreshToken", (token) => {
    refreshOverlayForToken(token);
  });

  Hooks.on("createActiveEffect", (effect) => {
    scheduleBloodiedRemovalIfNeeded(effect);
  });

  Hooks.on("updateActiveEffect", (effect) => {
    scheduleBloodiedRemovalIfNeeded(effect);
  });

  Hooks.on("canvasReady", async () => {
    await updateCurrentSceneTokens();
  });

  updateCurrentSceneTokens();
  console.log(`${MODULE_ID} | Loaded for D&D5e death saves`);
});

function getSetting(key) {
  return game.settings.get(MODULE_ID, key);
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.clamp ? Math.clamp(n, min, max) : Math.min(Math.max(n, min), max);
}

function getDeadImage() {
  return String(getSetting("deadImage") || DEFAULT_DEAD_IMAGE).trim();
}

async function migrateWorldSettings() {
  if (!game.user.isGM) return;

  const currentDeadImage = String(getSetting("deadImage") ?? "").trim();

  // Si el mundo venía de una versión anterior, el valor guardado en ajustes
  // puede seguir siendo icons/svg/skull.svg aunque el default ya haya cambiado.
  if (!currentDeadImage || LEGACY_DEAD_IMAGES.has(currentDeadImage)) {
    await game.settings.set(MODULE_ID, "deadImage", DEFAULT_DEAD_IMAGE);
    console.log(`${MODULE_ID} | Imagen superpuesta migrada a ${DEFAULT_DEAD_IMAGE}`);
  }

  const currentRatio = Number(getSetting("overlaySizeRatio"));
  if (!Number.isFinite(currentRatio) || currentRatio > 0.50) {
    await game.settings.set(MODULE_ID, "overlaySizeRatio", 0.50);
    console.log(`${MODULE_ID} | Tamaño del icono ajustado a 0.50 (máximo 50% del token)`);
  }
}

function getOverlayColor() {
  return parseHexColor(String(getSetting("overlayColor") || DEFAULT_DEAD_COLOR), 0x8B0000);
}

function parseHexColor(value, fallback) {
  const clean = String(value ?? "").trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    const expanded = clean.split("").map((char) => `${char}${char}`).join("");
    return Number.parseInt(expanded, 16);
  }
  if (/^[0-9a-fA-F]{6}$/.test(clean)) return Number.parseInt(clean, 16);
  return fallback;
}

function getActorHp(actor) {
  const value = foundry.utils.getProperty(actor, HP_PATH);
  const hp = Number(value);
  return Number.isFinite(hp) ? hp : null;
}

function getDeathFailures(actor) {
  const value = foundry.utils.getProperty(actor, DEATH_FAILURE_PATH);
  const failures = Number(value);
  return Number.isFinite(failures) ? Math.max(0, failures) : 0;
}

function didRelevantActorDataChange(changes) {
  if (!changes) return false;

  if (foundry.utils.getProperty(changes, HP_PATH) !== undefined) return true;
  if (foundry.utils.getProperty(changes, DEATH_FAILURE_PATH) !== undefined) return true;

  const flat = foundry.utils.flattenObject(changes ?? {});
  return Object.keys(flat).some((key) => key === HP_PATH || key === DEATH_FAILURE_PATH || key.endsWith(`.${HP_PATH}`) || key.endsWith(`.${DEATH_FAILURE_PATH}`));
}

function shouldProcessActor(actor) {
  if (!actor) return false;
  if (game.system?.id !== "dnd5e") return false;
  return getActorHp(actor) !== null;
}

function getOverlayAlphaForFailures(failures) {
  const capped = Math.min(Math.max(Number(failures) || 0, 0), 3);

  if (capped <= 0) {
    if (!getSetting("showAtZeroFailures")) return 0;
    return clampNumber(getSetting("alphaFailure0"), 0.05, 1, 0.12);
  }

  if (capped === 1) return clampNumber(getSetting("alphaFailure1"), 0.05, 1, 0.25);
  if (capped === 2) return clampNumber(getSetting("alphaFailure2"), 0.05, 1, 0.50);
  return clampNumber(getSetting("alphaFailure3"), 0.05, 1, 0.80);
}

function getStatuses(effectLike) {
  const raw = effectLike?.statuses;
  if (!raw) return [];
  if (raw instanceof Set) return [...raw];
  if (Array.isArray(raw)) return raw;
  if (typeof raw.values === "function") return [...raw.values()];
  return [];
}

function getStatusDefinition(statusKey) {
  const effects = CONFIG.statusEffects ?? [];
  return effects.find((effect) => {
    const statuses = getStatuses(effect);
    return effect.id === statusKey || effect._id === statusKey || statuses.includes(statusKey);
  });
}

function getStatusToggleId(statusKey) {
  const definition = getStatusDefinition(statusKey);
  return definition?.id ?? definition?._id ?? statusKey;
}

function effectMatchesStatus(effect, statusKey, definition = getStatusDefinition(statusKey)) {
  if (!effect) return false;

  const ids = new Set([statusKey]);
  if (definition?.id) ids.add(definition.id);
  if (definition?._id) ids.add(definition._id);

  if (ids.has(effect.id) || ids.has(effect._id)) return true;

  const statuses = getStatuses(effect);
  if (statuses.some((status) => ids.has(status))) return true;

  const coreStatusId = effect.getFlag?.("core", "statusId") ?? effect.flags?.core?.statusId;
  if (coreStatusId && ids.has(coreStatusId)) return true;

  return false;
}

function findActorStatusEffects(actor, statusKey) {
  const definition = getStatusDefinition(statusKey);
  return [...(actor?.effects ?? [])].filter((effect) => effectMatchesStatus(effect, statusKey, definition));
}

function actorHasStatus(actor, statusKey) {
  if (!actor) return false;

  const definition = getStatusDefinition(statusKey);
  const ids = new Set([statusKey]);
  if (definition?.id) ids.add(definition.id);
  if (definition?._id) ids.add(definition._id);

  if ([...ids].some((id) => actor.statuses?.has?.(id))) return true;
  return findActorStatusEffects(actor, statusKey).length > 0;
}

async function ensureActorStatus(actor, statusKey, options = {}) {
  if (!game.user.isGM) return;
  if (!actor?.toggleStatusEffect) return;
  if (actorHasStatus(actor, statusKey)) return;

  const definition = getStatusDefinition(statusKey);
  if (!definition) {
    console.warn(`${MODULE_ID} | No existe CONFIG.statusEffects para el estado: ${statusKey}`);
    return;
  }

  const statusId = getStatusToggleId(statusKey);

  try {
    await actor.toggleStatusEffect(statusId, { active: true, ...options });
  } catch (error) {
    if (isAlreadyExistsError(error)) {
      console.debug(`${MODULE_ID} | El estado ${statusKey} ya existe en ${actor.name}. Se omite la creación duplicada.`);
      return;
    }
    console.error(`${MODULE_ID} | No se pudo aplicar el estado ${statusKey}`, error);
  }
}

async function removeActorStatus(actor, statusKey) {
  if (!game.user.isGM) return;
  if (!actor) return;

  const effects = findActorStatusEffects(actor, statusKey);
  if (!effects.length) return;

  for (const effect of effects) {
    const id = effect.id;
    if (!id || !actor.effects?.get?.(id)) continue;

    try {
      await effect.delete();
    } catch (error) {
      if (isDoesNotExistError(error)) continue;
      console.error(`${MODULE_ID} | No se pudo quitar el estado ${statusKey}`, error);
    }
  }
}

function isAlreadyExistsError(error) {
  const message = String(error?.message ?? error ?? "");
  return message.includes("already exists") || message.includes("ya existe");
}

function isDoesNotExistError(error) {
  const message = String(error?.message ?? error ?? "");
  return message.includes("does not exist") || message.includes("no existe");
}

async function applyDeathStatusesIfNeeded(actor, hp, failures) {
  if (!game.user.isGM || !shouldProcessActor(actor)) return;

  const actorKey = actor.uuid ?? actor.id;
  if (pendingStatusActors.has(actorKey)) return;

  pendingStatusActors.add(actorKey);
  try {
    if (hp > 0) {
      if (getSetting("removeDeadWhenHealed")) {
        await removeActorStatus(actor, STATUS_KEYS.DEAD);
      }
      return;
    }

    if (failures < 3) return;

    if (getSetting("applyDeadAtThreeFailures")) {
      await ensureActorStatus(actor, STATUS_KEYS.DEAD, { overlay: Boolean(getSetting("deadStatusAsOverlay")) });
    }

    if (getSetting("removeBloodiedAtDeath")) {
      await removeActorStatus(actor, STATUS_KEYS.BLOODIED);
    }
  } finally {
    pendingStatusActors.delete(actorKey);
  }
}

async function updateCurrentSceneTokens() {
  if (!canvas?.scene?.tokens) return;

  for (const tokenDocument of canvas.scene.tokens) {
    await updateTokenDeathState(tokenDocument.object ?? tokenDocument);
  }

  removeStaleOverlays();
}

async function updateTokensForActor(actor) {
  if (!shouldProcessActor(actor)) return;

  const activeTokens = actor.getActiveTokens?.(false, false) ?? [];
  const activeTokenDocuments = actor.getActiveTokens?.(false, true) ?? [];

  const sceneTokens = canvas?.tokens?.placeables?.filter((token) => {
    const tokenActor = token.actor ?? token.document?.actor;
    return tokenActor?.uuid === actor.uuid || tokenActor?.id === actor.id;
  }) ?? [];

  const sceneTokenDocuments = canvas?.scene?.tokens?.filter((tokenDocument) => {
    const tokenActor = tokenDocument.actor;
    return tokenActor?.uuid === actor.uuid || tokenActor?.id === actor.id;
  }) ?? [];

  const unique = new Set([...activeTokens, ...activeTokenDocuments, ...sceneTokens, ...sceneTokenDocuments]);

  for (const tokenOrDocument of unique) {
    await updateTokenDeathState(tokenOrDocument.object ?? tokenOrDocument);
  }
}

async function updateTokenDeathState(tokenOrDocument) {
  const token = normalizeTokenPlaceable(tokenOrDocument);
  const tokenDocument = token?.document ?? tokenOrDocument;

  if (!tokenDocument?.actor) return;
  if (!shouldProcessActor(tokenDocument.actor)) {
    removeOverlayForTokenDocument(tokenDocument);
    return;
  }

  await restoreLegacyReplacementIfNeeded(tokenDocument);

  const actor = tokenDocument.actor;
  const hp = getActorHp(actor);
  const failures = getDeathFailures(actor);

  if (hp === null) return;

  await applyDeathStatusesIfNeeded(actor, hp, failures);

  const alpha = hp <= 0 ? getOverlayAlphaForFailures(failures) : 0;

  if (alpha > 0) {
    if (!token) return;
    await ensureOverlay(token, alpha);
    ensureBorder(token);
    return;
  }

  removeOverlayForTokenDocument(tokenDocument);
}

function normalizeTokenPlaceable(tokenOrDocument) {
  if (!tokenOrDocument) return null;
  if (tokenOrDocument.document && tokenOrDocument.object !== tokenOrDocument) return tokenOrDocument;
  return tokenOrDocument.object ?? null;
}

function scheduleBloodiedRemovalIfNeeded(effect) {
  if (!game.user.isGM) return;
  if (!getSetting("removeBloodiedAtDeath")) return;
  if (!effect || !effectMatchesStatus(effect, STATUS_KEYS.BLOODIED)) return;

  const actor = effect.parent;
  if (!shouldProcessActor(actor)) return;

  const hp = getActorHp(actor);
  const failures = getDeathFailures(actor);
  if (hp === null || hp > 0 || failures < 3) return;

  const actorKey = actor.uuid ?? actor.id;
  if (pendingBloodiedRemovalActors.has(actorKey)) return;

  pendingBloodiedRemovalActors.add(actorKey);
  window.setTimeout(() => {
    pendingBloodiedRemovalActors.delete(actorKey);
    removeActorStatus(actor, STATUS_KEYS.BLOODIED).catch((error) => {
      if (!isDoesNotExistError(error)) {
        console.error(`${MODULE_ID} | No se pudo eliminar Bloodied tras aplicar Dead`, error);
      }
    });
  }, 150);
}

async function restoreLegacyReplacementIfNeeded(tokenDocument) {
  if (!game.user.isGM) return;
  if (!tokenDocument) return;

  const originalImage = tokenDocument.getFlag(MODULE_ID, LEGACY_FLAGS.ORIGINAL_IMAGE);
  const originalRotation = tokenDocument.getFlag(MODULE_ID, LEGACY_FLAGS.ORIGINAL_ROTATION);
  const originalScaleX = tokenDocument.getFlag(MODULE_ID, LEGACY_FLAGS.ORIGINAL_SCALE_X);
  const originalScaleY = tokenDocument.getFlag(MODULE_ID, LEGACY_FLAGS.ORIGINAL_SCALE_Y);

  if (!originalImage && originalRotation === undefined && originalScaleX === undefined && originalScaleY === undefined) return;

  const updateData = {};

  if (originalImage) updateData["texture.src"] = originalImage;
  if (originalRotation !== undefined) updateData.rotation = Number(originalRotation);
  if (originalScaleX !== undefined) updateData["texture.scaleX"] = Number(originalScaleX);
  if (originalScaleY !== undefined) updateData["texture.scaleY"] = Number(originalScaleY);

  if (Object.keys(updateData).length > 0) {
    await tokenDocument.update(updateData);
  }

  await unsetFlagIfPresent(tokenDocument, LEGACY_FLAGS.ORIGINAL_IMAGE, originalImage);
  await unsetFlagIfPresent(tokenDocument, LEGACY_FLAGS.ORIGINAL_ROTATION, originalRotation);
  await unsetFlagIfPresent(tokenDocument, LEGACY_FLAGS.ORIGINAL_SCALE_X, originalScaleX);
  await unsetFlagIfPresent(tokenDocument, LEGACY_FLAGS.ORIGINAL_SCALE_Y, originalScaleY);
}

async function unsetFlagIfPresent(document, flag, value) {
  if (value !== undefined && value !== null) {
    await document.unsetFlag(MODULE_ID, flag);
  }
}

function findChildByName(container, name) {
  if (!container) return null;
  return container.getChildByName?.(name) ?? container.children?.find((child) => child.name === name) ?? null;
}

function getOverlayName(tokenDocument) {
  const safeUuid = String(tokenDocument.uuid ?? tokenDocument.id).replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${OVERLAY_PREFIX}-${safeUuid}`;
}

function getBorderName(tokenDocument) {
  const safeUuid = String(tokenDocument.uuid ?? tokenDocument.id).replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${BORDER_PREFIX}-${safeUuid}`;
}

async function ensureOverlay(token, alpha) {
  const tokenDocument = token.document;
  const deadImage = getDeadImage();
  if (!deadImage) return;

  const overlayName = getOverlayName(tokenDocument);
  let sprite = findChildByName(token, overlayName);

  if (!sprite) {
    const texture = await loadDeadTexture(deadImage);
    if (!texture) return;

    sprite = new PIXI.Sprite(texture);
    sprite.name = overlayName;
    sprite.anchor.set(1, 1);
    sprite.zIndex = 100000;
    sprite.interactive = false;
    sprite.interactiveChildren = false;
    sprite.eventMode = "none";
    sprite.cursor = null;
    sprite._deadTokenImageSrc = deadImage;

    token.sortableChildren = true;
    token.addChild(sprite);
    token.sortChildren?.();
  } else if (sprite._deadTokenImageSrc !== deadImage) {
    const texture = await loadDeadTexture(deadImage);
    if (!texture) return;

    sprite.texture = texture;
    sprite._deadTokenImageSrc = deadImage;
  }

  positionOverlaySprite(sprite, token, alpha);
}

function ensureBorder(token) {
  const tokenDocument = token.document;
  const borderName = getBorderName(tokenDocument);
  let graphic = findChildByName(token, borderName);

  if (!graphic) {
    graphic = new PIXI.Graphics();
    graphic.name = borderName;
    graphic.zIndex = 99999;
    graphic.interactive = false;
    graphic.interactiveChildren = false;
    graphic.eventMode = "none";
    graphic.cursor = null;

    token.sortableChildren = true;
    token.addChild(graphic);
    token.sortChildren?.();
  }

  positionBorderGraphic(graphic, token);
}

async function loadDeadTexture(src) {
  try {
    if (typeof loadTexture === "function") return await loadTexture(src);
    return PIXI.Texture.from(src);
  } catch (error) {
    console.error(`${MODULE_ID} | No se pudo cargar la imagen superpuesta: ${src}`, error);
    return null;
  }
}

function refreshOverlayForToken(token) {
  if (!token?.document) return;
  const overlayName = getOverlayName(token.document);
  const borderName = getBorderName(token.document);
  const sprite = findChildByName(token, overlayName);
  const border = findChildByName(token, borderName);

  const actor = token.document.actor;
  const hp = getActorHp(actor);
  const failures = getDeathFailures(actor);
  const alpha = hp !== null && hp <= 0 ? getOverlayAlphaForFailures(failures) : 0;

  if (alpha > 0) {
    if (sprite) positionOverlaySprite(sprite, token, alpha);
    if (border) positionBorderGraphic(border, token);
    return;
  }

  if (sprite) sprite.destroy({ children: true });
  if (border) border.destroy({ children: true });
}

function positionOverlaySprite(sprite, token, alpha) {
  const dimensions = getTokenDimensions(token);
  const fitToGrid = getSetting("fitDeadImageToGrid");
  const gridSize = Number(canvas?.grid?.size ?? 100);
  const ratio = clampNumber(getSetting("overlaySizeRatio"), 0.10, 0.50, 0.50);

  const targetWidth = fitToGrid ? dimensions.width * ratio : gridSize * ratio;
  const targetHeight = fitToGrid ? dimensions.height * ratio : gridSize * ratio;

  sprite.width = targetWidth;
  sprite.height = targetHeight;

  // El sprite es hijo del token. Lo colocamos en la esquina inferior derecha con margen interior.
  sprite.x = Math.max(targetWidth, dimensions.width - OVERLAY_MARGIN_PX);
  sprite.y = Math.max(targetHeight, dimensions.height - OVERLAY_MARGIN_PX);
  sprite.alpha = clampNumber(alpha, 0.05, 1, 0.50);
  sprite.tint = getOverlayColor();

  // Compensa la rotación del token para que el icono quede visualmente recto en pantalla.
  sprite.angle = -Number(token.document?.rotation ?? 0);
}

function positionBorderGraphic(graphic, token) {
  const dimensions = getTokenDimensions(token);
  const color = getOverlayColor();

  graphic.clear();
  graphic.lineStyle(BORDER_LINE_WIDTH, color, 0.95, 1);
  graphic.drawRect(0, 0, dimensions.width, dimensions.height);
}

function getTokenDimensions(token) {
  const gridSize = Number(canvas?.grid?.size ?? 100);
  const document = token.document;

  const width = Number(token.w ?? (document.width ?? 1) * gridSize);
  const height = Number(token.h ?? (document.height ?? 1) * gridSize);

  return { width, height };
}

function removeOverlayForTokenDocument(tokenDocument) {
  if (!tokenDocument) return;

  const token = tokenDocument.object ?? canvas?.tokens?.get?.(tokenDocument.id) ?? canvas?.tokens?.placeables?.find((placeable) => placeable.document?.uuid === tokenDocument.uuid);
  if (!token) return;

  const overlayName = getOverlayName(tokenDocument);
  const borderName = getBorderName(tokenDocument);
  const sprite = findChildByName(token, overlayName);
  const border = findChildByName(token, borderName);

  if (sprite) sprite.destroy({ children: true });
  if (border) border.destroy({ children: true });
}

function removeStaleOverlays() {
  const validOverlayNames = new Set((canvas?.scene?.tokens ?? []).map((tokenDocument) => getOverlayName(tokenDocument)));
  const validBorderNames = new Set((canvas?.scene?.tokens ?? []).map((tokenDocument) => getBorderName(tokenDocument)));

  for (const token of canvas?.tokens?.placeables ?? []) {
    for (const child of [...(token.children ?? [])]) {
      if (typeof child.name !== "string") continue;
      if (child.name.startsWith(OVERLAY_PREFIX) && !validOverlayNames.has(child.name)) {
        child.destroy({ children: true });
        continue;
      }
      if (child.name.startsWith(BORDER_PREFIX) && !validBorderNames.has(child.name)) {
        child.destroy({ children: true });
      }
    }
  }
}
