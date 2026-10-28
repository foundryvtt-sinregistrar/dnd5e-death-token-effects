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

The renderer uses the module version only to name the immutable file. It preserves
the approved artwork and its layout, updating only the D&D5e version in the original
compatibility line from `module.json`. Run it locally with:

```bash
python -m pip install Pillow
python -B dev-tools/buildScripts/generate_foundry_banner.py --output-dir dist
```

Do not commit `dist/` outputs. GitHub Releases preserve the versioned assets and
therefore the complete banner history.
