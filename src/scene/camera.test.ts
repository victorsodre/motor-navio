import test from 'node:test';
import assert from 'node:assert/strict';
import { Box3, PerspectiveCamera, Vector3 } from 'three';
import { CUT_MAX_AZIMUTH, directionForView, fit, framing, keepOrbit, orbitDirection } from './camera.ts';
import { viewBounds, type ViewMode } from './views.ts';
import { createModel } from './model.ts';
import { applyEngine } from './rig.ts';
import { sampleEngine } from '../simulation/engine.ts';

const close = (a: number, b: number, e = 1e-6) => assert.ok(Math.abs(a - b) < e, `${a} != ${b}`);
const inside = (camera: PerspectiveCamera, bounds: Box3) => {
  camera.updateMatrixWorld();
  for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
    const p = new Vector3(x, y, z).project(camera);
    assert.ok(Math.abs(p.x) < 1 && Math.abs(p.y) < 1 && p.z > -1 && p.z < 1);
  }
};

test('enquadramento do motor inteiro, do corte e da escala em horizontal e vertical', () => {
  for (const mode of ['whole', 'cut', 'scale'] as ViewMode[]) for (const aspect of [1920 / 830, 1080 / 1570]) for (const direction of [new Vector3(13, 8, 24), new Vector3(0, 1, 0), new Vector3(-5, 2, -9)]) {
    const camera = new PerspectiveCamera(38, aspect, .1, 400);
    fit(camera, viewBounds(mode), direction);inside(camera, viewBounds(mode));
  }
});

test('a vista inteira contém o modelo todo, da escada à hélice', () => {
  const model = createModel();
  try {
    const view = viewBounds('whole');
    // Every pose of the mechanism stays inside the frame (the floor is wider on purpose).
    for (const angle of [0, 90, 180, 270]) for (const reverse of [false, true]) {
      applyEngine(model, sampleEngine(angle, reverse), false);
      for (const part of model.parts) assert.ok(view.containsBox(new Box3().setFromObject(part.group, true)), `${part.id} ${angle}°`);
    }
  } finally {model.dispose();}
});

test('redimensionar mantém alvo e direção da órbita e só ajusta a distância', () => {
  const bounds = viewBounds('whole'), target = new Vector3(1, 4, 0), position = new Vector3(-20, 9, -14);
  const next = keepOrbit(position, target, bounds, 16 / 9, 9 / 16);
  const before = position.clone().sub(target).normalize(), after = next.clone().sub(target).normalize();
  close(before.angleTo(after), 0);
  close(next.distanceTo(target) / position.distanceTo(target), framing(bounds, 9 / 16, before).distance / framing(bounds, 16 / 9, before).distance);
  assert.ok(next.distanceTo(target) > position.distanceTo(target));
  assert.deepEqual(keepOrbit(position, target, bounds, 1.5, 1.5).toArray().map(v => +v.toFixed(9)), position.toArray());
});

test('trocar de vista conserva a órbita fora do corte; no corte, abre de frente mesmo vindo de lado ou de trás', () => {
  const front = new Vector3(-2, 3, 8), back = new Vector3(-6, 3, -8), side = new Vector3(20, 6, 1), azimuth = (v: Vector3) => Math.abs(Math.atan2(v.x, v.z));
  assert.deepEqual(directionForView(front, true).toArray(), front.toArray());
  assert.deepEqual(directionForView(back, false).toArray(), back.toArray());
  assert.deepEqual(directionForView(side, false).toArray(), side.toArray());
  for (const from of [back, side, new Vector3(13, 8, 24), new Vector3(-9, 2, -.5)]) {
    const next = directionForView(from, true);
    assert.ok(next.z > 0 && azimuth(next) <= CUT_MAX_AZIMUTH + 1e-9, from.toArray().join());
    close(next.y, from.y);close(Math.hypot(next.x, next.z), Math.hypot(from.x, from.z));
  }
  const fallback = new Vector3(0, 0, 1);
  assert.deepEqual(orbitDirection(new Vector3(2, 2, 2), new Vector3(2, 2, 2), fallback).toArray(), [0, 0, 1]);
  close(orbitDirection(new Vector3(3, 0, 4), new Vector3(), fallback).length(), 1);
});

test('o corte enquadra o cilindro aberto, a figura e a hélice inteira em qualquer ângulo', () => {
  const model = createModel();
  try {
    const view = viewBounds('cut'), ids = ['cylinder', 'shaft', 'scale'];
    for (const angle of [0, 90, 180, 270]) {
      applyEngine(model, sampleEngine(angle), true);
      for (const part of model.parts.filter(p => ids.includes(p.id))) assert.ok(view.containsBox(new Box3().setFromObject(part.group, true)), `${part.id} ${angle}°`);
    }
  } finally {model.dispose();}
});
