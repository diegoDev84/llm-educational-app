import Link from "next/link"
import { modules, lessons, getLessonsForModule } from "@/lib/lessons"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight, Sparkles, Code, Layers, Cpu, Rocket } from "lucide-react"

const moduleIcons = [BookOpen, Code, Layers, Cpu, Rocket]

export default function HomePage() {
  const firstLesson = lessons[0]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="relative max-w-5xl mx-auto px-6 py-24 lg:py-32">
          <div className="flex items-center gap-2 text-primary mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wide">
              Interactive Course
            </span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Master LLMs.
            <br />
            <span className="text-muted-foreground">Build AI Applications.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            A comprehensive, hands-on course teaching you how large language models work 
            and how to build production-ready AI applications. From fundamentals to 
            advanced techniques.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/lesson/${firstLesson.slug}`}>
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#curriculum">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Curriculum
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-border">
            <div>
              <p className="text-2xl font-bold text-foreground">14</p>
              <p className="text-sm text-muted-foreground">Lessons</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">5</p>
              <p className="text-sm text-muted-foreground">Modules</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">50+</p>
              <p className="text-sm text-muted-foreground">Playground Examples</p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">What You'll Learn</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            From understanding tokens to building production RAG systems, 
            this course covers everything you need to work effectively with LLMs.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "How LLMs Work",
                description: "Understand transformers, tokenization, and next-token prediction"
              },
              {
                title: "Prompt Engineering",
                description: "Master system prompts, few-shot learning, and structured outputs"
              },
              {
                title: "Function Calling",
                description: "Enable LLMs to interact with external APIs and tools"
              },
              {
                title: "Chain of Thought",
                description: "Improve accuracy with step-by-step reasoning techniques"
              },
              {
                title: "RAG Systems",
                description: "Build retrieval-augmented generation for accurate responses"
              },
              {
                title: "Production Skills",
                description: "Learn streaming, evaluation, and cost optimization"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Curriculum</h2>
          <p className="text-muted-foreground mb-10">
            5 modules taking you from foundations to production-ready skills.
          </p>

          <div className="space-y-6">
            {modules.map((module, moduleIndex) => {
              const Icon = moduleIcons[moduleIndex]
              const moduleLessons = getLessonsForModule(module.id)

              return (
                <div
                  key={module.id}
                  className="rounded-xl bg-card border border-border overflow-hidden"
                >
                  {/* Module Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Module {module.id}
                        </p>
                        <h3 className="text-lg font-semibold text-foreground">
                          {module.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="divide-y divide-border">
                    {moduleLessons.map((lesson) => {
                      const lessonNumber = lessons.findIndex(l => l.slug === lesson.slug) + 1

                      return (
                        <Link
                          key={lesson.slug}
                          href={`/lesson/${lesson.slug}`}
                          className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm text-muted-foreground font-medium">
                              {lessonNumber}
                            </span>
                            <span className="text-foreground group-hover:text-primary transition-colors">
                              {lesson.title}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Master LLMs?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Start with the fundamentals and work your way up to building 
            production-ready AI applications.
          </p>
          <Link href={`/lesson/${firstLesson.slug}`}>
            <Button size="lg" className="gap-2">
              Begin Your Journey
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>LLM Mastery — Learn AI Development</p>
        </div>
      </footer>
    </div>
  )
}
