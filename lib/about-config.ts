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
      pageTitle: "About the project & how to reach me",
      pageSubtitle:
        "A focused learning experience for developers and technology professionals who want to understand how real LLM systems behave.",
      aboutProject: {
        title: "About this platform",
        paragraphs: [
          "This platform was created as a learning environment for people who build with AI every day — developers, technical PMs, data professionals, and founders who want to understand how LLMs actually behave inside real systems.",
          "Instead of being an introductory course for a general audience or just a collection of prompting tips, the content follows a structured path: from fundamentals like transformers and tokens to practices used in real products, such as advanced prompting, structured outputs, RAG, and production patterns.",
          "Every lesson is designed to be practical: you understand the concepts and then immediately experiment in an integrated playground, with prompts and scenarios inspired by real application and system design problems.",
          "The goal is to build practical intuition — not just learn concepts, but see how these tools behave once they become real systems.",
        ],
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
      pageTitle: "Sobre o projeto e como falar comigo",
      pageSubtitle:
        "Uma experiência de aprendizagem focada para desenvolvedores e profissionais de tecnologia que querem entender como sistemas com LLMs se comportam na prática.",
      aboutProject: {
        title: "Sobre esta plataforma",
        paragraphs: [
          "Esta plataforma foi criada como um ambiente de aprendizado para quem constrói com IA no dia a dia — desenvolvedores, PMs técnicos, profissionais de dados e fundadores que querem entender como LLMs realmente se comportam em sistemas reais.",
          "Em vez de ser um curso introdutório para o público geral ou apenas uma coleção de dicas de prompting, o conteúdo segue um caminho estruturado: dos fundamentos, como Transformer e tokens, até práticas usadas em produtos reais, como prompting avançado, saídas estruturadas, RAG e padrões de produção.",
          "Cada lição foi pensada para ser prática: você entende os conceitos e imediatamente experimenta em um playground integrado, com prompts e cenários inspirados em problemas reais de aplicação e de design de sistemas.",
          "A ideia é desenvolver intuição prática — não só aprender conceitos, mas enxergar como essas ferramentas se comportam quando viram sistemas de verdade.",
        ],
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

