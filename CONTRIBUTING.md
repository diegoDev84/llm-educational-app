# Contributing to Frodex

Thanks for your interest in contributing. Frodex is an open-source educational platform and contributions of all kinds are welcome.

## Ways to contribute

- **Improve lesson content** — clarify explanations, fix inaccuracies, add examples
- **Improve playground examples** — better prompts, more realistic scenarios, clearer annotations
- **Fix bugs** — UI issues, broken interactions, incorrect behavior
- **Improve UX/UI** — layout, accessibility, mobile experience
- **Suggest new modules** — open an issue describing the topic and why it fits
- **Improve documentation** — README, code comments, this file

## How to contribute

### 1. Fork and clone

```bash
git clone https://github.com/your-username/llm-educational-app.git
cd llm-educational-app
pnpm install
```

### 2. Create a branch

Use a descriptive branch name:

```bash
git checkout -b fix/playground-prompt-reset
git checkout -b lesson/add-function-calling-examples
git checkout -b docs/improve-rag-explanation
```

### 3. Make your changes

Run locally to verify:

```bash
pnpm dev
```

Type-check before submitting:

```bash
npx tsc --noEmit
```

Lint:

```bash
pnpm lint
```

### 4. Open a pull request

Push your branch and open a PR against `main`. Fill out the pull request template.

---

## Lesson and content structure

Lesson content lives in `content/lessons/`. Each locale has its own file (`en.ts`, `pt-br.ts`). Lesson types are defined in `lib/lesson-types.ts`.

If you're adding or editing a lesson:

- Keep the tone technical but accessible
- Each lesson should pair concept explanation with playground experimentation
- If adding content in one locale, consider adding the equivalent in the other or noting it in your PR

## UI strings

Translated UI strings live in `content/ui/en.json` and `content/ui/pt-br.json`. If you add a new UI string, add it to both files.

## Code style

- TypeScript throughout — avoid `any`
- Tailwind CSS for styling — avoid inline styles
- Keep components focused and small
- Prefer editing existing files over creating new ones

## Questions

Open an issue or start a discussion on GitHub if you're unsure about something before investing time in a large change.
