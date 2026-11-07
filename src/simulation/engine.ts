export const DIMENSIONS = { bore:.96, stroke:2.5, length:25.914, rod:2.9, pistonRod:3.1, crankY:2.2, portTop:7.45, headY:9.7, human:1.8 } as const;
export const DEMO_X=10.92;
export const normalizedAngle=(angle:number)=>Number.isFinite(angle)?((angle%360)+360)%360:0;
export function sampleEngine(angle:number){
 const degrees=normalizedAngle(angle),radians=degrees*Math.PI/180,r=DIMENSIONS.stroke/2;
 const crankX=r*Math.sin(radians),crankY=DIMENSIONS.crankY+r*Math.cos(radians);
 const crossheadY=crankY+Math.sqrt(DIMENSIONS.rod**2-crankX**2),pistonY=crossheadY+DIMENSIONS.pistonRod;
 const portsOpen=pistonY<DIMENSIONS.portTop;
 const exhaustLift=degrees>95&&degrees<265?Math.sin((degrees-95)/170*Math.PI)**.6*.32:0;
 const phase=portsOpen?'scavenge':degrees<95?'power':degrees<265?'exhaust':'compression';
 return {degrees,radians,crankX,crankY,crossheadY,pistonY,portsOpen,exhaustLift,phase,shaftAngle:radians,propellerAngle:radians};
}
export type EngineSample=ReturnType<typeof sampleEngine>;
export function advanceAngle(angle:number,dt:number,speed:number,playing:boolean,visible:boolean){
 if(!playing||!visible)return normalizedAngle(angle);
 return normalizedAngle(normalizedAngle(angle)+Math.max(0,Math.min(.1,Number.isFinite(dt)?dt:0))*90*Math.max(.5,Math.min(2,Number.isFinite(speed)?speed:1)));
}
