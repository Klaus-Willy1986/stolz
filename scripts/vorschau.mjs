// Macht aus dem fertigen Build (dist/) eine Vorschau für einen Unterordner,
// z. B. GitHub Pages unter /stolz/. Aufruf: node scripts/vorschau.mjs /stolz
// Setzt außerdem "noindex", damit die Vorschau nicht in Suchmaschinen landet.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const basis = (process.argv[2] || '').replace(/\/$/, '');
const ziele = '_astro/|produkte/|maerkte/|ueber-mich/|kontakt/|danke/|impressum/|datenschutz/|textur/|favicon|senden[.]php';
const pfade = new RegExp(String.raw`(["'\s,(])/(?=${ziele})`, 'g');

async function alle(ordner) {
  const liste = [];
  for (const e of await readdir(ordner, { withFileTypes: true })) {
    const p = join(ordner, e.name);
    if (e.isDirectory()) liste.push(...(await alle(p)));
    else if (/\.(html|css)$/.test(e.name)) liste.push(p);
  }
  return liste;
}

for (const datei of await alle('dist')) {
  let text = await readFile(datei, 'utf8');
  text = text.replace(pfade, `$1${basis}/`).replace(/href="\/"/g, `href="${basis}/"`);
  if (datei.endsWith('.html')) {
    text = text.replace('<head>', '<head><meta name="robots" content="noindex, nofollow">');
  }
  await writeFile(datei, text);
}
console.log(`Vorschau vorbereitet für ${basis || '/'}`);
