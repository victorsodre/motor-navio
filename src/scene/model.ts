import * as T from 'three';
import {box,mesh,rod,connect,mergeStatic,disposeTree} from './geometry.ts';
import {catalog} from '../content/catalog.ts';
import {DEMO_X,DIMENSIONS as D,cylinderX as cylinderAt} from '../simulation/engine.ts';

const mat=(color:string,metalness=.5,roughness=.4)=>new T.MeshStandardMaterial({color,metalness,roughness});
function cylinderX(parent:T.Object3D,r:number,len:number,m:T.Material,x:number,y:number,z=0){const o=mesh(parent,new T.CylinderGeometry(r,r,len,24),m,x,y,z);o.rotation.z=Math.PI/2;return o;}
function pipe(parent:T.Object3D,points:T.Vector3[],radius:number,m:T.Material){return mesh(parent,new T.TubeGeometry(new T.CatmullRomCurve3(points),20,radius,10,false),m);}

/** Derived layout, in metres. Only bore, stroke, pitch and length come from the data sheet. */
export const LAYOUT=(()=>{
 const half=D.length/2,width=3.8,frameTop=8.1,deck=4.05;
 const shaftStart=DEMO_X+2,propellerX=half+7.6;
 return {half,width,deck,frameTop,walkways:[deck+.1,frameTop+.1,D.headY-.3],walkwayZ:width/2+.1,
  exhaustY:D.headY+.95,shaftStart,propellerX,personX:DEMO_X+.7,personZ:width/2+1.4,
  bayStart:DEMO_X-D.pitch/2,top:D.headY+1.6};
})();

