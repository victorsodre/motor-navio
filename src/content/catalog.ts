import {REVIEW,MANUAL} from './project.ts';
export const catalog=[
 {id:'structure',label:'Estrutura e passarelas',detail:'A base e as colunas sustentam os 14 cilindros. As passarelas ajudam a perceber a dimensão do conjunto.',note:'A cota A da ficha mede 25,914 m. Contornos e acessórios são esquemáticos.',source:REVIEW},
 {id:'cylinder',label:'Cilindro e circulação de ar',detail:'O pistão descobre as janelas inferiores. O ar novo entra por baixo e empurra os gases para a válvula de escape no cabeçote.',note:'Diâmetro interno: 0,96 m. Abertura de escape e cores são didáticas; não há comando por cames.',source:MANUAL},
 {id:'piston',label:'Pistão, haste e cruzeta',detail:'O pistão percorre 2,50 m. Uma haste rígida transmite esse movimento à cruzeta, que desliza em guias verticais.',note:'A biela articula abaixo da cruzeta. A haste do pistão permanece alinhada com o cilindro.',source:REVIEW},
 {id:'crank',label:'Biela e virabrequim',detail:'A biela liga a cruzeta à manivela. O movimento de subida e descida se transforma em rotação do eixo.',note:'Um ciclo a cada 360°. O interior móvel representa só o cilindro em corte, sem simular a ordem de ignição dos demais.',source:REVIEW},
 {id:'shaft',label:'Linha de eixo e hélice',detail:'No acoplamento direto, o virabrequim transmite rotação à hélice sem uma caixa redutora entre eles.',note:'Relação 1:1 na cena. Comprimento do eixo, hélice e mancais externos são ilustrativos.',source:'https://www.wartsila.com/encyclopedia/term/direct-drive'},
 {id:'scale',label:'Referência humana',detail:'Compare o motor com uma figura de 1,80 m. Essa altura foi escolhida para a comparação, não medida em uma pessoa.',note:'Mudar a vista apenas reenquadra a câmera. A figura e o motor conservam suas proporções.',source:REVIEW},
] as const;
export type PartId=typeof catalog[number]['id'];
