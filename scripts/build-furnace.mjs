// Salin tungku-induksi-dark.html ke public/ sebagai animasi otomatis tanpa tombol.
// Pakai: node scripts/build-furnace.mjs [path ke tungku-induksi-dark.html]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const src = process.argv[2] ?? "C:/Users/El/Documents/furnace-machine/tungku-induksi-dark.html";
let html = readFileSync(src, "utf8");

function swap(from, to) {
  const n = html.split(from).length - 1;
  if (n !== 1) throw new Error(`expected 1 match, got ${n}: ${String(from).slice(0, 60)}`);
  html = html.replace(from, () => to);
}

// Tombol dihapus, diganti urutan otomatis.
swap(/<div class="fz-controls">[\s\S]*?<\/div>(?=<\/div><\/figure>)/, "");
swap(' tabindex="0" aria-label="Tungku induksi. L buka/tutup robuta, C charging, T tapping."', ' aria-label="Medium furnace: charging, heating up, tapping berulang otomatis."');
swap('data-corner="title">Tungku induksi frekuensi menengah<', 'data-corner="title">Medium furnace<');
// Caption hanya tiga fase: charging, heating up, tapping.
swap(/  if \(note\) state = note;[\s\S]*?else state = `melebur[^\n]*\n/, `  if (charge || S.kg < 20) state = "charging";
  else if (pouring || tilt > 0.5) state = \`tapping \${taps}/2 · miring \${tilt.toFixed(0)}° · ladle \${Math.round(ladleKg)} kg\`;
  else if (swapClock >= 0) state = \`tapping \${taps}/2 · ganti ladle\`;
  else if (S.t >= M.tTap - 30) state = \`tapping \${taps}/2\`;
  else state = "heating up";
`);
swap(/\/\/ ---------- Tombol ----------[\s\S]*?(?=\/\/ ---------- Shader ----------)/, `// ---------- Otomatis: charging → melebur → tapping 2x, berulang ----------
const busy = () => pouring || tilt > 0.5 || charge;
let wait = 1.5;
function auto(dt) {
  if (busy()) return;
  if (wait > 0) { wait -= dt; return; }
  if (S.kg < 20) { powerTarget = 0; lidTarget = 1; charge = { stage: 0, clock: 0 }; }
  else if (melted() && S.t >= M.tTap - 30 && swapClock < 0 && ladleKg <= 1) { pouring = true; taps += 1; wait = 1.5; }
}

`);
// Melebur: robuta terbuka setengah supaya cairan tetap terlihat (tapping tetap menutup robuta).
swap("charge.clock > 1.2) { lidTarget = 0;", "charge.clock > 1.2) { lidTarget = 0.5;");
swap("const speed = tilt > 1 ? 3 : 90;", "const speed = tilt > 1 ? 8 : 90;"); // tapping lebih cepat untuk loop dasbor
swap(/  ctl\.lid\.setAttribute[\s\S]*?ctl\.charge\.setAttribute\([^\n]*\n/, "");
swap("  sequence(dt);\n", "  auto(dt);\n  sequence(dt);\n");

// Menyatu dengan Card aplikasi.
swap('</head><body class="iso" data-theme="dark">', `<style>
.iso[data-theme="dark"]{--anatomy-page:transparent;--anatomy-card:#0A0C10}
body{background:transparent;overflow:hidden}
.iso-page{width:100%;margin:0}
.iso-figure{margin:0}
.iso-plate{padding:30px 8px 26px;box-shadow:none}
.iso-plate-corners{inset:12px 14px}
</style></head><body class="iso" data-theme="dark">`);

mkdirSync("public/furnace", { recursive: true });
writeFileSync("public/furnace/tungku.html", html);
console.log("public/furnace/tungku.html", html.length);
