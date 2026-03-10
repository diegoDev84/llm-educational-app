import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n"
import { SiteHeader } from "@/components/site-header"
import { Card } from "@/components/ui/card"
import { getLessonSlugs } from "@/lib/lessons"

interface TermsPageProps {
  params: Promise<{ locale: Locale }>
}

const termsCopy: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Terms of Use",
    description:
      "Please read these terms of use to understand how this educational platform works, how your data is handled today, and what you are responsible for when using it.",
  },
  "pt-br": {
    title: "Termos de Uso",
    description:
      "Leia estes termos de uso para entender como esta plataforma educativa funciona, como seus dados são tratados hoje e quais são as suas responsabilidades ao utilizá-la.",
  },
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params
  const copy = termsCopy[locale]

  return {
    title: copy.title,
    description: copy.description,
  }
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params
  const slugs = getLessonSlugs(locale)
  const firstLessonSlug = slugs[0]
  const courseHref = firstLessonSlug ? `/${locale}/lesson/${firstLessonSlug}` : `/${locale}`

  const isPtBr = locale === "pt-br"

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader locale={locale} courseHref={courseHref} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16 space-y-8">
        <section className="space-y-3">
          <p className="text-sm font-medium text-primary uppercase tracking-wide">
            {isPtBr ? "Frodex · Termos" : "Frodex · Terms"}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
            {isPtBr ? "Termos de Uso da Plataforma" : "Terms of Use for This Platform"}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {isPtBr
              ? "Estes Termos de Uso explicam como esta plataforma educacional funciona, qual é o objetivo do projeto, como o conteúdo gerado por IA deve ser interpretado e quais são as responsabilidades de uso. Ao usar a plataforma, você concorda com estas condições."
              : "These Terms of Use explain how this educational platform works, the purpose of the project, how AI-generated content should be interpreted, and what your responsibilities are when using it. By using the platform, you agree to these conditions."}
          </p>
        </section>

        <Card className="p-6 sm:p-8 space-y-6 bg-card/80 border-border">
          {/* 1. Introduction */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {isPtBr ? "1. Introdução" : "1. Introduction"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "Esta plataforma foi criada como uma ferramenta educacional para desenvolvedores interessados em aprender sobre modelos de linguagem de grande porte (LLMs) e sistemas de IA. O foco é fornecer um ambiente prático, seguro e didático, com exemplos de uso, experimentação guiada e conceitos que ajudam a entender como essas tecnologias funcionam na prática."
                : "This platform was created as an educational tool for developers who want to learn about large language models (LLMs) and AI systems. The focus is to provide a practical, safe, and didactic environment, with usage examples, guided experimentation, and concepts that help you understand how these technologies work in real-world scenarios."}
            </p>
          </section>

          {/* 2. Acceptance of terms */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {isPtBr ? "2. Aceitação dos termos" : "2. Acceptance of terms"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "Ao acessar ou utilizar a plataforma, você declara que leu, entendeu e concorda em cumprir estes Termos de Uso. Se você não concorda com algum dos pontos descritos aqui, não deve utilizar a plataforma."
                : "By accessing or using the platform, you confirm that you have read, understood, and agree to comply with these Terms of Use. If you do not agree with any of the points described here, you should not use the platform."}
            </p>
          </section>

          {/* 3. Educational purpose */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {isPtBr ? "3. Finalidade educacional" : "3. Educational purpose"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "A plataforma é destinada exclusivamente a fins educacionais e experimentais. Ela não foi projetada para uso em produção, tomada de decisão automatizada em larga escala ou qualquer cenário onde erros de modelagem ou respostas imprecisas possam gerar riscos significativos."
                : "The platform is intended strictly for educational and experimental purposes. It is not designed for production use, large-scale automated decision-making, or any scenario where modeling errors or inaccurate responses could create significant risk."}
            </p>
          </section>

          {/* 4. AI-generated content disclaimer */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {isPtBr
                ? "4. Aviso sobre conteúdo gerado por IA"
                : "4. AI-generated content disclaimer"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "As respostas exibidas na plataforma são geradas por sistemas de inteligência artificial de terceiros. Esses sistemas podem produzir informações imprecisas, desatualizadas, incompletas ou que não se aplicam ao seu contexto específico. Nenhuma resposta deve ser interpretada como recomendação profissional, opinião definitiva ou garantia de veracidade."
                : "The responses shown in the platform are generated by third-party artificial intelligence systems. These systems may produce information that is inaccurate, outdated, incomplete, or not applicable to your specific context. No response should be interpreted as professional advice, a definitive opinion, or a guarantee of accuracy."}
            </p>
          </section>

          {/* 5. User responsibility */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {isPtBr ? "5. Responsabilidade do usuário" : "5. User responsibility"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "Você é integralmente responsável por como interpreta e utiliza as respostas geradas pela plataforma. Em especial, você não deve utilizar este conteúdo como base principal para decisões jurídicas, médicas, financeiras, de segurança, ou qualquer outra decisão crítica."
                : "You are fully responsible for how you interpret and use the responses generated by the platform. In particular, you must not use this content as the primary basis for legal, medical, financial, safety-related, or any other critical decisions."}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "Sempre valide as informações com fontes confiáveis e, quando apropriado, consulte profissionais qualificados antes de tomar decisões importantes."
                : "Always validate information against reliable sources and, when appropriate, consult qualified professionals before making important decisions."}
            </p>
          </section>

          {/* 6. Prompt and usage data */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {isPtBr ? "6. Prompts e dados de uso" : "6. Prompts and usage data"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "No momento, a plataforma não registra, persiste ou armazena de forma personalizada os prompts e mensagens que você envia. As interações são processadas apenas para gerar a resposta exibida na sessão atual."
                : "At this time, the platform does not log, persist, or store your prompts and messages in a personalized way. Interactions are processed only to generate the response shown in the current session."}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "No futuro, a plataforma poderá introduzir algum nível de registro ou monitoramento de uso para finalidades como segurança, prevenção de abuso, melhoria do serviço ou governança. Caso isso ocorra, estas práticas serão comunicadas por meio de atualizações destes Termos de Uso, e o texto será ajustado para refletir com clareza quais dados são coletados e como são tratados."
                : "In the future, the platform may introduce some level of logging or usage monitoring for purposes such as security, abuse prevention, service improvement, or governance. If this happens, these practices will be communicated through updates to these Terms of Use, and the text will be updated to clearly describe what data is collected and how it is handled."}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "Ao solicitar o certificado de conclusão do curso, são coletados seu nome e seu e-mail. Esses dados são utilizados para personalizar o certificado e podem ser enviados a uma ferramenta de automação (por exemplo, Zapier) para fins de envio do certificado e eventual contato relacionado ao curso. O usuário concorda com essa coleta ao preencher o formulário e aceitar os termos na própria tela do certificado."
                : "When you request the course completion certificate, your name and email are collected. These data are used to personalize the certificate and may be sent to an automation tool (e.g., Zapier) for certificate delivery and any course-related follow-up. By filling in the form and accepting the terms on the certificate screen, you agree to this collection."}
            </p>
          </section>

          {/* 7. Acceptable use */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {isPtBr ? "7. Uso aceitável" : "7. Acceptable use"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "Ao utilizar a plataforma, você concorda em não usá-la para:"
                : "By using the platform, you agree not to use it for:"}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-muted-foreground">
              <li>
                {isPtBr
                  ? "atividades ilegais ou que violem leis ou regulamentos aplicáveis;"
                  : "illegal activities or actions that violate applicable laws or regulations;"}
              </li>
              <li>
                {isPtBr
                  ? "gerar conteúdo intencionalmente prejudicial, abusivo, discriminatório, assediante ou que incentive violência;"
                  : "generating content that is intentionally harmful, abusive, discriminatory, harassing, or that incites violence;"}
              </li>
              <li>
                {isPtBr
                  ? "tentar explorar, atacar, sobrecarregar ou comprometer a segurança da plataforma, dos provedores de IA ou de qualquer outro sistema relacionado."
                  : "attempting to exploit, attack, overload, or compromise the security of the platform, the AI providers, or any related systems."}
              </li>
            </ul>
          </section>

          {/* 8. External services */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {isPtBr ? "8. Serviços externos de IA" : "8. External AI services"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "A plataforma depende de serviços de terceiros para geração de respostas por IA, como a API Gemini do Google ou serviços equivalentes. Esses provedores possuem seus próprios termos de uso, políticas de privacidade e regras de utilização, que podem se aplicar às suas interações."
                : "The platform relies on third-party services to generate AI responses, such as Google's Gemini API or equivalent services. These providers have their own terms of use, privacy policies, and usage rules, which may apply to your interactions."}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "Ao usar a plataforma, você também concorda em respeitar os termos desses provedores externos, na medida em que eles sejam aplicáveis ao uso que você faz aqui."
                : "By using the platform, you also agree to respect the terms of these external providers, to the extent that they apply to how you use the platform."}
            </p>
          </section>

          {/* 9. Changes to the service */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {isPtBr ? "9. Mudanças na plataforma" : "9. Changes to the service"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "Este é um projeto em evolução. A qualquer momento, funcionalidades podem ser adicionadas, alteradas ou removidas, e a plataforma pode ser pausada ou descontinuada sem aviso prévio. O objetivo é manter uma experiência útil e sustentável, mas não há garantia de disponibilidade contínua."
                : "This is an evolving project. Features may be added, changed, or removed at any time, and the platform may be paused or discontinued without prior notice. The goal is to maintain a useful and sustainable experience, but continuous availability is not guaranteed."}
            </p>
          </section>

          {/* 10. Changes to the terms */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {isPtBr ? "10. Atualizações destes termos" : "10. Changes to these terms"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "Estes Termos de Uso podem ser atualizados periodicamente para refletir mudanças na plataforma, nos serviços de terceiros utilizados ou nas práticas de tratamento de dados. A versão mais recente será sempre disponibilizada nesta página, com a data de última atualização indicada quando relevante."
                : "These Terms of Use may be updated from time to time to reflect changes in the platform, in the third-party services used, or in data-handling practices. The most recent version will always be available on this page, with an indication of the last update date when relevant."}
            </p>
          </section>

          {/* 11. Contact */}
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              {isPtBr ? "11. Contato" : "11. Contact"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isPtBr
                ? "Se você tiver dúvidas sobre estes Termos de Uso, sobre o funcionamento da plataforma ou sobre o projeto como um todo, pode entrar em contato pela página Sobre / Contato:"
                : "If you have questions about these Terms of Use, how the platform works, or the project more broadly, you can get in touch through the About / Contact page:"}
            </p>
            <p className="text-sm sm:text-base">
              <a
                href={`/${locale}/about`}
                className="text-primary underline underline-offset-4 hover:text-primary/90"
              >
                {isPtBr ? "acessar página Sobre / Contato" : "go to About / Contact page"}
              </a>
            </p>
          </section>
        </Card>
      </main>
    </div>
  )
}

