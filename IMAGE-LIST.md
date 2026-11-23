# Image list — drawings made in code

Every decorative picture on the site that I drew as SVG code (instead of finding a transparent PNG),
so you can recreate them yourself. The Porchlight page is not in this list: it uses your brand kit's
own files as they are (`assets/porchlight/`).

**How to read the sizes**

- **Shown at**: the largest size it appears on the site, in CSS pixels (desktop, 1440px wide).
- **Minimum**: the smallest PNG that won't look soft on a normal screen (≈ 1× the largest size).
- **Recommended**: 2× the largest size, so it stays crisp on phones and retina screens. Bigger is fine.
- All decorations are **transparent PNGs**, artwork centred, with a little breathing room (≈ 5%) so
  leaves and petals aren't cut off.

## How to swap one in

1. Save your PNG in `assets/img/art/` (e.g. `assets/img/art/rose.png`).
2. Open `assets/js/main.js` and add a line to the `ART` list near the top:

   ```js
   const ART = {
     rose: "assets/img/art/rose.png",
   };
   ```

3. Every place that draws `#rose` now shows your PNG instead. The **name** column below is the key to use.

Patterns are swapped in CSS instead: change the matching `--pat-…` line at the top of `assets/css/style.css`.

---

## 1. Painted folk flowers

Painted in a Petrykivka / Zhostovo style: flat colour with thin white highlight strokes. All are
**square (1:1)**, transparent.

| name | what it is | where it appears | shown at (max) | minimum | recommended |
| --- | --- | --- | --- | --- | --- |
| `rose` | Zhostovo-style rose: pink body, deep cherry centre, three leaves | vinok crown, painted tray, guides wreath, about board | ~125 × 125 | 128 × 128 | 256 × 256 |
| `chamomile` | romashka: 12 white petals, gold centre | home hero, vinok, tray, card emblem, wreath | 140 × 140 | 160 × 160 | 320 × 320 |
| `poppy` | red four-petal poppy, dark centre with stamens | vinok, tray, wreath | ~110 × 110 | 128 × 128 | 256 × 256 |
| `cherries` | two cherries on stems with leaves | home hero, guides card emblem, wreath, card corners | 90 × 90 | 96 × 96 | 256 × 256 |
| `kalyna` | guelder-rose berry cluster with two leaves | home letter, vinok, tray, wreath, card corners | 185 × 185 | 192 × 192 | 384 × 384 |
| `sprig` | leafy stem with small pink berries (filler greenery) | behind the vinok flowers, tray, wreath | ~110 × 110 | 128 × 128 | 256 × 256 |
| `bow` | pink satin ribbon bow | about page ID card | 96 × 77 (5:4) | 120 × 96 | 240 × 192 |

> The **vinok** crown is built from `rose`, `chamomile`, `poppy`, `kalyna` and `sprig`, but swapping
> those flowers doesn't change the crown. Swap the crown itself with `vinok` (below).

## 2. Frames and set pieces

| name | what it is | shown at (max) | shape | minimum | recommended | notes |
| --- | --- | --- | --- | --- | --- | --- |
| `oval-frame` | gilded oval mirror frame: pearl dots, rosettes, shell crests on the bottom and sides | 410 × 513 | 4:5 | 420 × 525 | 1000 × 1250 | **Transparent middle.** The photo is cut to an oval 83% as wide and 87% as tall as the canvas, centred, so the frame's inner edge should cover that oval's edge. |
| `vinok` | flower crown (roses, poppies, chamomile, kalyna, leaves) with long ribbons hanging down both sides (cherry, pink, chartreuse) | 410 × 574 | 5:7 | 420 × 588 | 1000 × 1400 | Sits on top of the oval frame. The canvas is the frame plus **12% headroom above**: on a 1000 × 1400 canvas the frame's top edge is at y = 168px. The crown follows the frame's top curve; the ribbons reach about 60% of the way down. |
| `tray-rim` | Zhostovo lacquer tray: scalloped gold rim, deep cherry centre, gold dotted band | 388 × 388 | 1:1 | 400 × 400 | 800 × 800 | On the guides page a round photo covers the centre (82% of the width). On the about page the painted bouquet and circular text are separate pieces (see note below). |
| `seal` | scalloped round badge with a ring of cream dots (no text) | 112 × 112 | 1:1 | 128 × 128 | 256 × 256 | The "made with love" text is real text laid on top. Fill colour is cherry `#b3122e`. |
| `star8` | folk eight-point star (zirka) with a cream inner star | 50 × 50 | 1:1 | 64 × 64 | 128 × 128 | Used in gold `#e8c46a`, cherry `#d3243f` and chartreuse `#bfd447`. A PNG can't change colour, so one PNG replaces all three; pick your favourite. |
| `rosette` | eight-petal folk rosette | 34 × 34 | 1:1 | 48 × 48 | 96 × 96 | Timeline markers on the about page, in four colours (same colour note as `star8`). |
| `play` | cherry medallion with gold dot ring and a cream play triangle | 86 × 86 | 1:1 | 96 × 96 | 192 × 192 | Play button on video thumbnails. |
| `up` | the same medallion with an up arrow | 56 × 56 | 1:1 | 64 × 64 | 128 × 128 | Back-to-top button. |
| `paperclip` | silver paperclip | 26 × 70 | 3:8 | 32 × 86 | 64 × 172 | About page polaroid. |

