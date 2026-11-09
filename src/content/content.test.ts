import test from 'node:test';
import assert from 'node:assert/strict';
import { captureText, project, ENGINE, GUIDE, PROPULSION } from './project.ts';
import { catalog } from './catalog.ts';
import { video, videoFacts } from './video.ts';
import { activeVideo, videoJsonLd } from './video-meta.ts';

test('textos do PNG e do catálogo saem das mesmas medidas do modelo', () => {
  assert.equal(captureText.footer, 'Motor de navio · 7 cilindros · Esquema educativo');
  assert.match(captureText.scale, /^Curso: 3,20 m · Figura: 1,80 m/);
  assert.match(catalog.find(p => p.id === 'piston')!.detail, /3,20 m/);
  const all = JSON.stringify({ project, catalog, captureText });
  for (const stale of ['RT-flex96C', '14 cilindros', '2,50', '0,96']) assert.ok(!all.includes(stale), stale);
});

test('textos de destaque sem nome de navio, fabricante ou designação do motor; só as fontes os citam', () => {
  const highlight = JSON.stringify({ intro: project.intro, catalog: catalog.map(({ label, detail, note }) => ({ label, detail, note })), captureText });
  for (const name of [ENGINE, 'S80', 'MAN', 'Ore Brasil', 'Valemax', 'Vale']) assert.ok(!highlight.includes(name), name);
  assert.ok(project.sources.some(source => source.detail.includes(ENGINE)));
});

test('o comando eletrônico do cilindro cita a fonte MAN do motor ME, não a ficha do MC-C8', () => {
  const cylinder = catalog.find(p => p.id === 'cylinder')!;
  assert.match(cylinder.note, /comando eletrônico/);
  const electronic = cylinder.sources.find(source => /comando eletrônico/.test(source.label));
  assert.equal(electronic?.url, PROPULSION);
  assert.ok(cylinder.sources.some(source => source.url === GUIDE && /diâmetro/.test(source.label)));
});

test('troca agendada: EP106 até 17/11 19h UTC, depois o Short do EP341 em retrato', () => {
  assert.equal(activeVideo(video, new Date('2026-11-17T18:59:59Z')).id, 'SoQtd_t-MUk');
  const next = activeVideo(video, new Date('2026-11-17T17:00:00Z'));
  assert.equal(next.id, 'zPVEOAuuBUg');assert.equal(next.format, 'portrait');assert.equal(next.related, false);
  assert.equal(next.duration, '0:49');assert.equal(next.thumbnail, './video-next.jpg');
});

test('VideoObject acompanha o vídeo vigente, com data e duração ISO', () => {
  const before = JSON.parse(videoJsonLd(video, videoFacts, new Date('2026-11-10T00:00:00Z')));
  assert.equal(before['@type'], 'VideoObject');assert.equal(before.duration, 'PT12M59S');
  assert.equal(before.thumbnailUrl, 'https://victorsodre.github.io/motor-navio/video-thumbnail.jpg');
  const after = JSON.parse(videoJsonLd(video, videoFacts, new Date('2026-11-18T00:00:00Z')));
  assert.equal(after.contentUrl, 'https://www.youtube.com/watch?v=zPVEOAuuBUg');assert.equal(after.duration, 'PT0M49S');
  assert.equal(after.uploadDate, '2026-11-17T17:00:00Z');
  assert.throws(() => videoJsonLd(video, {}, new Date()));
});
