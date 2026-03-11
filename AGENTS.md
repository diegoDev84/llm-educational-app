# AGENTS.md — Frodex

This file helps AI coding agents and contributors quickly understand how to work in this repository.

---

## Project overview

**Frodex** is an open-source educational platform for developers who want to understand how LLM-based systems actually behave. It is structured as a course with an integrated playground, covering topics from tokens and transformers to RAG, structured outputs, and production patterns.

**Live site:** [frodex.dev](https://frodex.dev)
**Repo:** [github.com/diegoDev84/llm-educational-app](https://github.com/diegoDev84/llm-educational-app)

---

## Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **UI components:** shadcn/ui (Radix UI primitives)
- **Package manager:** pnpm
- **Locales:** `en` (English) and `pt-br` (Brazilian Portuguese)
- **AI backend:** OpenRouter (`mistralai/mistral-nemo`) via `OPENROUTER_API_KEY` (playground chat)

---

## Folder structure

```
app/
  [locale]/            Locale-aware pages (home, about, course, lesson, complete)
  api/
    certificate/       POST endpoint — saves certificate and fires optional webhook
    playground/        POST endpoint — proxies prompts to Gemini API

components/
  course/              Course-specific components (lesson viewer, playground, certificate)
  site-header.tsx      Main navigation header
  ui/                  Shared UI primitives (Button, Card, Input, etc.)

content/
  lessons/
    en.ts              English lesson definitions
    pt-br.ts           Portuguese lesson definitions
  ui/
    en.json            English UI strings
    pt-br.json         Portuguese UI strings

lib/
  about-config.ts      About page content, author profile, links
  course-config.ts     Course title, duration, module list
  i18n.ts              Locale list, helpers (isValidLocale, getLocaleFromPathname)
  lesson-types.ts      TypeScript types: Lesson, PlaygroundConfig, etc.
  lessons.ts           Lesson registry — maps slug to lesson content
  translations.ts      Type for UIStrings; replaceParams helper
  rate-limit.ts        Simple in-memory rate limiter for API routes
  openrouter.ts        (Unused/legacy) OpenRouter integration

public/                Static assets (logo, author photo, OG image)
styles/                Global CSS (Tailwind entry point)
middleware.ts          Locale detection and redirect logic
```

---

## Localization

All user-facing text must exist in both `en` and `pt-br`.

- **UI strings** (buttons, labels, page copy): `content/ui/en.json` and `content/ui/pt-br.json`
- **Lesson content**: `content/lessons/en.ts` and `content/lessons/pt-br.ts`
- **About page copy**: `lib/about-config.ts` (keyed by locale)

The `UIStrings` type in `lib/translations.ts` is derived from the JSON files. If you add a key to one JSON file, add it to the other too — TypeScript will catch mismatches.

Locale routing is handled by `middleware.ts` and the `[locale]` dynamic segment. Valid locales are defined in `lib/i18n.ts`.

---

## Lesson structure

Each lesson is defined in `content/lessons/{locale}.ts` and exports an array of `Lesson` objects. The `Lesson` type (in `lib/lesson-types.ts`) includes:

- `slug` — URL identifier
- `title`, `description` — display metadata
- `content` — lesson body (structured sections: text, code, diagrams)
- `playground` — optional playground config (system prompt, user prompt, parameters)

The lesson registry in `lib/lessons.ts` maps slugs to content and handles ordering.

**To add a lesson:**
1. Add the `Lesson` object to both `content/lessons/en.ts` and `content/lessons/pt-br.ts`
2. Register the slug in `lib/lessons.ts`
3. Verify navigation and progress tracking still works

---

## Playground

The playground is a chat-like interface embedded in each lesson. It sends prompts to `/api/playground`, which calls the OpenRouter API using `OPENROUTER_API_KEY`.

Each lesson's playground config (`PlaygroundConfig`) defines the initial system prompt, user prompt template, and model parameters. These are intentionally constrained to keep experiments focused on the lesson's concept.

Rate limiting is applied in `lib/rate-limit.ts`. Be careful when modifying the playground API route.

---

## Certificate flow

When a user completes the course, they can generate a certificate:

1. User fills in name + email on the course complete page
2. The form POSTs to `/api/certificate`
3. The API optionally fires a webhook to `ZAPIER_CERTIFICATE_WEBHOOK_URL`
4. The certificate is rendered as a React component and exported to PNG via `html-to-image`

The certificate component is in `components/course/course-complete-content.tsx`.

---

## What to be careful with

- **Lesson ordering and slugs** — changing a slug breaks existing URLs and user progress (stored in localStorage by slug)
- **API routes** — both `/api/playground` and `/api/certificate` are public endpoints; rate limiting is intentional
- **Locale keys** — removing or renaming a key in one JSON file without updating the other will cause a TypeScript error
- **`lib/about-config.ts`** — contains author contact info and social links; do not change without intent
- **`middleware.ts`** — locale redirect logic; changes here affect all routing

---

## Preferred conventions

- TypeScript everywhere — no `any`, no implicit `any`
- Tailwind CSS only — no inline styles, no CSS modules
- Keep components small and focused
- No unnecessary abstractions — prefer simple, direct code
- No comments unless the logic is non-obvious
- Prefer editing existing files over creating new ones

---

## Validating changes

Before opening a PR:

```bash
# Type check
npx tsc --noEmit

# Lint
pnpm lint

# Run locally and verify affected pages
pnpm dev
```

There are no automated tests at this time. Manual verification of affected flows is expected.

---

## Common contribution workflows

### Adding or improving a lesson

1. Edit `content/lessons/en.ts` and `content/lessons/pt-br.ts`
2. If adding a new lesson, register it in `lib/lessons.ts`
3. Test the lesson page, playground interaction, and navigation
4. Run `npx tsc --noEmit` and `pnpm lint`

### Improving a playground example

1. Find the lesson's `playground` config in `content/lessons/{locale}.ts`
2. Update the prompt template or parameters
3. Test in the running app — verify the Gemini response is instructive for the lesson's concept

### Adding a UI string

1. Add the key to `content/ui/en.json`
2. Add the translated key to `content/ui/pt-br.json`
3. TypeScript will enforce the shape via `UIStrings` in `lib/translations.ts`

### Updating branding assets

Static assets live in `public/`. The logo is `public/frodex-logo.png`. Replace files in place; no code changes needed unless filenames change.
