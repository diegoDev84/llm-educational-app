# llm-educational-app

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_DHs50hXm61vIaFOh7DX45NSduziF)

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

## Deployment (Vercel)

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. Add the **`GEMINI_API_KEY`** environment variable in the Vercel project settings.
3. Deploy. The app uses `VERCEL_URL` for metadata and works with the default Next.js build (`npm run build`).

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/diegoDev84/llm-educational-app" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
