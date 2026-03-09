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
      en: "I created this platform to help developers and technology professionals build practical intuition about how LLM-based systems really work — beyond the hype, with clear concepts, explicit trade-offs, and hands-on experimentation. If you’d like to talk about AI systems, architecture, or building products with AI, I’m always happy to exchange ideas.",
      "pt-br":
        "Criei esta plataforma para ajudar desenvolvedores e profissionais de tecnologia a desenvolver intuição prática sobre como sistemas baseados em LLMs realmente funcionam — indo além do hype, com conceitos claros, trade-offs explícitos e experimentação concreta. Se quiser conversar sobre sistemas de IA, arquitetura ou construção de produtos com IA, fico feliz em trocar ideias.",
    },
    avatarUrl: "/diego.png",
  },
  links: {
    linkedin: "https://www.linkedin.com/in/diegofedrizzipetry",
    github: "https://github.com/diegofedrizzipetry",
    website: undefined,
  },
  whatsapp: {
    phoneNumberInternational: "5548999999999",
    defaultMessage: {
      en: "Hi Diego! I found your LLM course and would love to connect to talk about AI, products, or the project.",
      "pt-br":
        "Oi Diego! Encontrei sua plataforma de LLMs e gostaria de conversar sobre IA, produtos ou o projeto.",
    },
  },
  content: {
    en: {
      pageTitle: "About the project & who it's for",
      pageSubtitle:
        "A focused, practical learning environment for developers and technology professionals who are building real AI-powered products with large language models — plus a direct line if you want to talk.",
      aboutProject: {
        title: "About this platform",
        paragraphs: [
          "This platform is designed as a serious, modern learning environment for people who build with AI day to day — developers, product managers, data professionals, and technical founders who want to understand how large language models actually work in real systems.",
          "Instead of being an introductory AI course for the general public or a loose collection of tips, the curriculum is structured as a coherent path: from transformers and tokens, to prompting, structured outputs, RAG, and production patterns used in real-world LLM products.",
          "Every lesson is built to be practical: you read the concepts, then immediately experiment in an integrated playground with curated prompts and scenarios that mirror real application and system design work.",
        ],
      },
      aboutCreatorSectionTitle: "About the creator",
      networkingSectionTitle: "Professional links",
      whatsappSectionTitle: "Quick contact on WhatsApp",
      whatsappSectionDescription:
        "If you prefer a fast, informal channel to talk about AI, LLM products, or this project, you can send me a message on WhatsApp. It’s ideal for quick questions, networking, or exploring potential collaborations.",
      contactForm: {
        title: "Contact form",
        description:
          "If you’d rather write a more structured message, you can use this form. Share a bit about your context and what you’d like to discuss.",
        nameLabel: "Name",
        emailLabel: "Email",
        messageLabel: "Message",
        submitLabel: "Send message",
      },
    },
    "pt-br": {
      pageTitle: "Sobre o projeto e para quem ele foi feito",
      pageSubtitle:
        "Um ambiente de aprendizagem focado e prático para desenvolvedores e profissionais de tecnologia que estão construindo produtos reais com modelos de linguagem — e um canal direto caso você queira conversar.",
      aboutProject: {
        title: "Sobre esta plataforma",
        paragraphs: [
          "Esta plataforma foi desenhada como um ambiente moderno e sério de aprendizagem para quem constrói com IA no dia a dia — desenvolvedores, PMs, pessoas de dados e fundadores técnicos que querem entender como LLMs funcionam de verdade em sistemas reais.",
          "Em vez de ser um curso introdutório de IA para o público geral ou uma coleção solta de dicas, o currículo é estruturado como um caminho coerente: de Transformer e tokens, passando por prompting, saídas estruturadas, RAG e padrões de produção usados em produtos com LLMs.",
          "Cada lição foi pensada para ser prática: você lê os conceitos e imediatamente experimenta em um playground integrado, com prompts e cenários curados que se parecem com trabalho real de aplicação e design de sistemas.",
        ],
      },
      aboutCreatorSectionTitle: "Sobre o criador",
      networkingSectionTitle: "Links profissionais",
      whatsappSectionTitle: "Contato rápido por WhatsApp",
      whatsappSectionDescription:
        "Se você prefere um canal rápido e informal para falar sobre IA, produtos com LLMs ou sobre este projeto, pode me enviar uma mensagem no WhatsApp. É ideal para dúvidas pontuais, networking ou explorar possíveis colaborações.",
      contactForm: {
        title: "Formulário de contato",
        description:
          "Se você preferir escrever uma mensagem mais estruturada, pode usar este formulário. Conte um pouco do seu contexto e sobre o que você gostaria de conversar.",
        nameLabel: "Nome",
        emailLabel: "E-mail",
        messageLabel: "Mensagem",
        submitLabel: "Enviar mensagem",
      },
    },
  },
}