**About-page tray:** the bouquet and the gold circular text sit inside `about.html` (search for
`tray-paint`) so they can turn as you scroll. To use your own art, replace that whole `<svg>` with one
`<img>` of a finished tray: **square, at least 400 × 400, 800 × 800 recommended**.

## 3. Folk line icons

Single-colour line drawings on a 64 × 64 grid, round ends. Square, transparent.

| name | where | shown at (max) | minimum | recommended |
| --- | --- | --- | --- | --- |
| `t-matryoshka`, `t-samovar`, `t-poppy`, `t-bird`, `t-star`, `t-cherries`, `t-wheat` | footer row | 56 × 56 | 64 × 64 | 128 × 128 |
| `t-star`, `t-cherries`, `t-poppy`, `t-heart` | inside the scrolling ribbons | 35 × 35 | 48 × 48 | 96 × 96 |

Colour: olive `#56621c` in the footer. In the ribbons they take the text colour (white on the red
ribbon, dark on the green one), so a single PNG won't suit both. These are easiest left as they are.

The small UI icons (`t-search`, `t-video`, `t-page`, `t-youtube`, `t-github`, `t-mail`, `t-arrow`,
16–22px in buttons) are best kept as code or swapped for an icon set, not PNGs.

## 4. Logo and favicon

| what | file | shown at | minimum | recommended |
| --- | --- | --- | --- | --- |
| cross-stitch heart (header logo) | drawn live from a 9 × 8 stitch grid | 30 × 27 | 64 × 57 | 128 × 114 |
| favicon (the same heart on a pink tile) | `assets/img/favicon.svg` | browser tab | 32 × 32 | 512 × 512 (square) |

## 5. Pattern tiles (seamless repeats)

These repeat edge to edge, so the left edge must match the right and the top the bottom. Swap them in
`assets/css/style.css` (the `--pat-…` lines at the top).

| file | what it is | tile size on screen | recommended export | background |
| --- | --- | --- | --- | --- |
| `assets/img/patterns/shawl.svg` | Pavlovo Posad shawl print: painted roses, chamomile, leaves, gold dots | 200 × 200 | 400 × 400 | opaque cherry `#b3122e` |
| `assets/img/patterns/lace.svg` | Vologda-style lace net | 48 × 48 | 96 × 96 | white lines on **transparent** (sits on pink) |
| `assets/img/patterns/rushnyk.svg` | cross-stitched embroidered-towel band: diamonds in cherry and dark brown | 24 × 30 (shown 14–30px tall) | 48 × 60 | transparent |
| `assets/img/patterns/leafy.svg` | white painted sprigs and little flowers | 190 × 190 | 380 × 380 | white on **transparent** (sits on chartreuse) |
| `assets/img/patterns/floral.svg` | tiny pink flowers and leaves | 64 × 64 | 128 × 128 | transparent (sits on pink `#f8d5dc`) |

## 6. Drawn live by code (not images)

These move or reshape as you scroll, so they stay as code: the cross-stitched "i'm Lorem", the flowing
hero ribbons, the coral bead strand down the margin, the crossing marquee ribbons, torn-paper edges, the
shawl fringe, the linen texture, plus the CSS-only pieces (polaroids, washi tape, envelopes, wax seal,
postage stamps, ink stamp).
