import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleEngine, advanceAngle, DIMENSIONS } from './engine.ts';
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('curso de 2,5 m, cruzeta vertical e biela com comprimento constante',()=>{
 close(sampleEngine(0).pistonY-sampleEngine(180).pistonY,DIMENSIONS.stroke);
 for(let angle=0;angle<=360;angle+=2){const s=sampleEngine(angle);close(Math.hypot(s.crankX,s.crossheadY-s.crankY),DIMENSIONS.rod);close(s.pistonY-s.crossheadY,DIMENSIONS.pistonRod);assert.ok(Number.isFinite(s.pistonY));}
});
test('ciclo de uma volta e linha de eixo diretamente acoplada',()=>{
 for(const a of [0,90,140,180,220,280,359]){const s=sampleEngine(a);assert.deepEqual(sampleEngine(a+360),s);close(s.shaftAngle,s.radians);close(s.propellerAngle,s.radians);}
 assert.equal(sampleEngine(90).phase,'power');assert.equal(sampleEngine(100).phase,'exhaust');assert.equal(sampleEngine(180).phase,'scavenge');assert.equal(sampleEngine(300).phase,'compression');
});
test('janelas descobertas pelo pistão e escape aberto durante lavagem',()=>{
 for(let a=0;a<360;a++){const s=sampleEngine(a);assert.equal(s.portsOpen,s.pistonY<DIMENSIONS.portTop);if(s.portsOpen)assert.ok(s.exhaustLift>0);}
 assert.equal(sampleEngine(0).exhaustLift,0);assert.equal(sampleEngine(300).exhaustLift,0);assert.equal(sampleEngine(180).portsOpen,true);
});
test('relógio limitado, pausa, aba oculta e entradas inválidas',()=>{
 close(advanceAngle(90,1,1,true,true),99);close(advanceAngle(90,.1,2,true,true),108);
 close(advanceAngle(90,1,1,false,true),90);close(advanceAngle(90,1,1,true,false),90);
 for(const v of [NaN,Infinity,-Infinity]){assert.ok(Number.isFinite(sampleEngine(v).pistonY));assert.ok(Number.isFinite(advanceAngle(v,v,v,true,true)));}
 close(advanceAngle(0,-1,1,true,true),0);
});
