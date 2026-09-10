/* ==========================================================================
   OFF SOCIETY · falas do Naio no chat
   `text` é o roteiro que o Naio vai gravar (e a transcrição exibida no chat).

   Enquanto `src` estiver vazio, o chat mostra a fala como mensagens de texto.
   Quando o áudio chegar: salve em assets/audio/<file>.m4a (ou .mp3) e preencha
   `src`. A fala vira automaticamente um áudio com player e transcrição.
   Roteiro para gravar: docs/ROTEIRO-AUDIOS.md
   ========================================================================== */
window.OFF_AUDIOS = {
  a1: {
    file: 'a1-boas-vindas',
    src: '',
    title: 'Boas-vindas',
    text: 'Fala, tudo certo? Aqui é o Naio. Primeiro, valeu por ter respondido o diagnóstico com sinceridade. Eu vi o seu resultado e vou te explicar, em poucos minutos, o que esse número quer dizer. Porque ele fala muito mais sobre o jeito que você opera do que sobre o mercado. E eu falo isso com propriedade, porque eu já estive exatamente nesse lugar. Escuta os próximos áudios com calma, beleza? Vale a pena.',
    // versão usada enquanto a fala aparece como texto
    textChat: 'Primeiro, valeu por ter respondido o diagnóstico com sinceridade. Vou te explicar, em poucos minutos, o que esse número quer dizer. Porque ele fala muito mais sobre o jeito que você opera do que sobre o mercado. E eu falo com propriedade: eu já estive exatamente nesse lugar.'
  },
  a2: {
    file: 'a2-historia',
    src: '',
    title: 'A minha história',
    text: 'Antes do mercado, a minha vida era a música. Eu era fotógrafo de moda, diretor audiovisual, rapper. Em 2014, o trap tava chegando no Brasil e não existia uma festa sequer do gênero. Aí eu criei com a Luanna a Red Room, a primeira festa cem por cento trap do país, que depois virou gravadora e produtora de clipe. Depois disso eu conheci o mercado financeiro e mergulhei de cabeça. Só que eu mergulhei sozinho. Sem mentor, sem método, aprendendo na tentativa e erro. E o resultado veio rápido, só que no vermelho. Eu perdi mais de vinte mil reais. Eu fazia exatamente o que a maioria faz. E perdia do mesmo jeito que a maioria perde.',
    textChat: 'Antes do mercado, a minha vida era a música. Eu era fotógrafo de moda, diretor audiovisual, rapper. Em 2014, o trap tava chegando no Brasil e não existia uma festa sequer do gênero. Aí eu criei com a Luanna a Red Room, a primeira festa 100% trap do país, que depois virou gravadora e produtora de clipe. Depois disso eu conheci o mercado financeiro e mergulhei de cabeça. Só que mergulhei sozinho. Sem mentor, sem método, aprendendo na tentativa e erro. O resultado veio rápido, só que no vermelho: **perdi mais de R$ 20 mil.** Eu fazia exatamente o que a maioria faz. E perdia do mesmo jeito que a maioria perde.'
  },
  a3: {
    file: 'a3-virada',
    src: '',
    title: 'A virada',
    text: 'Sem ter pra quem perguntar, eu virei o meu próprio professor. Fui estudar como o mercado se move de verdade. E aí eu entendi uma coisa que mudou tudo pra mim: os movimentos mais violentos acontecem quando milhares de traders alavancados são obrigados a sair ao mesmo tempo. O prejuízo da maioria tem endereço. Ele fica onde estão os stops óbvios e os preços de liquidação. Durante anos eu operei assim, no off, só pra mim. Em 2024, numa viagem pros Estados Unidos, eu decidi abrir as estratégias. Senti que tinha compartilhado demais e voltei pro silêncio. Foram mais dois anos estudando e operando. Hoje eu tiro múltiplos seis dígitos por mês no mercado. Mas presta atenção: esse resultado é meu, com o meu capital e com os meus anos de mercado. Não é promessa pra ninguém.',
    textChat: 'Sem ter pra quem perguntar, eu virei o meu próprio professor. Fui estudar como o mercado se move de verdade. E entendi uma coisa que mudou tudo: os movimentos mais violentos acontecem quando milhares de traders alavancados são obrigados a sair ao mesmo tempo. **O prejuízo da maioria tem endereço.** Ele fica onde estão os stops óbvios e os preços de liquidação. Durante anos eu operei assim, no off, só pra mim. Em 2024, numa viagem pros Estados Unidos, decidi abrir as estratégias. Senti que tinha compartilhado demais e voltei pro silêncio. Foram mais dois anos estudando e operando. Hoje eu tiro múltiplos seis dígitos por mês no mercado. Mas presta atenção: **esse resultado é meu, com o meu capital e com os meus anos de mercado. Não é promessa pra ninguém.**'
  },
  a4: {
    file: 'a4-protocolo',
    src: '',
    title: 'Protocolo Cascata',
    text: 'Eu chamo isso de Protocolo Cascata. E ele tem quatro etapas. Primeira: combustível. Antes de perguntar pra onde o preço vai, eu pergunto onde a maioria vai ser obrigada a sair. Eu mapeio onde estão os stops e a alavancagem. Segunda: gatilho. O que pode disparar esses stops. Uma notícia, a abertura de Londres, de Nova York. Terceira: cascata. Eu não tento adivinhar. Eu espero o preço chegar na zona e opero a reação. Se ele varre os stops e perde força, é reversão. Se atravessa e acelera, é continuação. E a quarta, que é a mais importante: blindagem. O meu stop nunca fica onde todo mundo coloca. E a minha alavancagem é calculada pra que o meu preço de liquidação fique além da próxima zona. Se não cabe, a posição diminui ou nem entra. Quem opera igual à maioria vira combustível da cascata. O objetivo é nunca ser combustível.',
    textChat: 'Funciona assim. **Combustível:** antes de perguntar pra onde o preço vai, eu pergunto onde a maioria vai ser obrigada a sair. Mapeio onde estão os stops e a alavancagem. **Gatilho:** o que pode disparar esses stops. Uma notícia, a abertura de Londres, de Nova York. **Cascata:** eu não tento adivinhar. Espero o preço chegar na zona e opero a reação. Se ele varre os stops e perde força, é reversão. Se atravessa e acelera, é continuação. **Blindagem,** a mais importante: meu stop nunca fica onde todo mundo coloca, e minha alavancagem é calculada pra que o preço de liquidação fique além da próxima zona. Se não cabe, a posição diminui ou nem entra. Quem opera igual à maioria vira combustível da cascata. **O objetivo é nunca ser combustível.**'
  },
  a5: {
    file: 'a5-off-society',
    src: '',
    title: 'Off Society',
    text: 'Foi por isso que eu abri a Off Society. É a minha comunidade fechada. Lá eu ensino do zero: desde como verificar a corretora e abrir a conta, até as estratégias avançadas, tudo pelo Protocolo Cascata. E de segunda a sexta eu entro ao vivo na Sala Off e opero na minha conta, explicando o raciocínio, o que invalidaria a ideia, e mostrando as perdas com o mesmo destaque dos ganhos. Ninguém lá dentro pergunta: entro agora? Cada um aprende a mapear a liquidez, esperar o gatilho e proteger a própria conta. E no final de toda live tem um bloco de perguntas comigo.',
    textChat: 'É a minha comunidade fechada. Lá eu ensino do zero: desde como verificar a corretora e abrir a conta, até as estratégias avançadas, tudo pelo Protocolo Cascata. E de segunda a sexta eu entro ao vivo na **Sala Off** e opero na minha conta, explicando o raciocínio, o que invalidaria a ideia, e mostrando as perdas com o mesmo destaque dos ganhos. Ninguém lá dentro pergunta “entro agora?”. Cada um aprende a mapear a liquidez, esperar o gatilho e proteger a própria conta. E no final de toda live tem um bloco de perguntas comigo.'
  },
  a6: {
    file: 'a6-preco',
    src: '',
    title: 'Por que R$ 97',
    // ATENÇÃO: só vale se NÃO houver afiliação, patrocínio ou upsell (seção 1.1).
    // Com hasOtherRevenue: true no config, o chat pula esta fala.
    text: 'Eu vivo do trade. A Off Society existe por outro motivo: eu perdi dinheiro no começo por não ter ninguém pra me mostrar o caminho, e hoje eu quero ser essa pessoa pra outras pessoas. Ensinar não tira nada de mim. O mercado de moedas gira trilhões de dólares por dia, e você operando bem não muda em nada as minhas operações. Por isso a entrada custa noventa e sete reais. Esse valor paga a estrutura da comunidade.',
    textChat: 'Eu vivo do trade. A Off Society existe por outro motivo: eu perdi dinheiro no começo por não ter ninguém pra me mostrar o caminho, e hoje eu quero ser essa pessoa pra outras pessoas. Ensinar não tira nada de mim. O mercado de moedas gira trilhões de dólares por dia, e você operando bem não muda em nada as minhas operações. Por isso a entrada custa **R$ 97**. Esse valor paga a estrutura da comunidade.'
  },
  a7: {
    file: 'a7-fechamento',
    src: '',
    title: 'Te vejo lá dentro',
    text: 'Então é isso. Te mandei o link com tudo que tem lá dentro, as regras da sociedade e o botão pra entrar. Só lembra de uma coisa: na Off Society o nível sobe pelo diário. Print de lucro não conta. Te vejo do lado de dentro.',
    textChat: 'Te mandei o link com tudo que tem lá dentro, as regras da sociedade e o botão pra entrar. Só lembra de uma coisa: na Off Society **o nível sobe pelo diário. Print de lucro não conta.** Te vejo do lado de dentro.'
  }
};
