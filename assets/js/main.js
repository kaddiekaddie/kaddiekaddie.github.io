/* ==========================================================================
   lorem ipsum — site scripts
   - injects the painted folk SVG sprite (flowers, vinok, frames, folk icons…)
   - optional PNG overrides for any drawing (see ART below)
   - renders cross-stitch lettering + motifs
   - scroll-driven motion: parallax, ribbons, marquees, coral-bead strand,
     swaying polaroids & vinok ribbons, lantern glow
   - guides filter/search, click-to-load YouTube
   - Porchlight page: conversation that types itself, module toggles
   No dependencies. Everything degrades gracefully without JS.
   ========================================================================== */
(() => {
  "use strict";

  /* ------------------------------------------------------------------------
     ART — swap any drawing for your own transparent PNG.
     Make the PNG, put it in assets/img/art/, and add a line here, e.g.
         rose: "assets/img/art/rose.png",
     Every <svg><use href="#rose"/></svg> on the site becomes that image.
     (See IMAGE-LIST.md for every name, size and where it appears.)
     ------------------------------------------------------------------------ */
  const ART = {
    rose: "assets/img/art/rose.png",
    chamomile: "assets/img/art/chamomile.png",
    poppy: "assets/img/art/poppy.png",
    cherries: "assets/img/art/cherries.png",
    kalyna: "assets/img/art/kalyna.png",
    // "oval-frame": "assets/img/art/oval-frame.png",
    // vinok: "assets/img/art/vinok.png",
    // rose: "assets/img/art/rose.png",
  };

  const root = document.documentElement;
  root.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const seeded = (seed) => () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const f1 = (n) => n.toFixed(1);

  /* ------------------------------------------------------------------------
     1. SVG SPRITE — painted folk florals (Petrykivka / Zhostovo inspired)
     ------------------------------------------------------------------------ */
  const C = {
    cherry: "#b3122e", cherry2: "#d3243f", cherryDark: "#7d0c20", deep: "#8f0f24",
    pink: "#f6c9d3", pink2: "#efa9ba", pink3: "#de7b96",
    green: "#93aa2a", greenL: "#bfd447", olive: "#56621c",
    cream: "#fffdf8", ink: "#3d1f24", gold: "#e8c46a", goldD: "#c8962e",
  };

  const leaf = (len = 40, w = 12, fill = C.green, vein = C.greenL) =>
    `<path d="M0 0 C ${w} ${-len * 0.3} ${w * 0.7} ${-len * 0.8} 0 ${-len} C ${-w * 0.7} ${-len * 0.8} ${-w} ${-len * 0.3} 0 0Z" fill="${fill}"/>
     <path d="M0 ${-len * 0.15} C ${w * 0.25} ${-len * 0.4} ${w * 0.2} ${-len * 0.7} 0 ${-len * 0.88}" fill="none" stroke="${vein}" stroke-width="1.3" stroke-linecap="round"/>`;

  const ozhivka = (ds) => ds.map((d) => `<path d="${d}" fill="none" stroke="${C.cream}" stroke-width="1.7" stroke-linecap="round" opacity=".88"/>`).join("");

  // Zhostovo-style rose
  const roseBody = `
    <circle r="30" fill="${C.pink3}"/>
    <ellipse cy="-7" rx="17" ry="12" fill="${C.cherry}"/>
    <path d="M-12 -6 C -8 4 8 4 12 -6 C 6 -1 -6 -1 -12 -6Z" fill="${C.cherryDark}"/>
    <path d="M-27 0 C -22 22 22 22 27 0 C 15 11 -15 11 -27 0Z" fill="${C.pink2}"/>
    <path d="M-22 10 C -14 28 14 28 22 10 C 12 18 -12 18 -22 10Z" fill="${C.pink}"/>
    <path d="M-29 -4 C -33 -20 -18 -31 -6 -28 C -18 -22 -24 -14 -29 -4Z" fill="${C.pink2}"/>
    <path d="M29 -4 C 33 -20 18 -31 6 -28 C 18 -22 24 -14 29 -4Z" fill="${C.pink2}"/>
    ${ozhivka(["M-20 4 C -12 12 12 12 20 4", "M-15 16 C -6 22 6 22 15 16", "M-24 -10 C -22 -18 -16 -22 -10 -24", "M10 -24 C 16 -22 22 -18 24 -10", "M-8 -12 C -4 -9 4 -9 8 -12"])}`;
  const rose = `
    <g transform="rotate(-128) translate(0 -22)">${leaf(28, 11)}</g>
    <g transform="rotate(128) translate(0 -22)">${leaf(26, 10, C.greenL, C.cream)}</g>
    <g transform="rotate(180) translate(0 -24)">${leaf(22, 9)}</g>
    ${roseBody}`;

  // chamomile (romashka)
  const chamomile = (() => {
    let s = "";
    for (let i = 0; i < 12; i++) {
      s += `<path transform="rotate(${i * 30})" d="M0 -9 C 7 -16 7 -40 0 -45 C -7 -40 -7 -16 0 -9Z" fill="${C.cream}" stroke="#e7dac4" stroke-width=".8"/>
            <path transform="rotate(${i * 30})" d="M0 -14 C 1.5 -24 1.5 -32 0 -38" stroke="#efe4d2" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    }
    s += `<circle r="12" fill="#efc14a"/><circle r="12" fill="none" stroke="${C.goldD}" stroke-width="3" stroke-dasharray=".01 4.2" stroke-linecap="round"/><circle cx="-3.5" cy="-3.5" r="4" fill="#fbe39a"/>`;
    return s;
  })();

  // poppy (mak)
  const poppy = (() => {
    const petal = "M0 0 C 18 -6 32 -26 21 -41 C 12 -50 -12 -50 -21 -41 C -32 -26 -18 -6 0 0Z";
    let s = "";
    [45, 135, 225, 315].forEach((r) => (s += `<path transform="rotate(${r})" d="${petal}" fill="#c41a36"/>`));
    [0, 90, 180, 270].forEach((r) => {
      s += `<path transform="rotate(${r})" d="${petal}" fill="${C.cherry2}"/>`;
      s += `<path transform="rotate(${r}) scale(.55)" d="${petal}" fill="${C.cherry}"/>`;
      s += `<path transform="rotate(${r})" d="M-14 -36 C -6 -42 6 -42 14 -36" fill="none" stroke="${C.cream}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`;
    });
    s += `<circle r="11" fill="${C.ink}"/>`;
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      s += `<path d="M${f1(Math.cos(a) * 8)} ${f1(Math.sin(a) * 8)} L${f1(Math.cos(a) * 15)} ${f1(Math.sin(a) * 15)}" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round"/><circle cx="${f1(Math.cos(a) * 15.5)}" cy="${f1(Math.sin(a) * 15.5)}" r="1.5" fill="${C.ink}"/>`;
    }
    s += `<circle r="5.5" fill="${C.green}"/><path d="M-4 0 H4 M0 -4 V4 M-3 -3 L3 3 M3 -3 L-3 3" stroke="${C.olive}" stroke-width="1"/>`;
    return s;
  })();

  // cherries (vyshnia)
  const cherry = (cx, cy) => `
    <circle cx="${cx}" cy="${cy}" r="15" fill="${C.cherry2}"/>
    <path d="M${cx + 13} ${cy - 6} C ${cx + 16} ${cy + 8} ${cx + 6} ${cy + 17} ${cx - 8} ${cy + 13} C ${cx + 4} ${cy + 10} ${cx + 11} ${cy + 3} ${cx + 13} ${cy - 6}Z" fill="${C.deep}"/>
    <ellipse cx="${cx - 6}" cy="${cy - 6}" rx="3.6" ry="5.6" transform="rotate(35 ${cx - 6} ${cy - 6})" fill="${C.cream}" opacity=".8"/>`;
  const cherries = `
    <path d="M-16 12 C -12 -10 -2 -30 6 -42" fill="none" stroke="${C.olive}" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M18 16 C 16 -6 12 -26 6 -42" fill="none" stroke="${C.olive}" stroke-width="2.8" stroke-linecap="round"/>
    <g transform="translate(6 -42) rotate(72)">${leaf(36, 12)}</g>
    <g transform="translate(6 -42) rotate(-20)">${leaf(24, 8, C.greenL, C.cream)}</g>
    ${cherry(-17, 24)}${cherry(19, 28)}`;

  // kalyna (guelder-rose) berry cluster
  const kalyna = (() => {
    let s = `<g transform="translate(-4 -30) rotate(-60)">${leaf(34, 13)}</g><g transform="translate(4 -30) rotate(55)">${leaf(30, 12, C.greenL, C.cream)}</g>`;
    const berries = [[0, -14], [-12, -6], [12, -6], [-20, 6], [0, 2], [20, 6], [-10, 14], [10, 14], [0, 24], [-22, 20], [22, 20]];
    berries.forEach(([x, y]) => (s += `<path d="M0 -30 L${x} ${y}" stroke="${C.olive}" stroke-width="1.2" fill="none"/>`));
    berries.forEach(([x, y]) => {
      s += `<circle cx="${x}" cy="${y}" r="7.5" fill="${C.cherry2}" stroke="${C.deep}" stroke-width="1"/><circle cx="${x - 2.4}" cy="${y - 2.4}" r="2" fill="${C.cream}" opacity=".85"/>`;
    });
    return s;
  })();

  // leafy sprig
  const sprig = (() => {
    let s = `<path d="M0 48 C 6 20 -6 -10 2 -46" fill="none" stroke="${C.olive}" stroke-width="2.6" stroke-linecap="round"/>`;
    [[38, 1], [22, -1], [6, 1], [-10, -1], [-26, 1]].forEach(([y, side], i) => {
      s += `<g transform="translate(${side} ${y}) rotate(${side * 58})">${leaf(26 - i * 1.6, 9, i % 2 ? C.greenL : C.green, i % 2 ? C.cream : C.greenL)}</g>`;
    });
    s += `<g transform="translate(2 -42)">${leaf(16, 6)}</g>`;
    [[-12, 30], [12, 14], [-12, -2]].forEach(([x, y]) => (s += `<circle cx="${x}" cy="${y}" r="3.2" fill="${C.pink3}"/>`));
    return s;
  })();

  const bow = `
    <g stroke="#cf6c89" stroke-width="1.4" stroke-linejoin="round">
      <path d="M96 66 C 86 96 70 120 52 146 L 72 140 L 80 154 C 92 124 102 96 106 70Z" fill="url(#g-ribbon)"/>
      <path d="M104 66 C 114 96 130 120 148 146 L 128 140 L 120 154 C 108 124 98 96 94 70Z" fill="url(#g-ribbon)"/>
      <path d="M100 60 C 70 18 18 8 12 40 C 6 72 60 80 100 66Z" fill="url(#g-ribbon)"/>
      <path d="M100 60 C 130 18 182 8 188 40 C 194 72 140 80 100 66Z" fill="url(#g-ribbon)"/>
      <path d="M100 62 C 74 40 44 30 30 42" fill="none" stroke="#fdeaf0" stroke-width="2"/>
      <path d="M100 62 C 126 40 156 30 170 42" fill="none" stroke="#fdeaf0" stroke-width="2"/>
      <rect x="86" y="48" width="28" height="26" rx="9" fill="url(#g-ribbon)"/>
    </g>`;

  // eight-point star (zirka) — fill = currentColor
  const starPts = (n, r1, r2, cx = 0, cy = 0, rot = -90) =>
    Array.from({ length: n * 2 }, (_, i) => {
      const a = ((rot + (i * 180) / n) * Math.PI) / 180, r = i % 2 ? r2 : r1;
      return `${f1(cx + Math.cos(a) * r)},${f1(cy + Math.sin(a) * r)}`;
    }).join(" ");
  const star8 = `<polygon points="${starPts(8, 48, 26)}" fill="currentColor" stroke="rgba(61,31,36,.25)" stroke-width="1.5" stroke-linejoin="round"/>
    <polygon points="${starPts(8, 24, 13, 0, 0, -67.5)}" fill="${C.cream}" opacity=".9"/>
    <circle r="6" fill="currentColor"/>`;

  const rosette = (() => {
    let s = "";
    for (let i = 0; i < 8; i++) s += `<path transform="rotate(${i * 45})" d="M0 -8 C 9 -18 8 -36 0 -44 C -8 -36 -9 -18 0 -8Z" fill="currentColor"/>`;
    return s + `<circle r="13" fill="${C.cream}"/><circle r="6" fill="currentColor"/>`;
  })();

  const dotRing = (r, n, rad, fill) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      return `<circle cx="${f1(Math.cos(a) * r)}" cy="${f1(Math.sin(a) * r)}" r="${rad}" fill="${fill}"/>`;
    }).join("");

  const medallion = (inner) => `<circle r="46" fill="${C.cherry}" stroke="${C.cherryDark}" stroke-width="2"/>
    ${dotRing(38, 18, 2.4, C.gold)}<circle r="31" fill="none" stroke="rgba(255,253,248,.35)" stroke-width="1.5"/>${inner}`;
  const playBtn = medallion(`<path d="M-11 -18 L22 0 L-11 18Z" fill="${C.cream}"/>`);
  const upBtn = medallion(`<path d="M0 -18 V18 M-12 -6 L0 -18 L12 -6" fill="none" stroke="${C.cream}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`);

  const paperclip = `<path d="M10 22 V62 a8 8 0 0 0 16 0 V12 a11 11 0 0 0 -22 0 V58 a5 5 0 0 0 10 0 V24" fill="none" stroke="url(#g-silver)" stroke-width="3.2" stroke-linecap="round"/>`;

  const scallop = (n, r1, r2) => {
    let d = "";
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, am = ((i + 0.5) / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
      if (!i) d += `M${(Math.cos(a0) * r1).toFixed(2)} ${(Math.sin(a0) * r1).toFixed(2)}`;
      d += `Q${(Math.cos(am) * r2).toFixed(2)} ${(Math.sin(am) * r2).toFixed(2)} ${(Math.cos(a1) * r1).toFixed(2)} ${(Math.sin(a1) * r1).toFixed(2)}`;
    }
    return d + "Z";
  };
  const seal = `<path d="${scallop(22, 45, 53)}" fill="currentColor"/>${dotRing(38, 28, 1.3, C.cream)}`;

  // lacquer tray rim (viewBox -150 -150 300 300)
  const trayRim = `<path d="${scallop(30, 140, 156)}" fill="url(#g-gold)" stroke="#7d5a20" stroke-width="1"/>
    <circle r="132" fill="${C.deep}"/>
    <circle r="124" fill="none" stroke="url(#g-gold)" stroke-width="2.4"/>
    ${dotRing(118, 64, 1.6, C.gold)}`;

  // gilded oval frame (viewBox 0 0 400 500)
  const ovalFrame = (() => {
    const cx = 200, cy = 250;
    const crest = (x, y, rot, s) => {
      let lobes = "";
      for (let k = -3; k <= 3; k++) lobes += `<ellipse cx="0" cy="-19" rx="6.5" ry="19" transform="rotate(${k * 17})" fill="url(#g-gold)" stroke="#6b4c1c" stroke-width=".8"/>`;
      const curl = `<path d="M0 6 C -18 12 -38 6 -42 -8 C -45 -20 -30 -24 -26 -13" fill="none" stroke="url(#g-gold)" stroke-width="7" stroke-linecap="round"/>
                    <path d="M0 6 C -18 12 -38 6 -42 -8 C -45 -20 -30 -24 -26 -13" fill="none" stroke="#6b4c1c" stroke-width=".8" stroke-linecap="round" opacity=".6"/>`;
      return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${curl}<g transform="scale(-1 1)">${curl}</g>${lobes}<circle cy="6" r="7" fill="url(#g-gold)" stroke="#6b4c1c" stroke-width=".8"/><circle cy="6" r="2.6" fill="#fff6d4"/></g>`;
    };
    const rosetteAt = (a) => {
      const x = cx + Math.cos(a) * 182, y = cy + Math.sin(a) * 232;
      let s = "";
      for (let i = 0; i < 6; i++) {
        const b = (i / 6) * Math.PI * 2;
        s += `<circle cx="${f1(x + Math.cos(b) * 7)}" cy="${f1(y + Math.sin(b) * 7)}" r="5" fill="url(#g-gold)" stroke="#6b4c1c" stroke-width=".6"/>`;
      }
      return s + `<circle cx="${f1(x)}" cy="${f1(y)}" r="5" fill="#f9ebbd" stroke="#6b4c1c" stroke-width=".6"/>`;
    };
    return `
      <ellipse cx="${cx}" cy="${cy}" rx="182" ry="232" fill="none" stroke="#5a3f14" stroke-width="30" opacity=".25" transform="translate(0 3)"/>
      <ellipse cx="${cx}" cy="${cy}" rx="182" ry="232" fill="none" stroke="url(#g-gold)" stroke-width="28"/>
      <ellipse cx="${cx}" cy="${cy}" rx="196" ry="246" fill="none" stroke="#6b4c1c" stroke-width="1.2" opacity=".6"/>
      <ellipse cx="${cx}" cy="${cy}" rx="182" ry="232" fill="none" stroke="#fff4cc" stroke-width="6.5" stroke-dasharray=".01 13.5" stroke-linecap="round"/>
      <ellipse cx="${cx}" cy="${cy}" rx="182" ry="232" fill="none" stroke="#7d5a20" stroke-width="2" stroke-dasharray=".01 13.5" stroke-linecap="round" transform="translate(.8 1.2)" opacity=".5"/>
      <ellipse cx="${cx}" cy="${cy}" rx="166" ry="216" fill="none" stroke="url(#g-gold)" stroke-width="7"/>
      <ellipse cx="${cx}" cy="${cy}" rx="162.5" ry="212.5" fill="none" stroke="#5a3f14" stroke-width="1.4" opacity=".7"/>
      ${[45, 135, 225, 315].map((d) => rosetteAt((d * Math.PI) / 180)).join("")}
      ${crest(cx, 478, 180, 1)}${crest(16, cy, -90, 0.8)}${crest(384, cy, 90, 0.8)}`;
  })();

  // vinok — flower crown with streaming ribbons, drawn in the oval frame's
  // coordinates (viewBox 0 0 400 500) so it sits exactly on the frame's top.
  const vinok = (() => {
    const cx = 200, cy = 250, rx = 192, ry = 240;
    const at = (deg) => [cx + Math.cos((deg * Math.PI) / 180) * rx, cy + Math.sin((deg * Math.PI) / 180) * ry];
    const ribbons = (deg, side) => {
      const [x, y] = at(deg);
      const cols = ["#b3122e", "#efa9ba", "#bfd447", "#de7b96"];
      let s = `<g style="transform-origin:${f1(x)}px ${f1(y)}px;transform:rotate(calc(var(--vel, 0) * ${side * 7}deg))">`;
      cols.forEach((c, i) => {
        const len = 230 + i * 34, sway = side * (10 + i * 6), off = side * (i * 7 - 8);
        s += `<path d="M${f1(x + off)} ${f1(y)} C ${f1(x + off + sway)} ${f1(y + len * 0.3)} ${f1(x + off - sway)} ${f1(y + len * 0.65)} ${f1(x + off + sway * 0.6)} ${f1(y + len)}" fill="none" stroke="${c}" stroke-width="${9 - i}" stroke-linecap="butt"/>`;
      });
      return s + "</g>";
    };
    let s = ribbons(206, -1) + ribbons(334, 1);
    // leaves behind
    for (let d = 200; d <= 340; d += 10) {
      const [x, y] = at(d);
      s += `<use href="#sprig" x="${f1(x - 34)}" y="${f1(y - 34)}" width="68" height="68" transform="rotate(${d + 90 + ((d / 10) % 2 ? 50 : -50)} ${f1(x)} ${f1(y)})"/>`;
    }
    const flowers = [
      [207, "kalyna", 66], [218, "chamomile", 70], [230, "rose", 82], [243, "poppy", 80], [256, "chamomile", 70],
      [270, "rose", 104], [284, "chamomile", 70], [297, "poppy", 80], [310, "rose", 82], [322, "chamomile", 70], [333, "kalyna", 66],
    ];
    flowers.forEach(([d, k, sz]) => {
      const [x, y] = at(d);
      s += `<use href="#${k}" x="${f1(x - sz / 2)}" y="${f1(y - sz / 2)}" width="${sz}" height="${sz}"/>`;
    });
    return s;
  })();

  // folk line icons (stroke = currentColor, 64 grid)
  const icons = {
    matryoshka: `<path d="M32 6 C 25 6 21 11 21 17 C 21 21 22 24 24 26 C 17 31 14 40 14 47 C 14 54 20 58 32 58 C 44 58 50 54 50 47 C 50 40 47 31 40 26 C 42 24 43 21 43 17 C 43 11 39 6 32 6Z"/><circle cx="32" cy="17" r="6.5"/><path d="M24 26 C 28 29 36 29 40 26"/><circle cx="32" cy="44" r="3.4"/><path d="M32 36.5 v3 M32 48.5 v3 M24.5 44 h3 M36.5 44 h3"/><path d="M29.5 16 h.01 M34.5 16 h.01" stroke-width="3"/><path d="M30.2 19.6 q1.8 1.4 3.6 0"/>`,
    samovar: `<path d="M24 22 l2 -6 h12 l2 6 M30 16 v-6 h4 v6"/><path d="M22 22 C 14 30 14 44 22 50 H42 C 50 44 50 30 42 22 Z"/><path d="M17 34 h30"/><path d="M22 50 l-4 8 h28 l-4 -8"/><path d="M15.5 29 c-6 0 -7 9 -1 10 M48.5 29 c6 0 7 9 1 10"/><path d="M30 42 h7 v4 h-2"/>`,
    poppy: `<path d="M32 30 C 22 14 8 22 14 34 C 18 42 28 40 32 34 C 36 40 46 42 50 34 C 56 22 42 14 32 30Z"/><path d="M32 34 C 30 44 28 52 24 58"/><path d="M29 47 C 22 44 18 46 16 50 C 22 52 26 50 29 47Z"/><circle cx="32" cy="30" r="3.5"/>`,
    bird: `<path d="M12 40 C 18 26 34 20 44 28 C 48 22 54 22 58 24 C 54 26 52 30 51 34 C 48 46 30 52 18 46 Z"/><path d="M18 46 C 10 48 6 44 4 38 M18 46 C 12 54 6 54 4 50 M18 46 C 14 40 10 32 12 26"/><path d="M24 38 C 30 32 40 32 44 38"/><circle cx="50" cy="28" r="1.4" fill="currentColor"/>`,
    star: `<polygon points="${starPts(8, 26, 13, 32, 32)}"/><circle cx="32" cy="32" r="4"/>`,
    cherries: `<circle cx="22" cy="46" r="8"/><circle cx="42" cy="48" r="8"/><path d="M22 38 C 24 24 30 14 36 8 M42 40 C 40 26 38 16 36 8"/><path d="M36 8 C 44 4 52 8 54 14 C 46 16 40 14 36 8Z"/>`,
    wheat: `<path d="M32 58 V12"/><path d="M32 12 c -3 -4 -3 -8 0 -10 c 3 2 3 6 0 10z"/>${[18, 27, 36, 45].map((y) => `<path d="M32 ${y + 6} c -7 -2 -9 -8 -7 -12 c 6 2 8 7 7 12z M32 ${y + 6} c 7 -2 9 -8 7 -12 c -6 2 -8 7 -7 12z"/>`).join("")}`,
    heart: `<path d="M32 54 C 10 40 6 26 12 18 C 18 10 28 12 32 20 C 36 12 46 10 52 18 C 58 26 54 40 32 54Z"/>`,
    search: `<circle cx="27" cy="27" r="15"/><path d="M38 38 L54 54"/>`,
    video: `<rect x="8" y="16" width="38" height="32" rx="4"/><path d="M46 28 L58 20 V44 L46 36Z"/>`,
    page: `<path d="M16 8 H40 L50 18 V56 H16Z"/><path d="M40 8 V18 H50"/><path d="M22 28 H44 M22 36 H44 M22 44 H38"/>`,
    youtube: `<rect x="8" y="16" width="48" height="32" rx="9"/><path d="M28 25 L40 32 L28 39Z" fill="currentColor"/>`,
    github: `<path d="M32 8 C 18 8 8 18 8 32 C 8 43 15 52 25 55 C 26 55 27 54 27 53 V48 C 20 50 19 45 19 45 C 18 42 16 41 16 41 C 14 40 16 40 16 40 C 18 40 20 42 20 42 C 22 46 26 45 27 44 C 27 43 28 42 28 41 C 22 40 17 38 17 30 C 17 27 18 25 20 23 C 19 22 19 19 20 16 C 20 16 22 15 27 19 C 30 18 34 18 37 19 C 42 15 44 16 44 16 C 45 19 45 22 44 23 C 46 25 47 27 47 30 C 47 38 42 40 36 41 C 37 42 37 44 37 46 V53 C 37 54 38 55 39 55 C 49 52 56 43 56 32 C 56 18 46 8 32 8Z"/>`,
    mail: `<rect x="8" y="16" width="48" height="34" rx="3"/><path d="M8 18 L32 36 L56 18"/>`,
    arrow: `<path d="M12 32 H50 M38 20 L50 32 L38 44"/>`,
  };
  const iconSymbols = Object.entries(icons)
    .map(([k, v]) => `<symbol id="t-${k}" viewBox="0 0 64 64"><g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${v}</g></symbol>`)
    .join("");

  const ribbonStops = Array.from({ length: 19 }, (_, i) => {
    const colors = ["#f6b9c8", "#fde0e7", "#eb9db1", "#fbd3dd", "#e690a7"];
    return `<stop offset="${(i / 18).toFixed(3)}" stop-color="${colors[i % colors.length]}"/>`;
  }).join("");

  const sym = (id, vb, body, extra = "") => `<symbol id="${id}" viewBox="${vb}" ${extra}>${body}</symbol>`;
  const sprite = `
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">
    <defs>
      <linearGradient id="g-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#8a6526"/><stop offset=".18" stop-color="#f3dc9a"/><stop offset=".34" stop-color="#b88d45"/>
        <stop offset=".5" stop-color="#f7e6b0"/><stop offset=".66" stop-color="#a87c35"/><stop offset=".82" stop-color="#ecd18c"/><stop offset="1" stop-color="#7d5a20"/>
      </linearGradient>
      <linearGradient id="g-silver" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f4f2ee"/><stop offset=".4" stop-color="#a9a59e"/><stop offset=".6" stop-color="#fdfcf9"/><stop offset="1" stop-color="#8e8a82"/>
      </linearGradient>
      <linearGradient id="g-ribbon" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fcdbe3"/><stop offset=".35" stop-color="#f2a9bb"/><stop offset=".6" stop-color="#fde3ea"/><stop offset="1" stop-color="#e48aa3"/>
      </linearGradient>
      <linearGradient id="g-ribbon-h" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">${ribbonStops}</linearGradient>
      <radialGradient id="g-coin" cx=".35" cy=".35"><stop offset="0" stop-color="#fff1b8"/><stop offset=".5" stop-color="#e8c46a"/><stop offset="1" stop-color="#a87c35"/></radialGradient>
    </defs>
    ${sym("rose", "-50 -50 100 100", rose)}
    ${sym("chamomile", "-50 -50 100 100", chamomile)}
    ${sym("poppy", "-50 -50 100 100", poppy)}
    ${sym("cherries", "-50 -50 100 100", cherries)}
    ${sym("kalyna", "-50 -50 100 100", kalyna)}
    ${sym("sprig", "-50 -50 100 100", sprig)}
    ${sym("bow", "0 0 200 160", bow)}
    ${sym("star8", "-52 -52 104 104", star8)}
    ${sym("rosette", "-50 -50 100 100", rosette)}
    ${sym("paperclip", "0 0 30 80", paperclip)}
    ${sym("seal", "-54 -54 108 108", seal)}
    ${sym("play", "-50 -50 100 100", playBtn)}
    ${sym("up", "-50 -50 100 100", upBtn)}
    ${sym("tray-rim", "-160 -160 320 320", trayRim)}
    ${sym("oval-frame", "0 0 400 500", ovalFrame, 'overflow="visible"')}
    ${sym("vinok", "0 0 400 500", vinok, 'overflow="visible"')}
    ${iconSymbols}
  </svg>`;
  document.body.insertAdjacentHTML("afterbegin", sprite);

  /* ------------------------------------------------------------------------
     2. CROSS-STITCH (vyshyvka) lettering + motifs
     ------------------------------------------------------------------------ */
  const MOTIFS = {
    heart: [".rr...rr.", "rrrr.rrrr", "rwrrrrrrr", "rrrrrrrrr", ".rrrrrrr.", "..rrrrr..", "...rrr...", "....r...."],
    star: ["r...r...r", ".r..r..r.", "..r.r.r..", "...rrr...", "rrrrprrrr", "...rrr...", "..r.r.r..", ".r..r..r.", "r...r...r"],
  };
  const PALETTE = {
    r: ["#b3122e", "#e0475f"], w: ["#fffdf8", "#ffffff"], p: ["#de7b96", "#f6c9d3"],
    k: ["#3d1f24", "#6f4b50"], g: ["#56621c", "#93aa2a"],
  };

  const gridToSVG = (grid, cell, colorOverride) => {
    const rows = grid.length, cols = Math.max(...grid.map((r) => r.length));
    const inset = cell * 0.14, sw = (cell * 0.3).toFixed(2), hw = (cell * 0.09).toFixed(2);
    const buckets = new Map();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const ch = grid[y][x];
        if (!ch || ch === ".") continue;
        const b = Math.floor(x / 2);
        if (!buckets.has(b)) buckets.set(b, {});
        const bucket = buckets.get(b);
        const key = colorOverride ? "o" : ch;
        const X = x * cell, Y = y * cell, s = cell;
        bucket[key] = (bucket[key] || "") +
          `M${f1(X + inset)} ${f1(Y + inset)}L${f1(X + s - inset)} ${f1(Y + s - inset)}M${f1(X + s - inset)} ${f1(Y + inset)}L${f1(X + inset)} ${f1(Y + s - inset)}`;
      }
    }
    let body = "";
    [...buckets.keys()].sort((a, b) => a - b).forEach((b, i) => {
      const bucket = buckets.get(b);
      let g = "";
      for (const key in bucket) {
        const [base, light] = colorOverride || PALETTE[key] || PALETTE.r;
        g += `<path d="${bucket[key]}" stroke="${base}" stroke-width="${sw}" stroke-linecap="round"/>`;
        g += `<path d="${bucket[key]}" stroke="${light}" stroke-width="${hw}" stroke-linecap="round" transform="translate(-.35 -.45)" opacity=".8"/>`;
      }
      body += `<g class="xs-col" style="--i:${i}">${g}</g>`;
    });
    const w = cols * cell, h = rows * cell;
    return `<svg class="xstitch" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" aria-hidden="true" style="filter:drop-shadow(0 .7px .5px rgba(61,31,36,.35))">${body}</svg>`;
  };

  const textToGrid = (text, rows, font) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const fontStr = `${rows}px ${font}`;
    ctx.font = fontStr;
    const w = Math.ceil(ctx.measureText(text).width) + 4, h = Math.ceil(rows * 1.5);
    canvas.width = w;
    canvas.height = h;
    ctx.font = fontStr;
    ctx.fillText(text, 2, Math.round(rows * 1.08));
    const data = ctx.getImageData(0, 0, w, h).data;
    let grid = [];
    for (let y = 0; y < h; y++) {
      let row = "";
      for (let x = 0; x < w; x++) row += data[(y * w + x) * 4 + 3] > 120 ? "r" : ".";
      grid.push(row);
    }
    grid = grid.filter((r) => r.includes("r"));
    let left = Infinity, right = 0;
    grid.forEach((r) => {
      const a = r.indexOf("r"), b = r.lastIndexOf("r");
      if (a >= 0) { left = Math.min(left, a); right = Math.max(right, b); }
    });
    return grid.map((r) => r.slice(left, right + 1));
  };

  const renderStitches = () => {
    document.querySelectorAll("[data-motif]").forEach((el) => {
      const grid = MOTIFS[el.dataset.motif];
      if (!grid) return;
      el.insertAdjacentHTML("beforeend", gridToSVG(grid, +el.dataset.cell || 6));
      el.classList.add("xstitch-host");
    });
    document.querySelectorAll("[data-stitch]").forEach((el) => {
      const text = el.dataset.stitch;
      const grid = textToGrid(text, +el.dataset.rows || 20, el.dataset.font || '700 "Caveat", cursive');
      if (!grid.length) return;
      const color = el.dataset.color ? el.dataset.color.split(",") : null;
      el.insertAdjacentHTML("beforeend", gridToSVG(grid, +el.dataset.cell || 7, color));
      el.classList.add("xstitch-host");
    });
  };

  /* ------------------------------------------------------------------------
     3. PAINTED FLOWER WREATH around [data-bloom] (arch or circle)
     ------------------------------------------------------------------------ */
  const renderBloom = () => {
    document.querySelectorAll("[data-bloom]").forEach((layer) => {
      const r = seeded(+layer.dataset.bloom || 3);
      const kinds = ["rose", "chamomile", "poppy", "sprig", "rose", "chamomile", "kalyna", "sprig", "cherries"];
      const circle = layer.dataset.bloomShape === "circle";
      const pts = [];
      if (circle) {
        for (let i = 0; i < 22; i++) {
          const t = (i / 22) * Math.PI * 2;
          pts.push([0.5 + 0.5 * Math.cos(t), 0.5 + 0.5 * Math.sin(t), -t]);
        }
      } else {
        for (let i = 0; i <= 16; i++) {
          const t = Math.PI - (i / 16) * Math.PI;
          pts.push([0.5 + 0.47 * Math.cos(t), 0.4 - 0.376 * Math.sin(t), t]);
        }
        for (let i = 1; i <= 8; i++) {
          const y = 0.4 + (i / 8) * 0.58;
          pts.push([0.03, y, Math.PI], [0.97, y, 0]);
        }
        for (let i = 1; i < 6; i++) pts.push([0.03 + (i / 6) * 0.94, 0.98, -Math.PI / 2]);
      }
      const fw = layer.parentElement.offsetWidth || 500;
      const ix = circle ? 0.16 : 0.16, iy = circle ? 0.16 : 0.12;
      let html = "";
      pts.forEach(([fx, fy, out]) => {
        const kind = kinds[Math.floor(r() * kinds.length)];
        const size = fw * (0.12 + r() * 0.11 + (!circle && fy > 0.85 ? 0.06 : 0));
        const push = (r() - 0.3) * 0.05;
        const x = fx + Math.cos(out) * push, y = fy - Math.sin(out) * push;
        const lx = ((x + ix) / (1 + ix * 2)) * 100, ly = ((y + iy) / (1 + iy * 2)) * 100;
        const rot = kind === "sprig" ? (-out * 180) / Math.PI + 90 : r() * 360;
        const sway = (r() > 0.5 ? 1 : -1) * (0.02 + r() * 0.03);
        html += `<svg viewBox="-50 -50 100 100" data-spin="${sway.toFixed(3)}" style="left:${lx.toFixed(2)}%;top:${ly.toFixed(2)}%;width:${size.toFixed(0)}px;height:${size.toFixed(0)}px;margin:${(-size / 2).toFixed(0)}px 0 0 ${(-size / 2).toFixed(0)}px;--base:${rot.toFixed(0)}deg;transform:rotate(calc(var(--base) + var(--spin, 0deg)))"><use href="#${kind}"/></svg>`;
      });
      layer.innerHTML = html;
    });
  };

  /* ------------------------------------------------------------------------
     4. CORAL BEAD STRAND (namysto) down the page margin
     ------------------------------------------------------------------------ */
  let strand = null;
  const buildStrand = () => {
    if (!document.body.hasAttribute("data-beads")) return;
    const docH = document.documentElement.scrollHeight;
    if (!strand) {
      const layer = document.createElement("div");
      layer.className = "beads-layer";
      layer.setAttribute("aria-hidden", "true");
      layer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">
          <defs><mask id="beads-mask" maskUnits="userSpaceOnUse"><path class="bm" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round"/></mask></defs>
          <g mask="url(#beads-mask)">
            <path class="bead-string"/>
            <path class="bead-path"/>
            <path class="bead-shine"/>
          </g>
          <g class="bead-coin">
            <path d="M0 -12 V-6" stroke="#a87c35" stroke-width="1.5"/>
            <circle r="9" fill="url(#g-coin)" stroke="#a87c35" stroke-width="1"/>
            <circle r="5.5" fill="none" stroke="#a87c35" stroke-width=".8"/>
            <polygon points="${starPts(8, 4.2, 2.2)}" fill="#b3122e"/>
          </g>
        </svg>`;
      document.body.appendChild(layer);
      strand = {
        layer, mask: layer.querySelector(".bm"), coin: layer.querySelector(".bead-coin"),
        paths: [...layer.querySelectorAll(".bead-string, .bead-path, .bead-shine")],
      };
    }
    strand.layer.style.height = docH + "px";
    let d = "M32 120";
    let y = 120, flip = 1;
    while (y < docH - 120) {
      const step = 280;
      d += ` C ${32 + 24 * flip} ${y + step * 0.3}, ${32 - 24 * flip} ${y + step * 0.7}, 32 ${y + step}`;
      y += step;
      flip *= -1;
    }
    strand.paths.forEach((p) => p.setAttribute("d", d));
    strand.mask.setAttribute("d", d);
    strand.len = strand.paths[0].getTotalLength();
    strand.mask.style.strokeDasharray = `${strand.len} ${strand.len}`;
  };

  /* ------------------------------------------------------------------------
     5. RIBBON WAVES ([data-ribbon] paths)
     ------------------------------------------------------------------------ */
  const ribbons = [...document.querySelectorAll("[data-ribbon]")].map((p) => ({
    el: p,
    base: +(p.dataset.base || 0.5), amp: +(p.dataset.amp || 0.12), freq: +(p.dataset.freq || 1.4),
    phase: +(p.dataset.phase || 0), dy: +(p.dataset.dy || 0),
    w: +(p.closest("svg").viewBox.baseVal.width || 1440), h: +(p.closest("svg").viewBox.baseVal.height || 600),
  }));
  const drawRibbons = (scroll, t) => {
    ribbons.forEach((r) => {
      const ph = r.phase + scroll * 0.0035 + t * 0.00025;
      let d = "";
      for (let i = 0; i <= 70; i++) {
        const x = -60 + (i / 70) * (r.w + 120);
        const k = (x / r.w) * Math.PI * 2 * r.freq;
        const y = r.h * r.base + r.dy + Math.sin(k + ph) * r.h * r.amp + Math.sin(k * 0.5 - ph * 0.6) * r.h * r.amp * 0.4;
        d += `${i ? "L" : "M"}${f1(x)} ${f1(y)}`;
      }
      r.el.setAttribute("d", d);
    });
  };

  /* ------------------------------------------------------------------------
     6. MARQUEES — drift in the direction you last scrolled
     ------------------------------------------------------------------------ */
  const marquees = [...document.querySelectorAll("[data-marquee]")].map((m) => {
    const track = m.querySelector(".marquee-track");
    const group = track.querySelector(".marquee-group");
    const fill = () => {
      track.querySelectorAll(".marquee-group.clone").forEach((c) => c.remove());
      const gw = group.getBoundingClientRect().width || 1;
      const need = Math.ceil((m.clientWidth * 1.2) / gw) + 1;
      for (let i = 0; i < need; i++) {
        const c = group.cloneNode(true);
        c.classList.add("clone");
        c.setAttribute("aria-hidden", "true");
        track.appendChild(c);
      }
      return gw;
    };
    return { track, sign: +m.dataset.marquee || 1, gw: fill(), fill, pos: 0 };
  });

  /* ------------------------------------------------------------------------
     7. PARALLAX + SCROLL LOOP
     ------------------------------------------------------------------------ */
  const docTop = (el) => {
    let y = 0;
    while (el) { y += el.offsetTop; el = el.offsetParent; }
    return y;
  };
  let parallax = [], spinners = [];
  const measure = () => {
    parallax = [...document.querySelectorAll("[data-speed]")].map((el) => ({
      el, speed: +el.dataset.speed, center: docTop(el) + el.offsetHeight / 2,
    }));
    spinners = [...document.querySelectorAll("[data-spin]")].map((el) => ({ el, f: +el.dataset.spin }));
    marquees.forEach((mq) => (mq.gw = mq.fill()));
    buildStrand();
  };

  const header = document.querySelector(".site-header");
  const toTop = document.querySelector(".to-top");
  let lastY = window.scrollY, dir = 1, vel = 0, lastT = performance.now();

  const frame = (t) => {
    const y = window.scrollY, vh = window.innerHeight, dy = y - lastY;
    const dt = Math.min(64, t - lastT);
    lastT = t;
    if (Math.abs(dy) > 0.5) dir = dy > 0 ? 1 : -1;

    vel += (Math.max(-1.2, Math.min(1.2, dy * 0.06)) - vel) * 0.12;
    root.style.setProperty("--vel", vel.toFixed(3));

    for (const p of parallax) p.el.style.setProperty("--py", `${f1((p.center - (y + vh / 2)) * -p.speed)}px`);
    for (const s of spinners) s.el.style.setProperty("--spin", `${(y * s.f).toFixed(2)}deg`);

    drawRibbons(y, reduceMotion ? 0 : t);

    for (const mq of marquees) {
      mq.pos += mq.sign * (dy * 0.9 + dir * 0.045 * dt);
      mq.track.style.transform = `translate3d(${f1(-(((mq.pos % mq.gw) + mq.gw) % mq.gw))}px,0,0)`;
    }

    root.style.setProperty("--glow", (0.25 + 0.75 * Math.min(1, y / (vh * 0.8))).toFixed(3));

    if (strand && strand.len) {
      const maxY = document.documentElement.scrollHeight - vh;
      const prog = Math.max(0.02, Math.min(1, (y + vh * 0.55) / (maxY + vh * 0.55)));
      const L = strand.len * prog;
      strand.mask.style.strokeDashoffset = `${strand.len - L}`;
      const p = strand.paths[0].getPointAtLength(L);
      strand.coin.setAttribute("transform", `translate(${f1(p.x)} ${f1(p.y + 14)}) rotate(${f1(vel * 12)})`);
    }

    if (header) header.classList.toggle("is-hidden", y > 300 && dir > 0 && !header.contains(document.activeElement));
    if (toTop) toTop.classList.toggle("show", y > vh);

    lastY = y;
    if (!reduceMotion) requestAnimationFrame(frame);
  };

  /* ------------------------------------------------------------------------
     8. REVEAL ON SCROLL (+ Porchlight conversation & modules)
     ------------------------------------------------------------------------ */
  const playThread = (thread) => {
    const msgs = [...thread.querySelectorAll(".pl-msg")];
    if (reduceMotion) { msgs.forEach((m) => m.classList.add("is-shown")); return; }
    let delay = 200;
    msgs.forEach((m) => {
      const them = m.classList.contains("pl-msg--them");
      if (them) {
        const typing = document.createElement("div");
        typing.className = "pl-msg pl-msg--them is-shown pl-msg--typing";
        typing.innerHTML = '<div class="pl-msg__bubble"><span class="pl-typing" aria-label="typing"><i></i><i></i><i></i></span></div>';
        setTimeout(() => m.before(typing), delay);
        delay += 900 + Math.min(1200, m.textContent.length * 14);
        setTimeout(() => { typing.remove(); m.classList.add("is-shown"); }, delay);
      } else {
        delay += 500;
        setTimeout(() => m.classList.add("is-shown"), delay);
      }
      delay += 350;
    });
  };

  const syncModules = () => {
    document.querySelectorAll(".pl-module[data-needs]").forEach((card) => {
      const dep = document.getElementById(card.dataset.needs);
      const ok = dep && dep.checked;
      const input = card.querySelector("input");
      const chip = card.querySelector(".pl-needs-chip");
      input.disabled = !ok;
      card.classList.toggle("pl-module--blocked", !ok);
      card.querySelector(".pl-toggle").classList.toggle("is-disabled", !ok);
      if (chip) {
        chip.className = `pl-chip pl-needs-chip ${ok ? "pl-chip--sage" : "pl-chip--danger"}`;
        chip.textContent = ok ? `Needs: ${chip.dataset.label}` : `Turn on first: ${chip.dataset.label}`;
      }
    });
    document.querySelectorAll(".pl-module").forEach((card) => {
      const input = card.querySelector("input");
      if (input) card.classList.toggle("pl-module--on", input.checked);
    });
  };

  const switchOn = (card) => {
    const input = card.querySelector("input[data-auto-on]");
    if (!input || input.checked) return;
    setTimeout(() => { input.checked = true; syncModules(); }, reduceMotion ? 0 : 500);
  };

  const observeReveals = () => {
    const targets = document.querySelectorAll(".reveal, .xstitch-host, [data-pl-thread], .pl-module");
    const enter = (el) => {
      el.classList.add("is-in");
      if (el.matches("[data-pl-thread]")) playThread(el);
      if (el.matches(".pl-module")) switchOn(el);
    };
    if (!("IntersectionObserver" in window) || reduceMotion) { targets.forEach(enter); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { enter(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
    targets.forEach((el) => io.observe(el));
  };

  /* ------------------------------------------------------------------------
     9. GUIDES: filter + search
     ------------------------------------------------------------------------ */
  const initFilters = () => {
    const grid = document.querySelector("[data-guide-grid]");
    if (!grid) return;
    const cards = [...grid.children];
    const buttons = [...document.querySelectorAll(".filter-btn")];
    const search = document.querySelector("#guide-search");
    const empty = document.querySelector(".empty-note");
    let active = "all";
    const apply = () => {
      const q = (search?.value || "").trim().toLowerCase();
      let shown = 0;
      cards.forEach((c) => {
        const okTag = active === "all" || (c.dataset.tags || "").split(/\s+/).includes(active);
        const okText = !q || c.textContent.toLowerCase().includes(q);
        c.hidden = !(okTag && okText);
        if (!c.hidden) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    };
    buttons.forEach((b) => b.addEventListener("click", () => {
      active = b.dataset.filter;
      buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      apply();
    }));
    search?.addEventListener("input", apply);
    const fromHash = buttons.find((b) => b.dataset.filter === location.hash.replace("#", ""));
    if (fromHash) fromHash.click();
  };

  /* ------------------------------------------------------------------------
     10. click-to-load YouTube
     ------------------------------------------------------------------------ */
  const initYouTube = () => {
    document.querySelectorAll(".yt[data-yt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.yt;
        if (!id || /^YOUR_/i.test(id)) {
          const note = btn.querySelector(".yt-note");
          if (note) note.textContent = "✿ add your YouTube video id to data-yt in guides.html";
          return;
        }
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
        iframe.title = btn.getAttribute("aria-label") || "YouTube video";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        btn.replaceChildren(iframe);
      });
    });
  };

  /* ------------------------------------------------------------------------
     boot
     ------------------------------------------------------------------------ */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  renderBloom();

  // align <use> to its svg's viewBox, and swap in PNG overrides from ART
  document.querySelectorAll("svg > use, .tray-paint > use").forEach((u) => {
    const svg = u.ownerSVGElement;
    const name = (u.getAttribute("href") || "").replace("#", "");
    if (ART[name] && u.parentElement !== svg) {
      const image = document.createElementNS(svg.namespaceURI, "image");
      for (const attribute of u.attributes) image.setAttribute(attribute.name, attribute.value);
      image.setAttribute("href", ART[name]);
      u.replaceWith(image);
      return;
    }
    if (ART[name] && svg.children.length === 1 && svg.parentNode) {
      const img = document.createElement("img");
      img.src = ART[name];
      img.alt = "";
      img.className = svg.getAttribute("class") || "";
      img.setAttribute("style", (svg.getAttribute("style") || "") + ";object-fit:contain");
      for (const a of svg.attributes) if (a.name.startsWith("data-")) img.setAttribute(a.name, a.value);
      img.setAttribute("aria-hidden", "true");
      svg.replaceWith(img);
      return;
    }
    const vb = svg && svg.viewBox.baseVal;
    if (vb && vb.width && !u.hasAttribute("width")) {
      u.setAttribute("x", vb.x); u.setAttribute("y", vb.y);
      u.setAttribute("width", vb.width); u.setAttribute("height", vb.height);
    }
  });

  initFilters();
  initYouTube();
  syncModules();
  document.querySelectorAll(".pl-module input").forEach((i) => i.addEventListener("change", syncModules));

  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => {
    renderStitches();
    observeReveals();
    measure();
    requestAnimationFrame(frame);
  });

  let resizeTimer;
  window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(measure, 150); });
  window.addEventListener("load", measure);
  if ("ResizeObserver" in window) {
    let roTimer;
    new ResizeObserver(() => { clearTimeout(roTimer); roTimer = setTimeout(measure, 200); }).observe(document.body);
  }
  if (reduceMotion) window.addEventListener("scroll", () => requestAnimationFrame(frame), { passive: true });
})();
