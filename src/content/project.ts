import {DIMENSIONS as D,REAL_RPM,DIDACTIC_RPM,metres} from '../simulation/engine.ts';

export const SHIP='https://en.wikipedia.org/wiki/MS_Ore_Brasil';
export const SERIES='https://en.wikipedia.org/wiki/Valemax';
export const GUIDE='https://engine.od.ua/ufiles/MAN-S80MC-C8-PG.pdf';
export const PROPULSION='https://man-es.com/docs/default-source/document-sync-archive/basic-principles-of-ship-propulsion-eng.pdf';
export const ENGINE='7S80ME-C8';
export const POWER_KW=29_260;

const kw=POWER_KW.toLocaleString('pt-BR');
/** Texto gravado no PNG exportado: lê as mesmas constantes do modelo. */
export const captureText={
 footer:`Motor de navio · ${D.cylinders} cilindros · Esquema educativo`,
 scale:`Curso: ${metres(D.stroke)} m · Figura: ${metres(D.human)} m (referência definida)`,
};

export const project={
 intro:`O motor do navio do minério: ${D.cylinders} cilindros, sem câmbio, direto na hélice.`,
 sources:[
  {title:'O navio e o motor',detail:`Wikipédia (en), MS Ore Brasil: primeiro navio da série, 362 m, motor ${ENGINE} de dois tempos com ${kw} kW a ${REAL_RPM} rpm no máximo, ligado direto a uma hélice de passo fixo; primeira carga em Ponta da Madeira (São Luís, MA).`,url:SHIP},
  {title:'A série e a hélice',detail:'Wikipédia (en), Valemax: navios de 360 a 362 m, todos com motores de sete cilindros e hélice de 10 m a 76–78 rpm. A segunda série usa outro motor, a 72 rpm.',url:SERIES},
  {title:'Diâmetro, curso e rotação',detail:`MAN Diesel & Turbo, Project Guide S80MC-C8-TII, 1.ª edição, abril de 2010 (PDF do fabricante em espelho). Seção 1.01: o 80 do nome é o diâmetro do pistão em cm. Seção 1.03: curso de 3.200 mm, ${kw} kW com 7 cilindros a 78 rpm. Seção 17.04: os mesmos 4.180 kW por cilindro a 78 rpm valem para o ME-C8. Seção 5.02: cota A de 12.653 mm para 7 cilindros, medida na versão com came.`,url:GUIDE},
  {title:'Comando eletrônico, hélice lenta e ré',detail:'MAN Energy Solutions, Basic principles of ship propulsion. Seção Electronically controlled engines: no motor ME, sem eixo de cames, a injeção e a abertura da válvula de escape têm comando eletrônico. Também: hélice maior rende mais e pede rotação menor; com hélice de passo fixo, o motor para e é religado ao contrário para dar ré, e o comando eletrônico espelha o tempo das válvulas.',url:PROPULSION},
 ],
 disclosure:`Esquema autoral do ${ENGINE}, o motor do primeiro navio da série que leva minério de São Luís à China. Um cilindro demonstra o ciclo; os outros ${D.cylinders-1} dão contexto. Diâmetro (${metres(D.bore)} m), curso (${metres(D.stroke)} m) e rotação máxima (${REAL_RPM} rpm) seguem as fontes. O comprimento segue a cota A do irmão com came (S80MC-C8, mesmo diâmetro e curso); a versão eletrônica pode diferir um pouco. Alturas, biela, estrutura, hélice, ângulos de abertura e cores são ilustrativos, e a hélice da cena é menor que a de 10 m do navio. Na velocidade didática 1× o motor gira a ${metres(DIDACTIC_RPM,0)} rpm; a opção "Real" mostra os ${REAL_RPM} rpm. A figura de 1,80 m é uma referência definida pelo autor, não uma média de altura humana. Não há cálculo de potência, consumo ou velocidade do navio. Fontes consultadas em 09/11/2026.`,
};
