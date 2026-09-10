#!/usr/bin/env node
/* ==========================================================================
   Gera docs/ROTEIRO-AUDIOS.md a partir de assets/js/audios.js
   (fonte única: o mesmo texto vira roteiro de gravação e transcrição no chat).
   Uso: node tools/gerar-roteiro-audios.mjs
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {} };
vm.runInNewContext(readFileSync(join(root, 'assets/js/audios.js'), 'utf8'), ctx);
const AUDIOS = ctx.window.OFF_AUDIOS;
const words = (t) => t.split(/\s+/).length;
const total = Object.values(AUDIOS).reduce((s, a) => s + words(a.text), 0);

let md = `# Roteiro dos áudios do chat · Off Society

São ${Object.keys(AUDIOS).length} áudios curtos, estilo WhatsApp, que o Naio manda durante a conversa (etapa 2 do funil).
Tempo total estimado: ~${Math.round(total / 2.5 / 60)} minutos de fala.

Enquanto os áudios não chegam, o chat mostra cada fala como mensagem de texto — o funil já funciona sem eles.

## Como gravar

- No celular, em lugar silencioso, microfone a um palmo da boca.
- Tom de áudio de WhatsApp para um amigo: natural, sem cara de leitura. Pode trocar palavras e respirar.
- **Mantenha os fatos e as frases de cuidado** (ex.: "esse resultado é meu, com o meu capital…", "não é promessa").
- Um arquivo por áudio, com o nome indicado. Formato .m4a (memo de voz do iPhone) ou .mp3.
- Evite passar de 60 segundos por áudio.

## Como encaixar depois

1. Salvar os arquivos em \`assets/audio/\` com os nomes abaixo.
2. Em \`assets/js/audios.js\`, preencher o \`src\` de cada um (ex.: \`src: 'assets/audio/a1-boas-vindas.m4a'\`).
3. Se o Naio mudar o que fala, ajustar também o \`text\` — ele aparece como transcrição.

`;
for (const [id, a] of Object.entries(AUDIOS)) {
  const w = words(a.text);
  md += `---

## ${id.toUpperCase()} · ${a.title}

**Arquivo:** \`${a.file}.m4a\` · ~${w} palavras · ~${Math.round(w / 2.5)} segundos

> ${a.text}

`;
  if (id === 'a6') md += `> ⚠️ Só grave este se **não** houver afiliação com corretora/exchange, patrocínio ou produto mais caro planejado (seção 1.1 do documento mestre). Se houver, o chat pula esta fala (\`hasOtherRevenue: true\` no config).\n\n`;
  if (id === 'a3') md += `> ⚠️ Quando houver valor e período comprovados, vale trocar "múltiplos seis dígitos" pelo número concreto (seção 6.2), mantendo a frase de contexto logo depois.\n\n`;
}
mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(join(root, 'docs/ROTEIRO-AUDIOS.md'), md);
console.log('✓ docs/ROTEIRO-AUDIOS.md');
