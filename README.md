# Frodex

**An open-source educational platform for understanding LLM systems.**

Frodex is a practical learning environment for developers and technology professionals who want to understand how large language model systems actually behave — beyond the hype, with clear concepts, explicit trade-offs, and hands-on experimentation.

**Live site:** [frodex.dev](https://frodex.dev)

---

## What is Frodex?

Frodex is structured as a course with an integrated playground. Each lesson covers a concept — from tokens and transformers to RAG, structured outputs, and production patterns — and is paired with interactive prompts that let you experiment immediately.

The goal is to build practical intuition: not just learn concepts, but see how these tools behave when they become real systems.

**Who is it for?**

- Developers building with AI
- Technical PMs and architects evaluating LLM-based solutions
- Data professionals working with language models
- Anyone who wants to understand what's actually happening inside these systems

---

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (recommended) or npm/yarn

### Installation

```bash
git clone https://github.com/diegoDev84/llm-educational-app.git
cd llm-educational-app
pnpm install
```

### Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set the following variables:

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key for the lesson playground. Get one at [openrouter.ai/keys](https://openrouter.ai/keys). |
| `ZAPIER_CERTIFICATE_WEBHOOK_URL` | No | Webhook URL to receive certificate data when users complete the course. Payload: `{ nome, email, idioma, consentimento_noticia }`. |

### Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
pnpm build
pnpm start
```

---

## Project Structure

```
app/                   Next.js app directory (locale-aware routing)
  [locale]/            Pages per locale (en, pt-br)
  api/                 API routes (certificate, playground)
components/            React components
  course/              Course flow components (lessons, playground, certificate)
  ui/                  Shared UI primitives (shadcn/ui)
content/
  lessons/             Lesson content per locale (en.ts, pt-br.ts)
  ui/                  UI string translations per locale (en.json, pt-br.json)
lib/                   Utilities, configs, and types
  about-config.ts      About page content and author profile
  course-config.ts     Course metadata (title, duration, module list)
  i18n.ts              Locale definitions and helpers
  lesson-types.ts      TypeScript types for lesson and playground content
  lessons.ts           Lesson registry and routing logic
public/                Static assets (images, logo)
```

---

## Contributing

Frodex welcomes contributions. See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

Contribution ideas:

- Improving lesson explanations
- Adding or improving playground examples
- Fixing bugs or UI issues
- Suggesting new modules or topics
- Improving documentation

---

## License

[MIT](LICENSE)
