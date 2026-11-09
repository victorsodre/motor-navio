# Decisões e estado

## 2026-11-07 — documentação inicial

- Victor solicitou salvar o plano no VicMind, criar uma pasta para cada projeto, preparar guias de desenvolvimento/identidade, enviar ao GitHub e escrever posts do X para uso posterior.
- Planejamento detalhado criado; prioridade recomendada **8/10**. A prioridade pode mudar após o piloto e a validação de assets.
- Identidade: ovictorlab.com / Laboratório noturno. Interações: referência Fusquinha, adaptadas à pergunta do projeto.
- Repositório inicialmente privado por escolha operacional conservadora nesta fase. O pedido autoriza o envio dos guias; não foi tratado como solicitação de implementar e publicar os aplicativos.
- Nenhuma postagem no X enviada. Textos de protótipo e lançamento têm condições explícitas de uso.

## 2026-11-07 — implementação e validação

O pedido posterior de desenvolver todos os projetos autorizou a aplicação. A restrição inicial a documentos foi substituída para desenvolvimento; publicação continua fora da rodada.

- Referência: RT-flex96C de 14 cilindros, ficha técnica de 2008 e manual 0050–1/A1. Dois tempos, cruzeta, admissão por janelas e escape comandado eletronicamente. Sem vela ou comando automotivo.
- Um interior funcional, outros treze cilindros como contexto. Não inventar ordem de ignição ou simular a instalação completa de um navio.
- Curso 2,50 m, bore 0,96 m e cota A 25,914 m documentados. Figura de 1,80 m definida como parâmetro de comparação, não dado humano observado. Cota F de desmontagem rejeitada como altura total.
- Seis grupos, corte, comparação de escala, reprodução/etapas, seleção/isolamento, tour, malha e PNG. Som e desmontagem não agregam ao mecanismo e foram dispensados.
- Identidade oficial preservada. Sete testes, 97 verificações Chrome e build em subpasta aprovados. Limites: celular emulado e esquema educativo.
- Rascunhos do X ajustados ao estado implementado. Sem postagem ou deploy.

Próximo da coleção: Itaipu por dentro. Evidência em VALIDACAO.md.

## Como registrar mudanças

Acrescentar data, decisão, motivo, fonte/evidência, arquivos afetados e consequência para o escopo. Separar proposta, implementação, validação e publicação. Preservar decisões antigas com indicação de substituição quando necessário.

## 2026-11-08 — repositório público e GitHub Pages

Victor autorizou aprimorar e tornar públicos os dez projetos com HTML funcional e identidade oficial. Esta decisão substitui a restrição histórica de publicação acima. Incluídos navegação entre os dez sites, canonical/OG/X, prévia real, sitemap, página 404, verificação de caminhos e workflow com testes/build antes do deploy. URL: https://victorsodre.github.io/motor-navio/. Conteúdo e modelo educativo preservados; nenhum post enviado ao X. Procedimento e reversão em PUBLICACAO.md.

## 2026-11-08 — vídeo do canal incorporado

Pedido de Victor: embed abaixo do experimento e thumbnail clicável no README. Vídeo `SoQtd_t-MUk`, autoria ovictorlab confirmada pelo oEmbed público. O vídeo explica a flutuação e a estabilidade dos navios. O experimento complementa o tema mostrando o movimento do motor até a hélice. Player `youtube-nocookie.com`, criado só por clique, `autoplay=0`, controles nativos, referrer de origem e link direto sempre disponível. Capa local para não carregar o YouTube na abertura; layout landscape. Cabeçalho leva à seção `#video`. Identidade preservada; nenhum upload ou alteração de vídeo no canal.

## 2026-11-09 — motor do EP341, celular e câmera

Revisão autorizada por Victor ("faça tudo"). O motor do site contradizia o vídeo: era o RT-flex96C de 14 cilindros e 2,50 m de curso, e o EP341 fala do motor de 7 cilindros, mais de 3 m de curso e 78 rpm. Decisão: reparametrizar para o **MAN B&W 7S80ME-C8** do Ore Brasil (fontes e limites em APURACAO.md); a referência RT-flex96C fica substituída.

- Modelo, catálogo, PNG exportado e `index.html` leem as mesmas medidas (`DIMENSIONS`): 7 cilindros, 0,80 m × 3,20 m, cota A de 12,653 m (do S80MC-C8, marcada assim). Alturas e hélice seguem ilustrativas e dito na tela.
- Novos controles com fonte: velocidade "Real · 78 rpm" (1× = 15 rpm) e "Dar ré" (o comando eletrônico espelha as válvulas; etapas iguais, rotação invertida).
- Vídeo: EP106 continua até 17/11 19h UTC com contexto honesto ("não explica o motor") e Reel do motor; depois entra o Short zPVEOAuuBUg em retrato (`next`). VideoObject e texto indexável no `index.html`; título com "como funciona o motor de navio".
- Câmera: resize, tela cheia e troca de vista mantêm a direção da órbita (no corte, só espelha quem olha por trás). Toque curto seleciona sem pausar; toque no vazio não desmarca. Rolagem do mouse rola a página (Ctrl/⌘ + rolagem dá zoom); no celular, um dedo na vertical rola a página.
- Celular: texto ≥ 11 px, alvos ≥ 44 px, descrição da etapa visível, barra de ferramentas abaixo da cena. Desktop: bordas da cena com esmaecimento em vez de corte reto; corte enquadra a figura de 1,80 m acima do painel.
- Prévia `share.jpg` refeita a partir de uma captura do novo motor.
