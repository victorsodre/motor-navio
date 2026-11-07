import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createModel} from './model.ts';import {applyEngine} from './rig.ts';import {sampleEngine,DIMENSIONS as D,DEMO_X} from '../simulation/engine.ts';
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
test('rig conecta manivela à cruzeta e preserva escala e rotação do eixo',()=>{
 const m=createModel();try{
  assert.equal(m.parts.length,6);assert.equal(new Set(m.parts.map(p=>p.id)).size,6);
  for(let a=0;a<=360;a+=15){const s=sampleEngine(a);applyEngine(m,s,true);m.root.updateMatrixWorld(true);
   const lower=m.connectingRod.localToWorld(new T.Vector3(0,-.5,0)),upper=m.connectingRod.localToWorld(new T.Vector3(0,.5,0));
   close(lower.x,DEMO_X);close(lower.y,s.crankY);close(lower.z,s.crankX);close(upper.y,s.crossheadY);close(upper.z,0);
   close(m.pistonMoving.position.y,s.pistonY);close(m.lineRotor.rotation.x,m.crankRotor.rotation.x);assert.deepEqual(m.root.scale.toArray(),[1,1,1]);
  }
  const personBounds=new T.Box3().setFromObject(m.person);close(personBounds.max.y-personBounds.min.y,D.human);
 }finally{m.dispose();}
});
test('abrir e fechar o cilindro não acumula transformações nem altera ângulo',()=>{
 const m=createModel();try{
  const pose=()=>{m.root.updateMatrixWorld(true);return [m.pistonMoving,m.crankRotor,m.mainRotor,m.lineRotor,m.valve,m.connectingRod].flatMap(o=>o.matrixWorld.toArray());};
  applyEngine(m,sampleEngine(180),false);const initial=pose();for(let i=0;i<8;i++){applyEngine(m,sampleEngine(100),true);applyEngine(m,sampleEngine(180),false);}assert.deepEqual(pose(),initial);
 }finally{m.dispose();}
});
