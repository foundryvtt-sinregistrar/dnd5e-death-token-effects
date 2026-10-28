# Changelog

All notable changes to this project will be documented in this file.
The format is based on **Keep a Changelog**, and this project follows a custom versioning scheme:

**MAJOR.FOUNDRY.PATCH**

- **MAJOR** → Breaking structural changes
- **FOUNDRY** → Foundry VTT major compatibility version
- **PATCH** → Improvements, fixes, and incremental updates

---

## [Unreleased]

## [1.14.5] - 2026-10-27

### Changed
- Verified compatibility with Foundry VTT 14.369 and D&D5e 6.0.6.

### Fixed
- Validated the death overlay on a token at 0 HP with three failed death saves.

## [1.14.4] - 2026-10-22

### Added
- —

### Changed
- —

### Fixed
- Restored the required alignment between the release tag and the manifest version after the unsuccessful `v1.14.3` release attempt.

---

## [1.14.2] - 2026-10-22

### Added
- Continuous validation workflow for pushes and pull requests.
- Manifest, status-effect, and release-package tests.
- SHA-256 checksums and a release-local `module.json` for distributable assets.

### Changed
- Standardized release packaging and GitHub Actions around the tagged commit.
- Normalized repository text-file settings and excluded internal application notes from release archives.

---

## [1.14.1] - 2026-10-22

### Changed
- Declared compatibility with Foundry VTT `14.367` minimum and `14.368` verified.
- Declared D&D5e `6.0.3` as the minimum and verified system version.

### Fixed
- Read `CONFIG.statusEffects` correctly when D&D5e 6.0.x provides it as an object keyed by status ID.

---

## [1.14.0] - 2026-06-18

### Added
- First public release targeting **Foundry VTT v14**.
- Death-save based visual overlay for D&D5e tokens at 0 HP.
- Progressive opacity by failed death saving throws: 1, 2 and 3+ failures.
- Optional faint overlay at 0 HP and 0 death failures.
- Red token border while the death overlay is active.
- Automatic **Dead / Muerto** status application at 3+ death failures.
- Optional removal of **Bloodied / Ensangrentado** when Dead is applied.
- World settings for icon path, color, opacity, status handling and healing behavior.
- Module i18n support via `lang/en.json` and `lang/es.json`.
- Bilingual documentation: `README.md` and `README.en.md`.
- Developer documentation in `DEVELOPER.md`.
- Release packaging script: `dev-tools/buildScripts/build_release.py`.
- GitHub Actions release workflow generating draft releases from `v*` tags.

### Changed
- Public module id standardized as `dnd5e-death-token-effects`.
- `module.json` manifest/download URLs target GitHub release assets.
- Settings labels now use localization keys.
- Release ZIP contents are controlled through `.gitattributes` and `export-ignore`.

### Fixed
- Legacy settings are still registered as hidden settings to avoid upgrade warnings from older local versions.
- Legacy token image replacement flags are restored and cleaned up safely.
- Duplicate ActiveEffect creation is guarded when applying Dead.
- Overlay and border are non-interactive so they do not block token interaction.

---

## Version Links

[Unreleased]: https://github.com/foundryvtt-sinregistrar/dnd5e-death-token-effects/compare/v1.14.2...HEAD
[1.14.2]: https://github.com/foundryvtt-sinregistrar/dnd5e-death-token-effects/releases/tag/v1.14.2
[1.14.1]: https://github.com/foundryvtt-sinregistrar/dnd5e-death-token-effects/releases/tag/v1.14.1
[1.14.0]: https://github.com/foundryvtt-sinregistrar/dnd5e-death-token-effects/releases/tag/v1.14.0
