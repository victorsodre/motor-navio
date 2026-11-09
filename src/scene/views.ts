import { Box3, Vector3 } from 'three';
import { DEMO_X } from '../simulation/engine.ts';
import { LAYOUT as L } from './model.ts';

export type ViewMode = 'whole' | 'cut' | 'scale';

/** World-space limits the camera frames in each view. The propeller hangs past the floor, so its blades dip below y = 0. */
export function viewBounds(mode: ViewMode) {
  if (mode === 'scale') return new Box3(new Vector3(DEMO_X - 1.8, 0, -1), new Vector3(L.personX + 1, L.top, L.personZ + .4));
  // The cut keeps the 1.80 m figure as a size cue and the whole propeller (blades reach about 2.6 m off the shaft), so no edge or toolbar crops it.
  if (mode === 'cut') return new Box3(new Vector3(DEMO_X - 1.3, -.3, -3), new Vector3(L.propellerX + 1, L.top, L.personZ + .4));
  return new Box3(new Vector3(-L.half - 1.2, -.3, -3), new Vector3(L.propellerX + 1, L.top, L.personZ + .4));
}

/** Default orbit for "Reenquadrar": three-quarter view of the whole engine, front view of the cut. */
export const defaultDirection = (mode: ViewMode) => mode === 'whole' ? new Vector3(13, 8, 24) : new Vector3(2, 1.3, 12);

