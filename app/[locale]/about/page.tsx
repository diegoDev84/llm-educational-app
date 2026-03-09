import type { Metadata } from "next"
import type { Locale } from "@/lib/i18n"
import { aboutConfig } from "@/lib/about-config"
import { SiteHeader } from "@/components/site-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Linkedin, Github, Globe, MessageCircle } from "lucide-react"
import { getLessonSlugs } from "@/lib/lessons"
import { AboutContactForm } from "@/components/about-contact-form"

interface AboutPageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  const copy = aboutConfig.content[locale]

  return {
    title: copy.pageTitle,
    description: copy.pageSubtitle,
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  const copy = aboutConfig.content[locale]

  const slugs = getLessonSlugs(locale)
  const firstLessonSlug = slugs[0]
  const courseHref = firstLessonSlug ? `/${locale}/lesson/${firstLessonSlug}` : `/${locale}`

  const waNumber = aboutConfig.whatsapp.phoneNumberInternational
  const waMessage = aboutConfig.whatsapp.defaultMessage[locale]
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`

  const author = aboutConfig.author
  const links = aboutConfig.links

  const authorInitials = author.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader locale={locale} courseHref={courseHref} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16 space-y-10">
        {/* Intro */}
        <section className="space-y-4">
          <p className="text-sm font-medium text-primary uppercase tracking-wide">
            LLM Mastery
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
            {copy.pageTitle}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {copy.pageSubtitle}
          </p>
        </section>

        {/* Grid: project + creator */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          <Card className="p-6 sm:p-7 lg:p-8 bg-card/70 border-border">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
              {copy.aboutProject.title}
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {copy.aboutProject.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </Card>

          <Card className="p-6 sm:p-7 lg:p-8 bg-card/70 border-border flex flex-col gap-5">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              {copy.aboutCreatorSectionTitle}
            </h2>

            <div className="flex items-start gap-4">
              <Avatar className="w-14 h-14">
                {author.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={author.avatarUrl}
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{author.name}</p>
                <p className="text-sm text-muted-foreground">
                  {author.role[locale]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {author.location[locale]}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {author.shortBio[locale]}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {author.whyBuilt[locale]}
            </p>
          </Card>
        </section>

        {/* Networking + WhatsApp + Form */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)]">
          <div className="space-y-6">
            <Card className="p-6 sm:p-7 bg-card/70 border-border space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                {copy.networkingSectionTitle}
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                {links.github && (
                  <li>
                    <a
                      href={links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  </li>
                )}
                {links.website && (
                  <li>
                    <a
                      href={links.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  </li>
                )}
              </ul>
            </Card>

            <Card className="p-6 sm:p-7 bg-card/70 border-border space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span>{copy.whatsappSectionTitle}</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {copy.whatsappSectionDescription}
              </p>
              <Button asChild className="w-full sm:w-auto gap-2">
                <a href={waLink} target="_blank" rel="noreferrer">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </Button>
            </Card>
          </div>

          <AboutContactForm
            title={copy.contactForm.title}
            description={copy.contactForm.description}
            nameLabel={copy.contactForm.nameLabel}
            emailLabel={copy.contactForm.emailLabel}
            messageLabel={copy.contactForm.messageLabel}
            submitLabel={copy.contactForm.submitLabel}
          />
        </section>
      </main>
    </div>
  )
}

