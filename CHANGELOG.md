# Changelog

All notable changes to this project will be documented in this file.
The format is based on **Keep a Changelog**, and this project follows a custom versioning scheme:

**MAJOR.FOUNDRY.PATCH**

- **MAJOR** → Breaking structural changes
- **FOUNDRY** → Foundry VTT major compatibility version
- **PATCH** → Improvements, fixes, and incremental updates

---

## [Unreleased]

### Added
- —

### Changed
- —

### Fixed
- —

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

[Unreleased]: https://github.com/foundryvtt-sinregistrar/dnd5e-death-token-effects/compare/v1.14.0...HEAD
[1.14.0]: https://github.com/foundryvtt-sinregistrar/dnd5e-death-token-effects/releases/tag/v1.14.0
