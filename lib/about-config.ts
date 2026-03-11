import type { Locale } from "@/lib/i18n"

export interface AuthorProfile {
  name: string
  role: Record<Locale, string>
  location: Record<Locale, string>
  shortBio: Record<Locale, string>
  whyBuilt: Record<Locale, string>
  avatarUrl?: string
}

export interface NetworkingLinks {
  linkedin: string
  github?: string
  repoUrl?: string
  website?: string
}

export interface WhatsAppConfig {
  /** E.g. 5548999999999 (country code + number, no symbols). */
  phoneNumberInternational: string
  defaultMessage: Record<Locale, string>
}

export interface AboutPageCopy {
  pageTitle: string
  pageSubtitle: string
  aboutProject: {
    title: string
    paragraphs: string[]
  }
  openSource: {
    title: string
    description: string
    contributeText: string
    githubLabel: string
    githubDescription: string
  }
  aboutCreatorSectionTitle: string
  networkingSectionTitle: string
  networkingSectionDescription: string
  networkingLinkedinDescription: string
  networkingGithubDescription: string
  whatsappSectionTitle: string
  whatsappSectionDescription: string
  contactForm: {
    title: string
    description: string
    nameLabel: string
    emailLabel: string
    messageLabel: string
    submitLabel: string
  }
}

export interface AboutConfig {
  author: AuthorProfile
  links: NetworkingLinks
  whatsapp: WhatsAppConfig
  content: Record<Locale, AboutPageCopy>
}

