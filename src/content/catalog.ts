import {GUIDE,SHIP} from './project.ts';
import {DIMENSIONS as D,REAL_RPM,metres} from '../simulation/engine.ts';
export const catalog=[
 {id:'structure',label:'Estrutura e passarelas',detail:`A base e as colunas sustentam os ${D.cylinders} cilindros em linha. As passarelas ajudam a perceber a dimensão do conjunto.`,note:`Comprimento de ${metres(D.length,1)} m pela cota A do irmão S80MC-C8. Altura, contornos e acessórios são ilustrativos.`,source:GUIDE},
 {id:'cylinder',label:'Cilindro e circulação de ar',detail:'O pistão descobre as janelas de baixo. O ar novo entra por elas e empurra os gases para a válvula de escape no cabeçote. O diesel borrifado em cima pega fogo com o calor do ar comprimido, sem vela.',note:`Diâmetro interno: ${metres(D.bore)} m. Abertura de escape e cores são didáticas; a válvula e a injeção têm comando eletrônico, sem eixo de cames.`,source:GUIDE},
 {id:'piston',label:'Pistão, haste e cruzeta',detail:`O pistão percorre ${metres(D.stroke)} m. Uma haste rígida leva esse movimento à cruzeta, que desliza em guias verticais.`,note:'A biela articula abaixo da cruzeta. A haste do pistão fica sempre alinhada com o cilindro.',source:GUIDE},
 {id:'crank',label:'Biela e virabrequim',detail:'A biela liga a cruzeta à manivela. O sobe e desce vira rotação do eixo: uma queima por volta, porque o motor é de dois tempos.',note:'O interior móvel representa só o cilindro em corte, sem simular a ordem de ignição dos demais.',source:GUIDE},
 {id:'shaft',label:'Linha de eixo e hélice',detail:`Sem câmbio: o virabrequim é emendado direto no eixo da hélice. Uma volta do motor, uma volta da hélice, no máximo ${REAL_RPM} por minuto.`,note:'Relação 1:1 na cena. A hélice do navio tem 10 m; a da cena é menor, e eixo e mancais são ilustrativos.',source:SHIP},
 {id:'scale',label:'Referência humana',detail:'Compare o motor com uma figura de 1,80 m. Essa altura foi escolhida para a comparação, não medida em uma pessoa.',note:'Mudar a vista só move a câmera. A figura e o motor conservam suas proporções; a altura do motor é ilustrativa.',source:GUIDE},
] as const;
export type PartId=typeof catalog[number]['id'];
