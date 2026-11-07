# Manutenção e validação

## Antes de cada entrega

- Conferir fonte/data das explicações e a distinção entre ilustração e medição.
- Validar assets, créditos e termos, incluindo autorização para servir arquivos extraíveis no navegador.
- Executar `npm test`, `npm run check` e `npm run build`; repetir os fluxos afetados e registrar a evidência.
- Revisar diff, evitar segredos e incluir apenas mudanças da tarefa. Não adicionar diretórios de configuração pessoal, tokens ou snapshots de sessão.
- Testar URL de vídeo, acesso às fontes, carregamento, fallback e navegação por teclado.
- Conferir visualmente 1440×900, 390×844 e orientação horizontal; usar ao menos um navegador desktop e um celular real quando disponível. Registrar dispositivo e limitações.
- Exercitar selecionar → isolar → reenquadrar → abrir cilindro → fechar → reset. Câmera deve conservar o objeto visível.
- Testar mecanismo no início, meio, fim, pausa, retomada, reset e alternância de aba. Ausência de NaN e poses acumuladas é critério funcional.
- Comparar captura inicial, seleção, corte e escala com o guia visual. Validar ausência de autoplay e movimento reduzido; este app não usa áudio.

## Testes proporcionais

Sete testes para cinemática, relógio, rig, escala e enquadramento. Integração para catálogo/nós do asset e retorno ao estado inicial. Fluxo de navegador para carregar, interagir e resetar. Não criar testes que apenas repitam o texto destes guias.

## Rotina após lançamento

- A cada mudança de modelo: revisar IDs, pivôs, nomes, enquadramento, memória e créditos.
- A cada mudança de dependência: repetir build e fluxos essenciais; comparar imagens antes/depois.
- A cada mudança factual: atualizar a fonte e textos, incluindo capturas/posts ainda não publicados.
- Em revisão periódica: conferir links, disponibilidade de vídeos e situação das fontes. Datas dinâmicas, especialmente Voyager, exigem reconsulta explícita.
- Registrar bug com dispositivo, navegador, ação, resultado esperado/observado e evidência sem dados pessoais.

## Publicação e reversão

Publicar aplicativo é uma etapa futura. Preparar build revisável, checks e URL alvo; confirmar que o pedido vigente autoriza o deploy. Não habilitar publicação automática apenas porque a documentação foi enviada ao GitHub.

Quando houver deploy, registrar commit, build, URL, data e verificação do caminho público. Manter release anterior para reversão por novo deploy; não reescrever histórico compartilhado. Mudança de visibilidade do repositório é independente de publicar o aplicativo.

## Medição do piloto

Se a medição for implementada e autorizada, observar em 7 e 28 dias: visitas à experiência, primeira interação, uso da ação principal e cliques para o vídeo. Evitar coletar placas, imagens pessoais ou identificadores desnecessários. Views dos vídeos não medem uso do aplicativo.

Usar a combinação de qualidade, uso e custo de manutenção para ajustar o próximo projeto. Não prometer crescimento ou patrocínio com base no alcance histórico.

## Regressões específicas

- Em 0°/180°, diferença de altura do pistão = 2,50 m. Cruzeta sempre vertical, biela com comprimento constante e eixo/hélice 1:1.
- Janelas abrem pela posição real do pistão; escape permanece aberto durante a lavagem. Ângulos são ilustrativos, não configuração operacional.
- Conferir 45°, 100°, 180°, 300° e 360°; abrir/fechar, isolar/retornar e comparar escala não alteram a pose do mecanismo.
- Reset: 45°, parado, vista inteira, velocidade 1×, malha desligada, seleção vazia. `R` reenquadra e `Escape` fecha diálogo/detalhe.
- Medir o humano pelos limites geométricos: 1,80 m. Nunca redimensionar o motor para facilitar a comparação.
- Ao alterar mancais/flanges, procurar superfícies coincidentes no PNG grande; conferir continuidade da linha de eixo.
- Testar corte e escala em desktop, 390×844, 360×800 e 844×390; capturas 16:9 e 9:16 devem conservar marca, limites e enquadramento.
- Falha/perda de WebGL: mensagem em português, controle desabilitado e fontes acessíveis. Conferir comportamento por teclado e preferência de movimento reduzido.

A cobertura móvel atual é emulada. Registrar aparelho/browser quando houver teste físico. Publicação e medições públicas continuam posteriores ao desenvolvimento.
