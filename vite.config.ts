import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { videoFacts, video } from './src/content/video.ts';
import { activeVideo, videoJsonLd } from './src/content/video-meta.ts';

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Writes the current video into index.html (structured data and no-JS link) at build time. */
function videoMeta(): Plugin {
  return {
    name: 'video-meta',
    transformIndexHtml(html) {
      const now = new Date(), current = activeVideo(video, now);
      return html
        .replace('<!--video-ld-->', `<script type="application/ld+json">${videoJsonLd(video, videoFacts, now)}</script>`)
        .replace('<!--video-link-->', `<a href="https://www.youtube.com/watch?v=${current.id}">${escapeHtml(current.title)}</a>`);
    },
  };
}

export default defineConfig({ plugins: [react(), videoMeta()], base: './', server: { host: '127.0.0.1', port: 4311 } });
