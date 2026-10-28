# Notas internas de aplicacion

Este archivo no forma parte del modulo distribuible. La publicacion se realiza desde un
commit limpio y una etiqueta que coincida con `module.json`:

```bash
python -m pip install Pillow
python -B dev-tools/buildScripts/generate_foundry_banner.py --output-dir dist
python -B dev-tools/buildScripts/generate_release_notes.py --output dist/release-notes.md
python dev-tools/buildScripts/build_release.py
git tag v<version>
git push origin main --follow-tags
```

El workflow de la etiqueta vuelve a generar el banner y adjunta tanto el archivo
versionado como el alias de la release mÃ¡s reciente. Consulta `docs/foundry/README.md`
para la URL estable que debe usarse en la descripciÃ³n del paquete.

TambiÃ©n extrae la secciÃ³n `## [versiÃ³n]` correspondiente de `CHANGELOG.md` y la
antepone a las notas automÃ¡ticas de GitHub, incluido el enlace **Full Changelog**.

GitHub Actions valida el commit etiquetado, crea los ZIP y abre una release draft.
