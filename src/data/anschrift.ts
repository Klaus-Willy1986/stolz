// Die echte Anschrift liegt in anschrift.lokal.json. Die Datei wird nicht ins
// Git-Repository aufgenommen; fehlt sie (öffentliche Vorschau), erscheint ein Platzhalter.
const dateien = import.meta.glob('./anschrift.lokal.json', { eager: true, import: 'default' });
const lokal = Object.values(dateien)[0] as { strasse: string; ort: string } | undefined;
export const anschrift = lokal ?? { strasse: 'Musterstraße 1', ort: '12345 Musterstadt' };
