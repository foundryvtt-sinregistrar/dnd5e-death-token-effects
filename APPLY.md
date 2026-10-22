# Notas internas de aplicacion

Este archivo no forma parte del modulo distribuible. La publicacion se realiza desde un
commit limpio y una etiqueta que coincida con `module.json`:

```bash
python dev-tools/buildScripts/build_release.py
git tag v<version>
git push origin main --follow-tags
```

GitHub Actions valida el commit etiquetado, crea los ZIP y abre una release draft.
