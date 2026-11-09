/**
 * MAN B&W 7S80ME-C8, o motor do primeiro navio da série do EP341.
 * Documentados (fontes em content/project.ts): 7 cilindros, diâmetro 0,80 m,
 * curso 3,20 m, 29.260 kW a 78 rpm; distância entre cilindros e comprimento A
 * vêm da ficha do irmão S80MC-C8 (mesmo diâmetro e curso, comando por came).
 * Biela, haste, alturas e posição das janelas são esquemáticas.
 */
export const DIMENSIONS = {
  cylinders: 7, bore: .8, stroke: 3.2, pitch: 1.424, length: 12.653,
  rod: 3.7, pistonRod: 3.9, crankY: 2.4, portTop: 8.9, headY: 11.85, human: 1.8,
} as const;
/** Rotação máxima documentada (ponto L1). */
export const REAL_RPM = 78;
/** Na velocidade didática 1×, o virabrequim gira 90° por segundo. */
export const DIDACTIC_DEGREES_PER_SECOND = 90;
export const DIDACTIC_RPM = DIDACTIC_DEGREES_PER_SECOND / 6;
/** Fator que leva a velocidade didática à rotação real. */
export const REAL_SPEED = REAL_RPM / DIDACTIC_RPM;
export const SPEEDS = [.5, 1, 2, REAL_SPEED] as const;
/** O cilindro em corte é o último, do lado da hélice. */
export const DEMO_X = (DIMENSIONS.cylinders - 1) / 2 * DIMENSIONS.pitch;
export const cylinderX = (index: number) => (index - (DIMENSIONS.cylinders - 1) / 2) * DIMENSIONS.pitch;

export const normalizedAngle = (angle: number) => Number.isFinite(angle) ? ((angle % 360) + 360) % 360 : 0;

/**
 * `angle` é o avanço no ciclo (0° = ponto morto superior). Em ré o virabrequim
 * gira ao contrário e o comando eletrônico espelha o tempo das válvulas, então
 * a sequência de etapas é a mesma e só o sentido da rotação muda.
 */
export function sampleEngine(angle: number, reverse = false) {
  const degrees = normalizedAngle(angle), cycle = degrees * Math.PI / 180, r = DIMENSIONS.stroke / 2;
  const radians = reverse ? -cycle : cycle;
  const crankX = r * Math.sin(radians), crankY = DIMENSIONS.crankY + r * Math.cos(radians);
  const crossheadY = crankY + Math.sqrt(DIMENSIONS.rod ** 2 - crankX ** 2), pistonY = crossheadY + DIMENSIONS.pistonRod;
  const portsOpen = pistonY < DIMENSIONS.portTop;
  const exhaustLift = degrees > 95 && degrees < 265 ? Math.sin((degrees - 95) / 170 * Math.PI) ** .6 * .32 : 0;
  const phase = portsOpen ? 'scavenge' : degrees < 95 ? 'power' : degrees < 265 ? 'exhaust' : 'compression';
  return { degrees, radians, crankX, crankY, crossheadY, pistonY, portsOpen, exhaustLift, phase, shaftAngle: radians, propellerAngle: radians };
}
export type EngineSample = ReturnType<typeof sampleEngine>;

export function advanceAngle(angle: number, dt: number, speed: number, playing: boolean, visible: boolean) {
  if (!playing || !visible) return normalizedAngle(angle);
  const step = Math.max(0, Math.min(.1, Number.isFinite(dt) ? dt : 0));
  const factor = Math.max(SPEEDS[0], Math.min(REAL_SPEED, Number.isFinite(speed) ? speed : 1));
  return normalizedAngle(normalizedAngle(angle) + step * DIDACTIC_DEGREES_PER_SECOND * factor);
}

/** Número em pt-BR com casas fixas (3,20; 0,80; 1,80). */
export const metres = (value: number, digits = 2) => value.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
