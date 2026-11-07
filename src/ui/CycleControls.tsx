import type {CSSProperties} from 'react';
import {Pause,Play,RotateCcw} from 'lucide-react';
import {sampleEngine} from '../simulation/engine.ts';
const stages=[{id:'power',label:'Expansão',angle:45,detail:'Os gases empurram o pistão para baixo.'},{id:'exhaust',label:'Escape',angle:100,detail:'A válvula superior abre para os gases saírem.'},{id:'scavenge',label:'Lavagem',angle:180,detail:'Ar novo entra pelas janelas descobertas.'},{id:'compression',label:'Compressão',angle:300,detail:'O pistão sobe e comprime o ar.'}] as const;
export function CycleControls({angle,playing,speed,disabled,setAngle,setSpeed,setPlaying,reset,openCylinder}:{angle:number;playing:boolean;speed:number;disabled:boolean;setAngle:(n:number)=>void;setSpeed:(n:number)=>void;setPlaying:(v:boolean)=>void;reset:()=>void;openCylinder:()=>void}){
 const state=sampleEngine(angle),stage=stages.find(s=>s.id===state.phase)!;
 const jump=(value:number)=>{setPlaying(false);openCylinder();setAngle(value);};
 return <section className="control-dock engine-dock" aria-label="Controlar o motor">
  <div className="dock-top"><button className="primary" disabled={disabled} onClick={()=>setPlaying(!playing)}>{playing?<Pause size={15}/>:<Play size={15}/>} {playing?'Pausar':'Mover o motor'}</button><div className="phase-copy"><strong>{stage.label}</strong><span>{stage.detail}</span></div><label className="speed-control"><span>VELOCIDADE DIDÁTICA</span><select aria-label="Velocidade didática" value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={.5}>0,5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label><button className="icon-button" aria-label="Reiniciar experiência" onClick={reset}><RotateCcw size={18}/></button></div>
  <div className="timeline"><label htmlFor="engine-angle">VIRABREQUIM · UMA VOLTA POR CICLO <span>{Math.round(angle)}° / 360°</span></label><input style={{'--progress':`${angle/360*100}%`} as CSSProperties} id="engine-angle" aria-label="Ângulo do virabrequim" type="range" min="0" max="360" step="1" value={Math.round(angle)} onChange={e=>jump(Number(e.target.value))}/></div>
  <div className="phase-markers">{stages.map((s,i)=><button key={s.id} className={s.id===state.phase?'current':''} onClick={()=>jump(s.angle)}><span>{String(i+1).padStart(2,'0')}</span> {s.label}</button>)}</div>
 </section>;
}
