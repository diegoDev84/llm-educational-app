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
    name: "Diego Fedrizzi Petry",
    role: {
      en: "Software engineer & AI product builder",
      "pt-br": "Engenheiro de software e criador de produtos de IA",
    },
    location: {
      en: "Based in Brazil, working with global teams",
      "pt-br": "Baseado no Brasil, atuando com equipes globais",
    },
    shortBio: {
      en: "I help teams design, build, and ship reliable AI-powered products — with a strong focus on developer experience and real-world constraints.",
      "pt-br": "Ajudo equipes a desenhar, construir e entregar produtos com IA de forma confiável — com foco forte em experiência de desenvolvedor e restrições do mundo real.",
    },
    whyBuilt: {
      en: "I created this platform to give developers a serious, practical path into LLMs — beyond hype, with clear mental models and code you can actually ship.",
      "pt-br": "Criei esta plataforma para oferecer a desenvolvedores um caminho sério e prático para trabalhar com LLMs — além do hype, com modelos mentais claros e código que você realmente consegue colocar em produção.",
    },
    avatarUrl: undefined,
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
      pageTitle: "About the project & how to reach me",
      pageSubtitle:
        "A focused learning experience for developers who want to build real products with large language models — and a direct line if you want to talk.",
      aboutProject: {
        title: "About this platform",
        paragraphs: [
          "This platform is designed as a serious, modern learning environment for developers who want to understand how large language models actually work — and how to ship real applications with them.",
          "Instead of being a loose collection of tips or disconnected demos, the course is structured as a coherent path: from transformers and tokens, to prompting, structured outputs, RAG, and production patterns.",
          "Every lesson is built to be practical: you read the concepts, then immediately experiment in an integrated playground with curated prompts and scenarios that mirror real product work.",
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
      pageTitle: "Sobre o projeto e como falar comigo",
      pageSubtitle:
        "Uma experiência de aprendizagem focada para desenvolvedores que querem construir produtos reais com modelos de linguagem — e um canal direto caso você queira conversar.",
      aboutProject: {
        title: "Sobre esta plataforma",
        paragraphs: [
          "Esta plataforma foi desenhada como um ambiente moderno e sério de aprendizagem para desenvolvedores que querem entender como modelos de linguagem funcionam de verdade — e como colocar aplicações com LLMs em produção.",
          "Em vez de ser apenas uma coleção solta de dicas ou demos isoladas, o curso é estruturado como um caminho coerente: de transformadores e tokens, passando por prompting, saídas estruturadas, RAG e padrões de produção.",
          "Cada lição foi pensada para ser prática: você lê os conceitos e imediatamente experimenta em um playground integrado, com prompts e cenários curados que se parecem com trabalho real de produto.",
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

