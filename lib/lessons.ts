export type { Lesson, Section, StarterPrompt } from "./lesson-types"
import type { Lesson } from "./lesson-types"
import type { Locale } from "./i18n"
import { lessons as lessonsPtBr } from "@/content/lessons/pt-br"

function getLessons(locale: Locale): Lesson[] {
  return locale === "pt-br" ? lessonsPtBr : lessonsEn
}

export function getModules(locale: Locale): { name: string; lessons: Lesson[] }[] {
  const list = getLessons(locale)
  const moduleMap = new Map<string, Lesson[]>()
  for (const lesson of list) {
    if (!moduleMap.has(lesson.module)) moduleMap.set(lesson.module, [])
    moduleMap.get(lesson.module)!.push(lesson)
  }
  return Array.from(moduleMap.entries()).map(([name, lessons]) => ({ name, lessons }))
}

export function getLessonBySlug(slug: string, locale: Locale): Lesson | undefined {
  return getLessons(locale).find((l) => l.slug === slug)
}

export function getNextLesson(currentSlug: string, locale: Locale): Lesson | undefined {
  const list = getLessons(locale)
  const i = list.findIndex((l) => l.slug === currentSlug)
  return i >= 0 && i < list.length - 1 ? list[i + 1] : undefined
}

export function getPreviousLesson(currentSlug: string, locale: Locale): Lesson | undefined {
  const list = getLessons(locale)
  const i = list.findIndex((l) => l.slug === currentSlug)
  return i > 0 ? list[i - 1] : undefined
}

export function getLessonProgress(currentSlug: string, locale: Locale): { current: number; total: number } {
  const list = getLessons(locale)
  const i = list.findIndex((l) => l.slug === currentSlug)
  return { current: i + 1, total: list.length }
}

export function getLessonNumber(slug: string, locale: Locale): number {
  return getLessons(locale).findIndex((l) => l.slug === slug) + 1
}

export function getLessonSlugs(locale: Locale): string[] {
  return getLessons(locale).map((l) => l.slug)
}

