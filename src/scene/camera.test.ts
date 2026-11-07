import test from 'node:test';
import assert from 'node:assert/strict';
import { Box3, PerspectiveCamera, Vector3 } from 'three';
import { fit } from './camera.ts';

test('enquadramento do conjunto de 35 m, corte e escala em horizontal e vertical', () => {
  const limits = [new Box3(new Vector3(-13,0,-3),new Vector3(22,11.4,3.5)),new Box3(new Vector3(9.6,0,-1),new Vector3(12,11.3,1)),new Box3(new Vector3(8.9,0,-1),new Vector3(14,11.3,4))];
  for(const bounds of limits) for(const aspect of [1920/830,1080/1570]) for(const direction of [new Vector3(13,8,24),new Vector3(0,1,0)]) {
    const camera=new PerspectiveCamera(38,aspect,.1,400);
    fit(camera,bounds,direction);camera.updateMatrixWorld();
    for(const x of [bounds.min.x,bounds.max.x]) for(const y of [bounds.min.y,bounds.max.y]) for(const z of [bounds.min.z,bounds.max.z]) {
      const p=new Vector3(x,y,z).project(camera);
      assert.ok(Math.abs(p.x)<1 && Math.abs(p.y)<1 && p.z>-1 && p.z<1);
    }
  }
});
