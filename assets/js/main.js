/* ==========================================================================
   lorem ipsum — scrapbook site scripts
   - injects the embroidered SVG sprite (flowers, bows, frames, tools…)
   - renders cross-stitch lettering + motifs on "aida cloth"
   - scroll-driven motion: parallax, ribbons, marquees, running-stitch thread,
     swaying polaroids, lantern glow, horizontal gallery
   - guides filter/search + click-to-load YouTube embeds
   No dependencies. Everything degrades gracefully without JS.
   ========================================================================== */
(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     tiny seeded random so decorations look hand-placed but stay consistent
     ------------------------------------------------------------------------ */
  const seeded = (seed) => () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  /* ------------------------------------------------------------------------
     1. SVG SPRITE
     ------------------------------------------------------------------------ */
  const C = {
    cherry: "#b3122e", cherryDark: "#7d0c20", pink: "#efa9ba", pinkDeep: "#de7b96",
    green: "#a9c23a", olive: "#6f8a1f", ink: "#3d1f24", cream: "#fffdf8",
  };

  const satin = (id, base, light, angle = 0, h = 2.2) =>
    `<pattern id="${id}" width="4" height="${h}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
       <rect width="4" height="${h}" fill="${base}"/>
       <rect width="4" height="${(h * 0.38).toFixed(2)}" fill="${light}" opacity=".75"/>
     </pattern>`;

  const rand = seeded(11);

  // daisy petals + french-knot centre
  const daisy = (() => {
    let s = "";
    for (let i = 0; i < 12; i++) {
      s += `<path transform="rotate(${i * 30})" d="M0 -10 C 7 -18 7 -38 0 -45 C -7 -38 -7 -18 0 -10Z" fill="url(#satin-white)" stroke="#e2d2b8" stroke-width=".7"/>`;
    }
    s += `<circle r="12" fill="url(#satin-yellow)"/>`;
    for (let i = 0; i < 16; i++) {
      const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * 9;
      s += `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="1.9" fill="#cf9a22"/>`;
    }
    return s;
  })();

  // rose: satin body + stem-stitch spiral
  const spiral = (turns, r0, r1, steps = 90) => {
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, a = t * turns * Math.PI * 2, r = r0 + (r1 - r0) * t;
      d += `${i ? "L" : "M"}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
    }
    return d;
  };
  const leafShape = (len = 46, w = 13) =>
    `<path d="M0 0 C ${w} ${-len * 0.25} ${w} ${-len * 0.75} 0 ${-len} C ${-w} ${-len * 0.75} ${-w} ${-len * 0.25} 0 0Z" fill="url(#satin-green)" stroke="#7d961f" stroke-width=".7"/>
     <path d="M0 -3 V ${-len + 5}" stroke="${C.olive}" stroke-width="1.1" stroke-dasharray="3 2" fill="none"/>`;
  const rose = `
    <g transform="rotate(-130) translate(0 -20)">${leafShape(30, 10)}</g>
    <g transform="rotate(140) translate(0 -20)">${leafShape(28, 9)}</g>
    <circle r="27" fill="url(#satin-pink)" stroke="#d9748f" stroke-width=".8"/>
    <path d="${spiral(2.4, 24, 3)}" fill="none" stroke="#c8577a" stroke-width="2.8" stroke-linecap="round" stroke-dasharray="5 1.6"/>
    <path d="${spiral(2.2, 20, 4)}" transform="rotate(40)" fill="none" stroke="#fbd5de" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="4 2.5" opacity=".9"/>`;

  // forget-me-not cluster
  const tiny = (x, y, r, fill) => {
    let s = "";
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      s += `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" r="${(r * 0.78).toFixed(1)}" fill="${fill}"/>`;
    }
    return s + `<circle cx="${x}" cy="${y}" r="${(r * 0.55).toFixed(1)}" fill="url(#satin-yellow)"/>`;
  };
  const bud = `
    <g transform="translate(-6 34) rotate(-30)">${leafShape(26, 8)}</g>
    <g transform="translate(8 34) rotate(35)">${leafShape(24, 7)}</g>
    ${tiny(-14, -6, 9, "url(#satin-pink)")}${tiny(14, -14, 8, "url(#satin-white)")}${tiny(8, 14, 9, "url(#satin-rose)")}${tiny(-18, 22, 6, "url(#satin-white)")}`;

  // leafy sprig
  const sprig = (() => {
    let s = `<path d="M0 48 C 6 20 -6 -10 2 -46" fill="none" stroke="${C.olive}" stroke-width="2.4" stroke-dasharray="4 1.6" stroke-linecap="round"/>`;
    [[38, 1], [22, -1], [6, 1], [-10, -1], [-26, 1]].forEach(([y, side], i) => {
      s += `<g transform="translate(${side * 1} ${y}) rotate(${side * 55})">${leafShape(24 - i * 1.5, 8)}</g>`;
    });
    return s + `<g transform="translate(2 -42)">${leafShape(16, 6)}</g>`;
  })();

  const cherries = `
    <path d="M-16 14 C -12 -10 -2 -30 6 -42" fill="none" stroke="${C.olive}" stroke-width="2.6" stroke-dasharray="4 1.4" stroke-linecap="round"/>
    <path d="M18 18 C 16 -6 12 -26 6 -42" fill="none" stroke="${C.olive}" stroke-width="2.6" stroke-dasharray="4 1.4" stroke-linecap="round"/>
    <g transform="translate(6 -42) rotate(70)">${leafShape(34, 11)}</g>
    <circle cx="-17" cy="24" r="16" fill="url(#satin-cherry)" stroke="${C.cherryDark}" stroke-width=".8"/>
    <circle cx="19" cy="28" r="16" fill="url(#satin-cherry)" stroke="${C.cherryDark}" stroke-width=".8"/>
    <ellipse cx="-23" cy="18" rx="3.4" ry="5.5" transform="rotate(30 -23 18)" fill="#fff" opacity=".7"/>
    <ellipse cx="13" cy="22" rx="3.4" ry="5.5" transform="rotate(30 13 22)" fill="#fff" opacity=".7"/>`;

  const bow = `
    <g stroke="#cf6c89" stroke-width="1.6" stroke-linejoin="round">
      <path d="M96 66 C 86 96 70 120 52 146 L 72 140 L 80 154 C 92 124 102 96 106 70Z" fill="url(#g-ribbon)"/>
      <path d="M104 66 C 114 96 130 120 148 146 L 128 140 L 120 154 C 108 124 98 96 94 70Z" fill="url(#g-ribbon)"/>
      <path d="M100 60 C 70 18 18 8 12 40 C 6 72 60 80 100 66Z" fill="url(#g-ribbon)"/>
      <path d="M100 60 C 130 18 182 8 188 40 C 194 72 140 80 100 66Z" fill="url(#g-ribbon)"/>
      <path d="M100 62 C 74 40 44 30 30 42" fill="none" stroke="#e48aa3" opacity=".7"/>
      <path d="M100 62 C 126 40 156 30 170 42" fill="none" stroke="#e48aa3" opacity=".7"/>
      <rect x="86" y="48" width="28" height="26" rx="9" fill="url(#g-ribbon)"/>
    </g>`;

  const sparkle = `<path d="M0 -50 C 5 -12 12 -5 50 0 C 12 5 5 12 0 50 C -5 12 -12 5 -50 0 C -12 -5 -5 -12 0 -50Z" fill="currentColor" stroke="rgba(61,31,36,.25)" stroke-width="1.5"/>
    <path d="M0 -30 C 2 -8 8 -2 22 0" fill="none" stroke="#fff" stroke-width="2" opacity=".8" stroke-linecap="round"/>`;

  const paperclip = `<path d="M10 22 V62 a8 8 0 0 0 16 0 V12 a11 11 0 0 0 -22 0 V58 a5 5 0 0 0 10 0 V24" fill="none" stroke="url(#g-silver)" stroke-width="3.2" stroke-linecap="round"/>`;

  const seal = (() => {
    const n = 22, r1 = 45, r2 = 50;
    let d = "";
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, am = ((i + 0.5) / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
      if (!i) d += `M${(Math.cos(a0) * r1).toFixed(2)} ${(Math.sin(a0) * r1).toFixed(2)}`;
      d += `Q${(Math.cos(am) * r2 * 1.06).toFixed(2)} ${(Math.sin(am) * r2 * 1.06).toFixed(2)} ${(Math.cos(a1) * r1).toFixed(2)} ${(Math.sin(a1) * r1).toFixed(2)}`;
    }
    return `<path d="${d}Z" fill="currentColor"/><circle r="38" fill="none" stroke="#fffdf8" stroke-width="1.4" stroke-dasharray="3 2.4" opacity=".85"/>`;
  })();

  const lantern = `
    <circle class="lantern-glow" cx="50" cy="94" r="50" fill="url(#g-glow)"/>
    <g filter="url(#thread)">
      <path d="M50 2 V20" stroke="${C.ink}" stroke-width="2.4" stroke-dasharray="4 2"/>
      <circle cx="50" cy="8" r="5" fill="none" stroke="${C.ink}" stroke-width="2"/>
      <path d="M24 42 L50 20 L76 42 Z" fill="url(#satin-cherry)" stroke="${C.cherryDark}" stroke-width="1"/>
      <rect x="22" y="42" width="56" height="8" rx="2" fill="url(#g-gold)"/>
      <path d="M28 50 L72 50 L66 122 L34 122Z" fill="#fff3b8" stroke="${C.ink}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M50 50 V122 M39 50 L42 122 M61 50 L58 122" stroke="${C.ink}" stroke-width="1.6" stroke-dasharray="4 2.2"/>
      <path d="M50 76 C 60 90 58 104 50 108 C 42 104 40 90 50 76Z" fill="#f2a934"/>
      <path d="M50 88 C 55 96 54 102 50 104 C 46 102 45 96 50 88Z" fill="#fff1a0"/>
      <rect x="30" y="122" width="40" height="8" rx="2" fill="url(#g-gold)"/>
      <path d="M42 130 L58 130 L50 144Z" fill="url(#satin-cherry)"/>
    </g>`;

  const playBtn = `<circle r="46" fill="url(#satin-cherry)" stroke="${C.cherryDark}" stroke-width="2"/>
    <circle r="37" fill="none" stroke="rgba(255,253,248,.55)" stroke-width="2" stroke-dasharray="5 3.5"/>
    <path d="M-11 -18 L22 0 L-11 18Z" fill="#fffdf8"/>`;

  const sewButton = `<circle r="44" fill="currentColor" stroke="rgba(61,31,36,.35)" stroke-width="2"/>
    <circle r="35" fill="none" stroke="rgba(61,31,36,.22)" stroke-width="2.5"/>
    <path d="M-10 -10 L10 10 M10 -10 L-10 10" stroke="#fffdf8" stroke-width="5" stroke-linecap="round"/>
    <circle cx="-10" cy="-10" r="5" fill="rgba(61,31,36,.5)"/><circle cx="10" cy="-10" r="5" fill="rgba(61,31,36,.5)"/>
    <circle cx="-10" cy="10" r="5" fill="rgba(61,31,36,.5)"/><circle cx="10" cy="10" r="5" fill="rgba(61,31,36,.5)"/>`;

  // gilded oval frame (viewBox 0 0 400 500)
  const ovalFrame = (() => {
    const cx = 200, cy = 250;
    const crest = (x, y, rot, s) => {
      let lobes = "";
      for (let k = -3; k <= 3; k++) {
        lobes += `<ellipse cx="0" cy="-19" rx="6.5" ry="19" transform="rotate(${k * 17})" fill="url(#g-gold)" stroke="#6b4c1c" stroke-width=".8"/>`;
      }
      const curl = `<path d="M0 6 C -18 12 -38 6 -42 -8 C -45 -20 -30 -24 -26 -13" fill="none" stroke="url(#g-gold)" stroke-width="7" stroke-linecap="round"/>
                    <path d="M0 6 C -18 12 -38 6 -42 -8 C -45 -20 -30 -24 -26 -13" fill="none" stroke="#6b4c1c" stroke-width=".8" stroke-linecap="round" opacity=".6"/>`;
      return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${curl}<g transform="scale(-1 1)">${curl}</g>${lobes}<circle cy="6" r="7" fill="url(#g-gold)" stroke="#6b4c1c" stroke-width=".8"/><circle cy="6" r="2.6" fill="#fff6d4"/></g>`;
    };
    const rosette = (a) => {
      const x = cx + Math.cos(a) * 182, y = cy + Math.sin(a) * 232;
      let s = "";
      for (let i = 0; i < 6; i++) {
        const b = (i / 6) * Math.PI * 2;
        s += `<circle cx="${(x + Math.cos(b) * 7).toFixed(1)}" cy="${(y + Math.sin(b) * 7).toFixed(1)}" r="5" fill="url(#g-gold)" stroke="#6b4c1c" stroke-width=".6"/>`;
      }
      return s + `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#f9ebbd" stroke="#6b4c1c" stroke-width=".6"/>`;
    };
    return `
      <ellipse cx="${cx}" cy="${cy}" rx="182" ry="232" fill="none" stroke="#5a3f14" stroke-width="30" opacity=".25" transform="translate(0 3)"/>
      <ellipse cx="${cx}" cy="${cy}" rx="182" ry="232" fill="none" stroke="url(#g-gold)" stroke-width="28"/>
      <ellipse cx="${cx}" cy="${cy}" rx="196" ry="246" fill="none" stroke="#6b4c1c" stroke-width="1.2" opacity=".6"/>
      <ellipse cx="${cx}" cy="${cy}" rx="182" ry="232" fill="none" stroke="#fff4cc" stroke-width="6.5" stroke-dasharray=".01 13.5" stroke-linecap="round"/>
      <ellipse cx="${cx}" cy="${cy}" rx="182" ry="232" fill="none" stroke="#7d5a20" stroke-width="2" stroke-dasharray=".01 13.5" stroke-linecap="round" transform="translate(.8 1.2)" opacity=".5"/>
      <ellipse cx="${cx}" cy="${cy}" rx="166" ry="216" fill="none" stroke="url(#g-gold)" stroke-width="7"/>
      <ellipse cx="${cx}" cy="${cy}" rx="162.5" ry="212.5" fill="none" stroke="#5a3f14" stroke-width="1.4" opacity=".7"/>
      ${[45, 135, 225, 315].map((d) => rosette((d * Math.PI) / 180)).join("")}
      ${crest(cx, 24, 0, 1.25)}${crest(cx, 478, 180, 1)}${crest(16, cy, -90, 0.8)}${crest(384, cy, 90, 0.8)}`;
  })();

  // line-art sewing tools (stroke = currentColor)
  const tools = {
    spool: `<rect x="14" y="8" width="36" height="7" rx="2"/><rect x="14" y="49" width="36" height="7" rx="2"/><rect x="19" y="15" width="26" height="34"/><path d="M19 21 L45 27 M19 29 L45 35 M19 37 L45 43 M19 44 L40 49" stroke-dasharray="3 2"/><path d="M45 40 C 56 44 58 54 50 60" />`,
    scissors: `<circle cx="18" cy="48" r="8"/><circle cx="44" cy="50" r="8"/><path d="M23 42 L46 6 M39 44 L16 8"/><circle cx="31" cy="25" r="2" fill="currentColor"/>`,
    needle: `<path d="M12 54 L50 10"/><ellipse cx="47" cy="13.5" rx="1.6" ry="4" transform="rotate(41 47 13.5)"/><path d="M48 12 C 62 20 38 30 52 40 S 40 56 26 58" stroke-dasharray="4 3"/>`,
    thimble: `<path d="M18 54 C 18 30 21 12 32 10 C 43 12 46 30 46 54 Z"/><path d="M16 54 H48"/><path d="M18 46 H46"/><g fill="currentColor" stroke="none"><circle cx="26" cy="22" r="1.4"/><circle cx="32" cy="19" r="1.4"/><circle cx="38" cy="22" r="1.4"/><circle cx="24" cy="30" r="1.4"/><circle cx="30" cy="28" r="1.4"/><circle cx="36" cy="28" r="1.4"/><circle cx="41" cy="31" r="1.4"/><circle cx="25" cy="38" r="1.4"/><circle cx="32" cy="37" r="1.4"/><circle cx="39" cy="38" r="1.4"/></g>`,
    button: `<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="16"/><g fill="currentColor" stroke="none"><circle cx="27" cy="27" r="2.6"/><circle cx="37" cy="27" r="2.6"/><circle cx="27" cy="37" r="2.6"/><circle cx="37" cy="37" r="2.6"/></g><path d="M27 27 L37 37 M37 27 L27 37"/>`,
    pincushion: `<path d="M10 40 C 10 26 20 20 32 20 C 44 20 54 26 54 40 C 54 50 44 54 32 54 C 20 54 10 50 10 40Z"/><path d="M32 20 V54 M20 23 C 16 34 18 48 22 53 M44 23 C 48 34 46 48 42 53"/><path d="M26 22 L20 8 M38 22 L46 10"/><circle cx="19.5" cy="7" r="3" fill="currentColor"/><circle cx="46.5" cy="9" r="3" fill="currentColor"/><path d="M30 14 C 30 10 34 10 34 14 C 34 18 30 18 30 14Z" fill="currentColor"/>`,
    star: `<path d="M32 8 L38 25 L56 25 L41.5 36 L47 54 L32 43 L17 54 L22.5 36 L8 25 L26 25Z"/>`,
    heart: `<path d="M32 54 C 10 40 6 26 12 18 C 18 10 28 12 32 20 C 36 12 46 10 52 18 C 58 26 54 40 32 54Z"/>`,
    search: `<circle cx="27" cy="27" r="15"/><path d="M38 38 L54 54"/>`,
    video: `<rect x="8" y="16" width="38" height="32" rx="4"/><path d="M46 28 L58 20 V44 L46 36Z"/>`,
    page: `<path d="M16 8 H40 L50 18 V56 H16Z"/><path d="M40 8 V18 H50"/><path d="M22 28 H44 M22 36 H44 M22 44 H38" stroke-dasharray="3 2"/>`,
    sparkles: `<path d="M24 10 C 26 22 28 24 40 26 C 28 28 26 30 24 42 C 22 30 20 28 8 26 C 20 24 22 22 24 10Z"/><path d="M46 36 C 47 42 48 43 54 44 C 48 45 47 46 46 52 C 45 46 44 45 38 44 C 44 43 45 42 46 36Z"/>`,
    youtube: `<rect x="8" y="16" width="48" height="32" rx="9"/><path d="M28 25 L40 32 L28 39Z" fill="currentColor"/>`,
    github: `<path d="M32 8 C 18 8 8 18 8 32 C 8 43 15 52 25 55 C 26 55 27 54 27 53 V48 C 20 50 19 45 19 45 C 18 42 16 41 16 41 C 14 40 16 40 16 40 C 18 40 20 42 20 42 C 22 46 26 45 27 44 C 27 43 28 42 28 41 C 22 40 17 38 17 30 C 17 27 18 25 20 23 C 19 22 19 19 20 16 C 20 16 22 15 27 19 C 30 18 34 18 37 19 C 42 15 44 16 44 16 C 45 19 45 22 44 23 C 46 25 47 27 47 30 C 47 38 42 40 36 41 C 37 42 37 44 37 46 V53 C 37 54 38 55 39 55 C 49 52 56 43 56 32 C 56 18 46 8 32 8Z"/>`,
    mail: `<rect x="8" y="16" width="48" height="34" rx="3"/><path d="M8 18 L32 36 L56 18"/>`,
    arrow: `<path d="M12 32 H50 M38 20 L50 32 L38 44"/>`,
    up: `<path d="M32 50 V14 M20 26 L32 14 L44 26"/>`,
  };
  const toolSymbols = Object.entries(tools)
    .map(([k, v]) => `<symbol id="t-${k}" viewBox="0 0 64 64"><g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${v}</g></symbol>`)
    .join("");

  const ribbonStops = Array.from({ length: 19 }, (_, i) => {
    const colors = ["#f6b9c8", "#fde0e7", "#eb9db1", "#fbd3dd", "#e690a7"];
    return `<stop offset="${(i / 18).toFixed(3)}" stop-color="${colors[i % colors.length]}"/>`;
  }).join("");

  const sprite = `
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">
    <defs>
      ${satin("satin-white", "#fffdf6", "#efe4d0", 0)}
      ${satin("satin-pink", "#f2a7b8", "#fcd9e1", 20)}
      ${satin("satin-rose", "#de7b96", "#f3aabd", -20)}
      ${satin("satin-cherry", "#b3122e", "#e0475f", 30)}
      ${satin("satin-green", "#9fb935", "#d6e66c", 0)}
      ${satin("satin-yellow", "#f0c445", "#fbe28a", 45, 1.6)}
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
      <radialGradient id="g-glow">
        <stop offset="0" stop-color="#fff7c8" stop-opacity="1"/><stop offset=".4" stop-color="#f7e27c" stop-opacity=".65"/><stop offset="1" stop-color="#d6e66c" stop-opacity="0"/>
      </radialGradient>
      <filter id="thread" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="4" result="t"/>
        <feDisplacementMap in="SourceGraphic" in2="t" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="d"/>
        <feDropShadow in="d" dx=".5" dy=".9" stdDeviation=".5" flood-color="#3d1f24" flood-opacity=".38"/>
      </filter>
    </defs>
    <symbol id="daisy" viewBox="-50 -50 100 100"><g filter="url(#thread)">${daisy}</g></symbol>
    <symbol id="rose" viewBox="-50 -50 100 100"><g filter="url(#thread)">${rose}</g></symbol>
    <symbol id="bud" viewBox="-50 -50 100 100"><g filter="url(#thread)">${bud}</g></symbol>
    <symbol id="sprig" viewBox="-50 -50 100 100"><g filter="url(#thread)">${sprig}</g></symbol>
    <symbol id="cherries" viewBox="-50 -50 100 100"><g filter="url(#thread)">${cherries}</g></symbol>
    <symbol id="bow" viewBox="0 0 200 160"><g filter="url(#thread)">${bow}</g></symbol>
    <symbol id="sparkle" viewBox="-52 -52 104 104">${sparkle}</symbol>
    <symbol id="paperclip" viewBox="0 0 30 80">${paperclip}</symbol>
    <symbol id="seal" viewBox="-54 -54 108 108">${seal}</symbol>
    <symbol id="lantern" viewBox="0 0 100 150" overflow="visible">${lantern}</symbol>
    <symbol id="play" viewBox="-50 -50 100 100">${playBtn}</symbol>
    <symbol id="sew-button" viewBox="-50 -50 100 100">${sewButton}</symbol>
    <symbol id="oval-frame" viewBox="0 0 400 500" overflow="visible">${ovalFrame}</symbol>
    ${toolSymbols}
  </svg>`;
  document.body.insertAdjacentHTML("afterbegin", sprite);

  /* ------------------------------------------------------------------------
     2. CROSS-STITCH
     data-stitch="text"  → renders the text as cross stitches
       data-rows (letter height in stitches), data-font, data-color, data-cell
     data-motif="heart|cherry|flower|star" → pixel motifs
     ------------------------------------------------------------------------ */
  const MOTIFS = {
    heart: [
      ".rr...rr.",
      "rrrr.rrrr",
      "rwrrrrrrr",
      "rrrrrrrrr",
      ".rrrrrrr.",
      "..rrrrr..",
      "...rrr...",
      "....r....",
    ],
    cherry: [
      "......gGG....",
      ".....g.gGG...",
      "....g...g....",
      "...g.....g...",
      "..g.......g..",
      ".rrr.....rrr.",
      "rrwrr...rrwrr",
      "rwrrr...rwrrr",
      "rrrrr...rrrrr",
      ".rrr.....rrr.",
    ],
    flower: [
      "...p...",
      "..ppp..",
      "p.pyp.p",
      "ppyyypp",
      "p.pyp.p",
      "..ppp..",
      "...p...",
    ],
    star: [
      "r...r...r",
      ".r..r..r.",
      "..r.r.r..",
      "...rrr...",
      "rrrrprrrr",
      "...rrr...",
      "..r.r.r..",
      ".r..r..r.",
      "r...r...r",
    ],
  };
  const PALETTE = {
    r: ["#b3122e", "#e0475f"], w: ["#fffdf8", "#ffffff"], p: ["#de7b96", "#f6c9d3"],
    y: ["#e9b730", "#fbe28a"], g: ["#6f8a1f", "#a9c23a"], G: ["#a9c23a", "#e1ee8f"],
    c: ["#fffdf8", "#ffffff"],
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
          `M${(X + inset).toFixed(1)} ${(Y + inset).toFixed(1)}L${(X + s - inset).toFixed(1)} ${(Y + s - inset).toFixed(1)}` +
          `M${(X + s - inset).toFixed(1)} ${(Y + inset).toFixed(1)}L${(X + inset).toFixed(1)} ${(Y + s - inset).toFixed(1)}`;
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
    const w = Math.ceil(ctx.measureText(text).width) + 4;
    const h = Math.ceil(rows * 1.5);
    canvas.width = w;
    canvas.height = h;
    ctx.font = fontStr;
    ctx.fillStyle = "#000";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(text, 2, Math.round(rows * 1.08));
    const data = ctx.getImageData(0, 0, w, h).data;
    let grid = [];
    for (let y = 0; y < h; y++) {
      let row = "";
      for (let x = 0; x < w; x++) row += data[(y * w + x) * 4 + 3] > 120 ? "r" : ".";
      grid.push(row);
    }
    // trim empty rows / cols
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
      const cell = +el.dataset.cell || 6;
      el.insertAdjacentHTML("beforeend", gridToSVG(grid, cell));
      el.classList.add("xstitch-host");
    });
    document.querySelectorAll("[data-stitch]").forEach((el) => {
      const text = el.dataset.stitch;
      const rows = +el.dataset.rows || 20;
      const cell = +el.dataset.cell || 7;
      const font = el.dataset.font || '700 "Caveat", cursive';
      const color = el.dataset.color ? el.dataset.color.split(",") : null;
      const grid = textToGrid(text, rows, font);
      if (!grid.length) return;
      el.insertAdjacentHTML("beforeend", gridToSVG(grid, cell, color));
      el.classList.add("xstitch-host");
      if (!el.getAttribute("aria-label") && !el.textContent.trim()) el.setAttribute("aria-label", text);
    });
  };

  /* ------------------------------------------------------------------------
     3. EMBROIDERED FLOWER WREATH around [data-bloom]
     ------------------------------------------------------------------------ */
  const renderBloom = () => {
    document.querySelectorAll("[data-bloom]").forEach((layer) => {
      const r = seeded(+layer.dataset.bloom || 3);
      const kinds = ["rose", "daisy", "bud", "sprig", "rose", "daisy", "sprig", "bud"];
      const pts = [];
      // arch outline of the photo in frame-relative coords
      for (let i = 0; i <= 16; i++) {
        const t = Math.PI - (i / 16) * Math.PI;
        pts.push([0.5 + 0.47 * Math.cos(t), 0.4 - 0.376 * Math.sin(t), t]);
      }
      for (let i = 1; i <= 8; i++) {
        const y = 0.4 + (i / 8) * 0.58;
        pts.push([0.03, y, Math.PI]);
        pts.push([0.97, y, 0]);
      }
      for (let i = 1; i < 6; i++) pts.push([0.03 + (i / 6) * 0.94, 0.98, -Math.PI / 2]);
      let html = "";
      pts.forEach(([fx, fy, out], i) => {
        const kind = kinds[Math.floor(r() * kinds.length)];
        const fw = layer.parentElement.offsetWidth || 500;
        const size = fw * (0.12 + r() * 0.11 + (fy > 0.85 ? 0.06 : 0));
        const push = (r() - 0.3) * 0.05;
        const x = fx + Math.cos(out) * push, y = fy - Math.sin(out) * push;
        const lx = ((x + 0.16) / 1.32) * 100, ly = ((y + 0.12) / 1.24) * 100;
        const rot = kind === "sprig" ? (-out * 180) / Math.PI + 90 : r() * 360;
        const sway = (r() > 0.5 ? 1 : -1) * (0.02 + r() * 0.03);
        html += `<svg viewBox="-50 -50 100 100" data-spin="${sway.toFixed(3)}" style="left:${lx.toFixed(2)}%;top:${ly.toFixed(2)}%;width:${size.toFixed(0)}px;height:${size.toFixed(0)}px;margin:${(-size / 2).toFixed(0)}px 0 0 ${(-size / 2).toFixed(0)}px;--base:${rot.toFixed(0)}deg;transform:rotate(calc(var(--base) + var(--spin, 0deg)))"><use href="#${kind}"/></svg>`;
      });
      layer.innerHTML = html;
    });
  };

  /* ------------------------------------------------------------------------
     4. RUNNING-STITCH THREAD down the page margin
     ------------------------------------------------------------------------ */
  let thread = null;
  const buildThread = () => {
    if (!document.body.hasAttribute("data-thread")) return;
    const docH = document.documentElement.scrollHeight;
    if (!thread) {
      const layer = document.createElement("div");
      layer.className = "thread-layer";
      layer.setAttribute("aria-hidden", "true");
      layer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">
          <defs><mask id="thread-mask" maskUnits="userSpaceOnUse"><path class="tm" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round"/></mask></defs>
          <path class="thread-path" mask="url(#thread-mask)"/>
          <g class="thread-needle">
            <path d="M-26 0 L14 0" stroke="url(#g-silver)" stroke-width="3.2" stroke-linecap="round"/>
            <path d="M14 0 L18 0" stroke="#8e8a82" stroke-width="1.6" stroke-linecap="round"/>
            <ellipse cx="-20" cy="0" rx="4" ry="1.2" fill="#fbf4e8"/>
          </g>
        </svg>`;
      document.body.appendChild(layer);
      thread = { layer, path: layer.querySelector(".thread-path"), mask: layer.querySelector(".tm"), needle: layer.querySelector(".thread-needle") };
    }
    thread.layer.style.height = docH + "px";
    let d = "M32 130";
    let y = 130, flip = 1;
    while (y < docH - 120) {
      const step = 260;
      d += ` C ${32 + 26 * flip} ${y + step * 0.3}, ${32 - 26 * flip} ${y + step * 0.7}, 32 ${y + step}`;
      y += step;
      flip *= -1;
    }
    thread.path.setAttribute("d", d);
    thread.mask.setAttribute("d", d);
    thread.len = thread.path.getTotalLength();
    thread.mask.style.strokeDasharray = `${thread.len} ${thread.len}`;
  };

  /* ------------------------------------------------------------------------
     5. RIBBON WAVES (svg paths with [data-ribbon])
     ------------------------------------------------------------------------ */
  const ribbons = [...document.querySelectorAll("[data-ribbon]")].map((p) => ({
    el: p,
    base: +(p.dataset.base || 0.5),
    amp: +(p.dataset.amp || 0.12),
    freq: +(p.dataset.freq || 1.4),
    phase: +(p.dataset.phase || 0),
    dy: +(p.dataset.dy || 0),
    w: +(p.closest("svg").viewBox.baseVal.width || 1440),
    h: +(p.closest("svg").viewBox.baseVal.height || 600),
  }));
  const drawRibbons = (scroll, t) => {
    ribbons.forEach((r) => {
      const ph = r.phase + scroll * 0.0035 + t * 0.00025;
      let d = "";
      const n = 70;
      for (let i = 0; i <= n; i++) {
        const x = -60 + (i / n) * (r.w + 120);
        const k = (x / r.w) * Math.PI * 2 * r.freq;
        const y = r.h * r.base + r.dy + Math.sin(k + ph) * r.h * r.amp + Math.sin(k * 0.5 - ph * 0.6) * r.h * r.amp * 0.4;
        d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
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
    const sign = +m.dataset.marquee || 1;
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
    return { m, track, sign, gw: fill(), fill, pos: 0 };
  });

  /* ------------------------------------------------------------------------
     7. PARALLAX + SCROLL LOOP
     ------------------------------------------------------------------------ */
  const docTop = (el) => {
    let y = 0;
    while (el) { y += el.offsetTop; el = el.offsetParent; }
    return y;
  };
  let parallax = [];
  let spinners = [];
  let hscrolls = [];
  const measure = () => {
    parallax = [...document.querySelectorAll("[data-speed]")].map((el) => ({
      el, speed: +el.dataset.speed, center: docTop(el) + el.offsetHeight / 2,
    }));
    spinners = [...document.querySelectorAll("[data-spin]")].map((el) => ({ el, f: +el.dataset.spin }));
    hscrolls = [...document.querySelectorAll("[data-hscroll]")].map((sec) => {
      const track = sec.querySelector(".hscroll-track");
      const extra = Math.max(0, track.scrollWidth - window.innerWidth);
      sec.style.height = `${window.innerHeight + extra}px`;
      return { sec, track, extra, top: docTop(sec) };
    });
    marquees.forEach((mq) => (mq.gw = mq.fill()));
    buildThread();
  };

  const header = document.querySelector(".site-header");
  const toTop = document.querySelector(".to-top");
  let lastY = window.scrollY, dir = 1, vel = 0, lastT = performance.now();

  const frame = (t) => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const dy = y - lastY;
    const dt = Math.min(64, t - lastT);
    lastT = t;
    if (Math.abs(dy) > 0.5) dir = dy > 0 ? 1 : -1;

    // velocity → sway for polaroids
    vel += (Math.max(-1.2, Math.min(1.2, dy * 0.06)) - vel) * 0.12;
    root.style.setProperty("--vel", vel.toFixed(3));

    // parallax
    for (const p of parallax) {
      const off = (p.center - (y + vh / 2)) * -p.speed;
      p.el.style.setProperty("--py", `${off.toFixed(1)}px`);
    }
    // scroll-linked rotation
    for (const s of spinners) s.el.style.setProperty("--spin", `${(y * s.f).toFixed(2)}deg`);

    // ribbons
    drawRibbons(y, reduceMotion ? 0 : t);

    // marquees: scroll pushes them, idle drift follows last direction
    for (const mq of marquees) {
      mq.pos += mq.sign * (dy * 0.9 + dir * 0.045 * dt);
      const x = -(((mq.pos % mq.gw) + mq.gw) % mq.gw);
      mq.track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    }

    // horizontal gallery
    for (const h of hscrolls) {
      const p = Math.max(0, Math.min(1, (y - h.top) / Math.max(1, h.sec.offsetHeight - vh)));
      h.track.style.transform = `translate3d(${(-p * h.extra).toFixed(1)}px,0,0)`;
    }

    // porch light gets brighter as you scroll
    const glow = 0.3 + 0.7 * Math.min(1, y / (vh * 0.9));
    root.style.setProperty("--glow", glow.toFixed(3));

    // running-stitch thread follows scroll progress; needle faces travel direction
    if (thread && thread.len) {
      const maxY = document.documentElement.scrollHeight - vh;
      const prog = Math.max(0.02, Math.min(1, (y + vh * 0.55) / (maxY + vh * 0.55)));
      const L = thread.len * prog;
      thread.mask.style.strokeDashoffset = `${thread.len - L}`;
      const p1 = thread.path.getPointAtLength(L);
      const p0 = thread.path.getPointAtLength(Math.max(0, L - 2));
      let ang = (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI;
      if (dir < 0) ang += 180;
      thread.needle.setAttribute("transform", `translate(${p1.x.toFixed(1)} ${p1.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    }

    // header tucks away scrolling down, returns scrolling up
    if (header) header.classList.toggle("is-hidden", y > 300 && dir > 0 && !header.contains(document.activeElement));
    if (toTop) toTop.classList.toggle("show", y > vh);

    lastY = y;
    if (!reduceMotion) requestAnimationFrame(frame);
  };

  /* ------------------------------------------------------------------------
     8. REVEAL ON SCROLL
     ------------------------------------------------------------------------ */
  const observeReveals = () => {
    const targets = document.querySelectorAll(".reveal, .xstitch-host");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
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
        const tags = (c.dataset.tags || "").split(/\s+/);
        const okTag = active === "all" || tags.includes(active);
        const okText = !q || c.textContent.toLowerCase().includes(q);
        c.hidden = !(okTag && okText);
        if (!c.hidden) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    };
    buttons.forEach((b) =>
      b.addEventListener("click", () => {
        active = b.dataset.filter;
        buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        apply();
      })
    );
    search?.addEventListener("input", apply);
    // allow linking to guides.html#video etc.
    const hash = location.hash.replace("#", "");
    const fromHash = buttons.find((b) => b.dataset.filter === hash);
    if (fromHash) fromHash.click();
  };

  /* ------------------------------------------------------------------------
     10. click-to-load YouTube (keeps the page light + private until clicked)
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

  // <use> elements default to x=0,y=0; align them to their svg's viewBox so
  // centred viewBoxes like "-50 -50 100 100" draw where you'd expect.
  document.querySelectorAll("svg > use").forEach((u) => {
    const vb = u.ownerSVGElement && u.ownerSVGElement.viewBox.baseVal;
    if (vb && vb.width && !u.hasAttribute("width")) {
      u.setAttribute("x", vb.x); u.setAttribute("y", vb.y);
      u.setAttribute("width", vb.width); u.setAttribute("height", vb.height);
    }
  });

  initFilters();
  initYouTube();

  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => {
    renderStitches();
    observeReveals();
    measure();
    requestAnimationFrame(frame);
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 150);
  });
  window.addEventListener("load", measure);
  if ("ResizeObserver" in window) {
    let roTimer;
    new ResizeObserver(() => {
      clearTimeout(roTimer);
      roTimer = setTimeout(measure, 200);
    }).observe(document.body);
  }
  if (reduceMotion) window.addEventListener("scroll", () => requestAnimationFrame(frame), { passive: true });
})();