// EN data lives in lessons-data.ts to avoid circular import with content/lessons/pt-br
export const lessonsEn: Lesson[] = [
  {
    title: "Introduction: How LLMs Work",
    slug: "how-llms-work",
    module: "Foundations",
    summary: "Understand the fundamental mechanics of large language models so you can reason about real-world LLM systems",
    duration: "15 min",
    goals: [
      "Understand how transformer architecture enables text generation",
      "Learn about next-token prediction and autoregressive generation",
      "Recognize the limitations of LLMs regarding memory and understanding"
    ],
    sections: [
      {
        title: "The Transformer Architecture",
        content: `Large Language Models (LLMs) are neural networks trained on massive amounts of text data to understand and generate human-like language. At their core, they work by predicting the next most likely token in a sequence.

Modern LLMs are built on the transformer architecture, introduced in the 2017 paper "Attention Is All You Need." The key innovation is the **attention mechanism**, which allows the model to weigh the relevance of different parts of the input when generating each output token.

When you send a prompt to an LLM, here's what happens:

1. **Tokenization**: Your text is broken into tokens (words or word pieces)
2. **Embedding**: Each token is converted to a numerical vector
3. **Processing**: The vectors pass through multiple transformer layers
4. **Prediction**: The model outputs probabilities for the next token
5. **Generation**: A token is selected and the process repeats`
      },
      {
        title: "Next-Token Prediction",
        content: `LLMs are fundamentally **autoregressive** models. This means they generate text one token at a time, using all previous tokens as context. The model doesn't "understand" in the human sense—it predicts statistical patterns learned from training data.

For example, when you type "The capital of France is", the model predicts "Paris" with high probability because it has seen this pattern millions of times in training data.`
      },
      {
        title: "Key Insight",
        content: `The model has no memory between conversations. Each request starts fresh. What appears as "understanding" is actually sophisticated pattern matching across billions of parameters learned during training.

The model can generate code because it has learned the statistical patterns of how code is structured from millions of code examples.`
      }
    ],
    playground: {
      description:
        "Use these tiny experiments to feel how the model completes patterns, finishes thoughts, and answers simple questions.",
      starterPrompts: [
        {
          label: "Pattern completion: animals",
          prompt:
            "Complete the pattern with another animal:\n\n1) Bird\n2) Butterfly\n3) Dog\n4) Weasel\n5)",
          explanation:
            "A short list completion that makes next-token prediction very tangible—you can quickly see if the continuation \"fits\" the pattern."
        },
        {
          label: "Finish the sentence",
          prompt:
            "Complete this sentence in a natural way:\n\n\"On weekends I like to\"",
          explanation:
            "Shows how the model continues everyday text based on common patterns it has seen during training."
        },
        {
          label: "Answer from a tiny fact list",
          prompt:
            "Facts:\n- The Sun is a star.\n- Earth orbits the Sun.\n- The Moon orbits Earth.\n\nQuestion: What does the Moon orbit?",
          explanation:
            "A minimal question-answer example that highlights how the model uses short context rather than any hidden database of facts."
        }
      ]
    },
    commonMistakes: [
      "Assuming the model 'knows' or 'remembers' information like a database—it predicts based on patterns",
      "Expecting perfect factual accuracy—LLMs can hallucinate convincing but false information",
      "Thinking the model understands context across separate conversations—each request is independent",
      "Believing larger models are always better—the right model depends on your specific use case"
    ],
    takeaways: [
      "LLMs generate text by predicting the next most likely token based on training patterns",
      "The transformer architecture enables models to consider context when making predictions",
      "Models have no persistent memory—each conversation starts fresh",
      "Understanding is pattern matching, not true comprehension—always verify critical information"
    ]
  },
  {
    title: "Tokens: The Currency of LLMs",
    slug: "tokens",
    module: "Foundations",
    summary: "Learn what tokens are and why they matter for cost, context, and real application design",
    duration: "12 min",
    goals: [
      "Understand what tokens are and how text is tokenized",
      "Learn why token count matters for cost and context limits",
      "Recognize how different content types tokenize differently"
    ],
    sections: [
      {
        title: "What Are Tokens?",
        content: `A token is a chunk of text that the model processes as a single unit. Tokens can be:

- Whole words: "hello" → 1 token
- Word pieces: "unhappiness" → ["un", "happiness"] → 2 tokens  
- Punctuation: "!" → 1 token
- Numbers: "2024" might be 1-2 tokens depending on the tokenizer

As a rough rule: **1 token ≈ 4 characters** or **100 tokens ≈ 75 words** in English.`
      },
      {
        title: "Why Tokens Matter",
        content: `### Cost

API pricing is typically per-token. Both input (prompt) and output (completion) tokens are counted. A verbose prompt costs more than a concise one.

### Context Window

Each model has a maximum context length (e.g., 8K, 32K, 128K tokens). This limit includes both your input AND the model's output. A 32K context model can process about 24,000 words total.

### Performance

Longer contexts can affect response quality. Information at the beginning and end of long prompts tends to be weighted more heavily than information in the middle.`
      },
      {
        title: "Tokenization Differences",
        content: `Different models use different tokenizers:

- GPT-4 uses the cl100k_base tokenizer
- Claude uses its own tokenizer
- Open-source models often use SentencePiece or custom tokenizers

The same text may have different token counts across models. The word "indescribable" is split into ["ind", "esc", "rib", "able"] = 4 tokens in GPT tokenizers. Code often has higher token density: "function(){}" might be 5+ tokens due to special characters.`
      }
    ],
    playground: {
      description:
        "Compare short vs wordy prompts and see how they change token usage and output.",
      starterPrompts: [
        {
          label: "Short summary (few tokens)",
          prompt:
            "Summarize in one short sentence (max 15 words):\n\n\"Users saw 500 errors on checkout for 20 minutes until we rolled back a deploy.\"",
          explanation:
            "A compact instruction that uses few input tokens and encourages a tiny, cheap output."
        },
        {
          label: "Overly polite summary (many tokens)",
          prompt:
            "Could you please write a very nice and detailed summary in natural language of the following short incident description, making sure to sound professional and considerate to every possible stakeholder who might ever read it in the future?\n\n\"Users saw 500 errors on checkout for 20 minutes until we rolled back a deploy.\"",
          explanation:
            "Almost the same task as above, but the extra polite sentence burns many more input tokens."
        },
        {
          label: "Tiny code example",
          prompt:
            "Write a TypeScript function `fullName` that receives `{ firstName: string; lastName: string }` and returns a single string like \"Ada Lovelace\". Keep everything within 3–4 lines.",
          explanation:
            "Even a small snippet of code turns into a noticeable number of tokens because of symbols and identifiers."
        }
      ]
    },
    commonMistakes: [
      "Ignoring token costs in production—verbose prompts at scale become expensive quickly",
      "Not accounting for output tokens—a request for 'a detailed explanation' generates many output tokens",
      "Assuming word count equals token count—special characters and code tokenize differently",
      "Filling context windows completely—this can degrade response quality"
    ],
    takeaways: [
      "Tokens are the unit of measurement for LLM input and output, approximately 4 characters each",
      "Both input and output tokens count toward cost and context limits",
      "Different models tokenize the same text differently",
      "Efficient prompting means getting good results with fewer tokens"
    ]
  },
  {
    title: "Controlling the Model: Generation Parameters",
    slug: "generation-parameters",
    module: "Foundations",
    summary: "Master the parameters that control how LLMs generate text in real applications",
    duration: "15 min",
    goals: [
      "Understand temperature and its effect on output randomness",
      "Learn about top-p, max_tokens, and other generation parameters",
      "Know when to use which parameters for different tasks"
    ],
    sections: [
      {
        title: "Temperature (0.0 - 2.0)",
        content: `Temperature controls the randomness of token selection:

- **0.0**: Deterministic—always picks the highest probability token. Best for factual tasks.
- **0.7**: Balanced—good default for most tasks
- **1.0+**: Creative—more random, unexpected outputs. Good for brainstorming.

Think of temperature as the "creativity dial."`
      },
      {
        title: "Top-P (Nucleus Sampling)",
        content: `Top-P (0.0 - 1.0) limits token selection to the smallest set whose cumulative probability exceeds P:

- **0.1**: Very focused—considers only the most likely tokens
- **0.9**: Broad—considers more diverse options
- **1.0**: Considers all tokens

Use either temperature OR top-p for control, not both simultaneously.`
      },
      {
        title: "Max Tokens",
        content: `Sets the maximum length of the generated response. Important for:

- **Cost control**: Limits output tokens billed
- **Response format**: Ensures concise answers
- **Context management**: Leaves room for follow-up exchanges`
      },
      {
        title: "Other Parameters",
        content: `### Stop Sequences

Strings that terminate generation when encountered. Useful for structured outputs.

### Frequency Penalty (0.0 - 2.0)

Reduces repetition by penalizing tokens that have already appeared. Higher values = less repetition.

### Presence Penalty (0.0 - 2.0)

Encourages the model to introduce new topics. Higher values = more diverse content.`
      }
    ],
    playground: {
      description: "Experiment with different parameter settings on realistic tasks to see how they affect determinism, creativity, and length.",
      starterPrompts: [
        {
          label: "Low Temperature (Deterministic Answer)",
          prompt:
            "You are assisting with a technical FAQ.\n\nQuestion: What HTTP status code represents a successful GET request?\n\nAnswer in one token.",
          explanation:
            "At low temperature, the model should consistently return `200`. This mirrors production use cases where you want stable, deterministic answers for factual questions."
        },
        {
          label: "High Temperature (Brainstorming)",
          prompt:
            "You are helping a product team brainstorm names.\n\nTask: Propose 5 alternative product names for a developer tool that speeds up CI/CD pipelines.\n\nConstraints:\n- Each name must be at most 2 words\n- Avoid using the words \"CI\", \"CD\", or \"pipeline\"",
          explanation:
            "With a higher temperature, the model explores more diverse options. Try different temperatures to see how variation changes for a realistic product-naming task."
        },
        {
          label: "Constrained-Length Summary",
          prompt:
            "Summarize the following log snippet in **exactly 12 words** so it can be shown in a compact monitoring dashboard card:\n\n\"2024-07-12 14:03:12Z ERROR payments-service Timeout calling Stripe API after 30s for charge request #48291\"",
          explanation:
            "Combining a strict instruction with an appropriate `max_tokens` lets you tightly control the length of summaries in real UI components."
        },
        {
          label: "Structured Bullet Output",
          prompt:
            "You are helping a tech lead prepare a status update.\n\nFrom this description:\n\"We refactored the authentication service, reduced login latency by 25%, and closed three high-priority security issues. Rollout completed with no incidents.\"\n\nReturn 3 bullet points, one per line, starting with a verb (e.g. \"Reduced\", \"Fixed\").",
          explanation:
            "Clear format instructions plus appropriate stop sequences help you generate structured, easy-to-scan status updates for stakeholders."
        }
      ]
    },
    commonMistakes: [
      "Using high temperature for tasks requiring accuracy—leads to hallucinations",
      "Setting max_tokens too low—responses get cut off mid-sentence",
      "Using both temperature and top_p—they compete; use one or the other",
      "Not testing parameters—optimal values vary by use case"
    ],
    takeaways: [
      "Temperature controls randomness: low for accuracy, high for creativity",
      "Top-P is an alternative to temperature for controlling diversity",
      "Max tokens limits output length and controls costs",
      "Always test different parameter combinations for your specific use case"
    ]
  },
  {
    title: "Anatomy of a Good Prompt",
    slug: "anatomy-of-prompt",
    module: "Communicating with LLMs",
    summary: "Learn the components of effective prompts for real LLM-powered products",
    duration: "18 min",
    goals: [
      "Understand the CRISPE framework for structuring prompts",
      "Learn best practices for clarity and specificity",
      "Know how to use delimiters and formatting effectively"
    ],
    sections: [
      {
        title: "The CRISPE Framework",
        content: `A strong prompt often includes these elements:

### C - Context

Background information the model needs to understand the task.

### R - Role

Who the model should act as (expert, assistant, character).

### I - Instructions

Clear, specific directions for what to do.

### S - Specifics

Details about format, length, style, or constraints.

### P - Persona

Tone and voice characteristics for the response.

### E - Examples

Sample inputs and outputs to demonstrate expectations.`
      },
      {
        title: "Prompt Structure Best Practices",
        content: `### Be Specific, Not Vague

❌ "Write something about dogs"

✅ "Write a 100-word informative paragraph about Golden Retrievers' temperament for first-time dog owners"

### Use Clear Delimiters

Separate different parts of your prompt with clear markers:

\`\`\`
Context: [Your context here]
---
Task: [Your task here]
---
Format: [Expected output format]
\`\`\`

### Order Matters

Put the most important information at the beginning and end of prompts. Information in the middle may receive less attention (the "lost in the middle" problem).

### Be Explicit About Format

If you want a list, say "as a numbered list." If you want JSON, specify the schema.`
      }
    ],
    playground: {
      description:
        "Glance at these tiny prompts to feel the difference between vague and well-structured instructions.",
      starterPrompts: [
        {
          label: "Vague request",
          prompt: "Help me with my API.",
          explanation:
            "So short that the model has no idea what you care about—design, errors, performance, security—so the answer will be generic."
        },
        {
          label: "Structured request (CRISPE)",
          prompt:
            "You are a backend engineer.\n\nContext:\n- REST API used by a mobile app\n- Users sometimes get HTTP 429 on `/search`\n\nTask:\nExplain to a junior dev what HTTP 429 means and give 2 mitigation ideas.\n\nStyle:\n- Simple language\n- Bullet list, not long paragraphs",
          explanation:
            "Same topic, but now you add role, context, task, and style so the model knows exactly what to do."
        },
        {
          label: "Format-specific extraction",
          prompt:
            "From the text below, pull out 3 risks in this exact format:\n- Risk: <short title>\n  Impact: <short sentence>\n  Mitigation: <short sentence>\n\n\"We are migrating from a monolith to microservices. Multiple teams will touch the same database. We must keep performance acceptable for existing users.\"",
          explanation:
            "Shows how explicit format instructions turn a paragraph into structured, easy-to-scan bullets."
        }
      ]
    },
    commonMistakes: [
      "Being too vague—'write something good' gives the model no direction",
      "Overloading with instructions—too many competing requirements confuse the model",
      "Assuming context—the model doesn't know your previous thoughts or projects",
      "Forgetting format requirements—if you need structured output, specify it explicitly"
    ],
    takeaways: [
      "Structure prompts with context, role, instructions, specifics, and examples",
      "Be specific about format, length, tone, and audience",
      "Use delimiters to clearly separate different parts of complex prompts",
      "Put critical information at the beginning and end, not the middle"
    ]
  },
  {
    title: "System Prompts and Personas",
    slug: "system-prompts",
    module: "Communicating with LLMs",
    summary: "Shape model behavior with system prompts and personas for specific products and workflows",
    duration: "15 min",
    goals: [
      "Understand what system prompts are and how they work",
      "Learn to design effective personas for different use cases",
      "Know common patterns for system prompt design"
    ],
    sections: [
      {
        title: "What Is a System Prompt?",
        content: `A system prompt is a privileged message that:
- Sets persistent behavior rules
- Defines the AI's role and capabilities
- Establishes constraints and guidelines
- Is typically invisible to end users

Most APIs distinguish between "system" and "user" messages, giving system prompts priority.`
      },
      {
        title: "Designing Effective Personas",
        content: `### Define the Role Clearly

\`\`\`
You are a senior software architect with 15 years of experience
in distributed systems. You prioritize scalability and maintainability.
\`\`\`

### Set Behavioral Rules

\`\`\`
Rules:
- Always ask clarifying questions before providing solutions
- Cite trade-offs for every recommendation
- Never recommend deprecated technologies
\`\`\`

### Establish Boundaries

\`\`\`
Limitations:
- You can only discuss topics related to software architecture
- You cannot write or execute code directly
- You must acknowledge uncertainty when applicable
\`\`\``
      },
      {
        title: "System Prompt Patterns",
        content: `### The Expert Pattern

Position the model as a domain expert with specific knowledge and approach.

### The Persona Pattern

Give the model a character with personality traits, speaking style, and values.

### The Safety Pattern

Include instructions for handling edge cases, sensitive topics, and error conditions.`
      }
    ],
    playground: {
      description: "See how system prompts change the model's behavior and focus.",
      starterPrompts: [
        {
          label: "No System Prompt",
          prompt: "Review this code: function add(a,b) { return a + b }",
          explanation: "Without a system prompt, you get a generic review. The model doesn't know your standards or what aspects to focus on."
        },
        {
          label: "Expert Persona",
          prompt: "[System: You are a senior TypeScript developer who prioritizes type safety and clean code. Be concise but thorough.]\n\nReview this code: function add(a,b) { return a + b }",
          explanation: "With a persona, the review focuses on TypeScript-specific issues like missing type annotations."
        },
        {
          label: "Constrained Persona",
          prompt: "[System: You are a helpful cooking assistant. You can only discuss cooking, recipes, and kitchen topics. Politely redirect off-topic questions.]\n\nWhat's the best programming language?",
          explanation: "This demonstrates how system prompts can establish boundaries and redirect off-topic requests."
        }
      ]
    },
    commonMistakes: [
      "Making system prompts too long—the model may ignore parts of overly complex instructions",
      "Conflicting instructions—contradictory rules confuse the model",
      "Not testing edge cases—users will try to break or bypass your system prompt",
      "Assuming perfect compliance—models may still deviate from system prompt instructions"
    ],
    takeaways: [
      "System prompts set persistent behavior rules for the entire conversation",
      "Define clear roles, rules, and boundaries in your system prompts",
      "Use patterns like Expert, Persona, and Safety for different use cases",
      "Test thoroughly—users will find ways to challenge your system prompt"
    ]
  },
  {
    title: "Few-Shot Learning",
    slug: "few-shot-learning",
    module: "Communicating with LLMs",
    summary: "Teach models new tasks through examples, as you would in real product flows",
    duration: "12 min",
    goals: [
      "Understand few-shot learning and when to use it",
      "Learn to craft effective example sets",
      "Know the trade-offs between zero-shot, one-shot, and few-shot"
    ],
    sections: [
      {
        title: "What Is Few-Shot Learning?",
        content: `Few-shot learning teaches the model by providing examples of the desired input-output pairs. Instead of explaining what to do, you show it.

### Zero-Shot

No examples, just instructions. Works for common tasks.

### One-Shot

Single example provided. Good for simple patterns.

### Few-Shot

Multiple examples (typically 3-5). Best for complex or unusual tasks.`
      },
      {
        title: "Crafting Effective Examples",
        content: `### Diversity

Include examples that cover different cases:
- Different input formats
- Edge cases
- Various output lengths

### Consistency

Keep example format identical:
- Same delimiters
- Same structure
- Same level of detail

### Quality

Each example should be a perfect demonstration:
- No errors
- Clear pattern
- Representative of expected inputs`
      },
      {
        title: "Few-Shot Template",
        content: `\`\`\`
Convert the following product descriptions to marketing headlines:

Input: A comfortable office chair with lumbar support
Output: Work in Comfort: Premium Ergonomic Seating

Input: Wireless earbuds with 24-hour battery life
Output: All-Day Sound: Never Stop Listening

Input: [Your actual input here]
Output:
\`\`\``
      }
    ],
    playground: {
      description:
        "See how adding 2–3 short examples quickly teaches the model a pattern.",
      starterPrompts: [
        {
          label: "Zero-shot sentiment",
          prompt:
            "Classify the sentiment as positive, negative, or neutral:\n\n\"Shipping was slow, but the product is great.\"",
          explanation:
            "With no examples, the model leans on its general sense of sentiment words."
        },
        {
          label: "Few-shot sentiment",
          prompt:
            "Classify the sentiment:\n\n\"Fast delivery!\" → positive\n\"Product arrived broken.\" → negative\n\"Still waiting for my order.\" → negative\n\nNow classify:\n\"Shipping was slow, but the product is great.\" →",
          explanation:
            "A tiny set of labeled examples makes the expected categories and style crystal clear."
        },
        {
          label: "Learning a format",
          prompt:
            "Turn titles into URL slugs:\n\n\"How LLMs work\" → how-llms-work\n\"Few-shot learning basics\" → few-shot-learning-basics\n\"JSON output examples\" →",
          explanation:
            "The model copies the pattern from a couple of examples to a new input."
        }
      ]
    },
    commonMistakes: [
      "Too few examples for complex tasks—3-5 examples usually work better than 1",
      "Inconsistent example formatting—variation confuses the model about the expected pattern",
      "Poor quality examples—errors in examples propagate to outputs",
      "Ignoring token costs—more examples means higher costs; find the minimum effective number"
    ],
    takeaways: [
      "Few-shot learning teaches through examples rather than instructions",
      "Use diverse, consistent, high-quality examples",
      "Balance example count against token costs",
      "Few-shot is especially valuable for unusual or domain-specific tasks"
    ]
  },
  {
    title: "JSON Mode and Structured Output",
    slug: "json-mode",
    module: "Structured Outputs",
    summary: "Get predictable, parseable responses from LLMs so your systems can rely on them",
    duration: "15 min",
    goals: [
      "Understand JSON mode and when to use it",
      "Learn to specify output schemas effectively",
      "Handle edge cases and validation"
    ],
    sections: [
      {
        title: "Why Structured Output?",
        content: `LLMs naturally generate free-form text, but applications often need structured data:

- **Parsing reliability**: JSON can be parsed programmatically
- **Consistency**: Same structure every time
- **Integration**: Easy to use with databases and APIs
- **Validation**: Check if output matches expected schema`
      },
      {
        title: "Enabling JSON Mode",
        content: `Most APIs offer a JSON mode flag:

\`\`\`javascript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  response_format: { type: "json_object" },
  messages: [
    { role: "system", content: "Output valid JSON only." },
    { role: "user", content: "List 3 programming languages with their year of creation" }
  ]
});
\`\`\`

**Important**: When using JSON mode, you must instruct the model to output JSON in the prompt itself.`
      },
      {
        title: "Specifying Schemas",
        content: `Be explicit about the expected structure:

\`\`\`
Return a JSON object with this exact structure:
{
  "languages": [
    {
      "name": "string",
      "year": number,
      "paradigm": "string"
    }
  ]
}
\`\`\`

Providing a schema template significantly improves reliability.`
      }
    ],
    playground: {
      description: "Practice turning tiny pieces of text into clean JSON objects and arrays.",
      starterPrompts: [
        {
          label: "Simple field extraction",
          prompt:
            "Extract the fields from this text and return JSON:\n\n\"Name: John Smith\nEmail: john@email.com\nOrder: #4932\"\n\nReturn an object with: name, email, orderId",
          explanation:
            "A direct mapping from a mini form into JSON—easy to read and easy to validate."
        },
        {
          label: "Books with a fixed schema",
          prompt:
            "Return 2 books using exactly this JSON shape:\n{\n  \"books\": [\n    {\"title\": \"\", \"author\": \"\", \"year\": 0}\n  ]\n}",
          explanation:
            "Repeating a short template pushes the model to keep the same structure for every item."
        },
        {
          label: "Tiny nested JSON",
          prompt:
            "Create JSON for a recipe with:\n- name\n- prepMinutes\n- ingredients: array of { item, amount }\n- steps: array of strings\n\nKeep it very short: 2 ingredients and 2 steps.",
          explanation:
            "Shows how to describe a small nested shape without a lot of surrounding story text."
        }
      ]
    },
    commonMistakes: [
      "Forgetting to instruct JSON output in the prompt—JSON mode alone isn't enough",
      "Not providing a schema—the model may invent its own structure",
      "Not validating output—always parse and validate JSON before using it",
      "Requesting too complex structures—deeply nested schemas increase error rates"
    ],
    takeaways: [
      "JSON mode ensures syntactically valid JSON output",
      "Always include JSON instructions in the prompt, not just the API flag",
      "Provide explicit schema templates for consistent structure",
      "Validate and parse JSON output before using it in your application"
    ]
  },
  {
    title: "Function Calling",
    slug: "function-calling",
    module: "Structured Outputs",
    summary: "Enable LLMs to interact with external systems in a controlled, production-ready way",
    duration: "20 min",
    goals: [
      "Understand function calling and tool use",
      "Learn to define function schemas",
      "Implement safe and effective function execution"
    ],
    sections: [
      {
        title: "What Is Function Calling?",
        content: `Function calling allows LLMs to:

1. **Recognize** when a function should be called
2. **Extract** the correct parameters from natural language
3. **Return** a structured function call for your code to execute

The model doesn't execute functions—it tells your code what to call.`
      },
      {
        title: "Defining Functions",
        content: `Functions are defined using JSON Schema:

\`\`\`javascript
const functions = [{
  name: "get_weather",
  description: "Get the current weather for a location",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "City and state, e.g., 'San Francisco, CA'"
      },
      unit: {
        type: "string",
        enum: ["celsius", "fahrenheit"],
        description: "Temperature unit"
      }
    },
    required: ["location"]
  }
}];
\`\`\`

Clear descriptions help the model choose correctly.`
      },
      {
        title: "The Function Calling Loop",
        content: `The typical pattern:

1. User sends a message
2. Model decides to call a function
3. Your code executes the function
4. Send the result back to the model
5. Model generates a final response

\`\`\`
User: "What's the weather in Tokyo?"
↓
Model: {function: "get_weather", arguments: {location: "Tokyo, Japan"}}
↓
Your code: fetch weather API → {temp: 22, condition: "sunny"}
↓
Model: "It's currently 22°C and sunny in Tokyo."
\`\`\``
      }
    ],
    playground: {
      description: "See how function calling extracts structured parameters from natural language.",
      starterPrompts: [
        {
          label: "Simple Function Call",
          prompt: "[Available function: search_products(query: string, max_price?: number)]\n\nUser: Find me running shoes under $100",
          explanation: "The model extracts parameters from natural language: query='running shoes', max_price=100."
        },
        {
          label: "Multiple Parameters",
          prompt: "[Available function: book_flight(origin: string, destination: string, date: string, passengers: number)]\n\nUser: I need to book a flight from NYC to London for 2 people on March 15th",
          explanation: "The model correctly identifies all four parameters from a single natural language request."
        },
        {
          label: "Function Selection",
          prompt: "[Available functions: get_weather(location), search_restaurants(cuisine, location), book_table(restaurant_id, date, party_size)]\n\nUser: Find Italian restaurants near downtown Seattle",
          explanation: "When multiple functions are available, the model selects the appropriate one."
        }
      ]
    },
    commonMistakes: [
      "Poor function descriptions—the model relies on descriptions to choose functions",
      "Missing parameter descriptions—leads to incorrect parameter extraction",
      "Not handling function errors—always have fallback behavior for failed calls",
      "Trusting function calls blindly—validate parameters before executing"
    ],
    takeaways: [
      "Function calling bridges natural language and structured API calls",
      "Clear function and parameter descriptions are critical for accuracy",
      "Always validate parameters before executing functions",
      "The model suggests calls—your code executes them safely"
    ]
  },
  {
    title: "Chain of Thought Reasoning",
    slug: "chain-of-thought",
    module: "Advanced Techniques",
    summary: "Improve complex reasoning with step-by-step thinking for real-world decision making",
    duration: "15 min",
    goals: [
      "Understand chain of thought (CoT) prompting",
      "Learn when CoT improves results",
      "Implement various CoT techniques"
    ],
    sections: [
      {
        title: "What Is Chain of Thought?",
        content: `Chain of Thought prompting encourages the model to show its reasoning process step by step, rather than jumping directly to an answer.

**Without CoT:**
Q: If a shirt costs $25 and is 20% off, what's the final price?
A: $20

**With CoT:**
Q: If a shirt costs $25 and is 20% off, what's the final price? Think step by step.
A: Let me work through this:
1. Original price: $25
2. Discount: 20% of $25 = $5
3. Final price: $25 - $5 = $20`
      },
      {
        title: "Why CoT Works",
        content: `Chain of thought improves accuracy by:

- **Decomposing** complex problems into smaller steps
- **Reducing** errors in multi-step reasoning
- **Making** the reasoning process auditable
- **Catching** mistakes before the final answer

CoT is especially effective for:
- Math problems
- Logic puzzles
- Multi-step analysis
- Complex decision-making`
      },
      {
        title: "CoT Techniques",
        content: `### Zero-Shot CoT

Simply add "Think step by step" or "Let's work through this" to your prompt.

### Few-Shot CoT

Provide examples that demonstrate step-by-step reasoning.

### Self-Consistency

Generate multiple CoT paths and take the majority answer.

### Tree of Thoughts

Explore multiple reasoning branches and evaluate each.`
      }
    ],
    playground: {
      description:
        "Run the same tiny problems with and without “think step by step” and compare the reasoning.",
      starterPrompts: [
        {
          label: "No CoT: quick math",
          prompt:
            "I have $50.\nI buy a book for $18 and a snack for $4.\n\nHow much money is left?",
          explanation:
            "A very small multi-step calculation that the model might still fumble when answering directly."
        },
        {
          label: "With CoT: show the steps",
          prompt:
            "I have $50.\nI buy a book for $18 and a snack for $4.\n\nThink step by step. Show each intermediate calculation, then give the final amount of money left.",
          explanation:
            "The numbers are the same, but now you explicitly ask for the reasoning chain before the final answer."
        },
        {
          label: "Prioritizing tiny support tickets",
          prompt:
            "Tickets:\n1) \"Checkout button sometimes does nothing when clicked.\"\n2) \"Dark mode toggle does not remember my choice.\"\n3) \"Avatar image is slightly blurry on profile page.\"\n\nThink step by step about impact and frequency, then label each ticket P1, P2, or P3 with one short reason.",
          explanation:
            "A short qualitative example where you can see the model write out its reasoning before deciding priorities."
        }
      ]
    },
    commonMistakes: [
      "Using CoT for simple tasks—adds latency and cost without benefit",
      "Not verifying the reasoning—CoT steps can still contain errors",
      "Skipping CoT for math—most math problems benefit from explicit steps",
      "Ignoring the reasoning—the steps often reveal when the model is uncertain"
    ],
    takeaways: [
      "Chain of thought prompting improves accuracy on complex reasoning tasks",
      "Simply adding 'think step by step' can significantly improve results",
      "CoT makes reasoning auditable—you can check each step",
      "Use CoT for math, logic, and multi-step analysis"
    ]
  },
  {
    title: "Managing the Context Window",
    slug: "context-window",
    module: "Advanced Techniques",
    summary: "Work effectively within token limits when designing real conversational and assistant flows",
    duration: "15 min",
    goals: [
      "Understand context window limitations",
      "Learn strategies for long conversations",
      "Implement effective context management"
    ],
    sections: [
      {
        title: "Context Window Basics",
        content: `The context window is the total amount of text (in tokens) the model can consider at once. This includes:

- System prompt
- Conversation history
- Current user message
- Model's response

Common context sizes:
- GPT-3.5: 4K-16K tokens
- GPT-4: 8K-128K tokens
- Claude: 100K-200K tokens
- Llama: varies by model`
      },
      {
        title: "The Middle Problem",
        content: `Research shows models pay less attention to information in the middle of long contexts:

- **Beginning**: High attention (primacy effect)
- **Middle**: Lower attention (lost in the middle)
- **End**: High attention (recency effect)

For critical information, place it at the beginning or end of your context.`
      },
      {
        title: "Context Management Strategies",
        content: `### Summarization

Periodically summarize older messages:
\`\`\`
[Summary of previous conversation: User asked about X, we discussed Y, agreed on Z]
\`\`\`

### Sliding Window

Keep only the N most recent messages.

### Selective Inclusion

Only include messages relevant to the current query.

### Hierarchical Memory

Store detailed information externally, include summaries in context.`
      }
    ],
    playground: {
      description: "Practice techniques for managing long conversations.",
      starterPrompts: [
        {
          label: "Context Summary",
          prompt: "Summarize this conversation for context management:\n\nUser: I want to build a todo app\nAssistant: Great! Let's start with the tech stack.\nUser: I prefer React and TypeScript\nAssistant: Perfect. Should we use a database?\nUser: Yes, PostgreSQL\nAssistant: I recommend Prisma as the ORM.\n\nProvide a 2-sentence summary capturing the key decisions.",
          explanation: "Summarization preserves essential information while reducing token count."
        },
        {
          label: "Important Info Placement",
          prompt: "The user's budget is $500. They want a laptop for programming.\n\n[Many other details about laptop features, brands, and specifications would go here]\n\nRemember: Budget is $500, use case is programming.\n\nRecommend a laptop.",
          explanation: "Placing critical constraints at both start and end helps ensure they're not forgotten."
        },
        {
          label: "Selective Context",
          prompt: "Based only on the relevant context below, answer the question.\n\nContext:\n- User is building an e-commerce site\n- They chose Next.js as the framework\n- They need authentication\n- Previous discussion about color schemes (not relevant)\n- They want to use Stripe for payments\n\nQuestion: What payment integration should I implement?",
          explanation: "Including only relevant context improves response quality and reduces costs."
        }
      ]
    },
    commonMistakes: [
      "Including all conversation history—leads to context overflow and higher costs",
      "Putting critical info in the middle—it may be overlooked",
      "No context management strategy—conversations degrade as they grow",
      "Ignoring context limits—truncation can cause incoherent responses"
    ],
    takeaways: [
      "Context windows have hard limits—plan for them",
      "Place critical information at the beginning and end",
      "Use summarization and selective inclusion to manage long conversations",
      "Monitor token usage and implement overflow strategies"
    ]
  },
  {
    title: "Embeddings and Semantic Search",
    slug: "embeddings",
    module: "Advanced Techniques",
    summary: "Convert text to vectors for similarity search in real applications and systems",
    duration: "18 min",
    goals: [
      "Understand what embeddings are and how they work",
      "Learn to implement semantic search",
      "Know when to use embeddings vs other approaches"
    ],
    sections: [
      {
        title: "What Are Embeddings?",
        content: `Embeddings convert text into numerical vectors that capture semantic meaning:

- Similar meanings → Similar vectors
- Different meanings → Different vectors

A sentence like "I love pizza" becomes a vector like [0.23, -0.45, 0.87, ...] (typically 1536+ dimensions).

**Key property**: You can measure similarity between embeddings using cosine similarity or dot product.`
      },
      {
        title: "Generating Embeddings",
        content: `\`\`\`javascript
const response = await openai.embeddings.create({
  model: "text-embedding-ada-002",
  input: "Your text here"
});

const vector = response.data[0].embedding;
// Returns a 1536-dimensional vector
\`\`\`

Store these vectors in a vector database for efficient similarity search.`
      },
      {
        title: "Semantic Search",
        content: `Traditional search: exact keyword matching
Semantic search: meaning-based matching

Example queries that semantic search handles well:
- "automobile" finds documents about "cars"
- "happy" finds documents about "joyful" or "pleased"
- "ML" finds documents about "machine learning"

The process:

1. Embed your query
2. Find similar vectors in your database
3. Return the corresponding documents`
      }
    ],
    playground: {
      description: "Explore how embeddings capture semantic meaning.",
      starterPrompts: [
        {
          label: "Semantic Similarity",
          prompt: "Rate the semantic similarity (0-10) between these pairs:\n\n1. 'car' and 'automobile'\n2. 'car' and 'banana'\n3. 'happy' and 'joyful'\n4. 'bank' (financial) and 'bank' (river)\n\nExplain why embeddings would capture these similarities differently.",
          explanation: "Embeddings capture meaning, so synonyms have similar vectors while unrelated words are distant."
        },
        {
          label: "Search Use Case",
          prompt: "I have a database of product descriptions. A user searches for 'comfortable work from home chair'. Explain how semantic search would find relevant products even if they don't contain these exact words.",
          explanation: "Semantic search finds products described as 'ergonomic office seating' or 'desk chair with lumbar support'."
        },
        {
          label: "Embedding Strategy",
          prompt: "I'm building a Q&A system over company documentation. Should I embed:\nA) Entire documents\nB) Individual paragraphs\nC) Individual sentences\n\nExplain the trade-offs of each approach.",
          explanation: "Chunk size affects retrieval precision. Smaller chunks are more precise but may lose context."
        }
      ]
    },
    commonMistakes: [
      "Embedding very long texts—chunk into smaller pieces for better retrieval",
      "Using wrong embedding model—match the model to your use case and language",
      "Ignoring embedding costs—embeddings are cheaper than completions but add up at scale",
      "Not normalizing vectors—some similarity measures require normalized vectors"
    ],
    takeaways: [
      "Embeddings convert text to vectors that capture semantic meaning",
      "Similar meanings produce similar vectors, enabling semantic search",
      "Chunk long documents for better retrieval precision",
      "Use embeddings for search, clustering, and recommendation systems"
    ]
  },
  {
    title: "Retrieval-Augmented Generation (RAG)",
    slug: "rag",
    module: "Production Systems",
    summary: "Ground LLM responses in your own data to build reliable LLM applications",
    duration: "20 min",
    goals: [
      "Understand the RAG architecture",
      "Learn to implement basic RAG systems",
      "Know common RAG pitfalls and solutions"
    ],
    sections: [
      {
        title: "Why RAG?",
        content: `LLMs have limitations:
- Knowledge cutoff (don't know recent events)
- Can't access private data
- May hallucinate facts

RAG solves this by:
1. **Retrieving** relevant documents from your data
2. **Augmenting** the prompt with this context
3. **Generating** a response grounded in real information`
      },
      {
        title: "RAG Architecture",
        content: `\`\`\`
User Query
    ↓
┌─────────────────┐
│  Embed Query    │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Vector Search  │ ← Your document embeddings
└────────┬────────┘
         ↓
┌─────────────────┐
│  Top K Results  │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Augment Prompt │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Generate       │
└────────┬────────┘
         ↓
    Response
\`\`\``
      },
      {
        title: "Implementation Considerations",
        content: `### Chunking Strategy

- Too small: loses context
- Too large: noise and irrelevance
- Sweet spot: 200-500 tokens with overlap

### Retrieval Quality

- Number of results (k): balance relevance vs context size
- Similarity threshold: filter low-relevance results
- Hybrid search: combine semantic + keyword matching

### Prompt Design

- Clearly separate context from question
- Instruct model to say "I don't know" if context doesn't contain the answer
- Consider citing sources`
      }
    ],
    playground: {
      description: "Practice designing RAG prompts and understanding retrieval.",
      starterPrompts: [
        {
          label: "RAG Prompt Template",
          prompt: "Design a RAG prompt template that:\n1. Clearly separates context from question\n2. Instructs the model to only use provided context\n3. Handles cases where context doesn't contain the answer\n4. Cites which document the answer came from",
          explanation: "Good RAG prompts prevent hallucination by constraining the model to provided context."
        },
        {
          label: "Chunking Strategy",
          prompt: "I have 100 PDF documents about employee benefits. Each is 20 pages long. Recommend a chunking strategy for RAG, including:\n- Chunk size\n- Overlap\n- Metadata to include\n- How to handle tables and lists",
          explanation: "Chunking strategy significantly impacts retrieval quality."
        },
        {
          label: "Retrieval Debugging",
          prompt: "My RAG system retrieves irrelevant documents for 'What is the vacation policy?' It returns documents about 'office vacation decorations' and 'vacation mode settings'. What's likely wrong and how can I fix it?",
          explanation: "Understanding semantic search limitations helps debug retrieval issues."
        }
      ]
    },
    commonMistakes: [
      "Not saying 'I don't know'—model may hallucinate if context lacks the answer",
      "Poor chunking—too large or too small chunks hurt retrieval",
      "Ignoring metadata—dates, sources, and document types improve relevance",
      "No evaluation—track retrieval quality and answer accuracy separately"
    ],
    takeaways: [
      "RAG grounds LLM responses in your actual data",
      "Quality depends on both retrieval and generation",
      "Chunking strategy significantly impacts results",
      "Always include instructions for handling missing information"
    ]
  },
  {
    title: "Streaming Responses",
    slug: "streaming",
    module: "Production Systems",
    summary: "Deliver faster perceived performance with streaming in production LLM interfaces",
    duration: "12 min",
    goals: [
      "Understand why streaming improves UX",
      "Learn to implement streaming in different frameworks",
      "Handle streaming edge cases"
    ],
    sections: [
      {
        title: "Why Stream?",
        content: `Without streaming:
- User waits for entire response
- Long responses = long wait
- No feedback during generation

With streaming:
- First tokens appear in ~200ms
- Response builds in real-time
- Better perceived performance

For a 500-token response, streaming can make the experience feel 10x faster.`
      },
      {
        title: "Implementing Streaming",
        content: `\`\`\`javascript
// Using AI SDK
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = streamText({
  model: openai('gpt-4'),
  prompt: 'Write a short story',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
\`\`\`

Server-Sent Events (SSE) or WebSockets deliver chunks to the browser.`
      },
      {
        title: "Streaming Considerations",
        content: `### Error Handling

Errors can occur mid-stream. Always handle:
- Connection drops
- Rate limits
- Model errors

### Parsing Structured Output

If streaming JSON, wait for complete object before parsing.

### UI/UX

- Show typing indicator during generation
- Handle rapid content updates efficiently
- Consider smooth scroll behavior`
      }
    ],
    playground: {
      description: "Understand streaming patterns and trade-offs.",
      starterPrompts: [
        {
          label: "Streaming Benefits",
          prompt: "A response takes 3 seconds to generate (500 tokens). Compare the user experience with and without streaming. What's the perceived latency difference?",
          explanation: "Streaming shows first tokens in ~200ms vs 3000ms wait, dramatically improving perceived performance."
        },
        {
          label: "Streaming Challenges",
          prompt: "I'm streaming JSON responses. The partial response so far is: {\"name\": \"Joh\n\nWhat challenges does this create and how should I handle it?",
          explanation: "Partial JSON can't be parsed. Buffer until you have complete objects or valid JSON."
        },
        {
          label: "Error Recovery",
          prompt: "My streaming connection drops after receiving 'The answer is ' but before the actual answer. How should the application handle this gracefully?",
          explanation: "Good error handling shows partial content and offers retry options."
        }
      ]
    },
    commonMistakes: [
      "Not handling connection errors—streams can fail mid-response",
      "Parsing partial JSON—wait for complete structures",
      "Ignoring rate limits—streaming doesn't prevent rate limiting",
      "No loading states—users need feedback while waiting for first token"
    ],
    takeaways: [
      "Streaming dramatically improves perceived performance",
      "First tokens appear in ~200ms regardless of total response length",
      "Handle errors gracefully—streams can fail mid-response",
      "Buffer structured output until it's complete"
    ]
  },
  {
    title: "Evaluation and Cost Optimization",
    slug: "evaluation",
    module: "Production Systems",
    summary: "Measure quality and optimize costs in production LLM systems",
    duration: "18 min",
    goals: [
      "Learn to evaluate LLM output quality",
      "Understand cost optimization strategies",
      "Implement monitoring and observability"
    ],
    sections: [
      {
        title: "Evaluation Methods",
        content: `### Automated Metrics

- **Exact match**: Response matches expected output
- **BLEU/ROUGE**: Text similarity scores
- **Custom validators**: Schema compliance, keyword presence

### LLM-as-Judge

Use a (different) LLM to evaluate responses:
\`\`\`
Rate this response on accuracy (1-5):
Question: {question}
Expected themes: {themes}
Response: {response}
\`\`\`

### Human Evaluation

- A/B testing with users
- Expert review for high-stakes applications
- Periodic quality audits`
      },
      {
        title: "Cost Optimization",
        content: `### Model Selection

- Use smaller models for simple tasks
- GPT-3.5 for classification, GPT-4 for complex reasoning
- Fine-tuned small models can outperform large general models

### Prompt Optimization

- Shorter prompts = lower costs
- Remove redundant instructions
- Compress examples

### Caching

- Cache identical queries
- Semantic caching for similar queries
- TTL based on content freshness needs`
      },
      {
        title: "Monitoring in Production",
        content: `Track these metrics:

### Performance

- Latency (p50, p95, p99)
- Time to first token
- Token throughput

### Quality

- Error rates
- User feedback signals
- Automated quality scores

### Cost

- Token usage per request
- Cost per user/feature
- Daily/weekly spend trends`
      }
    ],
    playground: {
      description: "Practice evaluation and cost analysis techniques.",
      starterPrompts: [
        {
          label: "LLM-as-Judge Prompt",
          prompt: "Design a prompt that uses GPT-4 to evaluate the quality of customer support responses. Include:\n- Evaluation criteria (accuracy, tone, completeness)\n- Scoring rubric (1-5 scale)\n- Example good and bad responses",
          explanation: "LLM-as-judge provides scalable quality evaluation for subjective criteria."
        },
        {
          label: "Cost Analysis",
          prompt: "A chatbot handles 100,000 messages/day with average 500 input tokens and 200 output tokens per message. At $0.01 per 1K input tokens and $0.03 per 1K output tokens:\n\n1. Calculate daily cost\n2. Suggest 3 ways to reduce cost by 50%\n3. What's the trade-off for each approach?",
          explanation: "Understanding cost structures helps make informed optimization decisions."
        },
        {
          label: "Caching Strategy",
          prompt: "Design a caching strategy for a customer FAQ bot. Consider:\n- What to cache (full responses, embeddings, or both)\n- Cache invalidation rules\n- How to handle slight variations in questions",
          explanation: "Smart caching can dramatically reduce costs for repetitive queries."
        }
      ]
    },
    commonMistakes: [
      "Not measuring baseline performance before optimizations",
      "Optimizing for cost without tracking quality impact",
      "Using expensive models for simple tasks",
      "Ignoring caching opportunities for repeated queries"
    ],
    takeaways: [
      "Combine automated metrics, LLM-as-judge, and human evaluation for comprehensive assessment",
      "Match model capability to task complexity—don't use GPT-4 for simple classification",
      "Implement caching, prompt optimization, and batching to reduce costs",
      "Monitor latency, error rates, token usage, and quality scores in production"
    ]
  }
]
