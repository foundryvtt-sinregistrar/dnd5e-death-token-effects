#!/usr/bin/env python3
"""Build verified Foundry VTT release assets from a committed Git ref."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path


def run(command: list[str], cwd: Path) -> str:
    result = subprocess.run(command, cwd=cwd, check=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return result.stdout.strip()


def repository_root(start: Path) -> Path:
    return Path(run(["git", "rev-parse", "--show-toplevel"], start)).resolve()


def ensure_clean_worktree(root: Path) -> None:
    if run(["git", "status", "--porcelain"], root):
        raise RuntimeError("El arbol de trabajo contiene cambios. Haz commit o usa --allow-dirty.")


def load_manifest(root: Path, ref: str) -> tuple[dict, str, str]:
    source = run(["git", "show", f"{ref}:module.json"], root)
    data = json.loads(source)
    module_id = str(data.get("id", "")).strip()
    version = str(data.get("version", "")).strip()
    if not module_id or not version:
        raise ValueError("module.json debe contener id y version.")
    return data, module_id, version


def archive(root: Path, ref: str, destination: Path, prefix: str) -> None:
    subprocess.run(["git", "archive", "--format=zip", f"--prefix={prefix}/", "-o", str(destination), ref], cwd=root, check=True)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify_archive(path: Path, module_id: str) -> None:
    required = {f"{module_id}/module.json", f"{module_id}/scripts/dnd5e-death-token-effects.js"}
    with zipfile.ZipFile(path) as package:
        names = set(package.namelist())
    missing = required - names
    if missing:
        raise ValueError(f"El ZIP no contiene los archivos requeridos: {', '.join(sorted(missing))}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dist", default="dist", help="Directorio de salida.")
    parser.add_argument("--ref", default="HEAD", help="Commit o tag que se empaqueta.")
    parser.add_argument("--allow-dirty", action="store_true")
    parser.add_argument("--release-tag", default="", help="Etiqueta esperada, por ejemplo v1.14.2.")
    args = parser.parse_args()

    try:
        root = repository_root(Path.cwd())
        if not args.allow_dirty:
            ensure_clean_worktree(root)
        manifest, module_id, version = load_manifest(root, args.ref)
        if args.release_tag and args.release_tag != f"v{version}":
            raise ValueError(f"La etiqueta {args.release_tag!r} no coincide con v{version}.")

        output = (root / args.dist).resolve()
        output.mkdir(parents=True, exist_ok=True)
        versioned = output / f"{module_id}-{version}.zip"
        alias = output / f"{module_id}.zip"
        archive(root, args.ref, versioned, module_id)
        shutil.copyfile(versioned, alias)
        verify_archive(versioned, module_id)
        (output / "module.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        (output / "SHA256SUMS.txt").write_text(
            f"{sha256(alias)}  {alias.name}\n{sha256(versioned)}  {versioned.name}\n",
            encoding="utf-8",
        )
        print(f"OK: {alias}\nOK: {versioned}\nOK: {output / 'module.json'}\nOK: {output / 'SHA256SUMS.txt'}\nRef: {args.ref}")
        return 0
    except (subprocess.CalledProcessError, OSError, ValueError, json.JSONDecodeError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
