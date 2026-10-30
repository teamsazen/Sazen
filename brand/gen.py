"""Sazen brand kit generator.

Builds the S mark from geometry (one stroke width, two equal bowls, 180°
point symmetry) and sets the wordmark in Google Sans as outlines, so every
SVG renders the same everywhere with no font installed.

    python gen.py            # writes svg/ and preview.html
    python gen.py --png      # also renders png/ with headless Chrome
"""
import subprocess
import sys
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

HERE = Path(__file__).resolve().parent
FONTS = Path.home() / "Muzamil" / "Fonts" / "googlesans"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

INK, PAPER = "#ffffff", "#000000"
BG_IN, BG_OUT = "#1b1c20", "#0b0b0d"      # icon/banner radial background
TAG = "#8e9099"                          # "APPS · GAMES"

# ---- the mark --------------------------------------------------------------
# Each arm ends in two lanes split by a thin slit: the outer lane is cut short
# and a dot carries on from it, the inner lane runs a little further. The
# bottom end is the top end turned 180°, so the dot always follows the short
# lane at both ends.
W = 150.0                  # stroke width
GAP = 0.5 * W              # height of each counter (the slot inside a bowl)
R_MID = (GAP + W) / 2      # centre-line radius of each bowl
BAR = 150.0                # distance between the two bowl centres
SLIT = 0.14 * W            # slit height; also the gap before the dot
LANE = (W - SLIT) / 2      # height of each lane and of the dot
DOT = 1.4 * LANE           # dot length
LONG = 0.8 * LANE          # how far the inner lane outruns the outer one
DEPTH = 1.1 * LANE         # how far the slit cuts back past the outer lane


def mark_paths(cx=0.0, cy=0.0):
    """Return (s_outline, [dot rects]) centred on (cx, cy)."""
    r, h = R_MID, W / 2
    R, ri = r + h, r - h
    y1, y2, y3 = cy - 2 * r, cy, cy + 2 * r          # arm centre lines
    cxl, cxr = cx - BAR / 2, cx + BAR / 2
    T, B = y1 - h, y1 + h                            # top arm edges
    a, sr = LANE / 2, SLIT / 2
    edge = cxr + R                                   # outer edge of right bowl
    dot_x = edge - DOT                               # dot runs flush to it
    xu = dot_x - SLIT                                # outer (short) lane end
    xl = xu + LONG                                   # inner (long) lane end
    xs = xu - DEPTH                                  # slit's rounded inner end

    f = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")
    rot = lambda x, y: (2 * cx - x, 2 * cy - y)

    def emit(cmds, turn=False):
        out = []
        for c in cmds:
            if c[0] == "H":
                out.append(f"H{f(2 * cx - c[1] if turn else c[1])}")
            else:  # ("A", r, sweep, x, y)
                _, rad, sweep, x, y = c
                x, y = rot(x, y) if turn else (x, y)
                out.append(f"A{f(rad)} {f(rad)} 0 0 {sweep} {f(x)} {f(y)}")
        return "".join(out)

    # From the top terminal, round the left bowl to the inner right bowl.
    body = [("H", cxl), ("A", R, 0, cxl, y2 + h), ("H", cxr),
            ("A", ri, 1, cxr, y3 - h)]
    # From the top arm's underside out through the split terminal.
    terminal = [("H", xl - a), ("A", a, 0, xl - a, B - LANE), ("H", xs),
                ("A", sr, 1, xs, T + LANE), ("H", xu - a), ("A", a, 0, xu - a, T)]
    d = (f"M{f(xu - a)} {f(T)}" + emit(body) + emit(terminal, turn=True)
         + emit(body, turn=True) + emit(terminal) + "Z")

    top_dot = (dot_x, T, DOT, LANE)
    bx, by = rot(dot_x + DOT, T + LANE)
    return d, [top_dot, (bx, by, DOT, LANE)]


def mark_bbox():
    r, h = R_MID, W / 2
    half_w = BAR / 2 + r + h
    half_h = 2 * r + h
    return half_w * 2, half_h * 2


def mark_svg_group(cx, cy, scale, fill):
    d, pills = mark_paths()
    rects = "".join(
        f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{hh:.2f}" rx="{hh / 2:.2f}"/>'
        for x, y, w, hh in pills)
    return (f'<g transform="translate({cx:.2f} {cy:.2f}) scale({scale:.5f})" fill="{fill}">'
            f'<path d="{d}"/>{rects}</g>')


