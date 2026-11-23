# lorem ipsum — a hand-stitched personal site

A little scrapbook-style personal website: embroidery, cross-stitch, polaroids, gingham and ribbons in
**chartreuse, cherry red, beige and pink**. It's plain HTML + CSS + a single JS file — no build step, no
frameworks — so it runs on GitHub Pages as-is.

## Pages

| file | what it is |
| --- | --- |
| `index.html` | Home — "hello," + cross-stitched name, gilded oval portrait, crossing ribbon marquees, "what you'll find here", Porchlight teaser, latest guides, a little letter |
| `about.html` | About me — scrapbook board with ID card, embroidery hoop, "little things" polaroids, currently-list, timeline, say-hello envelope |
| `porchlight.html` | Porchlight — embroidered flower-wreath poster, what-is-it, fabric-patch features, sideways-scrolling screenshots, 3 setup steps, FAQ |
| `guides.html` | Guides & tutorials — featured video, filterable/searchable library of video + written guides |
| `guide.html` | Template for a **written** tutorial (table of contents, tips, code blocks, figures) |

## Things that move when you scroll

- **Parallax** — anything with `data-speed=".05"` drifts at its own pace (negative = the other way).
- **Spin** — anything with `data-spin=".04"` rotates as you scroll (the seals, flowers, embroidery hoop).
- **Ribbon marquees** — follow the direction you scroll, then keep drifting that way.
- **Running stitch** — a red thread sews itself down the left margin on wide screens; the needle flips when you scroll up.
- **Header** tucks away when scrolling down and comes back when scrolling up.
- **Polaroids** sway with scroll speed; scrapbook pieces "drop" into place as they appear.
- **Porch light** gets brighter the further you scroll; the Porchlight screenshots slide sideways.
- Everything calms down automatically for visitors with *reduce motion* turned on.

## Editing

All text is lorem ipsum — search for `Lorem` / `lorem` and replace.

- **Your name in cross-stitch:** in `index.html`, change `data-stitch="i'm Lorem"`. It's drawn as real
  X-stitches from whatever text you put there (`data-rows` = letter height in stitches, `data-cell` = stitch size).
- **Header + footer** are repeated in each page (so the site works without a build step) — if you change a
  link, change it in all five files.
- **Photos** live in `assets/img/photos/`. Drop in your own and keep the same file names, or update the `src`.
  The placeholders are free Unsplash photos (via Lorem Picsum) under the Unsplash License.
- **Colours & fonts** are CSS variables at the top of `assets/css/style.css` (`--cherry`, `--chartreuse`, `--pink`, …).
- **Embroidered artwork** (daisy, rose, bud, sprig, cherries, bow, lantern, gilded frame, sewing tools) is drawn
  in `assets/js/main.js` and used anywhere with `<svg viewBox="-50 -50 100 100"><use href="#daisy"/></svg>`.

### Adding a video tutorial

In `guides.html`, copy one `<a class="vcard" …>` block and change:

- `href` → your YouTube link
- the thumbnail `<img>`, duration, title, description
- `data-tags` → any of `video beginner advanced`

For the **featured video** player, set `data-yt="YOUR_VIDEO_ID"` to the id from your link
(`youtube.com/watch?v=`**`dQw4w9WgXcQ`**). It only loads YouTube when someone clicks play.

### Adding a written tutorial

1. Duplicate `guide.html` (e.g. `guide-installing.html`) and write your guide in it.
2. In `guides.html`, copy a `<a class="wcard" …>` block and point its `href` at the new file, with `data-tags="written beginner"` (or `advanced`).

Filters can be linked directly: `guides.html#video`, `guides.html#written`, `guides.html#beginner`.

## Publishing on GitHub Pages

1. Create a repo — name it **`yourusername.github.io`** for `https://yourusername.github.io`, or any name for `https://yourusername.github.io/reponame`.
2. Upload / push everything in this folder (keep `.nojekyll`).
3. Repo **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`** → Save.
4. Give it a minute, then visit your URL.

To preview locally, just open `index.html` in your browser (or run `python3 -m http.server` in this folder and go to `http://localhost:8000`).
