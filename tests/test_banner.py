"""Exercise the presentation step that previously blocked D&D5e 6.1 releases."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('banner', ROOT / 'dev-tools/buildScripts/generate_foundry_banner.py')
BANNER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(BANNER)


class BannerTests(unittest.TestCase):
    def test_minor_and_major_versions_render_complete_label(self):
        for version in ('6.1.1', '6.10.12', '7.0.0'):
            with self.subTest(version=version):
                image = Image.open(BANNER.BASE).convert('RGB')
                before = image.tobytes()
                draw = ImageDraw.Draw(image)
                with patch.object(BANNER.ImageDraw, 'Draw', return_value=draw), patch.object(draw, 'text', wraps=draw.text) as text:
                    BANNER.replace_dnd5e_version(image, version)
                    self.assertEqual(text.call_args.args[1], version)
                    font = text.call_args.kwargs['font']
                    self.assertLessEqual(draw.textlength(version, font=font), int(image.width * .333) - int(image.width * .294) - 2)
                self.assertNotEqual(before, image.tobytes())

    def test_current_manifest_produces_readable_webp(self):
        manifest = json.loads((ROOT / 'module.json').read_text(encoding='utf-8'))
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'banner.webp'
            BANNER.render(manifest, output)
            with Image.open(output) as image:
                self.assertEqual(image.format, 'WEBP')
                self.assertEqual(image.width, 1600)
                image.load()


if __name__ == '__main__':
    unittest.main()
