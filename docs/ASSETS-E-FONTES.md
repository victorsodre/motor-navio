# Assets e fontes — Motor de navio gigante

**Situação atual:** geometria autoral em Three.js, fontes locais licenciadas e identidade oficial. Apuração técnica concluída em APURACAO.md; sem modelo, foto, PDF ou áudio de terceiros distribuído.

## Conteúdo que originou a proposta

- [Motor de navio — Instagram](https://www.instagram.com/reel/DfVTXkqEmNA/)
- [Por que o navio flutua — YouTube](https://www.youtube.com/watch?v=SoQtd_t-MUk)

O Reel recente sobre motor de navio registrou 7.494 visualizações no Instagram. O vídeo longo sobre flutuação é uma conexão editorial, não evidência específica sobre o motor.

Leitura em 07/11/2026. A análise consultou as APIs oficiais do Instagram/YouTube e relatórios existentes do canal. Vídeos do próprio canal orientam a pauta; fatos científicos/operacionais precisam retornar a fontes primárias antes de serem usados no modelo.

## Apuração concluída

- Desde 09/11/2026: MS Ore Brasil e Valemax (Wikipédia), Project Guide MAN S80MC-C8-TII (2010) e MAN Basic principles of ship propulsion, com seções e limites em APURACAO.md.
- Dois tempos, cruzeta, transmissão direta; diâmetro 800 mm, curso 3.200 mm, 7 cilindros, 78 rpm, cota A 12.653 mm (S80MC-C8). Capa do Short (`public/video-next.jpg`) reduzida da capa do EP341 do canal.

Para cada afirmação, registrar: texto, fonte primária, URL/página, data de consulta, trecho ou figura de suporte, unidades, limites e onde aparece na experiência. Não listar uma instituição como se um documento específico já tivesse sido conferido.

## Necessidade de geometria

Modelagem de um cilindro fiel à arquitetura escolhida, com repetição visual dos demais. Conjuntos separados para escala e inspeção.

## Registro de aquisição

Registro do que é entregue ao navegador:

| Arquivo/asset | Autor e URL | Licença/termos e data | Uso web permitido | Alterações | Hash/créditos |
|---|---|---|---|---|---|
| Geometria de `src/scene/model.ts` | Victor Sodré / ovictorlab | Criação própria, 07/11/2026 | Sim, no projeto autorizado | Esquema do 7S80ME-C8 e hélice ilustrativa | Créditos na interface |
| `public/icon.svg`, `Brand.tsx` | Código oficial ovictorlab.com | Marca do usuário | Uso autorizado neste projeto | Transposição fiel | IDENTIDADE-VISUAL.md |
| Fontes via Fontsource | Anton, Archivo, Archivo Black, JetBrains Mono | SIL OFL, cópias em `public/licenses/` | Sim | Subconjuntos latinos locais | Créditos e licenças no diálogo |
| Código base de câmera/UI | Projetos anteriores da coleção, do mesmo usuário | Reuso dentro do pedido | Sim | Motor marítimo e seis grupos | Sem GLB ou áudio do Fusquinha |

Confirmar permissão para servir o arquivo no navegador: GLB e áudio enviados ao visitante são extraíveis. A licença do código não substitui a licença dos assets. Não baixar pacote executável, rodar scripts embutidos ou publicar interiores não verificados como engenharia fiel.

## Referências da coleção

- Marca e tipografia: fontes oficiais apontadas em IDENTIDADE-VISUAL.md.
- Interação: [Fusquinha](https://github.com/victorsodre/fusquinha), especialmente README e documentação de assets.
- Som: escolher fontes com licença explícita, início por gesto e mute. Evitar sons que sugiram mecanismo diferente do representado.



Bibliotecas React, Three.js e Lucide: licenças em `public/licenses/bibliotecas.txt`. Os PDFs servem de referência; não foram incorporados como assets. Sem aquisição paga.
