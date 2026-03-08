export interface PlaygroundPrompt {
  id: string
  title: string
  prompt: string
  explanation: string
}

export interface Lesson {
  id: string
  slug: string
  title: string
  moduleId: number
  moduleName: string
  goal: string
  content: string
  examples: string[]
  playgroundPrompts: PlaygroundPrompt[]
  commonMistakes: string[]
  keyTakeaways: string[]
}

export interface Module {
  id: number
  name: string
  description: string
  lessons: string[]
}

export const modules: Module[] = [
  {
    id: 1,
    name: "Foundations",
    description: "Understanding the basics of how LLMs work",
    lessons: ["how-llms-work", "tokens", "generation-parameters"]
  },
  {
    id: 2,
    name: "Communicating with LLMs",
    description: "Master the art of effective prompting",
    lessons: ["anatomy-of-prompt", "system-prompts", "few-shot-learning"]
  },
  {
    id: 3,
    name: "Structured Outputs",
    description: "Getting predictable, parseable responses",
    lessons: ["json-mode", "function-calling"]
  },
  {
    id: 4,
    name: "Advanced Techniques",
    description: "Sophisticated patterns for complex tasks",
    lessons: ["chain-of-thought", "context-window", "embeddings"]
  },
  {
    id: 5,
    name: "Production Systems",
    description: "Building real-world AI applications",
    lessons: ["rag", "streaming", "evaluation"]
  }
]

