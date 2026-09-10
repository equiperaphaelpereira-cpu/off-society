# Roteiro dos áudios do chat · Off Society

São 7 áudios curtos, estilo WhatsApp, que o Naio manda durante a conversa (etapa 2 do funil).
Tempo total estimado: ~5 minutos de fala.

Enquanto os áudios não chegam, o chat mostra cada fala como mensagem de texto — o funil já funciona sem eles.

## Como gravar

- No celular, em lugar silencioso, microfone a um palmo da boca.
- Tom de áudio de WhatsApp para um amigo: natural, sem cara de leitura. Pode trocar palavras e respirar.
- **Mantenha os fatos e as frases de cuidado** (ex.: "esse resultado é meu, com o meu capital…", "não é promessa").
- Um arquivo por áudio, com o nome indicado. Formato .m4a (memo de voz do iPhone) ou .mp3.
- Evite passar de 60 segundos por áudio.

## Como encaixar depois

1. Salvar os arquivos em `assets/audio/` com os nomes abaixo.
2. Em `assets/js/audios.js`, preencher o `src` de cada um (ex.: `src: 'assets/audio/a1-boas-vindas.m4a'`).
3. Se o Naio mudar o que fala, ajustar também o `text` — ele aparece como transcrição.

---

## A1 · Boas-vindas

**Arquivo:** `a1-boas-vindas.m4a` · ~73 palavras · ~29 segundos

> Fala, tudo certo? Aqui é o Naio. Primeiro, valeu por ter respondido o diagnóstico com sinceridade. Eu vi o seu resultado e vou te explicar, em poucos minutos, o que esse número quer dizer. Porque ele fala muito mais sobre o jeito que você opera do que sobre o mercado. E eu falo isso com propriedade, porque eu já estive exatamente nesse lugar. Escuta os próximos áudios com calma, beleza? Vale a pena.

---

## A2 · A minha história

**Arquivo:** `a2-historia.m4a` · ~117 palavras · ~47 segundos

> Antes do mercado, a minha vida era a música. Eu era fotógrafo de moda, diretor audiovisual, rapper. Em 2014, o trap tava chegando no Brasil e não existia uma festa sequer do gênero. Aí eu criei com a Luanna a Red Room, a primeira festa cem por cento trap do país, que depois virou gravadora e produtora de clipe. Depois disso eu conheci o mercado financeiro e mergulhei de cabeça. Só que eu mergulhei sozinho. Sem mentor, sem método, aprendendo na tentativa e erro. E o resultado veio rápido, só que no vermelho. Eu perdi mais de vinte mil reais. Eu fazia exatamente o que a maioria faz. E perdia do mesmo jeito que a maioria perde.

---

## A3 · A virada

**Arquivo:** `a3-virada.m4a` · ~137 palavras · ~55 segundos

> Sem ter pra quem perguntar, eu virei o meu próprio professor. Fui estudar como o mercado se move de verdade. E aí eu entendi uma coisa que mudou tudo pra mim: os movimentos mais violentos acontecem quando milhares de traders alavancados são obrigados a sair ao mesmo tempo. O prejuízo da maioria tem endereço. Ele fica onde estão os stops óbvios e os preços de liquidação. Durante anos eu operei assim, no off, só pra mim. Em 2024, numa viagem pros Estados Unidos, eu decidi abrir as estratégias. Senti que tinha compartilhado demais e voltei pro silêncio. Foram mais dois anos estudando e operando. Hoje eu tiro múltiplos seis dígitos por mês no mercado. Mas presta atenção: esse resultado é meu, com o meu capital e com os meus anos de mercado. Não é promessa pra ninguém.

> ⚠️ Quando houver valor e período comprovados, vale trocar "múltiplos seis dígitos" pelo número concreto (seção 6.2), mantendo a frase de contexto logo depois.

---

## A4 · Protocolo Cascata

**Arquivo:** `a4-protocolo.m4a` · ~150 palavras · ~60 segundos

> Eu chamo isso de Protocolo Cascata. E ele tem quatro etapas. Primeira: combustível. Antes de perguntar pra onde o preço vai, eu pergunto onde a maioria vai ser obrigada a sair. Eu mapeio onde estão os stops e a alavancagem. Segunda: gatilho. O que pode disparar esses stops. Uma notícia, a abertura de Londres, de Nova York. Terceira: cascata. Eu não tento adivinhar. Eu espero o preço chegar na zona e opero a reação. Se ele varre os stops e perde força, é reversão. Se atravessa e acelera, é continuação. E a quarta, que é a mais importante: blindagem. O meu stop nunca fica onde todo mundo coloca. E a minha alavancagem é calculada pra que o meu preço de liquidação fique além da próxima zona. Se não cabe, a posição diminui ou nem entra. Quem opera igual à maioria vira combustível da cascata. O objetivo é nunca ser combustível.

---

## A5 · Off Society

**Arquivo:** `a5-off-society.m4a` · ~104 palavras · ~42 segundos

> Foi por isso que eu abri a Off Society. É a minha comunidade fechada. Lá eu ensino do zero: desde como verificar a corretora e abrir a conta, até as estratégias avançadas, tudo pelo Protocolo Cascata. E de segunda a sexta eu entro ao vivo na Sala Off e opero na minha conta, explicando o raciocínio, o que invalidaria a ideia, e mostrando as perdas com o mesmo destaque dos ganhos. Ninguém lá dentro pergunta: entro agora? Cada um aprende a mapear a liquidez, esperar o gatilho e proteger a própria conta. E no final de toda live tem um bloco de perguntas comigo.

---

## A6 · Por que R$ 97

**Arquivo:** `a6-preco.m4a` · ~78 palavras · ~31 segundos

> Eu vivo do trade. A Off Society existe por outro motivo: eu perdi dinheiro no começo por não ter ninguém pra me mostrar o caminho, e hoje eu quero ser essa pessoa pra outras pessoas. Ensinar não tira nada de mim. O mercado de moedas gira trilhões de dólares por dia, e você operando bem não muda em nada as minhas operações. Por isso a entrada custa noventa e sete reais. Esse valor paga a estrutura da comunidade.

> ⚠️ Só grave este se **não** houver afiliação com corretora/exchange, patrocínio ou produto mais caro planejado (seção 1.1 do documento mestre). Se houver, o chat pula esta fala (`hasOtherRevenue: true` no config).

---

## A7 · Te vejo lá dentro

**Arquivo:** `a7-fechamento.m4a` · ~46 palavras · ~18 segundos

> Então é isso. Te mandei o link com tudo que tem lá dentro, as regras da sociedade e o botão pra entrar. Só lembra de uma coisa: na Off Society o nível sobe pelo diário. Print de lucro não conta. Te vejo do lado de dentro.