# ---- type ------------------------------------------------------------------
def text_path(text, weight, size, x, y, tracking=0.0, width=None):
    """Outline `text` with its baseline-left at (x, y). Returns (svg, width).

    If `width` is given, tracking is solved so the run is exactly that wide.
    """
    font = TTFont(FONTS / f"GoogleSans-{weight}.ttf")
    gs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
    upm = font["head"].unitsPerEm
    s = size / upm
    names = [cmap[ord(c)] for c in text]
    advances = [hmtx[n][0] * s for n in names]
    # Trim the side bearing after the last glyph so widths are ink-true.
    last = gs[names[-1]]
    from fontTools.pens.boundsPen import BoundsPen
    bp = BoundsPen(gs)
    last.draw(bp)
    ink_end = (bp.bounds[2] if bp.bounds else hmtx[names[-1]][0]) * s
    bp = BoundsPen(gs)
    gs[names[0]].draw(bp)
    ink_start = (bp.bounds[0] if bp.bounds else 0) * s
    natural = sum(advances[:-1]) + ink_end - ink_start
    if width is not None and len(text) > 1:
        tracking = (width - natural) / (len(text) - 1)
    out, pen_x = [], x - ink_start
    for n, adv in zip(names, advances):
        sp = SVGPathPen(gs)
        gs[n].draw(TransformPen(sp, (s, 0, 0, -s, pen_x, y)))
        if sp.getCommands():
            out.append(sp.getCommands())
        pen_x += adv + tracking
    total = natural + tracking * (len(text) - 1)
    return "".join(out), total


def cap_height(size):
    return 716 / 1000 * size


# ---- compositions ----------------------------------------------------------
def background(w, h, rid="bg"):
    return (f'<defs><radialGradient id="{rid}" cx="50%" cy="45%" r="75%">'
            f'<stop offset="0" stop-color="{BG_IN}"/><stop offset="1" stop-color="{BG_OUT}"/>'
            f'</radialGradient></defs><rect width="{w}" height="{h}" fill="url(#{rid})"/>')


def svg(w, h, body, label):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
            f'viewBox="0 0 {w} {h}" role="img" aria-label="{label}">{body}</svg>\n')


def icon(size=1024):
    mw, mh = mark_bbox()
    scale = size * 0.58 / mh          # mark fills 58% of the height: inside
    return svg(size, size,           # Play's safe circle with room to breathe
               background(size, size) + mark_svg_group(size / 2, size / 2, scale, INK),
               "Sazen")


def mark_only(fill, size=1024):
    mw, mh = mark_bbox()
    pad = 0.06 * size
    scale = (size - 2 * pad) / max(mw, mh)
    return svg(size, size, mark_svg_group(size / 2, size / 2, scale, fill), "Sazen S")


def lockup(w, h, mark_h, ink=INK, tag=TAG, bg=True):
    """Mark beside the wordmark + tagline, the pair centred on the canvas.

    The text block is exactly as tall as the mark: cap top of "Sazen" sits on
    the mark's top edge, the tagline baseline on its bottom edge. With w and h
    None the canvas hugs the lockup with a small margin.
    """
    mw, mh = mark_bbox()
    scale = mark_h / mh
    mark_w = mw * scale
    # Tagline cap height + the line gap (equal to it) + wordmark cap height
    # add up to exactly the mark's height.
    tag_size = mark_h * 0.19
    tag_cap = cap_height(tag_size)
    line_gap = tag_cap
    word_cap = mark_h - tag_cap - line_gap
    word_size = word_cap / cap_height(1)
    # Measure the wordmark first; the tagline is tracked to match its width.
    word_d, word_w = text_path("Sazen", "Bold", word_size, 0, 0)
    gap = mark_h * 0.30
    total_w = mark_w + gap + word_w
    if w is None:
        pad = mark_h * 0.08
        w, h = round(total_w + 2 * pad), round(mark_h + 2 * pad)
    x0 = (w - total_w) / 2
    top = (h - mark_h) / 2
    tx = x0 + mark_w + gap
    word_d, _ = text_path("Sazen", "Bold", word_size, tx, top + word_cap)
    tag_d, _ = text_path("APPS · GAMES", "Regular", tag_size, tx,
                         top + mark_h, width=word_w)
    body = ((background(w, h) if bg else "")
            + mark_svg_group(x0 + mark_w / 2, h / 2, scale, ink)
            + f'<path d="{word_d}" fill="{ink}"/>'
            + f'<path d="{tag_d}" fill="{tag}"/>')
    return svg(w, h, body, "Sazen — Apps · Games")


