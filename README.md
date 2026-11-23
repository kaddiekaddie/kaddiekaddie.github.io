# lorem ipsum — a slavic-feminine scrapbook site

A personal website in **chartreuse, cherry red, beige and pink**, drawing on Slavic folk art:
Zhostovo and Petrykivka painted florals, a *vinok* flower crown with ribbons, Pavlovo Posad shawl
print, Vologda lace, *rushnyk* cross-stitch bands, coral beads and folk eight-point stars, all on
scrapbook paper with polaroids and washi tape. Plain HTML + CSS + one JS file, with no build step, so
it runs on GitHub Pages as-is.

## Pages

| file | what it is |
| --- | --- |
| `index.html` | Home: "hello," and a cross-stitched name, a gilded portrait crowned with a vinok, crossing ribbons, the shawl-print "what you'll find here", a Porchlight teaser, the latest guides, a little letter |
| `about.html` | About me: scrapbook board and ID card, a painted lacquer tray, "little things" polaroids, a currently list, a timeline, a say-hello envelope |
| `porchlight.html` | **Porchlight**, built from the Porchlight brand book (see below) |
| `guides.html` | Guides and tutorials: featured video, filterable and searchable library of video and written guides |
| `guide.html` | Template for a **written** tutorial |
| `IMAGE-LIST.md` | Every drawing made in code, with sizes, so you can recreate them as PNGs |

## Things that move when you scroll

- **Parallax**: anything with `data-speed=".05"` drifts at its own pace.
- **Spin**: anything with `data-spin=".04"` turns as you scroll (the seal, the tray, wreath flowers).
- **Vinok ribbons and polaroids** sway with how fast you scroll.
- **Ribbon marquees** follow the direction you scroll, then keep drifting that way.
- **Coral bead strand**: a string of red beads threads itself down the left margin on wide screens, with a little gold coin at the end.
- The **header** tucks away when you scroll down and comes back when you scroll up.
- On Porchlight, the **porch light's rays** switch on, the **conversation types itself out** and the **module toggles** flip on as you reach them.
- Everything calms down for visitors with *reduce motion* turned on.

## The Porchlight page

`porchlight.html` follows the Porchlight brand book:

- **Brand assets** are copied into `assets/porchlight/`: logos, illustrations, patterns and fonts (Cormorant Garamond, Jost, Pinyon Script).
- **Styles** are in `assets/css/porchlight.css`. The brand tokens and component styles come straight from the kit, scoped to `.pl` so they don't affect the rest of the site.
- **Rules followed:** crème paper, chocolat ink, bordeaux for the one main action, harlequin only on the hero edge and never behind text, one script flourish per view, French as seasoning with the English beside it, and no exclamation marks.
- **Components** are rebuilt as plain HTML: ProfileCard, Thread, MessageBubble, ModuleCard, Toggle, Chip, Notice, Ornament, Button, DiscordEmbed.

## Editing

All filler text is lorem ipsum. Search for `Lorem` / `lorem` and replace.

- **Your name in cross-stitch:** in `index.html`, change `data-stitch="i'm Lorem"`.
- **Header and footer** are repeated in each page. If you change a link, change it in all five files.
- **Photos** live in `assets/img/photos/`. They're free Unsplash photos (via Lorem Picsum) under the Unsplash License; drop in your own with the same names.
- **Colours and fonts** are CSS variables at the top of `assets/css/style.css`.

### Replacing a drawing with your own PNG

Every flower, frame and ornament is drawn in code. To use your own transparent PNG instead, save it in
`assets/img/art/` and add a line to the `ART` list at the top of `assets/js/main.js`:

```js
const ART = {
  rose: "assets/img/art/rose.png",
};
```

`IMAGE-LIST.md` lists every name, where it appears, and the minimum and recommended sizes.
Pattern tiles are swapped in `assets/css/style.css` (the `--pat-…` lines).

### Adding a video tutorial

In `guides.html`, copy an `<a class="vcard" …>` block and change the `href` (your YouTube link), the
thumbnail, the duration, the title and the text. `data-tags` can be any of `video beginner advanced`.
For the featured player, set `data-yt` to your video id (the part after `watch?v=`).

### Adding a written tutorial

Duplicate `guide.html`, write your guide, then copy a `<a class="wcard" …>` block in `guides.html` and point it at the new file.

Filters can be linked directly: `guides.html#video`, `guides.html#written`, `guides.html#beginner`.

## Publishing

This repo is `kaddiekaddie.github.io`, so in **Settings → Pages** choose *Deploy from a branch*, then
`main` / `(root)`. The site lives at https://kaddiekaddie.github.io.
