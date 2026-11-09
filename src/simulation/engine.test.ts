import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleEngine, advanceAngle, DIMENSIONS, DEMO_X, cylinderX, DIDACTIC_RPM, REAL_RPM, REAL_SPEED, SPEEDS, metres } from './engine.ts';
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('curso da ficha, cruzeta vertical e biela com comprimento constante',()=>{
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
test('motor do EP341: 7 cilindros, curso de 3,20 m e cilindro em corte no último vão',()=>{
 assert.equal(DIMENSIONS.cylinders,7);close(DIMENSIONS.stroke,3.2);close(DIMENSIONS.bore,.8);
 close(DEMO_X,cylinderX(DIMENSIONS.cylinders-1));assert.ok(DEMO_X+DIMENSIONS.pitch/2<=DIMENSIONS.length/2);
 close(sampleEngine(0).pistonY,sampleEngine(0,true).pistonY);assert.ok(sampleEngine(0).pistonY<DIMENSIONS.headY);
});
test('ré: mesmas etapas e curso, manivela espelhada e eixo girando ao contrário',()=>{
 for(let a=0;a<360;a+=5){
  const ahead=sampleEngine(a),back=sampleEngine(a,true);
  assert.equal(back.phase,ahead.phase);assert.equal(back.portsOpen,ahead.portsOpen);close(back.exhaustLift,ahead.exhaustLift);
  close(back.pistonY,ahead.pistonY);close(back.crankX,-ahead.crankX);close(back.shaftAngle,-ahead.shaftAngle);close(back.propellerAngle,back.shaftAngle);
  close(Math.hypot(back.crankX,back.crossheadY-back.crankY),DIMENSIONS.rod);
 }
});
test('velocidade real: 78 rpm = 468° por segundo; didática 1× = 15 rpm',()=>{
 close(DIDACTIC_RPM,15);close(REAL_SPEED*DIDACTIC_RPM,REAL_RPM);assert.ok(SPEEDS.includes(REAL_SPEED));
 close(advanceAngle(0,.1,REAL_SPEED,true,true),46.8);close(advanceAngle(0,.1,99,true,true),46.8);close(advanceAngle(0,.1,.1,true,true),4.5);
 assert.equal(metres(3.2),'3,20');assert.equal(metres(12.653,1),'12,7');
});
