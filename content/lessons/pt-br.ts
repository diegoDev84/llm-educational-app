import type { Lesson } from "@/lib/lesson-types"

export const lessons: Lesson[] = [
  {
    title: "Introdução: Como funcionam os LLMs",
    slug: "how-llms-work",
    module: "Fundamentos",
    summary: "Entenda a mecânica fundamental dos LLMs para conseguir raciocinar sobre sistemas reais com modelos de linguagem",
    duration: "15 min",
    goals: [
      "Entender como a arquitetura Transformer permite a geração de texto",
      "Aprender sobre predição do próximo token e geração autoregressiva",
      "Reconhecer as limitações dos LLMs em relação a memória e compreensão"
    ],
    sections: [
      {
        title: "A arquitetura Transformer",
        content: `Grandes modelos de linguagem (LLMs) são redes neurais treinadas em quantidades massivas de texto para entender e gerar linguagem semelhante à humana. Em essência, funcionam prevendo o token mais provável em uma sequência.

Os LLMs modernos são construídos sobre a arquitetura Transformer, introduzida no artigo de 2017 "Attention Is All You Need". A inovação central é o **mecanismo de atenção**, que permite ao modelo ponderar a relevância de diferentes partes da entrada ao gerar cada token de saída.

Quando você envia um prompt a um LLM, acontece o seguinte:

1. **Tokenização**: Seu texto é dividido em tokens (palavras ou pedaços de palavras)
2. **Embedding**: Cada token é convertido em um vetor numérico
3. **Processamento**: Os vetores passam por múltiplas camadas transformer
4. **Predição**: O modelo produz probabilidades para o próximo token
5. **Geração**: Um token é selecionado e o processo se repete`
      },
      {
        title: "Predição do próximo token",
        content: `LLMs são fundamentalmente modelos **autoregressivos**. Isso significa que geram texto um token por vez, usando todos os tokens anteriores como contexto. O modelo não "compreende" no sentido humano — ele prevê padrões estatísticos aprendidos dos dados de treinamento.

Por exemplo, quando você digita "A capital da França é", o modelo prevê "Paris" com alta probabilidade porque viu esse padrão milhões de vezes nos dados de treinamento.`
      },
      {
        title: "Ideia central",
        content: `O modelo não tem memória entre conversas. Cada requisição começa do zero. O que parece "compreensão" é na verdade correspondência sofisticada de padrões entre bilhões de parâmetros aprendidos durante o treinamento.

O modelo pode gerar código porque aprendeu os padrões estatísticos de como o código é estruturado a partir de milhões de exemplos.`
      }
    ],
    playground: {
      description: "Experimente estes prompts para ver como os LLMs preveem e geram texto com base em padrões aprendidos no treinamento.",
      starterPrompts: [
        {
          label: "Completar padrão",
          prompt: "Complete esta frase: A raposa marrom rápida",
          explanation: "Observe como o modelo completa uma frase conhecida. Não está recuperando da memória — está prevendo a continuação estatisticamente mais provável com base nos padrões de treinamento."
        },
        {
          label: "Geração criativa",
          prompt: "Escreva a primeira linha de uma história sobre um robô que descobre emoções",
          explanation: "Isso demonstra a capacidade gerativa. O modelo combina padrões aprendidos sobre aberturas de história, robôs e emoções para criar algo novo."
        },
        {
          label: "Extração de conhecimento",
          prompt: "Explique o emaranhado quântico em um parágrafo",
          explanation: "O modelo sintetiza informações do treinamento para explicar conceitos. Atenção: pode afirmar com confiança informações incorretas se os padrões nos dados de treinamento estiverem errados."
        }
      ]
    },
    commonMistakes: [
      "Achar que o modelo 'sabe' ou 'lembra' informações como um banco de dados — ele prevê com base em padrões",
      "Esperar precisão factual perfeita — LLMs podem alucinar informações convincentes mas falsas",
      "Achar que o modelo entende contexto entre conversas separadas — cada requisição é independente",
      "Acreditar que modelos maiores são sempre melhores — o modelo certo depende do seu caso de uso"
    ],
    takeaways: [
      "LLMs geram texto prevendo o próximo token mais provável com base em padrões de treinamento",
      "A arquitetura transformer permite que o modelo considere contexto ao fazer predições",
      "Modelos não têm memória persistente — cada conversa começa do zero",
      "Compreensão é correspondência de padrões, não compreensão real — sempre verifique informações críticas"
    ]
  },
  {
    title: "Tokens: a moeda dos LLMs",
    slug: "tokens",
    module: "Fundamentos",
    summary: "Aprenda o que são tokens e por que importam para custo e contexto",
    duration: "12 min",
    goals: [
      "Entender o que são tokens e como o texto é tokenizado",
      "Aprender por que a contagem de tokens importa para custo e limites de contexto",
      "Reconhecer como diferentes tipos de conteúdo tokenizam de forma diferente"
    ],
    sections: [
      {
        title: "O que são tokens?",
        content: `Um token é um pedaço de texto que o modelo processa como uma unidade. Tokens podem ser:

- Palavras inteiras: "olá" → 1 token
- Pedaços de palavras: "infelicidade" → ["in", "felicidade"] → 2 tokens
- Pontuação: "!" → 1 token
- Números: "2024" pode ser 1–2 tokens dependendo do tokenizador

Como regra aproximada: **1 token ≈ 4 caracteres** ou **100 tokens ≈ 75 palavras** em português.`
      },
      {
        title: "Por que tokens importam",
        content: `### Custo
O preço de API costuma ser por token. Tanto tokens de entrada (prompt) quanto de saída (completion) são contados. Um prompt verboso custa mais que um conciso.

### Janela de contexto
Cada modelo tem um comprimento máximo de contexto (ex.: 8K, 32K, 128K tokens). Esse limite inclui sua entrada E a saída do modelo. Um modelo de 32K de contexto processa cerca de 24.000 palavras no total.

### Desempenho
Contextos longos podem afetar a qualidade da resposta. Informações no início e no fim de prompts longos tendem a ter mais peso que as do meio.`
      },
      {
        title: "Diferenças de tokenização",
        content: `Modelos diferentes usam tokenizadores diferentes:

- GPT-4 usa o tokenizador cl100k_base
- Claude usa seu próprio tokenizador
- Modelos open-source costumam usar SentencePiece ou tokenizadores customizados

O mesmo texto pode ter contagens de token diferentes entre modelos. A palavra "indescritível" pode ser dividida em ["ind", "esc", "rit", "ível"] = 4 tokens em tokenizadores GPT. Código costuma ter densidade maior: "function(){}" pode ser 5+ tokens por causa dos caracteres especiais.`
      }
    ],
    playground: {
      description: "Experimente com prompts para ver como a eficiência de tokens afeta custo e qualidade da saída.",
      starterPrompts: [
        {
          label: "Prompt eficiente em tokens",
          prompt: "Liste 5 linguagens de programação",
          explanation: "Prompts curtos e diretos usam menos tokens. Este prompt inteiro tem só cerca de 5 tokens, deixando mais espaço para a resposta."
        },
        {
          label: "Prompt pesado em tokens",
          prompt: "Eu realmente gostaria que você pudesse gentilmente me fornecer uma lista abrangente de aproximadamente cinco linguagens de programação diferentes que são comumente usadas na indústria de desenvolvimento de software hoje",
          explanation: "Pede a mesma coisa mas usa ~40 tokens. As palavras extras aumentam o custo sem melhorar a qualidade da saída."
        },
        {
          label: "Tokenização de código",
          prompt: "Escreva uma arrow function em JavaScript que soma dois números",
          explanation: "Note como a geração de código afeta os tokens de saída. Símbolos como =>, {} e () consomem tokens cada um."
        }
      ]
    },
    commonMistakes: [
      "Ignorar custos de token em produção — prompts verbosos em escala ficam caros rápido",
      "Não considerar tokens de saída — um pedido de 'explicação detalhada' gera muitos tokens de saída",
      "Assumir que contagem de palavras é igual a contagem de tokens — caracteres especiais e código tokenizam diferente",
      "Encher as janelas de contexto por completo — isso pode degradar a qualidade da resposta"
    ],
    takeaways: [
      "Tokens são a unidade de medida para entrada e saída de LLMs, aproximadamente 4 caracteres cada",
      "Tokens de entrada e saída contam para custo e limites de contexto",
      "Modelos diferentes tokenizam o mesmo texto de forma diferente",
      "Prompting eficiente significa obter bons resultados com menos tokens"
    ]
  },
  {
    title: "Controlando o modelo: parâmetros de geração",
    slug: "generation-parameters",
    module: "Fundamentos",
    summary: "Domine os parâmetros que controlam como os LLMs geram texto",
    duration: "15 min",
    goals: [
      "Entender temperatura e seu efeito na aleatoriedade da saída",
      "Aprender sobre top-p, max_tokens e outros parâmetros de geração",
      "Saber quando usar cada parâmetro para tarefas diferentes"
    ],
    sections: [
      {
        title: "Temperatura (0,0 - 2,0)",
        content: `A temperatura controla a aleatoriedade da seleção de tokens:

- **0,0**: Determinístico — sempre escolhe o token de maior probabilidade. Melhor para tarefas factuais.
- **0,7**: Equilibrado — bom padrão para a maioria das tarefas
- **1,0+**: Criativo — mais aleatório, saídas inesperadas. Bom para brainstorm.

Pense na temperatura como o "botão de criatividade".`
      },
      {
        title: "Top-P (amostragem por núcleo)",
        content: `Top-P (0,0 - 1,0) limita a seleção de tokens ao menor conjunto cuja probabilidade acumulada excede P:

- **0,1**: Muito focado — considera só os tokens mais prováveis
- **0,9**: Amplo — considera opções mais diversas
- **1,0**: Considera todos os tokens

Use temperatura OU top-p para controle, não os dois ao mesmo tempo.`
      },
      {
        title: "Max tokens",
        content: `Define o comprimento máximo da resposta gerada. Importante para:

- **Controle de custo**: Limita os tokens de saída faturados
- **Formato da resposta**: Garante respostas concisas
- **Gestão de contexto**: Deixa espaço para trocas de follow-up`
      },
      {
        title: "Outros parâmetros",
        content: `### Sequências de parada
Strings que terminam a geração quando encontradas. Úteis para saídas estruturadas.

### Frequency penalty (0,0 - 2,0)
Reduz repetição penalizando tokens que já apareceram. Valores maiores = menos repetição.

### Presence penalty (0,0 - 2,0)
Incentiva o modelo a introduzir novos tópicos. Valores maiores = conteúdo mais diverso.`
      }
    ],
    playground: {
      description: "Experimente diferentes configurações de parâmetros para ver como afetam a saída.",
      starterPrompts: [
        {
          label: "Baixa temperatura (factual)",
          prompt: "Qual é a capital do Japão? Responda em uma palavra.",
          explanation: "Com baixa temperatura, o modelo dá a resposta mais provável: 'Tóquio'. As respostas são consistentes entre execuções."
        },
        {
          label: "Alta temperatura (criativo)",
          prompt: "Invente um nome para uma nova cor que não existe e descreva-a",
          explanation: "Temperatura mais alta permite saídas criativas e inesperadas. Rode várias vezes para ver respostas variadas."
        },
        {
          label: "Saída restrita",
          prompt: "Descreva o oceano em exatamente 10 palavras",
          explanation: "Combinar uma instrução específica com max_tokens ajuda a controlar o comprimento da saída com precisão."
        },
        {
          label: "Geração estruturada",
          prompt: "Liste três frutas, uma por linha",
          explanation: "Sequências de parada podem encerrar a geração após um formato específico. Instruções claras de formatação ajudam a estruturar a saída."
        }
      ]
    },
    commonMistakes: [
      "Usar alta temperatura para tarefas que exigem precisão — leva a alucinações",
      "Definir max_tokens muito baixo — respostas são cortadas no meio da frase",
      "Usar temperatura e top_p juntos — competem; use um ou outro",
      "Não testar parâmetros — valores ótimos variam por caso de uso"
    ],
    takeaways: [
      "Temperatura controla aleatoriedade: baixa para precisão, alta para criatividade",
      "Top-P é uma alternativa à temperatura para controlar diversidade",
      "Max tokens limita o comprimento da saída e controla custos",
      "Sempre teste combinações de parâmetros para o seu caso de uso"
    ]
  },
  {
    title: "Anatomia de um bom prompt",
    slug: "anatomy-of-prompt",
    module: "Comunicando com LLMs",
    summary: "Aprenda os componentes de prompts eficazes",
    duration: "18 min",
    goals: [
      "Entender o framework CRISPE para estruturar prompts",
      "Aprender boas práticas de clareza e especificidade",
      "Saber usar delimitadores e formatação de forma eficaz"
    ],
    sections: [
      {
        title: "O framework CRISPE",
        content: `Um prompt forte costuma incluir estes elementos:

### C - Contexto
Informações de fundo que o modelo precisa para entender a tarefa.

### R - Papel
Quem o modelo deve interpretar (especialista, assistente, personagem).

### I - Instruções
Orientações claras e específicas do que fazer.

### S - Especificidades
Detalhes sobre formato, extensão, estilo ou restrições.

### P - Persona
Tom e características de voz da resposta.

### E - Exemplos
Exemplos de entradas e saídas para demonstrar expectativas.`
      },
      {
        title: "Boas práticas de estrutura de prompt",
        content: `### Seja específico, não vago
❌ "Escreva algo sobre cachorros"
✅ "Escreva um parágrafo informativo de 100 palavras sobre o temperamento de Golden Retrievers para donos de primeira viagem"

### Use delimitadores claros
Separe partes diferentes do prompt com marcadores claros:

\`\`\`
Contexto: [Seu contexto aqui]
---
Tarefa: [Sua tarefa aqui]
---
Formato: [Formato esperado da saída]
\`\`\`

### A ordem importa
Coloque as informações mais importantes no início e no fim dos prompts. Informações no meio podem receber menos atenção (o problema do "perdido no meio").

### Seja explícito sobre o formato
Se quiser uma lista, diga "como lista numerada". Se quiser JSON, especifique o schema.`
      }
    ],
    playground: {
      description: "Compare prompts vagos e estruturados para ver a diferença na qualidade da saída.",
      starterPrompts: [
        {
          label: "Prompt vago",
          prompt: "Fale sobre aprendizado de máquina",
          explanation: "Este prompt vago produz uma resposta genérica e sem foco. O modelo não sabe seu nível, interesses ou profundidade desejada."
        },
        {
          label: "Prompt estruturado",
          prompt: "Você é um professor de ciência da computação. Explique aprendizado de máquina para um aluno de primeiro ano de CC em 3 frases. Foque no conceito central, evite jargão e use uma analogia.",
          explanation: "Este prompt especifica papel, audiência, extensão, foco, estilo e técnica. A saída será muito mais direcionada."
        },
        {
          label: "Prompt com formato específico",
          prompt: "Liste 3 benefícios de exercício regular.\n\nFormate sua resposta assim:\n- Benefício: [nome]\n  Por quê: [explicação em uma frase]",
          explanation: "Instruções explícitas de formatação garantem saída consistente e parseável que atende às suas necessidades."
        }
      ]
    },
    commonMistakes: [
      "Ser vago demais — 'escreva algo bom' não dá direção ao modelo",
      "Sobrecarregar com instruções — muitos requisitos conflitantes confundem o modelo",
      "Assumir contexto — o modelo não conhece seus pensamentos ou projetos anteriores",
      "Esquecer requisitos de formato — se precisa de saída estruturada, especifique explicitamente"
    ],
    takeaways: [
      "Estruture prompts com contexto, papel, instruções, especificidades e exemplos",
      "Seja específico sobre formato, extensão, tom e audiência",
      "Use delimitadores para separar claramente partes de prompts complexos",
      "Coloque informações críticas no início e no fim, não no meio"
    ]
  },
  {
    title: "System prompts e personas",
    slug: "system-prompts",
    module: "Comunicando com LLMs",
    summary: "Molde o comportamento do modelo com system prompts e personas",
    duration: "15 min",
    goals: [
      "Entender o que são system prompts e como funcionam",
      "Aprender a desenhar personas eficazes para diferentes casos de uso",
      "Conhecer padrões comuns de design de system prompt"
    ],
    sections: [
      {
        title: "O que é um system prompt?",
        content: `Um system prompt é uma mensagem privilegiada que:
- Define regras de comportamento persistentes
- Define o papel e as capacidades da IA
- Estabelece restrições e diretrizes
- Normalmente é invisível para o usuário final

A maioria das APIs distingue mensagens "system" e "user", dando prioridade ao system prompt.`
      },
      {
        title: "Desenhando personas eficazes",
        content: `### Defina o papel com clareza
\`\`\`
Você é um arquiteto de software sênior com 15 anos de experiência
em sistemas distribuídos. Você prioriza escalabilidade e manutenibilidade.
\`\`\`

### Defina regras de comportamento
\`\`\`
Regras:
- Sempre faça perguntas de esclarecimento antes de dar soluções
- Cite trade-offs para cada recomendação
- Nunca recomende tecnologias obsoletas
\`\`\`

### Estabeleça limites
\`\`\`
Limitações:
- Você só pode discutir tópicos relacionados a arquitetura de software
- Você não pode escrever ou executar código diretamente
- Você deve reconhecer incerteza quando aplicável
\`\`\``
      },
      {
        title: "Padrões de system prompt",
        content: `### Padrão do especialista
Posicione o modelo como especialista de domínio com conhecimento e abordagem específicos.

### Padrão da persona
Dê ao modelo um personagem com traços de personalidade, estilo de fala e valores.

### Padrão de segurança
Inclua instruções para lidar com casos extremos, tópicos sensíveis e condições de erro.`
      }
    ],
    playground: {
      description: "Veja como system prompts mudam o comportamento e o foco do modelo.",
      starterPrompts: [
        {
          label: "Sem system prompt",
          prompt: "Revise este código: function add(a,b) { return a + b }",
          explanation: "Sem system prompt, você recebe uma revisão genérica. O modelo não conhece seus padrões nem em que aspectos focar."
        },
        {
          label: "Persona de especialista",
          prompt: "[System: Você é um desenvolvedor TypeScript sênior que prioriza type safety e código limpo. Seja conciso mas completo.]\n\nRevise este código: function add(a,b) { return a + b }",
          explanation: "Com uma persona, a revisão foca em questões específicas de TypeScript, como anotações de tipo faltando."
        },
        {
          label: "Persona com restrições",
          prompt: "[System: Você é um assistente de culinária prestativo. Só pode falar de culinária, receitas e cozinha. Redirecione educadamente perguntas fora do tema.]\n\nQual a melhor linguagem de programação?",
          explanation: "Isso mostra como system prompts podem estabelecer limites e redirecionar pedidos fora do tema."
        }
      ]
    },
    commonMistakes: [
      "Fazer system prompts longos demais — o modelo pode ignorar partes de instruções muito complexas",
      "Instruções conflitantes — regras contraditórias confundem o modelo",
      "Não testar casos extremos — usuários vão tentar quebrar ou contornar seu system prompt",
      "Assumir conformidade perfeita — modelos ainda podem desviar das instruções do system prompt"
    ],
    takeaways: [
      "System prompts definem regras de comportamento persistentes para toda a conversa",
      "Defina papéis, regras e limites claros nos system prompts",
      "Use padrões como Especialista, Persona e Segurança para casos de uso diferentes",
      "Teste bem — usuários vão encontrar formas de desafiar seu system prompt"
    ]
  },
  {
    title: "Few-shot learning",
    slug: "few-shot-learning",
    module: "Comunicando com LLMs",
    summary: "Ensine novas tarefas ao modelo por meio de exemplos",
    duration: "12 min",
    goals: [
      "Entender few-shot learning e quando usar",
      "Aprender a montar conjuntos de exemplos eficazes",
      "Conhecer os trade-offs entre zero-shot, one-shot e few-shot"
    ],
    sections: [
      {
        title: "O que é few-shot learning?",
        content: `Few-shot learning ensina o modelo fornecendo exemplos dos pares entrada-saída desejados. Em vez de explicar o que fazer, você mostra.

### Zero-shot
Sem exemplos, só instruções. Funciona para tarefas comuns.

### One-shot
Um único exemplo. Bom para padrões simples.

### Few-shot
Vários exemplos (tipicamente 3–5). Melhor para tarefas complexas ou incomuns.`
      },
      {
        title: "Criando exemplos eficazes",
        content: `### Diversidade
Inclua exemplos que cubram diferentes casos:
- Formatos de entrada diferentes
- Casos extremos
- Extensões de saída variadas

### Consistência
Mantenha o formato dos exemplos idêntico:
- Mesmos delimitadores
- Mesma estrutura
- Mesmo nível de detalhe

### Qualidade
Cada exemplo deve ser uma demonstração perfeita:
- Sem erros
- Padrão claro
- Representativo das entradas esperadas`
      },
      {
        title: "Template few-shot",
        content: `\`\`\`
Converta as seguintes descrições de produto em manchetes de marketing:

Entrada: Uma cadeira de escritório confortável com suporte lombar
Saída: Trabalhe com conforto: assento ergonômico premium

Entrada: Fones sem fio com 24 horas de bateria
Saída: Som o dia todo: nunca pare de ouvir

Entrada: [Sua entrada real aqui]
Saída:
\`\`\``
      }
    ],
    playground: {
      description: "Compare abordagens zero-shot e few-shot para ver como exemplos melhoram os resultados.",
      starterPrompts: [
        {
          label: "Classificação zero-shot",
          prompt: "Classifique este feedback de cliente como positivo, negativo ou neutro: 'O produto chegou atrasado mas funciona muito bem'",
          explanation: "Sem exemplos, o modelo usa sua compreensão geral. Os resultados podem variar."
        },
        {
          label: "Classificação few-shot",
          prompt: "Classifique o feedback do cliente:\n\nFeedback: 'Adorei!'\nCategoria: positivo\n\nFeedback: 'Chegou quebrado'\nCategoria: negativo\n\nFeedback: 'É ok, nada especial'\nCategoria: neutro\n\nFeedback: 'O produto chegou atrasado mas funciona muito bem'\nCategoria:",
          explanation: "Com exemplos, o modelo entende seus critérios e formato específicos de classificação."
        },
        {
          label: "Aprendizado de formato",
          prompt: "Converta para formato slug:\n\nTítulo: 'Como construir APIs melhores'\nSlug: como-construir-apis-melhores\n\nTítulo: 'O guia definitivo de React Hooks'\nSlug: o-guia-definitivo-de-react-hooks\n\nTítulo: '10 dicas para código limpo'\nSlug:",
          explanation: "Few-shot é ótimo para ensinar padrões de formatação específicos."
        }
      ]
    },
    commonMistakes: [
      "Poucos exemplos para tarefas complexas — 3–5 exemplos costumam funcionar melhor que 1",
      "Formatação inconsistente dos exemplos — variação confunde o modelo sobre o padrão esperado",
      "Exemplos de baixa qualidade — erros nos exemplos se propagam para as saídas",
      "Ignorar custo de tokens — mais exemplos = custo maior; encontre o número mínimo eficaz"
    ],
    takeaways: [
      "Few-shot learning ensina por exemplos em vez de instruções",
      "Use exemplos diversos, consistentes e de alta qualidade",
      "Balance a quantidade de exemplos com o custo de tokens",
      "Few-shot é especialmente valioso para tarefas incomuns ou de domínio específico"
    ]
  },
  {
    title: "Modo JSON e saída estruturada",
    slug: "json-mode",
    module: "Saídas estruturadas",
    summary: "Obtenha respostas previsíveis e parseáveis dos LLMs",
    duration: "15 min",
    goals: [
      "Entender o modo JSON e quando usá-lo",
      "Aprender a especificar schemas de saída de forma eficaz",
      "Lidar com casos extremos e validação"
    ],
    sections: [
      {
        title: "Por que saída estruturada?",
        content: `LLMs geram texto livre por natureza, mas aplicações frequentemente precisam de dados estruturados:

- **Confiabilidade de parsing**: JSON pode ser parseado programaticamente
- **Consistência**: Mesma estrutura sempre
- **Integração**: Fácil uso com bancos de dados e APIs
- **Validação**: Verificar se a saída corresponde ao schema esperado`
      },
      {
        title: "Habilitando modo JSON",
        content: `A maioria das APIs oferece uma flag de modo JSON:

\`\`\`javascript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  response_format: { type: "json_object" },
  messages: [
    { role: "system", content: "Retorne apenas JSON válido." },
    { role: "user", content: "Liste 3 linguagens de programação com ano de criação" }
  ]
});
\`\`\`

**Importante**: Ao usar modo JSON, você deve instruir o modelo a retornar JSON no próprio prompt.`
      },
      {
        title: "Especificando schemas",
        content: `Seja explícito sobre a estrutura esperada:

\`\`\`
Retorne um objeto JSON com esta estrutura exata:
{
  "linguagens": [
    {
      "nome": "string",
      "ano": number,
      "paradigma": "string"
    }
  ]
}
\`\`\`

Fornecer um template de schema melhora bastante a confiabilidade.`
      }
    ],
    playground: {
      description: "Pratique extrair dados estruturados de linguagem natural.",
      starterPrompts: [
        {
          label: "Extração JSON básica",
          prompt: "Extraia as informações principais deste texto e retorne como JSON:\n\n'João Silva é um engenheiro de software de 32 anos de São Paulo que gosta de trilhas.'\n\nRetorne: {nome, idade, profissão, localização, hobby}",
          explanation: "O modelo extrai dados estruturados de texto não estruturado. Especificar as chaves ajuda a garantir saída completa."
        },
        {
          label: "Saída guiada por schema",
          prompt: "Liste 2 livros com esta estrutura JSON exata:\n{\n  \"livros\": [\n    {\"titulo\": \"\", \"autor\": \"\", \"ano\": 0, \"genero\": \"\"}\n  ]\n}",
          explanation: "Fornecer o template exato do schema garante estrutura de saída consistente."
        },
        {
          label: "JSON aninhado",
          prompt: "Crie uma representação JSON de uma receita de cookies de chocolate com: nome, tempoPreparo (minutos), ingredientes (array de {item, quantidade}) e passos (array de strings). Limite a 3 ingredientes e 3 passos.",
          explanation: "Estruturas aninhadas complexas exigem descrições claras de cada nível."
        }
      ]
    },
    commonMistakes: [
      "Esquecer de instruir saída JSON no prompt — o modo JSON sozinho não basta",
      "Não fornecer schema — o modelo pode inventar sua própria estrutura",
      "Não validar a saída — sempre faça parse e valide o JSON antes de usar",
      "Pedir estruturas complexas demais — schemas muito aninhados aumentam a taxa de erro"
    ],
    takeaways: [
      "Modo JSON garante saída JSON sintaticamente válida",
      "Inclua sempre instruções de JSON no prompt, não só a flag da API",
      "Forneça templates de schema explícitos para estrutura consistente",
      "Valide e faça parse da saída JSON antes de usar na aplicação"
    ]
  },
  {
    title: "Function calling",
    slug: "function-calling",
    module: "Saídas estruturadas",
    summary: "Permita que LLMs interajam com sistemas externos",
    duration: "20 min",
    goals: [
      "Entender function calling e uso de ferramentas",
      "Aprender a definir schemas de funções",
      "Implementar execução de funções segura e eficaz"
    ],
    sections: [
      {
        title: "O que é function calling?",
        content: `Function calling permite que LLMs:

1. **Reconheçam** quando uma função deve ser chamada
2. **Extraiam** os parâmetros corretos da linguagem natural
3. **Retornem** uma chamada de função estruturada para seu código executar

O modelo não executa funções — ele diz ao seu código o que chamar.`
      },
      {
        title: "Definindo funções",
        content: `Funções são definidas com JSON Schema:

\`\`\`javascript
const functions = [{
  name: "get_weather",
  description: "Obtenha o clima atual de um local",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "Cidade e estado, ex.: 'São Paulo, SP'"
      },
      unit: {
        type: "string",
        enum: ["celsius", "fahrenheit"],
        description: "Unidade de temperatura"
      }
    },
    required: ["location"]
  }
}];
\`\`\`

Descrições claras ajudam o modelo a escolher corretamente.`
      },
      {
        title: "O loop de function calling",
        content: `O padrão típico:

1. Usuário envia uma mensagem
2. Modelo decide chamar uma função
3. Seu código executa a função
4. Envie o resultado de volta ao modelo
5. Modelo gera a resposta final

\`\`\`
Usuário: "Como está o tempo em Tóquio?"
↓
Modelo: {function: "get_weather", arguments: {location: "Tóquio, Japão"}}
↓
Seu código: busca API do tempo → {temp: 22, condition: "ensolarado"}
↓
Modelo: "Está 22°C e ensolarado em Tóquio."
\`\`\``
      }
    ],
    playground: {
      description: "Veja como function calling extrai parâmetros estruturados da linguagem natural.",
      starterPrompts: [
        {
          label: "Chamada simples",
          prompt: "[Função disponível: search_products(query: string, max_price?: number)]\n\nUsuário: Encontre tênis de corrida por menos de R$ 500",
          explanation: "O modelo extrai parâmetros da linguagem natural: query='tênis de corrida', max_price=500."
        },
        {
          label: "Múltiplos parâmetros",
          prompt: "[Função disponível: book_flight(origin: string, destination: string, date: string, passengers: number)]\n\nUsuário: Preciso reservar um voo de São Paulo para Londres para 2 pessoas no dia 15 de março",
          explanation: "O modelo identifica corretamente os quatro parâmetros a partir de um único pedido em linguagem natural."
        },
        {
          label: "Seleção de função",
          prompt: "[Funções disponíveis: get_weather(location), search_restaurants(cuisine, location), book_table(restaurant_id, date, party_size)]\n\nUsuário: Encontre restaurantes italianos perto do centro de São Paulo",
          explanation: "Com várias funções disponíveis, o modelo escolhe a apropriada."
        }
      ]
    },
    commonMistakes: [
      "Descrições ruins das funções — o modelo depende delas para escolher",
      "Faltando descrições dos parâmetros — leva a extração incorreta",
      "Não tratar erros de função — tenha sempre comportamento de fallback para chamadas que falham",
      "Confiar cegamente nas chamadas — valide parâmetros antes de executar"
    ],
    takeaways: [
      "Function calling une linguagem natural e chamadas de API estruturadas",
      "Descrições claras de funções e parâmetros são críticas para precisão",
      "Sempre valide parâmetros antes de executar funções",
      "O modelo sugere chamadas — seu código as executa com segurança"
    ]
  },
  {
    title: "Raciocínio em cadeia de pensamento",
    slug: "chain-of-thought",
    module: "Técnicas avançadas",
    summary: "Melhore o raciocínio complexo com pensamento passo a passo",
    duration: "15 min",
    goals: [
      "Entender o prompting de cadeia de pensamento (CoT)",
      "Aprender quando CoT melhora os resultados",
      "Implementar várias técnicas de CoT"
    ],
    sections: [
      {
        title: "O que é cadeia de pensamento?",
        content: `O prompting de cadeia de pensamento incentiva o modelo a mostrar seu processo de raciocínio passo a passo, em vez de ir direto à resposta.

**Sem CoT:**
P: Se uma camisa custa R$ 100 e tem 20% de desconto, qual o preço final?
R: R$ 80

**Com CoT:**
P: Se uma camisa custa R$ 100 e tem 20% de desconto, qual o preço final? Pense passo a passo.
R: Vamos calcular:
1. Preço original: R$ 100
2. Desconto: 20% de R$ 100 = R$ 20
3. Preço final: R$ 100 - R$ 20 = R$ 80`
      },
      {
        title: "Por que CoT funciona",
        content: `Cadeia de pensamento melhora a precisão ao:

- **Decompor** problemas complexos em passos menores
- **Reduzir** erros em raciocínio com múltiplos passos
- **Tornar** o processo de raciocínio auditável
- **Detectar** erros antes da resposta final

CoT é especialmente eficaz para:
- Problemas de matemática
- Quebra-cabeças de lógica
- Análise com múltiplos passos
- Tomada de decisão complexa`
      },
      {
        title: "Técnicas de CoT",
        content: `### Zero-shot CoT
Simplesmente adicione "Pense passo a passo" ou "Vamos trabalhar isso" ao seu prompt.

### Few-shot CoT
Forneça exemplos que demonstrem raciocínio passo a passo.

### Auto-consistência
Gere vários caminhos de CoT e tome a resposta majoritária.

### Árvore de pensamentos
Explore múltiplos ramos de raciocínio e avalie cada um.`
      }
    ],
    playground: {
      description: "Compare respostas diretas com raciocínio em cadeia de pensamento.",
      starterPrompts: [
        {
          label: "Sem CoT",
          prompt: "Um fazendeiro tem 15 maçãs. Dá 1/3 ao vizinho, compra 10 mais, come 2. Quantas maçãs ele tem?",
          explanation: "Respostas diretas a problemas com vários passos costumam conter erros."
        },
        {
          label: "Com CoT",
          prompt: "Um fazendeiro tem 15 maçãs. Dá 1/3 ao vizinho, compra 10 mais, come 2. Quantas maçãs ele tem?\n\nPense passo a passo, mostrando cada operação.",
          explanation: "Raciocínio passo a passo evita erros: 15 - 5 = 10, 10 + 10 = 20, 20 - 2 = 18 maçãs."
        },
        {
          label: "Problema de lógica",
          prompt: "Todas as rosas são flores. Algumas flores murcham rápido. Podemos concluir que algumas rosas murcham rápido?\n\nAnalise esta afirmação lógica passo a passo antes de dar sua resposta.",
          explanation: "CoT ajuda no raciocínio lógico ao tornar cada inferência explícita."
        }
      ]
    },
    commonMistakes: [
      "Usar CoT para tarefas simples — adiciona latência e custo sem benefício",
      "Não verificar o raciocínio — os passos de CoT ainda podem conter erros",
      "Pular CoT em matemática — a maioria dos problemas se beneficia de passos explícitos",
      "Ignorar o raciocínio — os passos muitas vezes revelam quando o modelo está incerto"
    ],
    takeaways: [
      "Prompting de cadeia de pensamento melhora a precisão em tarefas de raciocínio complexo",
      "Só adicionar 'pense passo a passo' pode melhorar bastante os resultados",
      "CoT torna o raciocínio auditável — você pode conferir cada passo",
      "Use CoT para matemática, lógica e análise com múltiplos passos"
    ]
  },
  {
    title: "Gerenciando a janela de contexto",
    slug: "context-window",
    module: "Técnicas avançadas",
    summary: "Trabalhe de forma eficaz dentro dos limites de tokens",
    duration: "15 min",
    goals: [
      "Entender as limitações da janela de contexto",
      "Aprender estratégias para conversas longas",
      "Implementar gestão de contexto eficaz"
    ],
    sections: [
      {
        title: "Noções básicas da janela de contexto",
        content: `A janela de contexto é a quantidade total de texto (em tokens) que o modelo pode considerar de uma vez. Isso inclui:

- System prompt
- Histórico da conversa
- Mensagem atual do usuário
- Resposta do modelo

Tamanhos comuns de contexto:
- GPT-3.5: 4K–16K tokens
- GPT-4: 8K–128K tokens
- Claude: 100K–200K tokens
- Llama: varia por modelo`
      },
      {
        title: "O problema do meio",
        content: `Pesquisas mostram que modelos prestam menos atenção a informações no meio de contextos longos:

- **Início**: Alta atenção (efeito de primazia)
- **Meio**: Menor atenção (perdido no meio)
- **Fim**: Alta atenção (efeito de recência)

Para informações críticas, coloque-as no início ou no fim do contexto.`
      },
      {
        title: "Estratégias de gestão de contexto",
        content: `### Resumo
Resuma periodicamente mensagens antigas:
\`\`\`
[Resumo da conversa anterior: Usuário perguntou sobre X, discutimos Y, concordamos em Z]
\`\`\`

### Janela deslizante
Mantenha apenas as N mensagens mais recentes.

### Inclusão seletiva
Inclua só mensagens relevantes para a consulta atual.

### Memória hierárquica
Armazene detalhes externamente, inclua resumos no contexto.`
      }
    ],
    playground: {
      description: "Pratique técnicas para gerenciar conversas longas.",
      starterPrompts: [
        {
          label: "Resumo de contexto",
          prompt: "Resuma esta conversa para gestão de contexto:\n\nUsuário: Quero fazer um app de tarefas\nAssistente: Ótimo! Vamos começar pela stack.\nUsuário: Prefiro React e TypeScript\nAssistente: Perfeito. Usamos banco de dados?\nUsuário: Sim, PostgreSQL\nAssistente: Recomendo Prisma como ORM.\n\nForneça um resumo em 2 frases com as decisões principais.",
          explanation: "Resumir preserva o essencial e reduz a contagem de tokens."
        },
        {
          label: "Posicionamento de informação importante",
          prompt: "O orçamento do usuário é R$ 2.500. Ele quer um notebook para programar.\n\n[Muitos outros detalhes sobre recursos, marcas e especificações viriam aqui]\n\nLembre-se: Orçamento R$ 2.500, uso é programação.\n\nRecomende um notebook.",
          explanation: "Colocar restrições críticas no início e no fim ajuda a não esquecê-las."
        },
        {
          label: "Contexto seletivo",
          prompt: "Com base apenas no contexto relevante abaixo, responda à pergunta.\n\nContexto:\n- Usuário está construindo um e-commerce\n- Escolheu Next.js como framework\n- Precisa de autenticação\n- Discussão anterior sobre cores (não relevante)\n- Quer usar Stripe para pagamentos\n\nPergunta: Qual integração de pagamento devo implementar?",
          explanation: "Incluir só o contexto relevante melhora a qualidade e reduz custos."
        }
      ]
    },
    commonMistakes: [
      "Incluir todo o histórico — leva a estouro de contexto e custo maior",
      "Colocar informação crítica no meio — pode ser ignorada",
      "Não ter estratégia de contexto — conversas degradam conforme crescem",
      "Ignorar limites de contexto — truncamento pode gerar respostas incoerentes"
    ],
    takeaways: [
      "Janelas de contexto têm limites rígidos — planeje para eles",
      "Coloque informações críticas no início e no fim",
      "Use resumo e inclusão seletiva para conversas longas",
      "Monitore o uso de tokens e implemente estratégias de estouro"
    ]
  },
  {
    title: "Embeddings e busca semântica",
    slug: "embeddings",
    module: "Técnicas avançadas",
    summary: "Converta texto em vetores para busca por similaridade",
    duration: "18 min",
    goals: [
      "Entender o que são embeddings e como funcionam",
      "Aprender a implementar busca semântica",
      "Saber quando usar embeddings em vez de outras abordagens"
    ],
    sections: [
      {
        title: "O que são embeddings?",
        content: `Embeddings convertem texto em vetores numéricos que capturam significado semântico:

- Significados similares → Vetores similares
- Significados diferentes → Vetores diferentes

Uma frase como "Adoro pizza" vira um vetor como [0,23, -0,45, 0,87, ...] (tipicamente 1536+ dimensões).

**Propriedade chave**: Você pode medir similaridade entre embeddings com similaridade de cosseno ou produto escalar.`
      },
      {
        title: "Gerando embeddings",
        content: `\`\`\`javascript
const response = await openai.embeddings.create({
  model: "text-embedding-ada-002",
  input: "Seu texto aqui"
});

const vector = response.data[0].embedding;
// Retorna um vetor de 1536 dimensões
\`\`\`

Armazene esses vetores em um banco vetorial para busca por similaridade eficiente.`
      },
      {
        title: "Busca semântica",
        content: `Busca tradicional: correspondência exata de palavras-chave
Busca semântica: correspondência por significado

Exemplos de consultas que a busca semântica lida bem:
- "automóvel" encontra documentos sobre "carros"
- "feliz" encontra documentos sobre "alegre" ou "contente"
- "ML" encontra documentos sobre "aprendizado de máquina"

O processo:
1. Gere embedding da sua consulta
2. Encontre vetores similares no seu banco
3. Retorne os documentos correspondentes`
      }
    ],
    playground: {
      description: "Explore como embeddings capturam significado semântico.",
      starterPrompts: [
        {
          label: "Similaridade semântica",
          prompt: "Avalie a similaridade semântica (0–10) entre estes pares:\n\n1. 'carro' e 'automóvel'\n2. 'carro' e 'banana'\n3. 'feliz' e 'alegre'\n4. 'banco' (financeiro) e 'banco' (rio)\n\nExplique por que embeddings capturariam essas similaridades de forma diferente.",
          explanation: "Embeddings capturam significado, então sinônimos têm vetores próximos e palavras não relacionadas ficam distantes."
        },
        {
          label: "Caso de uso de busca",
          prompt: "Tenho um banco de descrições de produtos. Um usuário busca 'cadeira confortável para home office'. Explique como a busca semântica encontraria produtos relevantes mesmo sem essas palavras exatas.",
          explanation: "Busca semântica encontra produtos descritos como 'assento ergonômico' ou 'cadeira de escritório com suporte lombar'."
        },
        {
          label: "Estratégia de embedding",
          prompt: "Estou construindo um sistema de Q&A sobre documentação da empresa. Devo fazer embedding de:\nA) Documentos inteiros\nB) Parágrafos individuais\nC) Frases individuais\n\nExplique os trade-offs de cada abordagem.",
          explanation: "O tamanho do chunk afeta a precisão da recuperação. Chunks menores são mais precisos mas podem perder contexto."
        }
      ]
    },
    commonMistakes: [
      "Fazer embedding de textos muito longos — divida em pedaços menores para melhor recuperação",
      "Usar modelo de embedding errado — combine o modelo ao seu caso de uso e idioma",
      "Ignorar custo de embeddings — são mais baratos que completions mas somam em escala",
      "Não normalizar vetores — algumas métricas de similaridade exigem vetores normalizados"
    ],
    takeaways: [
      "Embeddings convertem texto em vetores que capturam significado semântico",
      "Significados similares produzem vetores similares, permitindo busca semântica",
      "Divida documentos longos em chunks para melhor precisão de recuperação",
      "Use embeddings para busca, clustering e sistemas de recomendação"
    ]
  },
  {
    title: "Retrieval-Augmented Generation (RAG)",
    slug: "rag",
    module: "Sistemas em produção",
    summary: "Ancore as respostas do LLM nos seus próprios dados",
    duration: "20 min",
    goals: [
      "Entender a arquitetura RAG",
      "Aprender a implementar sistemas RAG básicos",
      "Conhecer armadilhas e soluções comuns em RAG"
    ],
    sections: [
      {
        title: "Por que RAG?",
        content: `LLMs têm limitações:
- Corte de conhecimento (não sabem eventos recentes)
- Não acessam dados privados
- Podem alucinar fatos

RAG resolve isso ao:
1. **Recuperar** documentos relevantes dos seus dados
2. **Aumentar** o prompt com esse contexto
3. **Gerar** uma resposta ancorada em informação real`
      },
      {
        title: "Arquitetura RAG",
        content: `\`\`\`
Consulta do usuário
    ↓
┌─────────────────┐
│  Embed da query │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Busca vetorial │ ← Seus embeddings de documentos
└────────┬────────┘
         ↓
┌─────────────────┐
│  Top K resultados │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Aumentar prompt │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Gerar           │
└────────┬────────┘
         ↓
    Resposta
\`\`\``
      },
      {
        title: "Considerações de implementação",
        content: `### Estratégia de chunking
- Muito pequeno: perde contexto
- Muito grande: ruído e irrelevância
- Ponto ideal: 200–500 tokens com sobreposição

### Qualidade da recuperação
- Número de resultados (k): balance relevância vs tamanho do contexto
- Limiar de similaridade: filtre resultados de baixa relevância
- Busca híbrida: combine semântica + correspondência por palavra-chave

### Design do prompt
- Separe claramente contexto da pergunta
- Instrua o modelo a dizer "não sei" se o contexto não tiver a resposta
- Considere citar fontes`
      }
    ],
    playground: {
      description: "Pratique desenhar prompts RAG e entender a recuperação.",
      starterPrompts: [
        {
          label: "Template de prompt RAG",
          prompt: "Desenhe um template de prompt RAG que:\n1. Separe claramente contexto da pergunta\n2. Instrua o modelo a usar apenas o contexto fornecido\n3. Trate casos em que o contexto não contém a resposta\n4. Cite de qual documento veio a resposta",
          explanation: "Bons prompts RAG evitam alucinação ao restringir o modelo ao contexto fornecido."
        },
        {
          label: "Estratégia de chunking",
          prompt: "Tenho 100 PDFs sobre benefícios de funcionários. Cada um tem 20 páginas. Recomende uma estratégia de chunking para RAG, incluindo:\n- Tamanho do chunk\n- Sobreposição\n- Metadados a incluir\n- Como lidar com tabelas e listas",
          explanation: "A estratégia de chunking impacta bastante a qualidade da recuperação."
        },
        {
          label: "Debug de recuperação",
          prompt: "Meu sistema RAG recupera documentos irrelevantes para 'Qual é a política de férias?' Retorna documentos sobre 'decoração de férias no escritório' e 'modo férias'. O que provavelmente está errado e como corrigir?",
          explanation: "Entender as limitações da busca semântica ajuda a debugar problemas de recuperação."
        }
      ]
    },
    commonMistakes: [
      "Não dizer 'não sei' — o modelo pode alucinar se o contexto não tiver a resposta",
      "Chunking ruim — chunks grandes ou pequenos demais prejudicam a recuperação",
      "Ignorar metadados — datas, fontes e tipos de documento melhoram a relevância",
      "Sem avaliação — acompanhe qualidade de recuperação e precisão da resposta separadamente"
    ],
    takeaways: [
      "RAG ancora as respostas do LLM nos seus dados reais",
      "A qualidade depende da recuperação e da geração",
      "A estratégia de chunking impacta bastante os resultados",
      "Sempre inclua instruções para quando a informação não estiver disponível"
    ]
  },
  {
    title: "Respostas em streaming",
    slug: "streaming",
    module: "Sistemas em produção",
    summary: "Entregue performance percebida mais rápida com streaming",
    duration: "12 min",
    goals: [
      "Entender por que streaming melhora a UX",
      "Aprender a implementar streaming em diferentes frameworks",
      "Lidar com casos extremos de streaming"
    ],
    sections: [
      {
        title: "Por que fazer streaming?",
        content: `Sem streaming:
- Usuário espera a resposta inteira
- Respostas longas = espera longa
- Sem feedback durante a geração

Com streaming:
- Primeiros tokens aparecem em ~200 ms
- Resposta é construída em tempo real
- Melhor performance percebida

Para uma resposta de 500 tokens, o streaming pode fazer a experiência parecer 10x mais rápida.`
      },
      {
        title: "Implementando streaming",
        content: `\`\`\`javascript
// Usando AI SDK
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = streamText({
  model: openai('gpt-4'),
  prompt: 'Escreva uma história curta',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
\`\`\`

Server-Sent Events (SSE) ou WebSockets entregam os chunks ao navegador.`
      },
      {
        title: "Considerações de streaming",
        content: `### Tratamento de erros
Erros podem ocorrer no meio do stream. Sempre trate:
- Quedas de conexão
- Rate limits
- Erros do modelo

### Parsing de saída estruturada
Se estiver fazendo streaming de JSON, espere o objeto completo antes de fazer parse.

### UI/UX
- Mostre indicador de digitação durante a geração
- Trate atualizações rápidas de conteúdo de forma eficiente
- Considere comportamento de scroll suave`
      }
    ],
    playground: {
      description: "Entenda padrões e trade-offs de streaming.",
      starterPrompts: [
        {
          label: "Benefícios do streaming",
          prompt: "Uma resposta leva 3 segundos para gerar (500 tokens). Compare a experiência do usuário com e sem streaming. Qual a diferença de latência percebida?",
          explanation: "Streaming mostra os primeiros tokens em ~200 ms vs 3000 ms de espera, melhorando muito a performance percebida."
        },
        {
          label: "Desafios do streaming",
          prompt: "Estou fazendo streaming de respostas JSON. A resposta parcial até agora é: {\"nome\": \"Jo\n\nQue desafios isso cria e como devo lidar?",
          explanation: "JSON parcial não pode ser parseado. Buffer até ter objetos completos ou JSON válido."
        },
        {
          label: "Recuperação de erro",
          prompt: "Minha conexão de streaming caiu depois de receber 'A resposta é ' mas antes da resposta real. Como a aplicação deve lidar com isso de forma elegante?",
          explanation: "Bom tratamento de erro mostra o conteúdo parcial e oferece opção de tentar de novo."
        }
      ]
    },
    commonMistakes: [
      "Não tratar erros de conexão — streams podem falhar no meio da resposta",
      "Fazer parse de JSON parcial — espere estruturas completas",
      "Ignorar rate limits — streaming não evita rate limiting",
      "Sem estados de carregamento — usuários precisam de feedback enquanto esperam o primeiro token"
    ],
    takeaways: [
      "Streaming melhora muito a performance percebida",
      "Os primeiros tokens aparecem em ~200 ms independente do tamanho total",
      "Trate erros com cuidado — streams podem falhar no meio",
      "Buffer saída estruturada até estar completa"
    ]
  },
  {
    title: "Avaliação e otimização de custo",
    slug: "evaluation",
    module: "Sistemas em produção",
    summary: "Meça qualidade e otimize custos em produção",
    duration: "18 min",
    goals: [
      "Aprender a avaliar a qualidade da saída do LLM",
      "Entender estratégias de otimização de custo",
      "Implementar monitoramento e observabilidade"
    ],
    sections: [
      {
        title: "Métodos de avaliação",
        content: `### Métricas automatizadas
- **Correspondência exata**: Resposta igual à saída esperada
- **BLEU/ROUGE**: Pontuações de similaridade de texto
- **Validadores customizados**: Conformidade de schema, presença de palavras-chave

### LLM como juiz
Use um LLM (diferente) para avaliar respostas:
\`\`\`
Avalie esta resposta em precisão (1-5):
Pergunta: {pergunta}
Temas esperados: {temas}
Resposta: {resposta}
\`\`\`

### Avaliação humana
- Testes A/B com usuários
- Revisão por especialistas para aplicações de alto risco
- Auditorias de qualidade periódicas`
      },
      {
        title: "Otimização de custo",
        content: `### Escolha do modelo
- Use modelos menores para tarefas simples
- GPT-3.5 para classificação, GPT-4 para raciocínio complexo
- Modelos pequenos fine-tunados podem superar modelos grandes gerais

### Otimização de prompt
- Prompts mais curtos = custo menor
- Remova instruções redundantes
- Comprima exemplos

### Cache
- Cache para consultas idênticas
- Cache semântico para consultas similares
- TTL baseado na necessidade de atualização do conteúdo`
      },
      {
        title: "Monitoramento em produção",
        content: `Acompanhe estas métricas:

### Performance
- Latência (p50, p95, p99)
- Tempo até o primeiro token
- Throughput de tokens

### Qualidade
- Taxa de erro
- Sinais de feedback do usuário
- Pontuações de qualidade automatizadas

### Custo
- Uso de tokens por requisição
- Custo por usuário/funcionalidade
- Tendências de gasto diário/semanal`
      }
    ],
    playground: {
      description: "Pratique técnicas de avaliação e análise de custo.",
      starterPrompts: [
        {
          label: "Prompt LLM como juiz",
          prompt: "Desenhe um prompt que use GPT-4 para avaliar a qualidade de respostas de suporte ao cliente. Inclua:\n- Critérios de avaliação (precisão, tom, completude)\n- Rubrica de pontuação (escala 1-5)\n- Exemplos de respostas boas e ruins",
          explanation: "LLM como juiz oferece avaliação de qualidade escalável para critérios subjetivos."
        },
        {
          label: "Análise de custo",
          prompt: "Um chatbot processa 100.000 mensagens/dia com média de 500 tokens de entrada e 200 de saída por mensagem. A US$ 0,01 por 1K tokens de entrada e US$ 0,03 por 1K de saída:\n\n1. Calcule o custo diário\n2. Sugira 3 formas de reduzir o custo em 50%\n3. Qual o trade-off de cada abordagem?",
          explanation: "Entender a estrutura de custos ajuda a tomar decisões de otimização informadas."
        },
        {
          label: "Estratégia de cache",
          prompt: "Desenhe uma estratégia de cache para um bot de FAQ de clientes. Considere:\n- O que cachear (respostas completas, embeddings ou ambos)\n- Regras de invalidação\n- Como lidar com pequenas variações nas perguntas",
          explanation: "Cache inteligente pode reduzir bastante o custo de consultas repetidas."
        }
      ]
    },
    commonMistakes: [
      "Não medir desempenho baseline antes de otimizar",
      "Otimizar custo sem acompanhar o impacto na qualidade",
      "Usar modelos caros para tarefas simples",
      "Ignorar oportunidades de cache para consultas repetidas"
    ],
    takeaways: [
      "Combine métricas automatizadas, LLM como juiz e avaliação humana para uma visão completa",
      "Combine a capacidade do modelo à complexidade da tarefa — não use GPT-4 para classificação simples",
      "Implemente cache, otimização de prompt e batch para reduzir custos",
      "Monitore latência, taxa de erro, uso de tokens e pontuações de qualidade em produção"
    ]
  }
]