def guides_overlay(w, h, mark_h):
    """Thin lines on the preview to show what lines up with what."""
    mw, mh = mark_bbox()
    top, bot = (h - mark_h) / 2, (h + mark_h) / 2
    c = "#ff3b6b"
    return (f'<svg viewBox="0 0 {w} {h}" class="ov" xmlns="http://www.w3.org/2000/svg">'
            f'<g stroke="{c}" stroke-width="{h / 600:.2f}" stroke-dasharray="{h / 120:.1f}">'
            f'<line x1="0" x2="{w}" y1="{top}" y2="{top}"/>'
            f'<line x1="0" x2="{w}" y1="{bot}" y2="{bot}"/>'
            f'<line x1="0" x2="{w}" y1="{h / 2}" y2="{h / 2}"/>'
            f'<line y1="0" y2="{h}" x1="{w / 2}" x2="{w / 2}"/></g></svg>')


def icon_guides(size=1024):
    """Grid for the mark: lanes, bowl centres, safe circle."""
    mw, mh = mark_bbox()
    scale = size * 0.58 / mh
    c = "#ff3b6b"
    sw = 1.2 / scale
    r, h = R_MID, W / 2
    t = -2 * r - h
    ys = [t, t + LANE, t + LANE + SLIT, t + W, -h, h, 2 * r - h, 2 * r + h]
    lines = "".join(f'<line x1="-600" x2="600" y1="{y}" y2="{y}"/>' for y in ys)
    xs = [-BAR / 2, BAR / 2, -BAR / 2 - r - h, BAR / 2 + r + h]
    lines += "".join(f'<line y1="-600" y2="600" x1="{x}" x2="{x}"/>' for x in xs)
    return (f'<svg viewBox="0 0 {size} {size}" class="ov" xmlns="http://www.w3.org/2000/svg">'
            f'<g transform="translate({size / 2} {size / 2}) scale({scale})" stroke="{c}" '
            f'stroke-width="{sw}" fill="none" stroke-dasharray="{6 / scale} {4 / scale}">{lines}'
            f'<circle r="{size * 0.5 * 0.92 / scale}" stroke-dasharray="none"/></g></svg>')


# ---- outputs ---------------------------------------------------------------
HEADER = (4096, 2304)       # Play developer page header image
FEATURE = (1024, 500)       # Play feature graphic

FILES = {
    "sazen-icon.svg": lambda: icon(1024),
    "sazen-header-4096x2304.svg": lambda: lockup(*HEADER, mark_h=HEADER[1] * 0.30),
    "sazen-feature-1024x500.svg": lambda: lockup(*FEATURE, mark_h=FEATURE[1] * 0.32),
    "sazen-logo-white.svg": lambda: lockup(None, None, 600, INK, TAG, bg=False),
    "sazen-logo-black.svg": lambda: lockup(None, None, 600, PAPER, "#5b5e66", bg=False),
    "sazen-s-black.svg": lambda: mark_only(PAPER),
    "sazen-s-white.svg": lambda: mark_only(INK),
}

PNGS = [  # (svg, out, w, h)
    ("sazen-icon.svg", "sazen-icon-2048.png", 2048, 2048),
    ("sazen-icon.svg", "sazen-icon-1024.png", 1024, 1024),
    ("sazen-icon.svg", "sazen-icon-512.png", 512, 512),
    ("sazen-icon.svg", "sazen-icon-48.png", 48, 48),
    ("sazen-header-4096x2304.svg", "sazen-header-4096x2304.png", 4096, 2304),
    ("sazen-feature-1024x500.svg", "sazen-feature-1024x500.png", 1024, 500),
    ("sazen-feature-1024x500.svg", "sazen-feature-2048x1000.png", 2048, 1000),
]


def write_svgs():
    out = HERE / "svg"
    out.mkdir(exist_ok=True)
    for name, make in FILES.items():
        (out / name).write_text(make())
    print(f"wrote {len(FILES)} svgs")


