# Validação — 07/11/2026

Desenvolvimento concluído para o escopo local. **7 testes e 97 verificações de navegador aprovados.** Sem publicação do aplicativo ou de posts.

## Ambiente e comandos

Mac de Victor, Node 26.7.0, npm 11.19.0, Chrome com sessão Playwright isolada `ovl-dev`. `npm ci --offline --no-audit --no-fund`, `npm test`, `npm run check`, `npm run build`. Servidor Vite local e build estático servido em `/motor-navio/`, com recarga direta. Não usa a 5090 nem o pipeline de vídeos.

## Evidência

- 7 testes: curso de 2,50 m; comprimento da biela e alinhamento da haste; ciclo 360° e eixo 1:1; relação pistão/janelas e válvula; relógio com pausa/entradas inválidas; contato geométrico entre biela, manivela e cruzeta; retorno repetido sem deriva; escala e câmera em diferentes proporções. Esses itens são agrupados em sete casos, não testes separados por afirmação.
- 65 checks de interação: etapas, slider, reprodução/pausa/velocidade/reset; seis seleções/isolações/retornos; busca com acentos; tour; zoom, malha e clique no objeto; fontes; movimento reduzido; exportação e larguras 390, 360 e 844 px.
- 29 checks de produção: subpasta/recarga; relógio e renderização com evento de visibilidade simulado; retomada; teclado; fontes/licenças locais; PNG; fallback WebGL e perda de contexto; sem erros JS e sem HTTP com erro no fluxo.
- 3 checks finais de exportação: PNG horizontal e vertical da escala após revisão de sobreposição de flanges e inclusão das cotas; câmera preservada.
- Capturas reais conferidas: motor inteiro, corte na lavagem, comparação de escala, mobile e exportações. Ajustados passarelas que encobriam a biela, junção da linha de eixo e faces coincidentes em um mancal.

Registros locais ignorados pelo Git: `output/tests.log`, `check.log`, `build.log`, `browser-qa.log`, `production-qa.log`, `export-qa.log`; capturas `desktop-final.png`, `mobile-scale.png`, `scale-wide-final.png`, `scale-tall-final.png`. Scripts transitórios de QA em `/private/tmp/marine-*-qa.js`; o roteiro durável está nesta nota e em MANUTENCAO.md.

## Medidas observadas

| Medida | Resultado |
|---|---|
| JavaScript do build | 832.287 bytes (aproximadamente 225 kB gzip) |
| CSS do build | 21.563 bytes |
| `dist/` inteiro | 1.093.073 bytes, incluindo fontes/licenças |
| Cena inteira, após reset | 103 draw calls, 131.508 triângulos (contador do renderizador, inclui passes) |
| Controle disponível | 363 ms em observação local com cache; não é benchmark de rede |
| PNG inteiro | 1920×1080 e 1080×1920; cerca de 1,66/1,26 MB na captura conferida |
| PNG de escala final | 1.607.656 / 1.223.934 bytes, horizontal/vertical |
| Repouso | Contador de renderizações estabiliza; sem loop contínuo |

O aviso do Vite sobre chunk maior que 500 kB permanece: Three.js domina o pacote, e a primeira cena precisa dele. O total está abaixo da meta inicial de 10 MB. Não há promessa de 30 fps em aparelhos não ensaiados.

## Limites do aceite

Celular emulado no Chrome do Mac, sem teste em telefone físico ou Safari. Sem homologação de engenharia. Proporções gerais são ilustrativas, salvo as cotas explicitamente referenciadas. Ângulos de abertura não são mapa operacional do fabricante. Fontes técnicas e seu limite estão em APURACAO.md; a figura de 1,80 m é definida pelo autor. Não houve avaliação de crescimento nas redes ou uso público.

## Revisão para publicação — 08/11/2026

Testes automatizados do projeto, TypeScript/build e `check:pages` aprovados. O último verifica assets relativos em subpasta, canonical, prévia social, 404, sitemap e fallback sem JavaScript. O conjunto mantém 76 testes dos mecanismos.

Chrome real em janela dedicada: build servido sob a subpasta do projeto, canvas e catálogo carregados, seleção, ação principal quando presente no dock, diálogo da coleção com dez destinos corretos, indicação da página atual, fechamento por Escape, foco devolvido e seleção preservada. Viewports 1440×1000 e 390×844, sem transbordamento horizontal, erros de JavaScript ou respostas HTTP de erro durante o fluxo. Capturas reais em `output/publish-local-*.png` (ignoradas pelo Git).

A publicação usa o procedimento em [PUBLICACAO.md](PUBLICACAO.md). Verificação local não substitui conferir a URL após o deploy. Celular físico e Safari permanecem fora da amostra; o modelo mantém os limites educativos descritos acima.

## Embed do canal — 08/11/2026

Vídeo e autoria confirmados pelo oEmbed público do YouTube. Os 76 testes da coleção continuam aprovados; TypeScript/build e check de Pages aprovados em cada projeto. Capas originais de maior resolução servidas localmente, com mesmo ID do player e link do README.

Fluxo a conferir após cada publicação: abrir pelo cabeçalho, capa legível, zero requisições ao YouTube antes do clique, Enter no botão Carregar vídeo, iframe correto sem autoplay, controles nativos, foco e link direto. Viewports 1440×1000 e 390×844; largura/altura úteis do player de ao menos 200 px, descontando bordas. Limites: telefone físico/Safari fora da amostra e disponibilidade do vídeo depende do YouTube. Evidências desta rodada em `output/video-*`.

Nesta rodada, os dez players foram carregados no Chrome em estado pronto (`5` / cued), com o ID esperado e sem reprodução automática. Navegação pelo cabeçalho, clique/Enter, dimensões mínimas, thumbnail local e link direto aprovados; nenhuma requisição ao YouTube antes do clique ou erro JavaScript nos fluxos.
