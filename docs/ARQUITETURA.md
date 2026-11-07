# Arquitetura implementada

React 19.2.6, TypeScript 5.9.3, Three.js 0.187.0 e Vite 8.3.6; versões fixas no lockfile. Aplicação estática com base `./`. Fontes Fontsource locais, sem chamadas a serviços na carga inicial.

| Arquivo | Responsabilidade |
|---|---|
| `src/simulation/engine.ts` | Ângulo 0–360°, cinemática de cruzeta, curso, válvula didática, janelas geometricamente descobertas e relógio limitado. |
| `src/scene/model.ts` | Geometria autoral de seis grupos, cilindro de demonstração, repetição estrutural dos outros treze, hélice e referência humana. |
| `src/scene/rig.ts` | Aplica uma pose absoluta: pistão, haste, biela, virabrequim, eixo, válvula e indicadores de ar. |
| `src/scene/runtime.ts` | WebGL, câmera, seleção, corte, isolamento, escala, demanda de renderização e perda de contexto. |
| `src/scene/camera.ts`, `capture.ts` | Enquadramento por limites projetados e exportação 1920×1080 / 1080×1920, restaurando a câmera. |
| `src/content/` | Catálogo, explicações, referências e limites visíveis. |
| `src/App.tsx`, `src/ui/` | Estado, catálogo, tour, controles HTML, diálogos e fallback. |

## Invariantes

Unidade metro. `sampleEngine` normaliza o ângulo e devolve uma pose pura. Raio da manivela = curso/2; comprimento da biela constante, cruzeta sem deslocamento lateral, haste vertical. A linha de eixo e a hélice recebem a mesma rotação. O app não representa a ordem de ignição dos demais cilindros.

O corte oculta tampas/passarelas do último vão e recorta a camisa. É um recurso de inspeção, não desmontagem. Trocar vista ou comparar escala não redimensiona peças. O reset volta a 45°, motor fechado, velocidade 1×, parado e sem seleção. Isolar armazena a câmera anterior e restaura ao retornar.

O relógio usa tempo decorrido, limita cada passo a 0,1 s e só avança quando reproduzindo e visível. Renderização limitada a 30 Hz, sob demanda em repouso, suspensa quando a aba está oculta. DPR ≤1,5, sombra de 1024², meshes estáticos combinados por material. Sem física geral, áudio ou texturas de terceiros.

## Entrega e limites

`npm test`, `npm run check`, `npm run build`. Build sem backend, testado em `/motor-navio/` com recarga direta. Falha de WebGL preserva explicações/fontes e desabilita reprodução. Captura PNG inclui marca e identificação de esquema; a vista de escala também inclui as duas cotas e a natureza da referência humana.

Sete testes cobrem cinemática, um ciclo por volta, abertura, relógio, articulação real do rig, retorno sem deriva e câmera. Detalhes e métricas em VALIDACAO.md. Sem deploy ou integração no site principal nesta entrega.
