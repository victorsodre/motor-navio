import type {CSSProperties} from 'react';
import {Pause,Play,RotateCcw,Undo2} from 'lucide-react';
import {sampleEngine,SPEEDS,REAL_SPEED,REAL_RPM} from '../simulation/engine.ts';
const stages=[{id:'power',label:'Expansão',angle:45,detail:'O diesel pega fogo no ar quente e empurra o pistão para baixo.'},{id:'exhaust',label:'Escape',angle:100,detail:'A válvula de cima abre para os gases saírem.'},{id:'scavenge',label:'Lavagem',angle:180,detail:'Ar novo entra pelas janelas descobertas.'},{id:'compression',label:'Compressão',angle:300,detail:'O pistão sobe e espreme o ar.'}] as const;
const speedLabel=(value:number)=>value===REAL_SPEED?`Real · ${REAL_RPM} rpm`:`${value.toLocaleString('pt-BR')}×`;
type Props={angle:number;reverse:boolean;playing:boolean;speed:number;disabled:boolean;setAngle:(n:number)=>void;setSpeed:(n:number)=>void;setPlaying:(v:boolean)=>void;setReverse:(v:boolean)=>void;reset:()=>void;openCylinder:()=>void};
export function CycleControls({angle,reverse,playing,speed,disabled,setAngle,setSpeed,setPlaying,setReverse,reset,openCylinder}:Props){
 const state=sampleEngine(angle,reverse),stage=stages.find(s=>s.id===state.phase)!;
 const jump=(value:number)=>{setPlaying(false);openCylinder();setAngle(value);};
 return <section className="control-dock engine-dock" aria-label="Controlar o motor">
  <div className="dock-top"><button className="primary" disabled={disabled} onClick={()=>setPlaying(!playing)}>{playing?<Pause size={15}/>:<Play size={15}/>} {playing?'Pausar':'Mover o motor'}</button><div className="phase-copy"><strong>{stage.label}{reverse&&' · ré'}</strong><span>{stage.detail}</span></div><label className="speed-control"><span>VELOCIDADE</span><select aria-label="Velocidade" value={speed} onChange={e=>setSpeed(Number(e.target.value))}>{SPEEDS.map(value=><option key={value} value={value}>{speedLabel(value)}</option>)}</select></label><button className="icon-button" aria-label="Reiniciar experiência" onClick={reset}><RotateCcw size={18}/></button></div>
  <div className="timeline"><label htmlFor="engine-angle">VIRABREQUIM · UMA VOLTA POR CICLO <span>{Math.round(angle)}° / 360°</span></label><input style={{'--progress':`${angle/360*100}%`} as CSSProperties} id="engine-angle" aria-label="Ângulo do virabrequim" type="range" min="0" max="360" step="1" value={Math.round(angle)} onChange={e=>jump(Number(e.target.value))}/></div>
  <div className="phase-markers">{stages.map((s,i)=><button key={s.id} className={s.id===state.phase?'current':''} onClick={()=>jump(s.angle)}><span>{String(i+1).padStart(2,'0')}</span> {s.label}</button>)}<button className="reverse-toggle" aria-pressed={reverse} disabled={disabled} onClick={()=>setReverse(!reverse)}><Undo2 size={14}/>{reverse?'Voltar a avante':'Dar ré'}</button></div>
 </section>;
}
