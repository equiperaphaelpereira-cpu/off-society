/* ==========================================================================
   OFF SOCIETY · falas do Naio no chat
   Público: pessoas que nunca operaram. Linguagem que até uma criança entende.

   `text` é o roteiro que o Naio vai gravar (e a transcrição exibida no chat).
   `textChat` é a versão usada enquanto o áudio não existe (vira mensagem de texto).
   Quando o áudio chegar: salve em assets/audio/<file>.m4a (ou .mp3) e preencha
   `src`. A fala vira automaticamente um áudio com player e transcrição.
   Roteiro para gravar: docs/ROTEIRO-AUDIOS.md
   ========================================================================== */
window.OFF_AUDIOS = {
  a1: {
    file: 'a1-boas-vindas',
    src: '',
    title: 'Boas-vindas',
    text: 'Oi, tudo bem? Aqui é o Naio. Primeiro, valeu por ter respondido o diagnóstico. E relaxa: se você nunca ouviu falar de mercado financeiro, você tá no lugar certo. Eu também comecei do zero. Vou te mandar uns áudios curtinhos explicando tudo, sem palavra difícil. Escuta com calma, beleza?',
    textChat: 'Primeiro, valeu por ter respondido o diagnóstico. E relaxa: se você nunca ouviu falar de mercado financeiro, você tá no lugar certo. **Eu também comecei do zero.** Vou te explicar tudo por aqui, sem palavra difícil.'
  },
  h1: {
    file: 'historia-1',
    src: 'assets/audio/historia-1.m4a',
    srcOgg: 'assets/audio/historia-1.ogg',
    duration: 40,
    title: 'Minha história · Parte 1',
    text: 'Até 2018, a minha vida era a música. Trabalhei com tudo na cena. Aí descobri o mercado financeiro e me joguei de cabeça.',
    textChat: 'Até 2018, a minha vida era a música. Aí descobri o mercado financeiro e me joguei de cabeça.'
  },
  h2: {
    file: 'historia-2',
    src: 'assets/audio/historia-2.m4a',
    srcOgg: 'assets/audio/historia-2.ogg',
    duration: 35,
    title: 'Minha história · Parte 2',
    text: 'Só que me joguei sozinho, sem ninguém pra ensinar. E perdi mais de vinte mil reais fazendo exatamente o que a maioria faz.',
    textChat: 'Só que me joguei sozinho, sem ninguém pra ensinar. E perdi mais de R$ 20 mil fazendo exatamente o que a maioria faz.'
  },
  h3: {
    file: 'historia-3',
    src: 'assets/audio/historia-3.m4a',
    srcOgg: 'assets/audio/historia-3.ogg',
    duration: 31,
    title: 'Minha história · Parte 3',
    text: 'Aí virei meu próprio professor e entendi: a maioria perde junta porque faz a mesma coisa na mesma hora. Quando parei de seguir a manada, tudo mudou.',
    textChat: 'Aí entendi que a maioria perde junta porque faz a mesma coisa na mesma hora. Quando parei de seguir a multidão, tudo mudou.'
  },
  a2: {
    file: 'a2-historia',
    src: 'assets/audio/historia-1.m4a',
    srcOgg: 'assets/audio/historia-1.ogg',
    title: 'Quem eu sou',
    text: 'Até 2018, a minha vida era a música. Trabalhei com tudo que você possa imaginar na cena. Aí eu descobri o mercado financeiro e me joguei de cabeça. Só que eu me joguei sozinho, sem ninguém pra me ensinar. E perdi mais de vinte mil reais fazendo exatamente o que a maioria faz.',
    textChat: 'Até 2018, a minha vida era a música. Aí descobri o mercado financeiro e me joguei de cabeça. Só que me joguei sozinho, sem ninguém pra me ensinar. E perdi mais de R$ 20 mil fazendo exatamente o que a maioria faz.'
  },
  a3: {
    file: 'a3-virada',
    src: 'assets/audio/historia-3.m4a',
    srcOgg: 'assets/audio/historia-3.ogg',
    title: 'O que mudou',
    text: 'Aí eu virei o meu próprio professor. E entendi uma coisa simples, que ninguém tinha me explicado: a maioria perde junto porque faz a mesma coisa, na mesma hora. Quando eu parei de fazer igual a todo mundo, tudo mudou. Hoje eu tiro múltiplos seis dígitos por mês no mercado. Mas presta atenção: esse resultado é meu, com o meu dinheiro e os meus anos de mercado. Não é promessa pra ninguém.',
    textChat: 'Aí eu virei o meu próprio professor. E entendi uma coisa simples, que ninguém tinha me explicado: a maioria perde junto porque faz a mesma coisa, na mesma hora. Quando parei de fazer igual a todo mundo, tudo mudou. Hoje eu tiro múltiplos seis dígitos por mês no mercado. Mas presta atenção: esse resultado é meu, com o meu dinheiro e os meus anos de mercado. Não é promessa pra ninguém.'
  },
  a4: {
    file: 'a4-feira-e-domino',
    src: '',
    title: 'O mercado explicado fácil',
    text: 'Vou te explicar como se você tivesse dez anos. Imagina uma feira. Se todo mundo quer comprar a mesma fruta, o preço dela sobe. Se todo mundo quer vender ao mesmo tempo, o preço cai. O mercado é só isso: gente comprando e vendendo. Agora imagina uma fileira de dominó. Você empurra a primeira peça, ela derruba a segunda, que derruba a terceira. No mercado, quando muita gente fica com medo e vende ao mesmo tempo, uma venda empurra a outra, e o preço despenca rapidinho. Eu chamo isso de cascata. E quem tá no meio da fileira, cai junto.',
    textChat: 'Imagina uma feira. Se todo mundo quer comprar a mesma fruta, o preço dela sobe. Se todo mundo quer vender ao mesmo tempo, o preço cai. O mercado é só isso: gente comprando e vendendo. Agora imagina uma fileira de dominó. Você empurra a primeira peça, ela derruba a segunda, que derruba a terceira. No mercado, quando muita gente fica com medo e vende ao mesmo tempo, uma venda empurra a outra, e o preço despenca rapidinho. Eu chamo isso de cascata. E quem tá no meio da fileira, cai junto.'
  },
  a5: {
    file: 'a5-quatro-passos',
    src: '',
    title: 'O que eu faço',
    text: 'E o que eu faço? Quatro coisas, sempre na mesma ordem. Primeiro, eu olho onde a fileira de dominó tá montada, ou seja, onde tá todo mundo. Segundo, eu vejo o que pode dar o empurrão, tipo uma notícia. Terceiro, eu espero as peças caírem e só depois eu entro, nunca no chute. E quarto: antes de entrar, eu coloco o capacete. Eu decido quanto eu aceito perder, igual a quem coloca capacete antes de andar de bicicleta. Esses quatro passos são o Protocolo Cascata.',
    textChat: 'Quatro coisas, sempre na mesma ordem. Um: olho onde a fileira de dominó tá montada, ou seja, onde tá todo mundo. Dois: vejo o que pode dar o empurrão, tipo uma notícia. Três: espero as peças caírem e só depois entro, nunca no chute. Quatro: antes de entrar, coloco o capacete. Decido quanto aceito perder, igual a quem coloca capacete antes de andar de bicicleta. Esses quatro passos são o Protocolo Cascata.'
  },
  a6: {
    file: 'a6-modo-treino',
    src: '',
    title: 'Modo treino',
    text: 'E lá dentro ninguém começa com dinheiro de verdade. É igual videogame: primeiro você joga no modo treino. Você opera numa conta com dinheiro de mentira, junto comigo, ao vivo. Só quando o seu diário mostra que você tá pronto, você passa pro dinheiro real, e com valor pequeno. Sem pressa e sem aposta.',
    textChat: 'E lá dentro ninguém começa com dinheiro de verdade. É igual videogame: primeiro você joga no modo treino. Você opera numa conta com dinheiro de mentira, junto comigo, ao vivo. Só quando o seu diário mostra que você tá pronto, você passa pro dinheiro real, e com valor pequeno. Sem pressa e sem aposta.'
  },
  a7: {
    file: 'a7-off-society',
    src: '',
    title: 'Off Society',
    text: 'Foi por isso que eu criei a Off Society. É a minha comunidade fechada. Lá eu ensino do zero absoluto: o que é dólar, o que é bitcoin, como escolher uma corretora segura, até as estratégias que eu uso. E de segunda a sexta a gente tem o meet fechado 3 vezes por dia: às 9h, 15h e 20h. Tem abertura, troca de ideia, 3 operações ao vivo onde eu opero na minha conta explicando tudo, dúvidas e encerramento. Seguindo esses meets, tem aluno meu fazendo de 500 a 1.000 reais por dia.',
    textChat: 'É a minha comunidade fechada. Lá eu ensino do zero absoluto: o que é dólar, o que é bitcoin, como escolher uma corretora segura, até as estratégias que eu uso. E de segunda a sexta a gente tem o meet fechado 3 vezes por dia: às 9h, 15h e 20h. Tem abertura, troca de ideia, 3 operações ao vivo na minha conta, dúvidas e encerramento. Seguindo os meets, alunos fazem até R$ 500 a R$ 1.000 por dia.'
  },
  a8: {
    file: 'a8-preco',
    src: '',
    title: 'Por que R$ 97',
    // ATENÇÃO: só vale se NÃO houver afiliação, patrocínio ou upsell (seção 1.1).
    // Com hasOtherRevenue: true no config, o chat pula esta fala.
    text: 'Eu vivo do trade. A Off Society existe por outro motivo: eu perdi dinheiro no começo por não ter ninguém pra me mostrar o caminho, e hoje eu quero ser essa pessoa pra você. Ensinar não tira nada de mim. Por isso a entrada custa noventa e sete reais. Uma vez só. Sem mensalidade, e o acesso é pra sempre.',
    textChat: 'Eu vivo do trade. A Off Society existe por outro motivo: perdi dinheiro no começo por não ter ninguém pra me mostrar o caminho, e hoje quero ser essa pessoa pra você. Ensinar não tira nada de mim. Por isso a entrada custa **R$ 97. Uma vez só. Sem mensalidade, e o acesso é pra sempre.**'
  },
  a9: {
    file: 'a9-golpe',
    src: '',
    title: 'Isso é golpe?',
    text: 'Pergunta mais do que justa, tem muito golpe por aí. Então vou ser bem direto. Aqui ninguém pede pra você depositar dinheiro com a gente. Ninguém promete rendimento. E não é pirâmide: você não precisa trazer ninguém. Você paga a comunidade, aprende, e se um dia quiser operar, opera na sua própria conta, numa corretora que você mesmo aprende a verificar. O seu dinheiro fica sempre com você.',
    textChat: 'Pergunta mais do que justa, tem muito golpe por aí. Vou ser direto: **aqui ninguém pede pra você depositar dinheiro com a gente.** Ninguém promete rendimento. E não é pirâmide: você não precisa trazer ninguém. Você paga a comunidade, aprende, e se um dia quiser operar, opera na sua própria conta, numa corretora que você mesmo aprende a verificar. **O seu dinheiro fica sempre com você.**'
  },
  a10: {
    file: 'a10-fechamento',
    src: '',
    title: 'Te vejo lá dentro',
    text: 'Então é isso. Te mandei o link com tudo que tem lá dentro e o botão pra entrar. Só lembra de uma coisa: na Off Society, ninguém sobe de nível por print de lucro. O que conta é o seu diário, dia bom e dia ruim. Te vejo do lado de dentro.',
    textChat: 'Te mandei o link com tudo que tem lá dentro e o botão pra entrar. Só lembra de uma coisa: na Off Society, **ninguém sobe de nível por print de lucro.** O que conta é o seu diário, dia bom e dia ruim. Te vejo do lado de dentro.'
  }
};
