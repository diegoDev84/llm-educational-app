export interface StarterPrompt {
  label: string
  prompt: string
  explanation: string
  /** When true, response is streamed (only used in streaming lesson). Omit or false = full response at once. */
  stream?: boolean
}

export interface Section {
  title: string
  content: string
}

export interface Lesson {
  title: string
  slug: string
  module: string
  summary: string
  duration: string
  goals: string[]
  sections: Section[]
  playground: {
    description: string
    starterPrompts: StarterPrompt[]
  }
  commonMistakes: string[]
  takeaways: string[]
}
