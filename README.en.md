# 🇬🇧 D&D5e Death Token Effects

![Foundry v14](https://img.shields.io/badge/Foundry-v14-green)
![Foundry verified 14.363](https://img.shields.io/badge/Verified-14.363-blue)
![System dnd5e](https://img.shields.io/badge/System-dnd5e-orange)
![License MIT](https://img.shields.io/badge/License-MIT-lightgrey)

Module for **Foundry VTT 14** and the **D&D5e** system.

It displays the D&D5e death icon over the token when an actor is at **0 HP** and has failed death saving throws. It can also automatically apply the **Dead** status at 3 failures and remove **Bloodied** if present.

---

## 📦 Compatibility

| Item | Version |
|---|---|
| Minimum Foundry VTT | `14` |
| Verified Foundry VTT | `14.363` |
| System | `dnd5e` |
| Module version | `1.14.0` |

---

## 🧭 Versioning

This module uses the second version number as the target **Foundry VTT major version**.

```text
1.14.0
│ │  └─ Module patch / revision
│ └──── Target Foundry VTT major version: v14
└────── Internal module major version
```

| Version | Meaning |
|---|---|
| `1.14.0` | First public release for Foundry VTT v14 |
| `1.14.1` | Fix or minor improvement for Foundry VTT v14 |
| `1.15.0` | Version adapted/verified for Foundry VTT v15 |
| `2.14.0` | Internal breaking change while still targeting Foundry VTT v14 |

---

## ✅ Behavior

```text
HP > 0
  → removes the overlay icon and red border

HP <= 0 and 0 failures
  → shows no icon by default
  → can optionally show a very faint icon

HP <= 0 and 1 death failure
  → shows the icon with low opacity

HP <= 0 and 2 death failures
  → shows the icon with medium opacity

HP <= 0 and 3+ death failures
  → shows the icon with high opacity
  → applies Dead status
  → removes Bloodied status if present
```
---

## Preview

| State | Screenshot |
|---|---|
| Healthy / full HP | ![Healthy token](docs/images/status-demo/01-full-hp.png) |
| Wounded / half HP | ![Wounded token](docs/images/status-demo/02-half-hp.png) |
| Near death / 1 HP | ![Token at 1 HP](docs/images/status-demo/03-one-hp.png) |
| Dying / 0 HP | ![Dying token at 0 HP](docs/images/status-demo/04-zero-hp-dying.png) |
| 1 death saving throw failure | ![Token with 1 death saving throw failure](docs/images/status-demo/05-death-save-failure-1.png) |
| 2 death saving throw failures | ![Token with 2 death saving throw failures](docs/images/status-demo/06-death-save-failure-2.png) |
| 3 failures / Dead | ![Dead token with 3 death saving throw failures](docs/images/status-demo/07-death-save-failure-3-dead.png) |

---

## 🎨 Visual features

The module:

- does not replace the original token image;
- draws the icon over the token;
- keeps the icon visually upright even if the token is rotated;
- places the icon in the lower-right corner;
- applies a `3 px` inner margin;
- limits the maximum icon size to `50%` of the token;
- adds a red border around the token;
- uses non-interactive visual elements so double-clicking the token is not blocked.

---

## ⚙️ Settings

Go to:

```text
Configure Settings → Module Settings → D&D5e Death Token Effects
```

Main options:

| Option | Recommended value |
|---|---|
| **Overlay image** | `systems/dnd5e/icons/svg/statuses/dead.svg` |
| **Overlay image color** | `#8B0000` |
| **Opacity with 1 death failure** | `0.25` |
| **Opacity with 2 death failures** | `0.50` |
| **Opacity with 3+ death failures** | `0.80` |
| **Show icon with 0 failures** | Disabled |
| **Fit overlay image to token grid size** | Enabled |
| **Icon size relative to token** | `0.50` |
| **Apply Dead status at 3+ failures** | Enabled |
| **Remove Bloodied status on death** | Enabled |
| **Apply Dead as status overlay** | Disabled |
| **Remove Dead when healed** | Disabled |

---

## 🧩 D&D5e data paths

```text
system.attributes.hp.value
system.attributes.death.failure
```

Default image:

```text
systems/dnd5e/icons/svg/statuses/dead.svg
```

Default color:

```text
#8B0000
```

---

## 🚀 Installation

### Option 1 — Manifest URL

In Foundry:

```text
Add-on Modules → Install Module → Manifest URL
```

Paste:

```text
https://github.com/foundryvtt-sinregistrar/dnd5e-death-token-effects/releases/latest/download/module.json
```

### Option 2 — Manual installation

1. Download the release ZIP.
2. Extract the archive.
3. Copy the `dnd5e-death-token-effects` folder into:

```text
FoundryVTT/Data/modules/
```

4. Restart Foundry VTT.
5. Open your world.
6. Enable the module from `Manage Modules`.

---

## 🏗️ Release workflow

This project includes the same release-style infrastructure as the other module:

- `dev-tools/buildScripts/build_release.py` builds the ZIP using `git archive`.
- `.gitattributes` controls release ZIP contents with `export-ignore`.
- `.github/workflows/release.yml` creates a draft release when a `v*` tag is pushed.
- Two ZIPs are uploaded: `dnd5e-death-token-effects-<version>.zip` and `dnd5e-death-token-effects.zip`.

Recommended flow:

```bash
git status
python dev-tools/buildScripts/build_release.py --allow-dirty

# For a real release:
git add .
git commit -m "build(release): add release infrastructure"
git tag v1.14.0
git push origin main
git push origin v1.14.0
```

> If `v1.14.0` already exists on GitHub, bump the version to `1.14.1` before creating a new tag.

---

## 📜 Changelog

See **CHANGELOG.md**.

---

## 📜 License

This module is distributed under the license specified in **LICENSE**.

---

## 👤 Author

```text
foundryvtt-sinregistrar
```
