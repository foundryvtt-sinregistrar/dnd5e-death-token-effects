#!/usr/bin/env python3
"""Refresh the dynamic metadata in the canonical Foundry package description."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DESCRIPTION = ROOT / "docs" / "foundry" / "description-foundry.html"
REPO = "https://github.com/foundryvtt-sinregistrar/dnd5e-death-token-effects"


def main() -> int:
    manifest = json.loads((ROOT / "module.json").read_text(encoding="utf-8"))
    dnd5e = next(item for item in manifest["relationships"]["systems"] if item["id"] == "dnd5e")["compatibility"]
    foundry = manifest["compatibility"]
    text = DESCRIPTION.read_text(encoding="utf-8")
    title = (
        f'<p style="text-align: center;"><strong>D&amp;D5e Death Token Effects</strong> &middot; '
        f'v{manifest["version"]} &middot; Foundry VTT 14 &middot; D&amp;D5e {dnd5e.get("verified", dnd5e["minimum"])} &middot; MIT</p>'
    )
    badges = (
        f'<p style="text-align: center;"><img src="https://img.shields.io/badge/Foundry-{foundry["minimum"]}%2B-2f855a" alt="Foundry {foundry["minimum"]}+" /> '
        f'<img src="https://img.shields.io/badge/Verified-{foundry["verified"]}-2563eb" alt="Foundry verified {foundry["verified"]}" /> '
        f'<img src="https://img.shields.io/badge/dnd5e-{dnd5e["minimum"]}%2B-654b75" alt="D&amp;D5e {dnd5e["minimum"]}+" /> '
        f'<img src="https://img.shields.io/badge/Verified-{dnd5e["verified"]}-2563eb" alt="D&amp;D5e verified {dnd5e["verified"]}" /> '
        '<img src="https://img.shields.io/badge/languages-English%20%7C%20Espa%C3%B1ol-687b8f" alt="English and Spanish" /></p>'
    )
    text = re.sub(r'<p style="text-align: center;"><strong>D&amp;D5e Death Token Effects</strong>.*?</p>', title, text)
    text = re.sub(r'<p style="text-align: center;"><img src="https://img\.shields\.io/badge/Foundry-.*?</p>', badges, text)
    DESCRIPTION.write_text(text, encoding="utf-8", newline="\n")
    print(f"OK: {DESCRIPTION}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
