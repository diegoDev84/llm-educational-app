# llm-educational-app

This is an open-source [Next.js](https://nextjs.org) project that provides an interactive educational platform for learning how large language model (LLM) systems work end to end.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/[locale]/page.tsx`. The page auto-updates as you edit the file.

## Environment variables

Copy `.env.example` to `.env.local` and set:

- **`GEMINI_API_KEY`** – Required for the lesson Playground (chat API). Get a key at [Google AI Studio](https://aistudio.google.com/app/apikey). Without it, the Playground will show an error when running prompts.

- **`ZAPIER_CERTIFICATE_WEBHOOK_URL`** (optional) – When users request a completion certificate, the API sends a POST with `{ name, email, locale, courseTitle, courseDuration, completedAt }` to this URL (e.g. a Zapier webhook). If unset, the certificate still works; no webhook is called.

## Deployment

This project can be deployed to any platform that supports Node.js and Next.js (for example, a managed hosting provider or your own server).

1. Push the repo to your Git hosting provider (e.g. GitHub, GitLab, Bitbucket).
2. Configure the **`GEMINI_API_KEY`** environment variable in your hosting environment.
3. Build the app with `npm run build` and serve it with `npm start`, or follow your hosting provider’s Next.js deployment guide.
4. Optionally, expose a public base URL for the app (for example via an environment variable like `VERCEL_URL`) so that metadata links can use the correct origin. If no URL is provided, the app falls back to `http://localhost:3000` in `app/layout.tsx`.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
