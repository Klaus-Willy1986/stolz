// Alle Fotos aus src/assets/fotos, ansprechbar über den Dateinamen ohne Endung.
import type { ImageMetadata } from 'astro';
const dateien = import.meta.glob<ImageMetadata>('../assets/fotos/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });
export const fotos: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(dateien).map(([pfad, bild]) => [pfad.split('/').pop()!.replace(/\.\w+$/, ''), bild]),
);
