import type { LabVideo } from '../kit/VideoSection.tsx';

const SITE = 'https://victorsodre.github.io/motor-navio/';

/** Same rule as the kit's currentVideo, without React: used at build time for index.html. */
export function activeVideo(video: LabVideo, now: Date) {
  if (video.next && now >= new Date(video.next.from)) return { ...video.next };
  return { ...video, thumbnail: './video-thumbnail.jpg' };
}

const escapeJson = (value: string) => value.replace(/</g, '\\u003c');

/** schema.org VideoObject for the video shown on the page. */
export function videoJsonLd(video: LabVideo, facts: Record<string, { uploadDate: string; description: string }>, now: Date) {
  const current = activeVideo(video, now);
  const fact = facts[current.id];
  if (!fact) throw new Error(`Dados do vídeo ausentes para ${current.id}`);
  const [minutes, seconds] = current.duration.split(':').map(Number);
  return escapeJson(JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: current.title,
    description: fact.description,
    thumbnailUrl: new URL(current.thumbnail, SITE).href,
    uploadDate: fact.uploadDate,
    duration: `PT${minutes}M${seconds}S`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${current.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${current.id}`,
    inLanguage: 'pt-BR',
  }));
}