export function createModel(){
 const L=LAYOUT;
 const root=new T.Group(),parts=catalog.map(p=>{const group=new T.Group();group.name=p.id;group.userData.partId=p.id;root.add(group);return {...p,group};});
 const group=(id:string)=>parts.find(p=>p.id===id)!.group;
 const structure=group('structure'),cylinder=group('cylinder'),piston=group('piston'),crank=group('crank'),shaft=group('shaft'),scale=group('scale');
 const green=mat('#517a71',.5,.5),pale=mat('#879d95',.4,.5),dark=mat('#263d42',.55,.5),silver=mat('#bcc9cc',.8,.28),steel=mat('#596d79',.75,.3),bronze=mat('#c78d43',.72,.3),yellow=mat('#e5bc38',.3,.5);
 const r=D.stroke/2,bayEnd=L.half,bay=bayEnd-L.bayStart,rest=L.bayStart+L.half;
 const restX=(L.bayStart-L.half)/2,bayX=(L.bayStart+bayEnd)/2;
 box(structure,[D.length,.5,L.width+.4],[0,.25,0],dark,.12);
 // The aft bay (demo cylinder) is a separate group so the cut can remove its covers.
 const demoCovers=new T.Group();structure.add(demoCovers);
 box(structure,[rest,.22,L.width-.4],[restX,L.deck,0],green,.06);box(demoCovers,[bay,.22,L.width-.4],[bayX,L.deck,0],green,.06);
 for(let i=0;i<D.cylinders;i++){
  const x=cylinderAt(i),isDemo=i===D.cylinders-1,target=isDemo?demoCovers:structure;
  // A-shaped main frame. The removable aft bay reveals the crosshead and crank.
  for(const z of [-1.4,1.4]){box(target,[1.2,3.5,.15],[x,2.25,z],green,.04);box(target,[1.02,3.9,.18],[x,6.05,z*.72],green,.04);}
  box(target,[1.3,.25,2.4],[x,L.frameTop,0],green,.05);
  if(!isDemo){
   const height=D.headY-L.frameTop;
   mesh(structure,new T.CylinderGeometry(.6,.6,height,24),green,x,L.frameTop+height/2);
   mesh(structure,new T.CylinderGeometry(.63,.63,.25,24),silver,x,D.headY+.02);
   mesh(structure,new T.CylinderGeometry(.2,.2,.85,16),steel,x,D.headY+.5);
  }
  for(const z of [-1.4,1.4]){box(target,[.8,.8,.08],[x,2.1,z*1.04],dark,.03);for(const dx of [-.3,.3])box(target,[.06,.12,.08],[x+dx,2.1,z*1.08],silver);}
 }
 for(const y of L.walkways){
  for(const z of [-L.walkwayZ,L.walkwayZ]){
   box(structure,[rest,.13,1],[restX,y,z],dark,.025);box(demoCovers,[bay,.13,1],[bayX,y,z],dark,.025);
   const railZ=z+Math.sign(z)*.42;
   for(const railY of [.55,1.05]){cylinderX(structure,.035,rest,yellow,restX,y+railY,railZ);cylinderX(demoCovers,.035,bay,yellow,bayX,y+railY,railZ);}
   for(let x=-L.half+.15;x<=L.half;x+=1.42)mesh(x>L.bayStart?demoCovers:structure,new T.CylinderGeometry(.028,.028,1.05,6),yellow,x,y+.525,railZ);
  }
 }
 // Fore-end stair: gives a human-sized step without blocking the aft cutaway bay.
 for(const y of L.walkways.slice(0,2))for(let k=0;k<13;k++)box(structure,[.75,.06,.2],[-L.half+.4,y+k*.3,-1.5-k*.11],steel,.01);
 cylinderX(structure,.42,D.length-.6,pale,0,L.exhaustY,-.7);
 cylinderX(structure,.42,D.length-.6,green,0,8.65,-1.3);
 for(const x of [-3,2.2]){mesh(structure,new T.SphereGeometry(.75,16,12),dark,x,L.exhaustY-.15,-1.6);cylinderX(structure,.44,.9,silver,x,L.exhaustY-.15,-2.1);}
 mergeStatic(structure);mergeStatic(demoCovers);
 // Ported liner: physical openings below the solid upper wall.
 const linerMat=silver.clone();linerMat.side=T.DoubleSide;const plane=new T.Plane(new T.Vector3(0,0,-1),0);
 const liner=new T.Group();cylinder.add(liner);liner.position.x=DEMO_X;
 const linerR=D.bore/2+.05,solid=D.headY-.05-D.portTop,portBand=.5;
 mesh(liner,new T.CylinderGeometry(linerR,linerR,solid,48,1,true),linerMat,0,D.portTop+solid/2);
 mesh(liner,new T.CylinderGeometry(linerR,linerR,.3,48,1,true),linerMat,0,D.portTop-portBand-.15);
 for(let i=0;i<12;i++)mesh(liner,new T.CylinderGeometry(linerR,linerR,portBand,3,1,true,i/12*Math.PI*2,.17),linerMat,0,D.portTop-portBand/2);
 const head=mesh(liner,new T.CylinderGeometry(.6,.6,.2,48),green,0,D.headY+.1);
 head.material=green.clone();
 const valve=new T.Group();cylinder.add(valve);valve.position.x=DEMO_X;
 mesh(valve,new T.CylinderGeometry(.2,.18,.07,24),steel,0,D.headY-.04);mesh(valve,new T.CylinderGeometry(.045,.045,.85,12),silver,0,D.headY+.4);
 mesh(cylinder,new T.CylinderGeometry(.22,.22,.6,20),dark,DEMO_X,D.headY+.72);
 for(const z of [-.27,.27])mesh(cylinder,new T.CylinderGeometry(.05,.05,.5,10),bronze,DEMO_X+.25,D.headY+.25,z);
 pipe(cylinder,[new T.Vector3(DEMO_X,D.headY+.4,-.15),new T.Vector3(DEMO_X,L.exhaustY+.05,-.3),new T.Vector3(DEMO_X,L.exhaustY,-.7)],.15,steel);
 // Piston crown + straight rod + crosshead. Y positions set by the rig.
 const pistonMoving=new T.Group();piston.add(pistonMoving);pistonMoving.position.x=DEMO_X;
 const crownR=D.bore/2-.01;
 mesh(pistonMoving,new T.CylinderGeometry(crownR,crownR,.34,48),silver,0,-.17);
 for(const y of [-.08,-.15,-.24]){const ring=mesh(pistonMoving,new T.TorusGeometry(crownR+.001,.015,6,48),steel,0,y);ring.rotation.x=Math.PI/2;}
 mesh(pistonMoving,new T.CylinderGeometry(.09,.09,D.pistonRod-.17,16),silver,0,-(D.pistonRod+.17)/2);
 cylinderX(pistonMoving,.18,1,bronze,0,-D.pistonRod);
 for(const x of [-.5,.5])box(pistonMoving,[.2,.34,.48],[x,-D.pistonRod,0],bronze,.03);
 mergeStatic(pistonMoving);
 // Crosshead guides cover the full crosshead travel (crank radius above and below the mid point).
 const guideY=D.crankY+D.rod;
 for(const x of [DEMO_X-.62,DEMO_X+.62])box(piston,[.12,D.stroke+.4,.55],[x,guideY,0],steel,.02);
 const connectingRod=rod(crank,.13,steel),crankRotor=new T.Group();crank.add(crankRotor);crankRotor.position.set(DEMO_X,D.crankY,0);
 for(const x of [-.38,.38]){box(crankRotor,[.18,r,.45],[x,r/2,0],steel,.09);cylinderX(crankRotor,.33,.2,steel,x,0);cylinderX(crankRotor,.28,.2,bronze,x,r);}
 cylinderX(crankRotor,.17,.86,silver,0,r);
 cylinderX(crankRotor,.2,.8,silver,-.8,0);cylinderX(crankRotor,.2,1.6,silver,1.2,0);
 const mainRotor=new T.Group();crank.add(mainRotor);mainRotor.position.y=D.crankY;
 const mainStart=-L.half-.2,mainEnd=DEMO_X-1.2;
 cylinderX(mainRotor,.2,mainEnd-mainStart,silver,(mainStart+mainEnd)/2,0);box(mainRotor,[mainEnd-mainStart,.045,.06],[(mainStart+mainEnd)/2,.21,0],yellow);
 mergeStatic(mainRotor);mergeStatic(crankRotor);
 const lineRotor=new T.Group();shaft.add(lineRotor);lineRotor.position.y=D.crankY;
 const lineEnd=L.propellerX-.3,lineLength=lineEnd-L.shaftStart,lineX=(L.shaftStart+lineEnd)/2;
 cylinderX(lineRotor,.2,lineLength,silver,lineX,0);
 for(const x of [L.half+.3,L.half+2.5,L.half+7]){cylinderX(lineRotor,.36,.18,steel,x,0);for(let i=0;i<8;i++){const a=i*Math.PI/4;cylinderX(lineRotor,.045,.22,bronze,x,Math.sin(a)*.28,Math.cos(a)*.28);}}
 box(lineRotor,[lineLength,.04,.06],[lineX,.21,0],yellow);
 const propeller=new T.Group();lineRotor.add(propeller);propeller.position.x=L.propellerX;
 cylinderX(propeller,.52,1.4,bronze,0,0);
 const shape=new T.Shape();shape.moveTo(-.22,.35);shape.bezierCurveTo(-.85,1,-.8,2.1,-.15,2.3);shape.bezierCurveTo(.5,2.5,1.1,2,.8,1.4);shape.bezierCurveTo(.5,.8,.35,.5,-.22,.35);
 for(let i=0;i<5;i++){
  const blade=mesh(propeller,new T.ExtrudeGeometry(shape,{depth:.08,bevelEnabled:true,bevelSize:.06,bevelThickness:.04,bevelSegments:2,curveSegments:16}),bronze);
  // Shape lies in YZ after rotating its original XY plane onto the shaft normal.
  blade.geometry.rotateY(Math.PI/2);blade.rotation.x=i/5*Math.PI*2;blade.rotation.y=.3;
 }
 mergeStatic(propeller);mergeStatic(lineRotor);
 for(const x of [L.half+1.9,L.half+5.9]){box(shaft,[.6,D.crankY-.25,.8],[x,(D.crankY-.25)/2,0],dark,.06);cylinderX(shaft,.36,.6,dark,x,D.crankY);}
 mergeStatic(shaft);
 // Reference mannequin: exactly 1.80 m from feet to top of helmet.
 const person=new T.Group();scale.add(person);person.position.set(L.personX,0,L.personZ);
 const suit=mat('#e4b740',.05,.7),boot=mat('#27333b',.1,.8);
 box(person,[.4,.58,.22],[0,1.15,0],suit,.09);
 mesh(person,new T.SphereGeometry(.13,16,12),silver,0,1.6);mesh(person,new T.SphereGeometry(.15,16,8,0,Math.PI*2,0,Math.PI/2),suit,0,1.65);
 for(const x of [-.115,.115]){box(person,[.16,.69,.17],[x,.52,0],suit,.06);box(person,[.19,.18,.3],[x,.09,.05],boot,.04);const arm=rod(person,.065,suit);connect(arm,new T.Vector3(x*2.2,1.4,0),new T.Vector3(x*2.6,.85,.04));}
 mergeStatic(person);
 const dimensions=new T.Group();root.add(dimensions);dimensions.visible=false;
 const dimension=(x:number,y0:number,y1:number,z:number)=>{
  const line=rod(dimensions,.012,yellow);connect(line,new T.Vector3(x,y0,z),new T.Vector3(x,y1,z));
  for(const y of [y0,y1])box(dimensions,[.28,.025,.025],[x,y,z],yellow);
 };
 // Stroke: piston crown travel between bottom and top dead centre.
 const bottom=D.crankY-r+D.rod+D.pistonRod;
 dimension(DEMO_X+1,bottom,bottom+D.stroke,.2);dimension(L.personX+.6,0,D.human,L.personZ);
 // Labels are DOM in the app; dimension geometry keeps measured endpoints at the same world scale.
 const helpers=new T.Group();root.add(helpers);
 const gasMat=new T.MeshBasicMaterial({color:'#f4b95c',transparent:true,opacity:.18,depthWrite:false,side:T.DoubleSide});
 const gas=mesh(helpers,new T.CylinderGeometry(crownR-.005,crownR-.005,1,32,1,false,Math.PI/2,Math.PI),gasMat,DEMO_X,D.headY-.5,0);gas.castShadow=false;gas.raycast=()=>{};
 const dots=Array.from({length:18},()=>{const d=mesh(helpers,new T.SphereGeometry(.045,8,6),new T.MeshBasicMaterial({color:'#74c4e4'}));d.castShadow=false;d.raycast=()=>{};return d;});
 const floorStart=-L.half-4,floorEnd=L.propellerX-1.6;
 const floor=box(root,[floorEnd-floorStart,.1,12],[(floorStart+floorEnd)/2,-.08,0],mat('#101626',0,.9),.1);floor.castShadow=false;floor.raycast=()=>{};
 const applyCut=(cut:boolean)=>{demoCovers.visible=!cut;linerMat.clippingPlanes=cut?[plane]:[];linerMat.clipShadows=true;(head.material as T.Material).clippingPlanes=cut?[plane]:[];};
 return {root,parts,pistonMoving,connectingRod,crankRotor,mainRotor,lineRotor,valve,gas,gasMat,dots,helpers,floor,person,dimensions,applyCut,dispose:()=>disposeTree(root)};
}
export type EngineModel=ReturnType<typeof createModel>;
