import { Box3, PerspectiveCamera, Vector3 } from 'three';

export function framing(bounds: Box3, aspect: number, direction: Vector3, fov = 38) {
  const center = bounds.getCenter(new Vector3());
  const forward = direction.clone().normalize();
  // Match lookAt's vertical-view adjustment before measuring projected corners.
  if (Math.abs(forward.y) > .9999) forward.z += .001;
  forward.normalize();
  const right = new Vector3(0, 1, 0).cross(forward).normalize();
  const up = forward.clone().cross(right).normalize();
  const tanV = Math.tan(fov * Math.PI / 360), tanH = tanV * Math.max(.1, aspect);
  let distance = 1;
  for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
    const p = new Vector3(x, y, z).sub(center), toward = p.dot(forward);
    distance = Math.max(distance, Math.abs(p.dot(right)) / tanH + toward, Math.abs(p.dot(up)) / tanV + toward);
  }
  distance *= 1.08;
  return { center, distance, position: center.clone().addScaledVector(forward, distance) };
}

export function fit(camera: PerspectiveCamera, bounds: Box3, direction: Vector3) {
  const pose = framing(bounds, camera.aspect, direction, camera.fov);
  camera.position.copy(pose.position); camera.lookAt(pose.center); camera.updateProjectionMatrix();
  return pose.center;
}

/** Where the camera sits relative to its orbit target: the user's current orbit. */
export function orbitDirection(position: Vector3, target: Vector3, fallback: Vector3) {
  const direction = position.clone().sub(target);
  return direction.lengthSq() > 1e-8 ? direction.normalize() : fallback.clone().normalize();
}

/** Widest horizontal angle, from straight ahead (+z), at which the open cylinder still reads as a cut. */
export const CUT_MAX_AZIMUTH = 20 * Math.PI / 180;

/**
 * The cutaway removes the +z half of the liner: looking from -z shows only its closed back, and
 * looking from the side shows it edge-on. In the cut, the orbit keeps its height and distance but
 * swings to within CUT_MAX_AZIMUTH of the front.
 */
export function directionForView(direction: Vector3, cut: boolean) {
  const next = direction.clone();
  if (!cut) return next;
  const radius = Math.hypot(next.x, next.z);
  if (radius < 1e-8) return next;
  const azimuth = Math.atan2(next.x, Math.abs(next.z)), clamped = Math.max(-CUT_MAX_AZIMUTH, Math.min(CUT_MAX_AZIMUTH, azimuth));
  next.x = radius * Math.sin(clamped);next.z = radius * Math.cos(clamped);
  return next;
}

/**
 * New camera position after the viewport aspect changes: same target, same
 * direction, distance scaled by how much the framing needs to change.
 */
export function keepOrbit(position: Vector3, target: Vector3, bounds: Box3, fromAspect: number, toAspect: number, fov = 38) {
  const direction = position.clone().sub(target);
  if (direction.lengthSq() < 1e-8 || !(fromAspect > 0) || !(toAspect > 0)) return position.clone();
  const before = framing(bounds, fromAspect, direction, fov).distance, after = framing(bounds, toAspect, direction, fov).distance;
  return target.clone().addScaledVector(direction, after / before);
}
