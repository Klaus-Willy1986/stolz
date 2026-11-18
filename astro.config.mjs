// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://stolz-stoffundholz.de',
  // Vorschau auch über Tailscale erreichbar (Rechnername und *.ts.net)
  server: { allowedHosts: ['adlerhorst', '.ts.net'] },
});