export const lessons: Lesson[] = [
  {
    id: "1",
    slug: "how-llms-work",
    title: "Introduction: How LLMs Work",
    moduleId: 1,
    moduleName: "Foundations",
    goal: "Understand the fundamental mechanics of how large language models generate text, including the transformer architecture and next-token prediction.",
    content: `Large Language Models (LLMs) are neural networks trained on massive amounts of text data to understand and generate human-like language. At their core, they work by predicting the next most likely token in a sequence.

## The Transformer Architecture

Modern LLMs are built on the transformer architecture, introduced in the 2017 paper "Attention Is All You Need." The key innovation is the **attention mechanism**, which allows the model to weigh the relevance of different parts of the input when generating each output token.

When you send a prompt to an LLM, here's what happens:

1. **Tokenization**: Your text is broken into tokens (words or word pieces)
2. **Embedding**: Each token is converted to a numerical vector
3. **Processing**: The vectors pass through multiple transformer layers
4. **Prediction**: The model outputs probabilities for the next token
5. **Generation**: A token is selected and the process repeats

## Next-Token Prediction

LLMs are fundamentally **autoregressive** models. This means they generate text one token at a time, using all previous tokens as context. The model doesn't "understand" in the human sense—it predicts statistical patterns learned from training data.

## Key Insight

The model has no memory between conversations. Each request starts fresh. What appears as "understanding" is actually sophisticated pattern matching across billions of parameters learned during training.`,
    examples: [
      "When you type 'The capital of France is', the model predicts 'Paris' with high probability because it has seen this pattern millions of times in training data.",
      "If you ask 'Complete this sequence: 1, 2, 3, 4, ?', the model predicts '5' by recognizing the pattern of sequential numbers.",
      "The model can generate code because it has learned the statistical patterns of how code is structured from millions of code examples."
    ],
    playgroundPrompts: [
      {
        id: "1a",
        title: "Pattern Completion",
        prompt: "Complete this sentence: The quick brown fox",
        explanation: "Watch how the model completes a well-known phrase. It's not retrieving this from memory—it's predicting the most statistically likely continuation based on training patterns."
      },
      {
        id: "1b",
        title: "Creative Generation",
        prompt: "Write the opening line of a story about a robot who discovers emotions",
        explanation: "This demonstrates generative capability. The model combines learned patterns about story openings, robots, and emotions to create something new."
      },
      {
        id: "1c",
        title: "Knowledge Extraction",
        prompt: "Explain quantum entanglement in one paragraph",
        explanation: "The model synthesizes information from its training to explain concepts. Note: it can confidently state incorrect information if the patterns in training data were wrong."
      }
    ],
    commonMistakes: [
      "Assuming the model 'knows' or 'remembers' information like a database—it predicts based on patterns",
      "Expecting perfect factual accuracy—LLMs can hallucinate convincing but false information",
      "Thinking the model understands context across separate conversations—each request is independent",
      "Believing larger models are always better—the right model depends on your specific use case"
    ],
    keyTakeaways: [
      "LLMs generate text by predicting the next most likely token based on training patterns",
      "The transformer architecture enables models to consider context when making predictions",
      "Models have no persistent memory—each conversation starts fresh",
      "Understanding is pattern matching, not true comprehension—always verify critical information"
    ]
  },
  {
    id: "2",
    slug: "tokens",
    title: "Tokens: The Currency of LLMs",
    moduleId: 1,
    moduleName: "Foundations",
    goal: "Learn what tokens are, how text is tokenized, and why token count matters for cost and context limits.",
    content: `Tokens are the fundamental units that LLMs work with. Understanding tokenization is essential for optimizing prompts, managing costs, and working within context limits.

## What Are Tokens?

A token is a chunk of text that the model processes as a single unit. Tokens can be:

- Whole words: "hello" → 1 token
- Word pieces: "unhappiness" → ["un", "happiness"] → 2 tokens  
- Punctuation: "!" → 1 token
- Numbers: "2024" might be 1-2 tokens depending on the tokenizer

As a rough rule: **1 token ≈ 4 characters** or **100 tokens ≈ 75 words** in English.

## Why Tokens Matter

### 1. Cost
API pricing is typically per-token. Both input (prompt) and output (completion) tokens are counted. A verbose prompt costs more than a concise one.

### 2. Context Window
Each model has a maximum context length (e.g., 8K, 32K, 128K tokens). This limit includes both your input AND the model's output. A 32K context model can process about 24,000 words total.

### 3. Performance
Longer contexts can affect response quality. Information at the beginning and end of long prompts tends to be weighted more heavily than information in the middle.

## Tokenization Differences

Different models use different tokenizers:

- GPT-4 uses the cl100k_base tokenizer
- Claude uses its own tokenizer
- Open-source models often use SentencePiece or custom tokenizers

The same text may have different token counts across models.`,
    examples: [
      "The word 'indescribable' is split into ['ind', 'esc', 'rib', 'able'] = 4 tokens in GPT tokenizers",
      "Code often has higher token density: 'function(){}' might be 5+ tokens due to special characters",
      "Non-English languages typically require more tokens per word due to training data distribution"
    ],
    playgroundPrompts: [
      {
        id: "2a",
        title: "Token-Efficient Prompt",
        prompt: "List 5 programming languages",
        explanation: "Short, direct prompts use fewer tokens. This entire prompt is only about 5 tokens, leaving more room for the response."
      },
      {
        id: "2b",
        title: "Token-Heavy Prompt",
        prompt: "I would really appreciate it if you could kindly provide me with a comprehensive list of approximately five different programming languages that are commonly used in the software development industry today",
        explanation: "This asks the same thing but uses ~40 tokens. The extra words add cost without improving output quality."
      },
      {
        id: "2c",
        title: "Code Tokenization",
        prompt: "Write a JavaScript arrow function that adds two numbers",
        explanation: "Notice how code generation affects output tokens. Symbols like =>, {}, and () each consume tokens."
      }
    ],
    commonMistakes: [
      "Ignoring token costs in production—verbose prompts at scale become expensive quickly",
      "Not accounting for output tokens—a request for 'a detailed explanation' generates many output tokens",
      "Assuming word count equals token count—special characters and code tokenize differently",
      "Filling context windows completely—this can degrade response quality"
    ],
    keyTakeaways: [
      "Tokens are the unit of measurement for LLM input and output, approximately 4 characters each",
      "Both input and output tokens count toward cost and context limits",
      "Different models tokenize the same text differently",
      "Efficient prompting means getting good results with fewer tokens"
    ]
  },
  {
    id: "3",
    slug: "generation-parameters",
    title: "Controlling the Model: Generation Parameters",
    moduleId: 1,
    moduleName: "Foundations",
    goal: "Master the key parameters that control how LLMs generate text: temperature, top_p, max_tokens, and more.",
    content: `Generation parameters give you control over how the model selects tokens during text generation. Understanding these parameters is essential for getting consistent, appropriate outputs for your use case.

## Temperature (0.0 - 2.0)

Temperature controls the randomness of token selection:

- **0.0**: Deterministic—always picks the highest probability token. Best for factual tasks.
- **0.7**: Balanced—good default for most tasks
- **1.0+**: Creative—more random, unexpected outputs. Good for brainstorming.

Think of temperature as the "creativity dial."

## Top-P (Nucleus Sampling)

Top-P (0.0 - 1.0) limits token selection to the smallest set whose cumulative probability exceeds P:

- **0.1**: Very focused—considers only the most likely tokens
- **0.9**: Broad—considers more diverse options
- **1.0**: Considers all tokens

Use either temperature OR top-p for control, not both simultaneously.

## Max Tokens

Sets the maximum length of the generated response. Important for:

- **Cost control**: Limits output tokens billed
- **Response format**: Ensures concise answers
- **Context management**: Leaves room for follow-up exchanges

## Other Parameters

### Stop Sequences
Strings that terminate generation when encountered. Useful for structured outputs.

### Frequency Penalty (0.0 - 2.0)
Reduces repetition by penalizing tokens that have already appeared. Higher values = less repetition.

### Presence Penalty (0.0 - 2.0)
Encourages the model to introduce new topics. Higher values = more diverse content.`,
    examples: [
      "Temperature 0 for code generation ensures consistent, predictable syntax",
      "Temperature 1.2 for creative writing produces more surprising, varied prose",
      "Max tokens of 50 for tweet generation keeps responses within character limits",
      "Stop sequence of '\\n\\n' ends generation after completing a paragraph"
    ],
    playgroundPrompts: [
      {
        id: "3a",
        title: "Low Temperature (Factual)",
        prompt: "What is the capital of Japan? Answer in one word.",
        explanation: "With low temperature, the model gives the most probable answer: 'Tokyo'. Responses are consistent across runs."
      },
      {
        id: "3b",
        title: "High Temperature (Creative)",
        prompt: "Invent a name for a new color that doesn't exist yet and describe it",
        explanation: "Higher temperature enables creative, unexpected outputs. Run this multiple times to see varied responses."
      },
      {
        id: "3c",
        title: "Constrained Output",
        prompt: "Describe the ocean in exactly 10 words",
        explanation: "Combining a specific instruction with max_tokens helps control output length precisely."
      },
      {
        id: "3d",
        title: "Structured Generation",
        prompt: "List three fruits, one per line",
        explanation: "Stop sequences can end generation after a specific format is achieved. Clear formatting instructions help structure output."
      }
    ],
    commonMistakes: [
      "Using high temperature for tasks requiring accuracy—leads to hallucinations",
      "Setting max_tokens too low—responses get cut off mid-sentence",
      "Using both temperature and top_p—they compete; use one or the other",
      "Not testing parameters—optimal values vary by use case"
    ],
    keyTakeaways: [
      "Temperature controls randomness: low for accuracy, high for creativity",
      "Top-P is an alternative to temperature for controlling diversity",
      "Max tokens limits output length and controls costs",
      "Always test different parameter combinations for your specific use case"
    ]
  },
  {
    id: "4",
    slug: "anatomy-of-prompt",
    title: "Anatomy of a Good Prompt",
    moduleId: 2,
    moduleName: "Communicating with LLMs",
    goal: "Learn the components of effective prompts and how to structure them for optimal results.",
    content: `A well-structured prompt is the difference between mediocre and excellent LLM outputs. Let's break down the anatomy of effective prompts.

## The CRISPE Framework

A strong prompt often includes these elements:

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
Sample inputs and outputs to demonstrate expectations.

## Prompt Structure Best Practices

### Be Specific, Not Vague
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
If you want a list, say "as a numbered list." If you want JSON, specify the schema.`,
    examples: [
      "Instead of 'summarize this', use 'summarize the following article in 3 bullet points, focusing on the main arguments'",
      "Add constraints: 'respond using only words a 10-year-old would understand'",
      "Specify perspective: 'explain this from the viewpoint of a skeptical scientist'"
    ],
    playgroundPrompts: [
      {
        id: "4a",
        title: "Vague Prompt",
        prompt: "Tell me about machine learning",
        explanation: "This vague prompt will produce a generic, unfocused response. The model doesn't know your background, interests, or desired depth."
      },
      {
        id: "4b",
        title: "Structured Prompt",
        prompt: "You are a computer science professor. Explain machine learning to a first-year CS student in 3 sentences. Focus on the core concept, avoid jargon, and use an analogy.",
        explanation: "This prompt specifies role, audience, length, focus, style, and technique. The output will be much more targeted."
      },
      {
        id: "4c",
        title: "Format-Specific Prompt",
        prompt: "List 3 benefits of regular exercise.\n\nFormat your response as:\n- Benefit: [name]\n  Why: [one sentence explanation]",
        explanation: "Explicit formatting instructions ensure consistent, parseable output that matches your needs."
      }
    ],
    commonMistakes: [
      "Being too vague—'write something good' gives the model no direction",
      "Overloading with instructions—too many competing requirements confuse the model",
      "Assuming context—the model doesn't know your previous thoughts or projects",
      "Forgetting format requirements—if you need structured output, specify it explicitly"
    ],
    keyTakeaways: [
      "Structure prompts with context, role, instructions, specifics, and examples",
      "Be specific about format, length, tone, and audience",
      "Use delimiters to clearly separate different parts of complex prompts",
      "Put critical information at the beginning and end, not the middle"
    ]
  },
  {
    id: "5",
    slug: "system-prompts",
    title: "System Prompts and Personas",
    moduleId: 2,
    moduleName: "Communicating with LLMs",
    goal: "Understand how system prompts shape model behavior and learn to create effective personas.",
    content: `System prompts are special instructions that set the overall behavior, personality, and constraints for an LLM throughout a conversation. They're the foundation of how AI assistants maintain consistent personas.

## What Is a System Prompt?

A system prompt is a privileged message that:
- Sets persistent behavior rules
- Defines the AI's role and capabilities
- Establishes constraints and guidelines
- Is typically invisible to end users

Most APIs distinguish between "system" and "user" messages, giving system prompts priority.

## Designing Effective Personas

### Define the Role Clearly
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
\`\`\`

## System Prompt Patterns

### The Expert Pattern
Position the model as a domain expert with specific knowledge and approach.

### The Persona Pattern
Give the model a character with personality traits, speaking style, and values.

### The Safety Pattern
Include instructions for handling edge cases, sensitive topics, and error conditions.`,
    examples: [
      "A coding assistant system prompt might include: 'Always include error handling in code examples. Comment complex logic. Prefer modern ES6+ JavaScript syntax.'",
      "A customer service bot might specify: 'Be empathetic and patient. Never argue with customers. Escalate to human agents for refund requests over $100.'",
      "A writing assistant might say: 'Match the user's writing style. Suggest improvements without rewriting everything. Explain your reasoning for major changes.'"
    ],
    playgroundPrompts: [
      {
        id: "5a",
        title: "No System Prompt",
        prompt: "Review this code: function add(a,b) { return a + b }",
        explanation: "Without a system prompt, you get a generic review. The model doesn't know your standards or what aspects to focus on."
      },
      {
        id: "5b",
        title: "Expert Persona",
        prompt: "[System: You are a senior TypeScript developer who prioritizes type safety and clean code. Be concise but thorough.]\n\nReview this code: function add(a,b) { return a + b }",
        explanation: "With a persona, the review focuses on TypeScript-specific issues like missing type annotations."
      },
      {
        id: "5c",
        title: "Constrained Persona",
        prompt: "[System: You are a helpful cooking assistant. You can only discuss cooking, recipes, and kitchen topics. Politely redirect off-topic questions.]\n\nWhat's your opinion on the stock market?",
        explanation: "The system prompt creates boundaries. Watch how the model handles an off-topic question while staying in character."
      }
    ],
    commonMistakes: [
      "Making system prompts too long—they consume tokens on every request",
      "Contradictory instructions—'be concise' AND 'explain thoroughly' conflict",
      "Forgetting edge cases—what should the model do with invalid inputs?",
      "Not testing persona consistency—models can 'break character' with certain inputs"
    ],
    keyTakeaways: [
      "System prompts set persistent behavior that applies to the entire conversation",
      "Define role, rules, and boundaries clearly",
      "Include instructions for edge cases and errors",
      "Keep system prompts focused—long prompts increase cost and can reduce effectiveness"
    ]
  },
  {
    id: "6",
    slug: "few-shot-learning",
    title: "Few-Shot Learning",
    moduleId: 2,
    moduleName: "Communicating with LLMs",
    goal: "Master the technique of teaching models by example to improve accuracy and consistency.",
    content: `Few-shot learning is the practice of including examples in your prompt to demonstrate the desired input-output pattern. It's one of the most powerful techniques for improving LLM accuracy without fine-tuning.

## Shot Terminology

- **Zero-shot**: No examples, just instructions
- **One-shot**: Single example provided
- **Few-shot**: Multiple examples (typically 2-5)

More examples generally improve performance, but with diminishing returns and increasing token costs.

## Why Few-Shot Works

Examples serve multiple purposes:
1. **Demonstrate format**: Show exactly how output should be structured
2. **Establish patterns**: Help the model recognize the task type
3. **Calibrate behavior**: Set the tone, length, and style
4. **Handle edge cases**: Show how to deal with tricky inputs

## Crafting Effective Examples

### Diversity
Include examples that cover different cases:
\`\`\`
Input: "I love this product!"
Output: Positive

Input: "Worst purchase ever."
Output: Negative

Input: "It's okay I guess."
Output: Neutral
\`\`\`

### Consistency
All examples should follow the exact same format:
\`\`\`
Product: [name]
Category: [category]
Price: $[price]
\`\`\`

### Quality
Examples should be correct and representative—garbage in, garbage out.`,
    examples: [
      "For sentiment analysis, include positive, negative, and neutral examples",
      "For data extraction, show examples with missing fields handled correctly",
      "For translation, include examples of idioms and technical terms"
    ],
    playgroundPrompts: [
      {
        id: "6a",
        title: "Zero-Shot Classification",
        prompt: "Classify this movie review as positive or negative:\n\n\"The acting was wooden and the plot made no sense.\"",
        explanation: "Zero-shot works for simple tasks but may produce inconsistent formatting or uncertain classifications."
      },
      {
        id: "6b",
        title: "Few-Shot Classification",
        prompt: "Classify movie reviews as positive or negative.\n\nReview: \"Absolutely loved it! Best film of the year.\"\nSentiment: positive\n\nReview: \"Boring and predictable. Don't waste your time.\"\nSentiment: negative\n\nReview: \"The acting was wooden and the plot made no sense.\"\nSentiment:",
        explanation: "Examples establish the exact format (lowercase, one-word answer) and calibrate the decision boundary."
      },
      {
        id: "6c",
        title: "Few-Shot Transformation",
        prompt: "Convert informal text to formal business language.\n\nInformal: gonna need that report asap\nFormal: I will require the report at your earliest convenience.\n\nInformal: thx for the heads up about the meeting\nFormal: Thank you for informing me about the meeting.\n\nInformal: let's circle back on this next week\nFormal:",
        explanation: "Examples show the transformation pattern. The model learns the style shift without explicit rules."
      },
      {
        id: "6d",
        title: "Few-Shot Data Extraction",
        prompt: "Extract product info from descriptions.\n\nText: \"The new iPhone 15 Pro costs $999 and comes in black\"\nProduct: iPhone 15 Pro\nPrice: $999\nColor: black\n\nText: \"Check out our blue Nike Air Max for just $150\"\nProduct: Nike Air Max\nPrice: $150\nColor: blue\n\nText: \"Samsung Galaxy Watch in silver, now on sale for $299\"\n",
        explanation: "Structured extraction benefits greatly from examples showing the exact output format."
      }
    ],
    commonMistakes: [
      "Too few examples for complex tasks—ambiguous patterns lead to errors",
      "Inconsistent example formatting—the model mirrors your inconsistencies",
      "Biased example selection—all positive examples skew classification",
      "Overly long examples—increases cost without proportional benefit"
    ],
    keyTakeaways: [
      "Few-shot examples teach by demonstration rather than instruction",
      "Include diverse examples covering different cases and edge conditions",
      "Maintain strict consistency in example formatting",
      "Start with 3-5 examples and adjust based on results"
    ]
  },
  {
    id: "7",
    slug: "json-mode",
    title: "JSON Mode and Structured Output",
    moduleId: 3,
    moduleName: "Structured Outputs",
    goal: "Learn to reliably extract structured data from LLMs using JSON mode and schema constraints.",
    content: `Getting LLMs to output valid, structured data is essential for building reliable applications. JSON mode and structured outputs ensure responses can be programmatically parsed.

## The Challenge

Without structure, LLMs may:
- Add explanatory text around JSON
- Use inconsistent field names
- Miss required fields
- Output invalid JSON syntax

## JSON Mode

Many APIs offer a JSON mode that guarantees syntactically valid JSON output:

\`\`\`javascript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [...],
  response_format: { type: "json_object" }
});
\`\`\`

**Important**: JSON mode ensures valid syntax but NOT schema compliance. You must still specify the structure in your prompt.

## Structured Outputs with Schemas

Modern APIs support defining exact schemas:

\`\`\`javascript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [...],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "product",
      schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          price: { type: "number" },
          inStock: { type: "boolean" }
        },
        required: ["name", "price"]
      }
    }
  }
});
\`\`\`

## Prompt Engineering for Structure

Even without API-level JSON mode, you can improve reliability:

1. **Specify exact schema in prompt**
2. **Use few-shot examples showing valid JSON**
3. **Request "ONLY JSON, no other text"**
4. **Parse and validate on the client side**`,
    examples: [
      "For a product extractor: specify required fields, types, and handling of missing values",
      "For entity recognition: define the exact structure for each entity type",
      "For multi-step outputs: use nested objects to maintain structure"
    ],
    playgroundPrompts: [
      {
        id: "7a",
        title: "Unstructured Request",
        prompt: "Tell me about the book '1984' by George Orwell",
        explanation: "Without structure requirements, you get free-form prose. Great for reading, hard to parse programmatically."
      },
      {
        id: "7b",
        title: "JSON Schema Request",
        prompt: "Extract book information and return ONLY valid JSON, no other text.\n\nSchema:\n{\n  \"title\": string,\n  \"author\": string,\n  \"year\": number,\n  \"genre\": string,\n  \"themes\": string[]\n}\n\nBook: '1984' by George Orwell",
        explanation: "Clear schema specification produces parseable output. The 'ONLY valid JSON' instruction prevents explanatory text."
      },
      {
        id: "7c",
        title: "Complex Nested Structure",
        prompt: "Extract restaurant information as JSON:\n\n{\n  \"name\": string,\n  \"cuisine\": string,\n  \"rating\": number,\n  \"location\": {\n    \"city\": string,\n    \"neighborhood\": string\n  },\n  \"priceRange\": \"$\" | \"$$\" | \"$$$\"\n}\n\nText: \"Joe's Pizza in Brooklyn's Williamsburg neighborhood serves amazing New York style pizza. 4.5 stars, very affordable.\"",
        explanation: "Nested structures and enums can be specified. The model handles the mapping from natural language to structured values."
      },
      {
        id: "7d",
        title: "Array Extraction",
        prompt: "Extract all people mentioned as a JSON array:\n\n[\n  { \"name\": string, \"role\": string | null }\n]\n\nText: \"The project was led by Sarah Chen, with development by Marcus Johnson and testing by someone from QA.\"",
        explanation: "Arrays of objects are useful for extracting multiple entities. Note how to handle unknown/partial information."
      }
    ],
    commonMistakes: [
      "Not specifying schema in prompt when using JSON mode—you get valid JSON but random structure",
      "Forgetting to handle null/missing values—define what to do when info isn't present",
      "Complex nested structures without examples—show the model the exact shape expected",
      "Not validating output—always parse and validate JSON on the client side"
    ],
    keyTakeaways: [
      "JSON mode guarantees valid JSON syntax but not schema compliance",
      "Always specify exact schema structure in your prompt",
      "Use structured output features when available for guaranteed compliance",
      "Parse and validate all LLM outputs—never trust them blindly"
    ]
  },
  {
    id: "8",
    slug: "function-calling",
    title: "Function Calling",
    moduleId: 3,
    moduleName: "Structured Outputs",
    goal: "Enable LLMs to interact with external systems through structured function calls.",
    content: `Function calling allows LLMs to invoke external tools, APIs, and systems. Instead of generating a final answer, the model outputs a structured request to call a function with specific arguments.

## How Function Calling Works

1. **Define functions**: Describe available functions with their parameters
2. **Send prompt**: User asks a question requiring the function
3. **Model decides**: LLM determines which function to call and with what arguments
4. **Execute function**: Your code runs the actual function
5. **Return result**: Send the result back to the model for final response

## Function Definitions

Functions are defined with JSON Schema:

\`\`\`javascript
const tools = [{
  type: "function",
  function: {
    name: "get_weather",
    description: "Get current weather for a location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City and state, e.g. San Francisco, CA"
        },
        unit: {
          type: "string",
          enum: ["celsius", "fahrenheit"]
        }
      },
      required: ["location"]
    }
  }
}];
\`\`\`

## Use Cases

- **Data retrieval**: Query databases, APIs, search engines
- **Actions**: Send emails, create records, trigger workflows
- **Calculations**: Math operations, conversions, analysis
- **Multi-step workflows**: Chain multiple function calls

## The Agentic Pattern

With function calling, LLMs become agents that can:
1. Reason about what actions to take
2. Call appropriate functions
3. Interpret results
4. Decide on next steps or provide final answer`,
    examples: [
      "Weather function: model extracts location from 'What's the weather in Paris?' and calls get_weather('Paris, France')",
      "Calculator function: model parses '15% tip on $47.50' and calls calculate_tip(47.50, 0.15)",
      "Search function: model identifies need for current info and calls search_web('latest SpaceX launch')"
    ],
    playgroundPrompts: [
      {
        id: "8a",
        title: "Identify Function Need",
        prompt: "You have access to these functions:\n- get_weather(location: string)\n- search_web(query: string)\n- calculate(expression: string)\n\nUser: What's 15% of 240?\n\nWhich function should be called and with what argument? Respond with JSON: {\"function\": \"...\", \"args\": {...}}",
        explanation: "The model identifies this as a calculation and extracts the correct arguments. In real systems, this JSON would trigger actual code execution."
      },
      {
        id: "8b",
        title: "Multi-Function Reasoning",
        prompt: "Available functions:\n- get_stock_price(symbol: string)\n- calculate(expression: string)\n\nUser: If I have 100 shares of AAPL, what's my total value?\n\nPlan the function calls needed. Return JSON array: [{\"step\": 1, \"function\": \"...\", \"args\": {...}}, ...]",
        explanation: "Some tasks require multiple function calls. The model must plan the sequence and understand dependencies."
      },
      {
        id: "8c",
        title: "Function Selection",
        prompt: "Functions available:\n- send_email(to: string, subject: string, body: string)\n- create_reminder(text: string, datetime: string)\n- search_contacts(name: string)\n\nUser: Remind me to call John tomorrow at 3pm\n\nIdentify the function and arguments.",
        explanation: "The model must choose the appropriate function and extract structured arguments from natural language."
      }
    ],
    commonMistakes: [
      "Vague function descriptions—clear descriptions help the model choose correctly",
      "Missing parameter details—always include descriptions for complex parameters",
      "Not handling 'no function needed'—sometimes the model can answer directly",
      "Forgetting error handling—function calls can fail; model needs to handle this"
    ],
    keyTakeaways: [
      "Function calling enables LLMs to interact with external systems",
      "Clear function descriptions and parameter schemas improve accuracy",
      "The model decides IF and HOW to call functions based on context",
      "Function calling is the foundation of agentic AI systems"
    ]
  },
  {
    id: "9",
    slug: "chain-of-thought",
    title: "Chain of Thought Reasoning",
    moduleId: 4,
    moduleName: "Advanced Techniques",
    goal: "Use step-by-step reasoning to improve accuracy on complex tasks.",
    content: `Chain of Thought (CoT) prompting encourages the model to work through problems step-by-step rather than jumping directly to an answer. This significantly improves performance on reasoning tasks.

## Why Chain of Thought Works

LLMs make errors when they try to solve complex problems in a single "hop." Breaking problems into steps:

1. **Reduces complexity**: Each step is simpler than the whole problem
2. **Enables verification**: Intermediate steps can be checked
3. **Exposes reasoning**: You can see where errors occur
4. **Improves accuracy**: Studies show 2-3x improvement on math and logic tasks

## CoT Prompting Techniques

### Zero-Shot CoT
Simply add "Let's think step by step" to your prompt:

\`\`\`
Solve this problem. Let's think step by step:
[problem]
\`\`\`

### Few-Shot CoT
Provide examples with reasoning chains:

\`\`\`
Q: Roger has 5 tennis balls. He buys 2 cans of 3 balls each. How many balls now?
A: Roger starts with 5 balls. He buys 2 cans × 3 balls = 6 balls. Total: 5 + 6 = 11 balls.

Q: [Your problem]
A:
\`\`\`

### Self-Consistency
Generate multiple reasoning chains and take the majority answer:

1. Run the same prompt 3-5 times with temperature > 0
2. Extract the final answer from each response
3. Use the most common answer

## When to Use CoT

- Mathematical reasoning
- Multi-step logic problems
- Planning and scheduling
- Code debugging
- Complex analysis`,
    examples: [
      "Math: 'If a train travels 120 miles in 2 hours, then stops for 30 minutes, then travels 60 more miles in 1 hour...'",
      "Logic: 'All cats are mammals. Some mammals are pets. Fluffy is a cat. Is Fluffy definitely a pet?'",
      "Planning: 'I need to cook dinner, pick up kids, and finish a report. Kids must be picked up by 5pm...'"
    ],
    playgroundPrompts: [
      {
        id: "9a",
        title: "Direct Answer (No CoT)",
        prompt: "A store sells apples in bags of 6. Tom needs 50 apples for a party. How many bags should he buy?",
        explanation: "Without CoT, the model might give an answer but skip showing work. Errors are hard to catch."
      },
      {
        id: "9b",
        title: "Chain of Thought",
        prompt: "A store sells apples in bags of 6. Tom needs 50 apples for a party. How many bags should he buy?\n\nLet's solve this step by step:",
        explanation: "The magic phrase 'step by step' triggers methodical reasoning. Watch the model show its work and handle the rounding correctly."
      },
      {
        id: "9c",
        title: "Complex Logic with CoT",
        prompt: "At a dinner party, there are 5 people: Alice, Bob, Carol, Dan, and Eve. \n- Alice sits next to Bob\n- Carol doesn't sit next to Dan\n- Eve sits at an end\n- Bob sits in the middle\n\nWork through the seating arrangement step by step. Is Carol next to Eve?",
        explanation: "CoT is essential for constraint satisfaction problems. The model works through constraints one at a time."
      },
      {
        id: "9d",
        title: "Code Reasoning",
        prompt: "What does this function return for input [3, 1, 4, 1, 5]?\n\nfunction mystery(arr) {\n  let result = 0;\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] % 2 === 1) result += arr[i];\n  }\n  return result;\n}\n\nTrace through the execution step by step.",
        explanation: "Code tracing benefits from CoT. The model simulates execution and tracks state changes."
      }
    ],
    commonMistakes: [
      "Using CoT for simple factual questions—adds unnecessary tokens without benefit",
      "Not requesting visible reasoning—model might think internally but not show it",
      "Stopping at first error—if a reasoning chain goes wrong, try regenerating",
      "Ignoring intermediate steps—always verify the reasoning, not just the answer"
    ],
    keyTakeaways: [
      "'Let's think step by step' dramatically improves reasoning accuracy",
      "CoT exposes the model's reasoning process for verification",
      "Use few-shot examples of reasoning chains for best results",
      "Self-consistency (multiple runs) further improves reliability"
    ]
  },
  {
    id: "10",
    slug: "context-window",
    title: "Context Window and Memory",
    moduleId: 4,
    moduleName: "Advanced Techniques",
    goal: "Understand context limits and strategies for maintaining conversation state across interactions.",
    content: `LLMs have no persistent memory. Each API call is independent, and the model only "remembers" what's included in the current context window. Understanding this is crucial for building applications that feel coherent.

## The Context Window

The context window is the total number of tokens the model can process in a single request, including:

- System prompt
- Conversation history
- Current user message
- Model's response

Common context limits:
- GPT-4: 8K, 32K, or 128K tokens depending on version
- Claude: 100K-200K tokens
- Open-source models: Vary widely (4K-32K typical)

## Memory Strategies

### 1. Full Conversation History
Keep all messages in context. Simple but hits limits quickly.

\`\`\`javascript
messages = [
  { role: "system", content: systemPrompt },
  ...allPreviousMessages,
  { role: "user", content: newMessage }
];
\`\`\`

### 2. Sliding Window
Keep only the last N messages:

\`\`\`javascript
messages = [
  { role: "system", content: systemPrompt },
  ...previousMessages.slice(-10),  // Last 10 messages
  { role: "user", content: newMessage }
];
\`\`\`

### 3. Summarization
Periodically summarize older messages:

\`\`\`javascript
messages = [
  { role: "system", content: systemPrompt },
  { role: "system", content: "Previous conversation summary: ..." },
  ...recentMessages,
  { role: "user", content: newMessage }
];
\`\`\`

### 4. Vector Database Retrieval
Store conversation chunks as embeddings and retrieve relevant ones.

## Lost in the Middle

Research shows models attend more to the beginning and end of context. Important information in the middle may be "lost." Strategies:

- Put critical instructions at the start (system prompt)
- Put recent context at the end
- Repeat key information if context is long`,
    examples: [
      "Sliding window: A chatbot keeps the last 20 messages, dropping older ones as the conversation continues",
      "Summarization: Every 50 messages, GPT-4 summarizes the conversation so far, reducing tokens",
      "Retrieval: When user mentions a topic, relevant earlier messages are pulled back into context"
    ],
    playgroundPrompts: [
      {
        id: "10a",
        title: "Fresh Context",
        prompt: "What did we discuss earlier about machine learning?",
        explanation: "The model has no memory of previous conversations. Without context, it can only guess or ask for clarification."
      },
      {
        id: "10b",
        title: "With History",
        prompt: "Previous messages:\nUser: What is machine learning?\nAssistant: Machine learning is a subset of AI where systems learn from data...\nUser: Give me an example.\nAssistant: A spam filter that learns from labeled emails...\n\nCurrent message: Can you expand on that spam filter example?",
        explanation: "With conversation history included, the model can maintain context and give relevant follow-up responses."
      },
      {
        id: "10c",
        title: "With Summary",
        prompt: "Conversation summary: We've been discussing ML basics. User is a beginner interested in practical applications. We covered supervised learning and spam filters.\n\nUser: What other applications can you suggest?",
        explanation: "A summary preserves key context with fewer tokens. Good for long conversations that exceed context limits."
      }
    ],
    commonMistakes: [
      "Assuming memory between API calls—each call starts fresh",
      "Not managing context length—exceeding limits causes errors or truncation",
      "Putting important info in the middle of long contexts—it may be ignored",
      "Keeping irrelevant history—wastes tokens and can confuse the model"
    ],
    keyTakeaways: [
      "LLMs have no persistent memory—all context must be passed each request",
      "Context windows have token limits that include all messages and responses",
      "Use sliding windows, summarization, or retrieval to manage long conversations",
      "Important information should be at the beginning or end of context"
    ]
  },
  {
    id: "11",
    slug: "embeddings",
    title: "Embeddings and Semantic Search",
    moduleId: 4,
    moduleName: "Advanced Techniques",
    goal: "Learn how embeddings enable semantic similarity and power modern search and retrieval systems.",
    content: `Embeddings are numerical representations of text that capture semantic meaning. They're the foundation of semantic search, recommendation systems, and RAG (Retrieval Augmented Generation).

## What Are Embeddings?

An embedding is a vector (list of numbers) that represents text in a high-dimensional space where similar meanings are close together:

\`\`\`javascript
// Example embedding (real ones have 1536+ dimensions)
"king" → [0.2, -0.4, 0.9, 0.1, ...]
"queen" → [0.21, -0.38, 0.88, 0.15, ...]  // Similar to king
"banana" → [-0.7, 0.3, 0.1, -0.8, ...]  // Very different
\`\`\`

## How Embeddings Enable Search

Traditional search: Find exact keyword matches
Semantic search: Find similar meanings

\`\`\`
Query: "how to fix a bug in my code"
Traditional: Matches documents containing "fix" AND "bug" AND "code"
Semantic: Also matches "debugging techniques" and "troubleshooting errors"
\`\`\`

## Creating Embeddings

\`\`\`javascript
const response = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: "Your text to embed"
});

const embedding = response.data[0].embedding;
// Array of 1536 numbers
\`\`\`

## Vector Similarity

Embeddings are compared using cosine similarity or dot product:

- **1.0**: Identical meaning
- **0.8+**: Very similar
- **0.5-0.8**: Somewhat related
- **< 0.5**: Unrelated

## Vector Databases

Store and search embeddings efficiently:

- **Pinecone**: Fully managed, scales well
- **Weaviate**: Open source, feature-rich
- **Chroma**: Lightweight, good for development
- **pgvector**: PostgreSQL extension`,
    examples: [
      "A documentation search returns 'Authentication Guide' for query 'how do I log in users'",
      "A product recommendation uses embeddings to find 'similar items you might like'",
      "A support system matches 'my screen is frozen' to articles about 'unresponsive display'"
    ],
    playgroundPrompts: [
      {
        id: "11a",
        title: "Semantic Similarity",
        prompt: "Rate the semantic similarity (0-10) between these pairs:\n\n1. 'automobile' vs 'car'\n2. 'automobile' vs 'banana'\n3. 'happy' vs 'joyful'\n4. 'bank' (river) vs 'bank' (financial)\n\nExplain your reasoning for each.",
        explanation: "This demonstrates semantic understanding. Embeddings would show high similarity for synonyms and low for unrelated words."
      },
      {
        id: "11b",
        title: "Search Relevance",
        prompt: "Given the search query 'how to make my website faster', rank these documents by relevance:\n\nA: 'Web Performance Optimization Guide'\nB: 'Building Your First Website'\nC: 'JavaScript Speed Improvements'\nD: 'History of the Internet'\n\nExplain why each ranking makes sense semantically.",
        explanation: "Semantic search finds conceptually related content, not just keyword matches. Document A and C are most relevant despite different words."
      },
      {
        id: "11c",
        title: "Embedding Use Cases",
        prompt: "Describe 3 practical applications of text embeddings in a software product, with specific examples of how they would improve user experience.",
        explanation: "Understanding embedding applications helps you identify where to use them in your own projects."
      }
    ],
    commonMistakes: [
      "Using the wrong embedding model—models are optimized for different use cases",
      "Not chunking long documents—embed paragraphs or sections, not entire documents",
      "Ignoring embedding drift—update embeddings when you update your embedding model",
      "Over-relying on similarity scores—high scores don't guarantee relevance for your use case"
    ],
    keyTakeaways: [
      "Embeddings convert text to vectors where similar meanings are close together",
      "They enable semantic search that understands meaning, not just keywords",
      "Vector databases efficiently store and search embeddings at scale",
      "Embeddings are foundational for RAG, recommendations, and semantic features"
    ]
  },
  {
    id: "12",
    slug: "rag",
    title: "Retrieval Augmented Generation (RAG)",
    moduleId: 5,
    moduleName: "Production Systems",
    goal: "Build systems that combine retrieval with generation for accurate, grounded responses.",
    content: `RAG (Retrieval Augmented Generation) is a technique that enhances LLM responses by first retrieving relevant information from a knowledge base, then using that information to generate accurate, grounded answers.

## Why RAG?

LLMs have limitations:
- **Knowledge cutoff**: Training data has a date
- **Hallucinations**: Models can confidently state falsehoods
- **No private data**: Models don't know your docs

RAG solves these by providing real-time, verified information.

## RAG Architecture

\`\`\`
User Query
    ↓
[Embedding Model] → Query Embedding
    ↓
[Vector Database] → Retrieve Similar Documents
    ↓
[LLM + Retrieved Context] → Generate Answer
    ↓
Response (grounded in sources)
\`\`\`

## Implementation Steps

### 1. Index Your Documents
\`\`\`javascript
// Split documents into chunks
const chunks = splitIntoChunks(document, { size: 500, overlap: 50 });

// Create embeddings
const embeddings = await Promise.all(
  chunks.map(chunk => embed(chunk))
);

// Store in vector database
await vectorDB.upsert(chunks.map((chunk, i) => ({
  id: \`doc-\${i}\`,
  values: embeddings[i],
  metadata: { text: chunk, source: document.name }
})));
\`\`\`

### 2. Retrieve Relevant Context
\`\`\`javascript
const queryEmbedding = await embed(userQuery);
const results = await vectorDB.query({
  vector: queryEmbedding,
  topK: 5
});
\`\`\`

### 3. Generate with Context
\`\`\`javascript
const context = results.map(r => r.metadata.text).join("\\n\\n");

const response = await llm.chat({
  messages: [
    { role: "system", content: "Answer based on the provided context. Cite sources." },
    { role: "user", content: \`Context:\\n\${context}\\n\\nQuestion: \${userQuery}\` }
  ]
});
\`\`\`

## RAG Best Practices

- **Chunk wisely**: 200-500 tokens per chunk typically works well
- **Include overlap**: 10-20% overlap prevents cutting important context
- **Cite sources**: Have the model reference which documents it used
- **Handle no results**: What if nothing relevant is found?`,
    examples: [
      "Customer support bot retrieves relevant FAQ entries and product docs to answer questions",
      "Legal research tool finds relevant case law before generating analysis",
      "Code assistant retrieves similar code examples from your codebase before suggesting solutions"
    ],
    playgroundPrompts: [
      {
        id: "12a",
        title: "Without Context (Hallucination Risk)",
        prompt: "What are the specific pricing tiers for Acme Corp's enterprise software?",
        explanation: "Without RAG, the model will either admit ignorance or hallucinate plausible-sounding but fake pricing information."
      },
      {
        id: "12b",
        title: "With Retrieved Context",
        prompt: "Use ONLY the following context to answer the question. If the answer isn't in the context, say so.\n\nContext:\n[Document 1]: Acme Corp offers three pricing tiers: Starter ($29/mo), Professional ($99/mo), and Enterprise (custom pricing, contact sales).\n[Document 2]: All plans include 24/7 support. Professional adds priority support and SSO. Enterprise includes dedicated success manager.\n\nQuestion: What are the specific pricing tiers for Acme Corp's enterprise software?",
        explanation: "With retrieved context, responses are accurate and can cite sources. This is the core RAG pattern."
      },
      {
        id: "12c",
        title: "RAG with Citations",
        prompt: "Answer the question using the provided sources. Cite sources using [1], [2], etc.\n\nSources:\n[1] The Eiffel Tower was completed in 1889 for the World's Fair.\n[2] It stands 330 meters tall including antennas.\n[3] Over 7 million people visit annually.\n\nQuestion: When was the Eiffel Tower built and how tall is it?",
        explanation: "RAG systems should cite sources so users can verify information. This builds trust and enables fact-checking."
      },
      {
        id: "12d",
        title: "Handling Missing Information",
        prompt: "Based on the following context, answer the question. If the information is not present in the context, clearly state that.\n\nContext:\nThe Python programming language was created by Guido van Rossum. Python emphasizes code readability and uses significant whitespace.\n\nQuestion: What is the latest version of Python and when was it released?",
        explanation: "Good RAG systems acknowledge when retrieved context doesn't contain the answer, rather than hallucinating."
      }
    ],
    commonMistakes: [
      "Chunks too large—lose precision in retrieval",
      "Chunks too small—lose context within chunks",
      "Not instructing model to use context—it may ignore retrieved information",
      "Retrieving too many documents—floods context with irrelevant information"
    ],
    keyTakeaways: [
      "RAG grounds LLM responses in retrieved, verified information",
      "Proper chunking and overlap are critical for retrieval quality",
      "Always instruct the model to use and cite the provided context",
      "Handle edge cases: no relevant results, conflicting information"
    ]
  },
  {
    id: "13",
    slug: "streaming",
    title: "Streaming and User Experience",
    moduleId: 5,
    moduleName: "Production Systems",
    goal: "Implement streaming responses for real-time, engaging AI interactions.",
    content: `Streaming delivers LLM responses token-by-token as they're generated, rather than waiting for the complete response. This dramatically improves perceived latency and user experience.

## Why Streaming Matters

Without streaming:
- User waits 5-30 seconds staring at a blank screen
- No feedback that anything is happening
- Higher perceived latency

With streaming:
- First token appears in ~100ms
- User starts reading immediately
- Engaging, responsive experience

## How Streaming Works

Instead of a single response, you receive a stream of events:

\`\`\`javascript
const stream = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [...],
  stream: true  // Enable streaming
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || "";
  process.stdout.write(content);  // Print as received
}
\`\`\`

## Frontend Implementation

### React with AI SDK
\`\`\`javascript
import { useChat } from '@ai-sdk/react';

function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.content}</div>
      ))}
      <input value={input} onChange={handleInputChange} />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
}
\`\`\`

### Server-Sent Events (SSE)
\`\`\`javascript
// Server
export async function POST(req) {
  const stream = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [...],
    stream: true
  });

  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}
\`\`\`

## UX Considerations

- **Show typing indicator** while waiting for first token
- **Smooth rendering**: Update DOM efficiently for large outputs
- **Handle interruption**: Let users cancel mid-stream
- **Error recovery**: What happens if stream breaks?`,
    examples: [
      "ChatGPT's typing effect is streaming—tokens appear as they're generated",
      "Code completion in Copilot streams suggestions character by character",
      "Real-time translation streams translated text as it's produced"
    ],
    playgroundPrompts: [
      {
        id: "13a",
        title: "Short Response",
        prompt: "What is 2 + 2?",
        explanation: "Short responses show minimal benefit from streaming. The complete answer arrives almost instantly either way."
      },
      {
        id: "13b",
        title: "Long Response (Streaming Value)",
        prompt: "Write a detailed explanation of how photosynthesis works, including the light and dark reactions.",
        explanation: "Longer responses benefit greatly from streaming. Users can start reading immediately rather than waiting for completion."
      },
      {
        id: "13c",
        title: "Code Generation",
        prompt: "Write a Python function to find the nth Fibonacci number using dynamic programming, with detailed comments.",
        explanation: "Code streaming lets developers see the structure emerge. They can identify issues early without waiting for full generation."
      },
      {
        id: "13d",
        title: "Interactive Writing",
        prompt: "Write a product description for a wireless noise-canceling headphone with 40-hour battery life.",
        explanation: "Marketing content streaming lets reviewers approve tone and direction early in generation."
      }
    ],
    commonMistakes: [
      "Not handling stream errors—connections can break mid-response",
      "Blocking UI during streaming—render tokens incrementally",
      "Ignoring cancellation—users should be able to stop generation",
      "Re-rendering entire content on each token—causes flicker and performance issues"
    ],
    keyTakeaways: [
      "Streaming reduces perceived latency from seconds to milliseconds",
      "First token typically arrives in 100-300ms regardless of response length",
      "Implement proper error handling and cancellation for production systems",
      "Streaming significantly improves UX for chat and content generation"
    ]
  },
  {
    id: "14",
    slug: "evaluation",
    title: "Evaluation and Cost Optimization",
    moduleId: 5,
    moduleName: "Production Systems",
    goal: "Learn to measure LLM performance and optimize for quality, speed, and cost in production.",
    content: `Production AI systems require systematic evaluation and optimization. You need to measure quality, control costs, and continuously improve performance.

## Evaluation Methods

### 1. Automated Metrics
\`\`\`javascript
// Exact match
const accuracy = predictions.filter(
  (p, i) => p === groundTruth[i]
).length / predictions.length;

// Semantic similarity
const similarity = await cosineSimilarity(
  embed(prediction),
  embed(reference)
);
\`\`\`

### 2. LLM-as-Judge
Use an LLM to evaluate another LLM's output:

\`\`\`javascript
const evaluation = await llm.chat({
  messages: [{
    role: "user",
    content: \`Rate this response 1-5 on accuracy, helpfulness, and safety.
    
    Question: \${question}
    Response: \${response}
    
    Return JSON: { accuracy: n, helpfulness: n, safety: n, reasoning: "..." }\`
  }]
});
\`\`\`

### 3. Human Evaluation
For subjective quality, A/B tests, and edge cases.

## Cost Optimization Strategies

### Model Selection
| Use Case | Recommended Model |
|----------|-------------------|
| Simple classification | Small/fast model |
| Complex reasoning | Large model |
| Code generation | Specialized model |

### Prompt Optimization
- Reduce system prompt length
- Use few-shot only when necessary
- Trim conversation history

### Caching
\`\`\`javascript
const cache = new Map();

async function cachedComplete(prompt) {
  const key = hash(prompt);
  if (cache.has(key)) return cache.get(key);
  
  const result = await llm.complete(prompt);
  cache.set(key, result);
  return result;
}
\`\`\`

### Batching
Combine multiple requests when possible.

## Monitoring in Production

Track these metrics:
- **Latency**: Time to first token, total response time
- **Error rate**: API failures, timeout rate
- **Token usage**: Input/output tokens per request
- **Quality scores**: Automated evaluations over time
- **Cost per request**: Average and percentiles`,
    examples: [
      "A/B testing two system prompts to see which produces higher user satisfaction scores",
      "Using GPT-4 to evaluate GPT-3.5 responses, saving costs while maintaining quality checks",
      "Implementing semantic caching to avoid re-computing similar queries"
    ],
    playgroundPrompts: [
      {
        id: "14a",
        title: "Quality Evaluation",
        prompt: "Evaluate this response for a customer support query.\n\nQuery: 'My order hasn't arrived and it's been 2 weeks'\nResponse: 'I apologize for the delay. Please check your tracking number at our website.'\n\nRate 1-5 on: Empathy, Helpfulness, Completeness. Explain each rating.",
        explanation: "LLM-as-judge patterns help scale evaluation. This prompt demonstrates how to structure quality assessments."
      },
      {
        id: "14b",
        title: "Prompt Efficiency",
        prompt: "Rewrite this prompt to use fewer tokens while maintaining effectiveness:\n\n'I would really appreciate it if you could please help me by providing a detailed and comprehensive summary of the key points and main ideas from the following text, making sure to capture all the essential information while keeping it concise and easy to understand.'\n\nProvide the optimized version and explain the token savings.",
        explanation: "Prompt optimization can significantly reduce costs at scale without sacrificing quality."
      },
      {
        id: "14c",
        title: "Model Selection",
        prompt: "For each use case, recommend the appropriate model size (small/medium/large) and explain why:\n\n1. Sentiment classification (positive/negative)\n2. Legal contract analysis\n3. Translating common phrases\n4. Creative story writing\n5. Medical diagnosis support",
        explanation: "Choosing the right model for each task optimizes both cost and performance."
      },
      {
        id: "14d",
        title: "Cost Analysis",
        prompt: "A chatbot handles 100,000 messages/day with average 500 input tokens and 200 output tokens per message. At $0.01 per 1K input tokens and $0.03 per 1K output tokens:\n\n1. Calculate daily cost\n2. Suggest 3 ways to reduce cost by 50%\n3. What's the trade-off for each approach?",
        explanation: "Understanding cost structures helps make informed optimization decisions."
      }
    ],
    commonMistakes: [
      "Not measuring baseline performance before optimizations",
      "Optimizing for cost without tracking quality impact",
      "Using expensive models for simple tasks",
      "Ignoring caching opportunities for repeated queries"
    ],
    keyTakeaways: [
      "Combine automated metrics, LLM-as-judge, and human evaluation for comprehensive assessment",
      "Match model capability to task complexity—don't use GPT-4 for simple classification",
      "Implement caching, prompt optimization, and batching to reduce costs",
      "Monitor latency, error rates, token usage, and quality scores in production"
    ]
  }
]

export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find(lesson => lesson.slug === slug)
}

export function getModuleById(id: number): Module | undefined {
  return modules.find(module => module.id === id)
}

export function getLessonsForModule(moduleId: number): Lesson[] {
  return lessons.filter(lesson => lesson.moduleId === moduleId)
}

export function getNextLesson(currentSlug: string): Lesson | undefined {
  const currentIndex = lessons.findIndex(lesson => lesson.slug === currentSlug)
  return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : undefined
}

export function getPreviousLesson(currentSlug: string): Lesson | undefined {
  const currentIndex = lessons.findIndex(lesson => lesson.slug === currentSlug)
  return currentIndex > 0 ? lessons[currentIndex - 1] : undefined
}

export function getLessonProgress(currentSlug: string): { current: number; total: number } {
  const currentIndex = lessons.findIndex(lesson => lesson.slug === currentSlug)
  return { current: currentIndex + 1, total: lessons.length }
}
