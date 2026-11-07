# Escopo — Motor de navio gigante

## Pergunta e resultado esperado

Como o movimento de um motor gigante chega à hélice? O visitante deve conseguir explicar o mecanismo depois de explorar a cena e acionar seus controles.

Um motor marítimo de arquitetura identificada, com um cilindro em corte e caminho mecânico até o eixo. Curso, diâmetro e cota longitudinal têm fonte técnica. A figura humana usa 1,80 m definidos pelo autor, explicitamente rotulados como referência de comparação, sem alegação antropométrica.

## Conjuntos da primeira versão

- Estrutura do motor
- Cilindro em corte
- Pistão e mecanismo escolhido
- Virabrequim
- Eixo propulsor
- Referência de escala

Seis grupos implementados no catálogo, vinculados à geometria e às fontes. Motor escolhido: Wärtsilä RT-flex96C de 14 cilindros, dois tempos, cruzeta e acoplamento direto.

## Ações principais

| Controle | Comportamento implementado |
|---|---|
| Mover o motor | Avança um ciclo ilustrativo da arquitetura escolhida. |
| Abrir cilindro | Expõe o mecanismo interno e mantém a referência do conjunto. |
| Comparar escala | Alterna visão geral e detalhe com referência humana dimensionada. |

Base de exploração: órbita, zoom, seleção por lista ou clique, isolamento, reenquadrar e reset. Desmontagem e corte só se aplicam aos conjuntos para os quais forem úteis e tecnicamente coerentes. Malha e captura PNG implementadas. Som e desmontagem dispensados: não acrescentam explicação ao corte e à transmissão.

## Estado do mecanismo

`stopped ↔ running ↔ paused; crankAngle é a origem do movimento; scaleView muda a câmera, não altera dimensões do modelo.`

## Critérios específicos de conclusão

- Escolher dois ou quatro tempos e a arquitetura real antes de desenhar os componentes.
- Não transplantar automaticamente o mecanismo automotivo para um grande motor marítimo.
- Eixo e hélice seguem a transmissão escolhida; não inserir redutor ou conexão direta sem fonte.

- A pergunta inicial é respondida por uma interação observável, com texto curto e fontes acessíveis.
- O modelo funciona no desktop e no celular de referência, com reset e fallback conferidos.
- Nenhum botão visível é apenas decorativo ou promete função pendente.

## Fora da primeira versão

- Navio completo com todas as instalações.
- Flutuação, navegação, consumo e emissões como simuladores quantitativos.

Ampliações entram no backlog após o piloto, com evidência de uso e esforço. Não incluir funcionalidades só para repetir todas as opções do Fusquinha.
