import type { LabVideo } from '../kit/VideoSection.tsx';

// Até o Short do motor (EP341) ir ao ar, o vídeo do canal é o de flutuação (EP106), com contexto honesto.
export const video: LabVideo = {
  id: 'SoQtd_t-MUk',
  title: 'Por que um navio de aço não afunda? (e por que ele vira)',
  context: 'Este vídeo é sobre o casco: por que o aço flutua e quando o navio vira. Ele não explica o motor; o motor do navio do minério está no Reel do Instagram.',
  related: true,
  format: 'landscape',
  duration: '12:59',
  reel: 'DfVTXkqEmNA',
  reelLabel: 'Ver no Instagram: o motor do navio do minério',
  next: {
    from: '2026-11-17T19:00:00Z',
    id: 'zPVEOAuuBUg',
    title: 'Como funciona o motor do navio que leva o minério do Brasil pra China? (ele não tem câmbio)',
    context: 'O Short que deu origem ao experimento: hélice de 10 m, 78 voltas por minuto, sete cilindros de dois tempos e a ré sem marcha.',
    related: false,
    format: 'portrait',
    duration: '0:49',
    thumbnail: './video-next.jpg',
  },
};

/** Dados do YouTube para o VideoObject (data de publicação e resumo do próprio vídeo). */
export const videoFacts: Record<string, { uploadDate: string; description: string }> = {
  'SoQtd_t-MUk': { uploadDate: '2026-10-14T23:00:08Z', description: 'Por que um navio de aço boia: ele empurra água para fora do lugar até a água devolver um empurrão igual ao peso dele. E por que ele vira quando o peso fica alto demais.' },
  'zPVEOAuuBUg': { uploadDate: '2026-11-17T19:00:00Z', description: 'Como funciona o motor de dois tempos e sete cilindros do navio que leva minério do Brasil à China: sem câmbio, ligado direto à hélice de 10 m, a no máximo 78 rpm.' },
};
