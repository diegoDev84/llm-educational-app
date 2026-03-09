export interface StarterPrompt {
  label: string
  prompt: string
  explanation: string
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
