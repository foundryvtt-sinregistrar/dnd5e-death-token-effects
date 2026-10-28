#!/usr/bin/env python3
"""Create immutable and latest-release Foundry presentation banners.

The source image is deliberately kept outside the distributed module archive.  Each
release gets a versioned banner, while the unversioned file is a stable URL that can
be embedded once in the Foundry package description.
"""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "dev-tools" / "presentation" / "banner-base.png"
LATEST_NAME = "banner-death-token-effects.webp"
BASE_DND5E_VERSION = "6.0.3"


def load_manifest(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    required = ("id", "version", "compatibility", "relationships")
    if any(key not in data for key in required):
        raise ValueError("module.json is missing required release metadata.")
    return data


def dnd5e_version(manifest: dict) -> str:
    systems = manifest["relationships"].get("systems", [])
    dnd5e = next((entry for entry in systems if entry.get("id") == "dnd5e"), None)
    if not dnd5e:
        raise ValueError("module.json must declare a dnd5e system relationship.")
    compatibility = dnd5e.get("compatibility", {})
    return str(compatibility.get("verified") or compatibility.get("minimum") or BASE_DND5E_VERSION)


def banner_font(size: int) -> ImageFont.FreeTypeFont:
    candidates = ("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", "C:/Windows/Fonts/georgia.ttf")
    for candidate in candidates:
        if Path(candidate).is_file():
            return ImageFont.truetype(candidate, size=size)
    raise FileNotFoundError("No compatible banner font found. Install DejaVu Serif or Georgia.")


def replace_dnd5e_version(image: Image.Image, version: str) -> None:
    """Refresh only the final version glyphs; preserve the legacy banner layout."""
    if version == BASE_DND5E_VERSION:
        return

    width, height = image.size
    if version[:-1] != BASE_DND5E_VERSION[:-1]:
        raise ValueError(f"Banner artwork must be refreshed for a version outside the {BASE_DND5E_VERSION[:-1]}x series.")

    # The final digit lies on unadorned parchment. Replace that glyph only; this
    # retains the original typography, linework, and every other visual element.
    target = (int(width * 0.319), int(height * 0.866), int(width * 0.331), int(height * 0.913))
    source = (target[0], int(height * 0.813), target[2], int(height * 0.860))
    patch = image.crop(source)
    image.paste(patch, target[:2])

    draw = ImageDraw.Draw(image)
    label_font = banner_font(round(height * 0.035))
    draw.text((target[0] - 1, int(height * 0.866)), version[-1], font=label_font, fill=(81, 52, 37))


def render(manifest: dict, output: Path) -> None:
    if not BASE.is_file():
        raise FileNotFoundError(f"Banner base image not found: {BASE}")

    image = Image.open(BASE).convert("RGB")
    width, height = image.size
    replace_dnd5e_version(image, dnd5e_version(manifest))
    output.parent.mkdir(parents=True, exist_ok=True)
    image.resize((1600, round(height * 1600 / width)), Image.Resampling.LANCZOS).save(output, "WEBP", quality=88, method=6)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=ROOT / "module.json")
    parser.add_argument("--output-dir", type=Path, default=ROOT / "dist")
    args = parser.parse_args()

    manifest = load_manifest(args.manifest)
    module_id = str(manifest["id"])
    version = str(manifest["version"])
    versioned = args.output_dir / f"{module_id}-{version}-banner.webp"
    latest = args.output_dir / LATEST_NAME
    render(manifest, versioned)
    shutil.copyfile(versioned, latest)
    print(f"OK: {versioned}\nOK: {latest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
