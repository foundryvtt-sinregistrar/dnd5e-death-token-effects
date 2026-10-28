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


def font(size: int) -> ImageFont.FreeTypeFont:
    """Use fonts available on GitHub Actions and common Windows installations."""
    candidates = (
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
        "C:/Windows/Fonts/georgiab.ttf",
    )
    for candidate in candidates:
        if Path(candidate).is_file():
            return ImageFont.truetype(candidate, size=size)
    raise FileNotFoundError("No compatible banner font found. Install DejaVu Serif or Georgia.")


def load_manifest(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    required = ("id", "version", "compatibility", "relationships")
    if any(key not in data for key in required):
        raise ValueError("module.json is missing required release metadata.")
    return data


def dnd5e_compatibility(manifest: dict) -> tuple[str, str]:
    systems = manifest["relationships"].get("systems", [])
    dnd5e = next((entry for entry in systems if entry.get("id") == "dnd5e"), None)
    if not dnd5e:
        raise ValueError("module.json must declare a dnd5e system relationship.")
    compatibility = dnd5e.get("compatibility", {})
    return str(compatibility.get("minimum", "14")), str(compatibility.get("verified", ""))


def render(manifest: dict, output: Path) -> None:
    if not BASE.is_file():
        raise FileNotFoundError(f"Banner base image not found: {BASE}")

    foundry = manifest["compatibility"]
    dnd5e_min, dnd5e_verified = dnd5e_compatibility(manifest)
    foundry_verified = str(foundry.get("verified", ""))
    version = str(manifest["version"])
    label = f"Release {version}  |  Foundry {foundry_verified}  |  dnd5e {dnd5e_verified or dnd5e_min}"

    image = Image.open(BASE).convert("RGB")
    draw = ImageDraw.Draw(image)
    width, height = image.size
    # This panel intentionally covers the compatibility line baked into the legacy
    # artwork, while preserving every other part of the approved original banner.
    panel = (int(width * 0.105), int(height * 0.862), int(width * 0.463), int(height * 0.956))
    draw.rounded_rectangle(panel, radius=max(5, height // 90), fill=(236, 222, 194), outline=(119, 75, 39), width=max(2, width // 800))

    label_font = font(max(16, round(height * 0.026)))
    box = draw.textbbox((0, 0), label, font=label_font)
    text_width = box[2] - box[0]
    text_height = box[3] - box[1]
    center_x = (panel[0] + panel[2]) / 2
    center_y = (panel[1] + panel[3]) / 2
    draw.text((center_x - text_width / 2, center_y - text_height / 2 - box[1]), label, font=label_font, fill=(70, 35, 24))

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
