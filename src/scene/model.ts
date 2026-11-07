import * as T from 'three';
import {box,mesh,rod,connect,mergeStatic,disposeTree} from './geometry.ts';
import {catalog} from '../content/catalog.ts';
import {DEMO_X,DIMENSIONS as D} from '../simulation/engine.ts';
const mat=(color:string,metalness=.5,roughness=.4)=>new T.MeshStandardMaterial({color,metalness,roughness});
function cylinderX(parent:T.Object3D,r:number,len:number,m:T.Material,x:number,y:number,z=0){const o=mesh(parent,new T.CylinderGeometry(r,r,len,24),m,x,y,z);o.rotation.z=Math.PI/2;return o;}
function pipe(parent:T.Object3D,points:T.Vector3[],radius:number,m:T.Material){return mesh(parent,new T.TubeGeometry(new T.CatmullRomCurve3(points),20,radius,10,false),m);}
export function createModel(){
 const root=new T.Group(),parts=catalog.map(p=>{const group=new T.Group();group.name=p.id;group.userData.partId=p.id;root.add(group);return {...p,group};});
 const group=(id:string)=>parts.find(p=>p.id===id)!.group;
 const structure=group('structure'),cylinder=group('cylinder'),piston=group('piston'),crank=group('crank'),shaft=group('shaft'),scale=group('scale');
 const green=mat('#517a71',.5,.5),pale=mat('#879d95',.4,.5),dark=mat('#263d42',.55,.5),silver=mat('#bcc9cc',.8,.28),steel=mat('#596d79',.75,.3),bronze=mat('#c78d43',.72,.3),yellow=mat('#e5bc38',.3,.5);
 box(structure,[D.length,.5,4.48],[0,.25,0],dark,.12);
 box(structure,[23.1,.22,3.4],[-1.407,3.1,0],green,.06);
 const demoCovers=new T.Group();structure.add(demoCovers);box(demoCovers,[2.814,.22,3.4],[11.55,3.1,0],green,.06);
 for(let i=0;i<14;i++){
  const x=(i-6.5)*1.68,isDemo=i===13,target=isDemo?demoCovers:structure;
  // A-shaped main frame. The removable front bay reveals the crosshead and crank.
  for(const z of [-1.5,1.5]){box(target,[1.35,2.5,.15],[x,1.78,z],green,.04);box(target,[1.15,3.6,.18],[x,5.0,z*.7],green,.04);}
  box(target,[1.5,.25,2.5],[x,6.7,0],green,.05);
  if(!isDemo){mesh(structure,new T.CylinderGeometry(.68,.68,3,24),green,x,8.2);mesh(structure,new T.CylinderGeometry(.71,.71,.25,24),silver,x,9.72);mesh(structure,new T.CylinderGeometry(.24,.24,.85,16),steel,x,10.2);}
  for(const z of [-1.47,1.47]){box(target,[.9,.9,.08],[x,1.7,z*1.04],dark,.03);for(const dx of [-.33,.33])box(target,[.06,.12,.08],[x+dx,1.7,z*1.08],silver);}
 }
 for(const y of [3.25,6.8,9.4]){
  for(const z of [-2.12,2.12]){
   box(structure,[23.1,.13,1.05],[-1.407,y,z],dark,.025);box(demoCovers,[2.814,.13,1.05],[11.55,y,z],dark,.025);
   for(const railY of [.55,1.05]){cylinderX(structure,.035,23.1,yellow,-1.407,y+railY,z+Math.sign(z)*.45);cylinderX(demoCovers,.035,2.814,yellow,11.55,y+railY,z+Math.sign(z)*.45);}
   for(let i=0;i<=14;i++)mesh(i>=13?demoCovers:structure,new T.CylinderGeometry(.028,.028,1.05,6),yellow,-12.6+i*1.8,y+.525,z+Math.sign(z)*.45);
  }
 }
 // The near end stair and structural ribs give scale without obstructing the cutaway bay.
 for(const y of [3.25,6.8])for(let k=0;k<12;k++)box(structure,[.75,.06,.2],[-12.5,y+k*.29,-1.6-k*.12],steel,.01);
 cylinderX(structure,.46,25,pale,0,10.65,-.7);
 cylinderX(structure,.46,25,green,0,7.0,-1.5);
 for(const x of [-7,0,7]){mesh(structure,new T.SphereGeometry(.8,16,12),dark,x,10.5,-1.5);cylinderX(structure,.48,.9,silver,x,10.5,-2);}
 mergeStatic(structure);mergeStatic(demoCovers);
 // A ported liner: physical openings below the solid upper wall.
 const linerMat=silver.clone();linerMat.side=T.DoubleSide;const plane=new T.Plane(new T.Vector3(0,0,-1),0);
 const liner=new T.Group();cylinder.add(liner);liner.position.x=DEMO_X;
 mesh(liner,new T.CylinderGeometry(.53,.53,2.15,48,1,true),linerMat,0,8.575);
 mesh(liner,new T.CylinderGeometry(.53,.53,.3,48,1,true),linerMat,0,6.9);
 for(let i=0;i<12;i++)mesh(liner,new T.CylinderGeometry(.53,.53,.45,3,1,true,i/12*Math.PI*2,.17),linerMat,0,7.275);
 const head=mesh(liner,new T.CylinderGeometry(.68,.68,.2,48),green,0,9.8);
 head.material=green.clone();
 const valve=new T.Group();cylinder.add(valve);valve.position.x=DEMO_X;
 mesh(valve,new T.CylinderGeometry(.24,.22,.07,24),steel,0,9.66);mesh(valve,new T.CylinderGeometry(.05,.05,.85,12),silver,0,10.1);
 mesh(cylinder,new T.CylinderGeometry(.24,.24,.6,20),dark,DEMO_X,10.42);
 for(const z of [-.3,.3])mesh(cylinder,new T.CylinderGeometry(.055,.055,.5,10),bronze,DEMO_X+.28,9.95,z);
 pipe(cylinder,[new T.Vector3(DEMO_X,10.1,-.15),new T.Vector3(DEMO_X,10.7,-.3),new T.Vector3(DEMO_X,10.65,-.7)],.17,steel);
 // Piston crown + straight rod + crosshead. Y positions set by the rig.
 const pistonMoving=new T.Group();piston.add(pistonMoving);pistonMoving.position.x=DEMO_X;
 mesh(pistonMoving,new T.CylinderGeometry(.47,.47,.34,48),silver,0,-.17);
 for(const y of [-.08,-.15,-.24]){const ring=mesh(pistonMoving,new T.TorusGeometry(.471,.015,6,48),steel,0,y);ring.rotation.x=Math.PI/2;}
 mesh(pistonMoving,new T.CylinderGeometry(.095,.095,D.pistonRod-.17,16),silver,0,-(D.pistonRod+.17)/2);
 cylinderX(pistonMoving,.18,1.05,bronze,0,-D.pistonRod);
 for(const x of [-.55,.55])box(pistonMoving,[.22,.34,.5],[x,-D.pistonRod,0],bronze,.03);
 mergeStatic(pistonMoving);
 for(const x of [DEMO_X-.67,DEMO_X+.67])box(piston,[.12,3.1,.6],[x,5.1,0],steel,.02);
 const connectingRod=rod(crank,.14,steel),crankRotor=new T.Group();crank.add(crankRotor);crankRotor.position.set(DEMO_X,D.crankY,0);
 for(const x of [-.42,.42]){box(crankRotor,[.18,D.stroke/2,.45],[x,D.stroke/4,0],steel,.09);cylinderX(crankRotor,.35,.2,steel,x,0);cylinderX(crankRotor,.3,.2,bronze,x,D.stroke/2);}
 cylinderX(crankRotor,.19,.94,silver,0,D.stroke/2);
 cylinderX(crankRotor,.21,.8,silver,-.85,0);cylinderX(crankRotor,.21,1.56,silver,1.3,0);
 const mainRotor=new T.Group();crank.add(mainRotor);mainRotor.position.y=D.crankY;
 cylinderX(mainRotor,.21,22.87,silver,-1.765,0);box(mainRotor,[22.87,.045,.06],[-1.765,.22,0],yellow);mergeStatic(mainRotor);mergeStatic(crankRotor);
 const lineRotor=new T.Group();shaft.add(lineRotor);lineRotor.position.y=D.crankY;
 cylinderX(lineRotor,.21,7.34,silver,16.67,0);
 for(const x of [13.2,15.4,20]){cylinderX(lineRotor,.38,.18,steel,x,0);for(let i=0;i<8;i++){const a=i*Math.PI/4;cylinderX(lineRotor,.045,.22,bronze,x,Math.sin(a)*.3,Math.cos(a)*.3);}}
 box(lineRotor,[7.3,.04,.06],[16.67,.22,0],yellow);
 const propeller=new T.Group();lineRotor.add(propeller);propeller.position.x=20.6;
 cylinderX(propeller,.52,1.4,bronze,0,0);
 const shape=new T.Shape();shape.moveTo(-.22,.35);shape.bezierCurveTo(-.85,1,-.8,2.3,-.15,2.8);shape.bezierCurveTo(.5,3.1,1.1,2.4,.8,1.6);shape.bezierCurveTo(.5,.8,.35,.5,-.22,.35);
 for(let i=0;i<5;i++){
  const blade=mesh(propeller,new T.ExtrudeGeometry(shape,{depth:.08,bevelEnabled:true,bevelSize:.06,bevelThickness:.04,bevelSegments:2,curveSegments:16}),bronze);
  // Shape lies in YZ after rotating its original XY plane onto the shaft normal.
  blade.geometry.rotateY(Math.PI/2);blade.rotation.x=i/5*Math.PI*2;blade.rotation.y=.3;
 }
 mergeStatic(propeller);mergeStatic(lineRotor);
 for(const x of [14.8,18.8]){box(shaft,[.6,1.8,.8],[x,.95,0],dark,.06);cylinderX(shaft,.38,.6,dark,x,D.crankY);}
 mergeStatic(shaft);
 // Reference mannequin: exactly 1.80 m from feet to top of helmet.
 const person=new T.Group();scale.add(person);person.position.set(11.6,0,3.5);
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
 dimension(DEMO_X+1.1,6.95,9.45,.2);dimension(12.2,0,D.human,3.5);
 // Labels are DOM in the app; dimension geometry keeps measured endpoints at the same world scale.
 const helpers=new T.Group();root.add(helpers);
 const gasMat=new T.MeshBasicMaterial({color:'#f4b95c',transparent:true,opacity:.18,depthWrite:false,side:T.DoubleSide});
 const gas=mesh(helpers,new T.CylinderGeometry(.465,.465,1,32,1,false,Math.PI/2,Math.PI),gasMat,DEMO_X,8.5,0);gas.castShadow=false;gas.raycast=()=>{};
 const dots=Array.from({length:18},()=>{const d=mesh(helpers,new T.SphereGeometry(.045,8,6),new T.MeshBasicMaterial({color:'#74c4e4'}));d.castShadow=false;d.raycast=()=>{};return d;});
 const floor=box(root,[42,.1,12],[4,-.08,0],mat('#101626',0,.9),.1);floor.castShadow=false;floor.raycast=()=>{};
 const applyCut=(cut:boolean)=>{demoCovers.visible=!cut;linerMat.clippingPlanes=cut?[plane]:[];linerMat.clipShadows=true;(head.material as T.Material).clippingPlanes=cut?[plane]:[];};
 return {root,parts,pistonMoving,connectingRod,crankRotor,mainRotor,lineRotor,valve,gas,gasMat,dots,helpers,floor,person,dimensions,applyCut,dispose:()=>disposeTree(root)};
}
export type EngineModel=ReturnType<typeof createModel>;