export const aboutConfig: AboutConfig = {
  author: {
    name: "Diego Fedrizzi Petry Becker",
    role: {
      en: "Software engineer and technical leader focused on AI-powered systems",
      "pt-br": "Engenheiro de software e líder técnico com foco em sistemas com IA",
    },
    location: {
      en: "Based in Brazil.",
      "pt-br": "Baseado no Brasil.",
    },
    shortBio: {
      en: "I work on building platforms and systems that use modern AI capabilities to solve real problems at scale. My focus is on turning language models, automation, and data into reliable tools that teams can actually use and evolve in production.",
      "pt-br":
        "Trabalho na construção de plataformas e sistemas que usam capacidades modernas de IA para resolver problemas reais em escala. Meu foco é transformar modelos de linguagem, automação e dados em ferramentas confiáveis, que equipes conseguem de fato usar e evoluir em produção.",
    },
    whyBuilt: {
      en: "I created this platform to help developers and technology professionals build practical intuition about how LLM-based systems really work — beyond the hype, with clear concepts, explicit trade-offs, and hands-on experimentation.",
      "pt-br":
        "Criei esta plataforma para ajudar desenvolvedores e profissionais de tecnologia a desenvolver intuição prática sobre como sistemas baseados em LLMs realmente funcionam — indo além do hype, com conceitos claros, trade-offs explícitos e experimentação concreta.",
    },
    avatarUrl: "/diego.png",
  },
  links: {
    linkedin: "https://www.linkedin.com/in/diego-becker-21668720b/",
    github: "https://github.com/diegoDev84",
    repoUrl: "https://github.com/diegoDev84/llm-educational-app",
    website: undefined,
  },
  whatsapp: {
    phoneNumberInternational: "5551982188221",
    defaultMessage: {
      en: "Hi Diego! I found your LLM course and would love to connect to talk about AI, products, or the project.",
      "pt-br":
        "Oi Diego! Encontrei sua plataforma de LLMs e gostaria de conversar ou entender como posso contribuir com o projeto.",
    },
  },
  content: {
    en: {
      pageTitle: "An open-source platform for understanding LLM systems",
      pageSubtitle:
        "Frodex is a practical learning environment where developers can explore how LLM-based systems actually behave — from tokens and prompts to RAG, tooling, and production patterns.",
      aboutProject: {
        title: "What is Frodex?",
        paragraphs: [
          "Frodex is a learning environment for people who build with AI every day — developers, technical PMs, data professionals, and founders who want to understand how LLMs actually behave inside real systems.",
          "The content follows a structured path: from fundamentals like transformers and tokens to practices used in real products, such as advanced prompting, structured outputs, RAG, and production patterns.",
          "Every lesson is designed to be practical: you understand the concepts and then immediately experiment in an integrated playground, with prompts and scenarios inspired by real application and system design problems.",
          "The goal is to build practical intuition — not just learn concepts, but see how these tools behave once they become real systems.",
        ],
      },
      openSource: {
        title: "Open source",
        description:
          "Frodex is an open-source project. The codebase, lessons, and playground experiments are all available on GitHub. If you find a bug, have a suggestion, or want to contribute — pull requests and issues are welcome.",
        contributeText:
          "The platform is intentionally kept simple and modular so it’s easy to navigate and contribute to. Whether you want to fix a typo, improve an explanation, or propose a new module — there’s room for it.",
        githubLabel: "View on GitHub",
        githubDescription: "Source code, issues, and contributions.",
      },
      aboutCreatorSectionTitle: "About the creator",
      networkingSectionTitle: "Let’s connect",
      networkingSectionDescription:
        "These are usually the best places to connect and continue the conversation.",
      networkingLinkedinDescription: "Professional connection and networking.",
      networkingGithubDescription: "Code, projects, and open source work.",
      whatsappSectionTitle: "Quick contact",
      whatsappSectionDescription:
        "If you’d like to talk about applied AI, system architecture, or this project, WhatsApp is the fastest way to reach me.",
      contactForm: {
        title: "Structured message",
        description:
          "If you prefer to send a more detailed message, you can use this form.",
        nameLabel: "Name",
        emailLabel: "Email",
        messageLabel: "Message",
        submitLabel: "Send message",
      },
    },
    "pt-br": {
      pageTitle: "Uma plataforma open source para entender sistemas com LLMs",
      pageSubtitle:
        "Frodex é um ambiente de aprendizagem prático onde desenvolvedores podem explorar como sistemas com LLMs realmente se comportam — de tokens e prompts a RAG, ferramentas e padrões de produção.",
      aboutProject: {
        title: "O que é o Frodex?",
        paragraphs: [
          "Frodex é um ambiente de aprendizado para quem constrói com IA no dia a dia — desenvolvedores, PMs técnicos, profissionais de dados e fundadores que querem entender como LLMs realmente se comportam em sistemas reais.",
          "O conteúdo segue um caminho estruturado: dos fundamentos, como Transformer e tokens, até práticas usadas em produtos reais, como prompting avançado, saídas estruturadas, RAG e padrões de produção.",
          "Cada lição foi pensada para ser prática: você entende os conceitos e imediatamente experimenta em um playground integrado, com prompts e cenários inspirados em problemas reais de aplicação e de design de sistemas.",
          "A ideia é desenvolver intuição prática — não só aprender conceitos, mas enxergar como essas ferramentas se comportam quando viram sistemas de verdade.",
        ],
      },
      openSource: {
        title: "Open source",
        description:
          "Frodex é um projeto open source. O código, as lições e os experimentos do playground estão disponíveis no GitHub. Se você encontrar um bug, tiver uma sugestão ou quiser contribuir — pull requests e issues são bem-vindos.",
        contributeText:
          "A plataforma foi mantida propositalmente simples e modular para facilitar a navegação e a contribuição. Seja para corrigir um texto, melhorar uma explicação ou propor um novo módulo — há espaço para isso.",
        githubLabel: "Ver no GitHub",
        githubDescription: "Código-fonte, issues e contribuições.",
      },
      aboutCreatorSectionTitle: "Sobre o criador",
      networkingSectionTitle: "Vamos nos conectar",
      networkingSectionDescription:
        "Estes são, em geral, os melhores lugares para se conectar, continuar a conversa ou falar sobre possíveis contribuições ao projeto.",
      networkingLinkedinDescription: "Conexão profissional e networking.",
      networkingGithubDescription: "Código, projetos e trabalho open source.",
      whatsappSectionTitle: "Contato rápido",
      whatsappSectionDescription:
        "Se quiser conversar sobre IA aplicada, arquitetura de sistemas, este projeto ou formas de contribuir, o WhatsApp é a forma mais rápida de falar comigo.",
      contactForm: {
        title: "Mensagem estruturada",
        description:
          "Se preferir enviar uma mensagem mais detalhada — seja para conversar, dar feedback ou explorar formas de contribuição — você pode usar este formulário.",
        nameLabel: "Nome",
        emailLabel: "E-mail",
        messageLabel: "Mensagem",
        submitLabel: "Enviar mensagem",
      },
    },
  },
}

