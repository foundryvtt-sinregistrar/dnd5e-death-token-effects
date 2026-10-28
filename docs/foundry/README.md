# Foundry package banner

The release workflow creates two banner assets from `module.json` and the approved
base artwork in `dev-tools/presentation/banner-base.png`:

- `dnd5e-death-token-effects-<version>-banner.webp` is immutable and remains in
  that GitHub release.
- `banner-death-token-effects.webp` is uploaded to every release and is the stable
  **latest** asset.

Use this URL once in the package Description HTML; it will serve the latest release
banner without another description edit:

```html
<img style="width: 100%; max-width: 1600px;" src="https://github.com/foundryvtt-sinregistrar/dnd5e-death-token-effects/releases/latest/download/banner-death-token-effects.webp" alt="D&amp;D5e Death Token Effects — visual death-save effects" />
```

The banner renderer reads the module version plus the verified Foundry and D&D5e
versions from `module.json`. It overlays that release data only in the lower-left
metadata panel; the rest of the approved artwork is unchanged. Run it locally with:

```bash
python -m pip install Pillow
python -B dev-tools/buildScripts/generate_foundry_banner.py --output-dir dist
```

Do not commit `dist/` outputs. GitHub Releases preserve the versioned assets and
therefore the complete banner history.
