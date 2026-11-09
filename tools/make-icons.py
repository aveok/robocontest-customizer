"""Render the extension icons (icons/icon-{16,32,48,128}.png).

Design: dark rounded square in the Classic dark palette with a green "C"
(for Classic) and a blue dot. Drawn at 1024 px, downscaled for antialiasing.

Run: python3 tools/make-icons.py
"""

from pathlib import Path

from PIL import Image, ImageDraw

BG = "#222222"
GREEN = "#00cc99"
BLUE = "#4a7ab0"
SIZES = (16, 32, 48, 128)
S = 1024  # master size

out = Path(__file__).resolve().parent.parent / "icons"
out.mkdir(exist_ok=True)

img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

# Background: rounded square
d.rounded_rectangle((0, 0, S - 1, S - 1), radius=int(S * 0.22), fill=BG)

# Green "C": thick arc, opening to the right
pad = int(S * 0.2)
d.arc((pad, pad, S - pad, S - pad), start=45, end=315, fill=GREEN, width=int(S * 0.15))

# Blue dot inside the opening of the C
r = int(S * 0.085)
cx, cy = int(S * 0.69), S // 2
d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=BLUE)

for size in SIZES:
    if size == 128:
        # Chrome Web Store guideline: 96x96 artwork + 16 px transparent padding
        icon = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
        icon.paste(img.resize((96, 96), Image.LANCZOS), (16, 16))
    else:
        icon = img.resize((size, size), Image.LANCZOS)
    icon.save(out / f"icon-{size}.png")
    print("wrote", out / f"icon-{size}.png")
