# Cómo aplicar estos archivos

Copia el contenido de esta carpeta encima del repositorio `dnd5e-death-token-effects`.

Desde la raíz del repo:

```bash
mkdir -p lang scripts dev-tools/buildScripts .github/workflows
cp -R dnd5e-death-token-effects-professional/. .

git status
python dev-tools/buildScripts/build_release.py --allow-dirty
```

Para publicar:

```bash
git add .
git commit -m "build(release): add release infrastructure and i18n"

# Solo si v1.14.0 no existe aún:
git tag v1.14.0
git push origin main
git push origin v1.14.0
```

Si `v1.14.0` ya existe, cambia `module.json` y `CHANGELOG.md` a `1.14.1` y usa `git tag v1.14.1`.
