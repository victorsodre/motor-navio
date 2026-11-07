import * as T from 'three';
import type {EngineModel} from './model.ts';
import type {EngineSample} from '../simulation/engine.ts';
import {DEMO_X,DIMENSIONS as D} from '../simulation/engine.ts';
import {connect} from './geometry.ts';
export function applyEngine(model:EngineModel,s:EngineSample,cut:boolean){
 model.pistonMoving.position.y=s.pistonY;model.valve.position.y=-s.exhaustLift;
 model.crankRotor.rotation.x=s.radians;model.mainRotor.rotation.x=s.shaftAngle;model.lineRotor.rotation.x=s.propellerAngle;
 connect(model.connectingRod,new T.Vector3(DEMO_X,s.crankY,s.crankX),new T.Vector3(DEMO_X,s.crossheadY,0));
 model.applyCut(cut);model.gas.scale.y=Math.max(.01,D.headY-s.pistonY);model.gas.position.y=(D.headY+s.pistonY)/2;
 model.gasMat.color.set(s.phase==='power'?'#f4b95c':s.phase==='compression'?'#c493d4':'#74c4e4');
 model.dots.forEach((dot,i)=>{
  dot.visible=s.portsOpen;const t=((s.degrees/120+i/18)%1);
  dot.position.set(DEMO_X+Math.sin(i*2.4)*.28,7.2+t*2.4,-.15+Math.cos(i*2.4)*.2);
 });
}