def write_preview():
    s = lambda n: (HERE / "svg" / n).read_text()
    old = Path.home() / "Muzamil/Projects/Sazen/public/images/sazen-logo.png"
    html = f'''<!doctype html><html><head><meta charset="utf-8"><title>Sazen brand preview</title>
<style>
:root{{--bg:#f4f4f5;--fg:#111;--card:#fff;--line:#e4e4e7}}
body{{margin:0;font-family:"Google Sans",-apple-system,sans-serif;background:var(--bg);color:var(--fg)}}
header{{position:sticky;top:0;z-index:2;display:flex;gap:12px;align-items:center;padding:12px 24px;background:#111;color:#fff}}
header b{{margin-right:auto}}
button{{font:inherit;background:#27272a;color:#fff;border:1px solid #3f3f46;border-radius:8px;padding:6px 12px;cursor:pointer}}
main{{max-width:1200px;margin:0 auto;padding:24px 16px 64px}}
h2{{font-size:15px;margin:32px 0 12px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:.06em}}
.row{{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end}}
.card{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px}}
.card small{{display:block;margin-top:8px;color:#71717a;font-size:12px}}
.wrap{{position:relative;line-height:0}} .wrap svg{{display:block;width:100%;height:auto}}
.wrap .ov{{position:absolute;inset:0;width:100%;height:100%;display:none;pointer-events:none}}
body.guides .wrap .ov{{display:block}}
.round svg:first-child{{border-radius:50%}} .squircle svg:first-child{{border-radius:22%}}
.checker{{background:repeating-conic-gradient(#e5e5e5 0 25%,#fff 0 50%) 0 0/20px 20px}}
.dark{{background:#09090b}}
</style></head><body>
<header><b>Sazen brand kit — preview</b>
<button onclick="document.body.classList.toggle('guides')">Show alignment guides</button></header>
<main>
<h2>Before → after</h2>
<div class="row">
 <div class="card" style="width:260px"><img src="file://{old}" width="228" style="border-radius:22%"><small>Before (current)</small></div>
 <div class="card squircle" style="width:260px"><div class="wrap">{s("sazen-icon.svg")}{icon_guides()}</div><small>After — guides show the 3-lane grid, bowl centres and safe circle</small></div>
</div>

<h2>App icon at real sizes and Play masks</h2>
<div class="row">
 <div class="card round" style="width:180px"><div class="wrap">{s("sazen-icon.svg")}</div><small>Circle mask</small></div>
 <div class="card squircle" style="width:120px"><div class="wrap">{s("sazen-icon.svg")}</div><small>Squircle</small></div>
 <div class="card squircle" style="width:72px"><div class="wrap">{s("sazen-icon.svg")}</div><small>48dp</small></div>
 <div class="card squircle" style="width:48px"><div class="wrap">{s("sazen-icon.svg")}</div><small>24</small></div>
</div>

<h2>Play developer page header · 4096 × 2304</h2>
<div class="card"><div class="wrap">{s("sazen-header-4096x2304.svg")}{guides_overlay(*HEADER, HEADER[1] * 0.30)}</div>
<small>Guides: the top of the S = cap top of “Sazen”; the bottom of the S = baseline of “APPS · GAMES”; tagline is exactly the wordmark's width; the pair is centred.</small></div>

<h2>Play feature graphic · 1024 × 500</h2>
<div class="card"><div class="wrap">{s("sazen-feature-1024x500.svg")}{guides_overlay(*FEATURE, FEATURE[1] * 0.40)}</div></div>

<h2>S only — black and white (transparent)</h2>
<div class="row">
 <div class="card checker" style="width:220px"><div class="wrap">{s("sazen-s-black.svg")}</div><small>sazen-s-black.svg</small></div>
 <div class="card dark" style="width:220px"><div class="wrap">{s("sazen-s-white.svg")}</div><small style="color:#a1a1aa">sazen-s-white.svg</small></div>
 <div class="card" style="width:96px"><div class="wrap">{s("sazen-s-black.svg")}</div><small>small</small></div>
 <div class="card dark" style="width:96px"><div class="wrap">{s("sazen-s-white.svg")}</div><small style="color:#a1a1aa">small</small></div>
</div>
</main></body></html>'''
    (HERE / "preview.html").write_text(html)
    print("wrote preview.html")


def write_pngs():
    out = HERE / "png"
    out.mkdir(exist_ok=True)
    tmp = HERE / ".render.html"
    for src, name, w, h in PNGS:
        tmp.write_text(f'<html><body style="margin:0"><img src="svg/{src}" '
                       f'width="{w}" height="{h}" style="display:block"></body></html>')
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        "--allow-file-access-from-files", "--force-device-scale-factor=1",
                        f"--window-size={w},{h}", f"--screenshot={out / name}",
                        f"file://{tmp}"], check=True, capture_output=True)
        print("wrote", name)
    tmp.unlink()


if __name__ == "__main__":
    write_svgs()
    write_preview()
    if "--png" in sys.argv:
        write_pngs()
