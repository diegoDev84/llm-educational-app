"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { Lesson } from "@/lib/lessons"
import {
  Play,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface PlaygroundPanelProps {
  playground: Lesson["playground"]
  lessonSlug: string
  className?: string
}

export function PlaygroundPanel({
  playground,
  lessonSlug,
  className,
}: PlaygroundPanelProps) {
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0)
  const [customPrompt, setCustomPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [latency, setLatency] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(true)
  const startTimeRef = useRef<number>(0)

  // Reset state when lesson changes
  useEffect(() => {
    setSelectedPromptIndex(0)
    setCustomPrompt("")
    setResponse("")
    setError(null)
    setLatency(null)
  }, [lessonSlug])

  const selectedPrompt = playground.starterPrompts[selectedPromptIndex]
  const currentPromptText = customPrompt || selectedPrompt?.prompt || ""

  const isJsonResponse = (text: string): boolean => {
    const trimmed = text.trim()
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        JSON.parse(trimmed)
        return true
      } catch {
        return false
      }
    }
    return false
  }

  const formatJson = (text: string): string => {
    try {
      return JSON.stringify(JSON.parse(text.trim()), null, 2)
    } catch {
      return text
    }
  }

  const runPrompt = async () => {
    if (!currentPromptText.trim()) return

    setIsLoading(true)
    setResponse("")
    setError(null)
    setLatency(null)
    startTimeRef.current = performance.now()

    try {
      // Simulate API response with educational content
      const delay = 800 + Math.random() * 1200
      await new Promise((resolve) => setTimeout(resolve, delay))

      // Simulate occasional errors for demo purposes (5% chance)
      if (Math.random() < 0.05) {
        throw new Error("Rate limit exceeded. Please try again in a moment.")
      }

      const simulatedResponse = generateResponse(currentPromptText)
      const endTime = performance.now()
      setLatency(Math.round(endTime - startTimeRef.current))
      setResponse(simulatedResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const copyResponse = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectStarterPrompt = (index: number) => {
    setSelectedPromptIndex(index)
    setCustomPrompt("")
    setResponse("")
    setError(null)
    setLatency(null)
  }

  const resetPlayground = () => {
    setSelectedPromptIndex(0)
    setCustomPrompt("")
    setResponse("")
    setError(null)
    setLatency(null)
  }

  const responseIsJson = response && isJsonResponse(response)

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border-l border-border",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-foreground">Playground</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetPlayground}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Experiment Description */}
      <div className="px-4 py-3 bg-secondary/30 border-b border-border">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {playground.description}
        </p>
      </div>

      {/* Starter Prompts as Cards */}
      <div className="p-4 border-b border-border overflow-auto max-h-[260px]">
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Try These Experiments
        </p>
        <div className="space-y-2">
          {playground.starterPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => selectStarterPrompt(index)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all",
                "border",
                selectedPromptIndex === index && !customPrompt
                  ? "bg-primary/10 border-primary/50 ring-1 ring-primary/20"
                  : "bg-secondary/50 border-border hover:bg-secondary hover:border-border/80"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5",
                    selectedPromptIndex === index && !customPrompt
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      selectedPromptIndex === index && !customPrompt
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {prompt.label}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">
                    {prompt.explanation}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">
          Prompt
        </label>
        <textarea
          value={currentPromptText}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Enter your prompt or select an experiment above..."
          className={cn(
            "w-full h-28 px-3 py-2 text-sm rounded-lg resize-none",
            "bg-secondary border border-border",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "font-mono"
          )}
        />
        <Button
          onClick={runPrompt}
          disabled={isLoading || !currentPromptText.trim()}
          className="w-full mt-3"
        >
          {isLoading ? (
            <>
              <Spinner className="w-4 h-4 mr-2" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run Prompt
            </>
          )}
        </Button>
      </div>

      {/* Response */}
      <div className="flex-1 flex flex-col min-h-0 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Response
            </label>
            {latency !== null && !isLoading && !error && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
                <Clock className="w-3 h-3" />
                {latency}ms
              </span>
            )}
          </div>
          {response && !error && (
            <Button
              variant="ghost"
              size="sm"
              onClick={copyResponse}
              className="h-6 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>

        <div
          className={cn(
            "flex-1 rounded-lg p-4 overflow-auto",
            "border",
            error
              ? "bg-destructive/10 border-destructive/30"
              : "bg-secondary/50 border-border",
            "min-h-[120px]"
          )}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <Spinner className="w-6 h-6" />
              <span className="text-sm">Generating response...</span>
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 text-destructive">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Error</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runPrompt}
                  className="mt-3 h-7 text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              </div>
            </div>
          ) : response ? (
            responseIsJson ? (
              <div className="relative">
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-medium rounded-bl rounded-tr-lg uppercase tracking-wide">
                  JSON
                </div>
                <pre className="text-sm text-foreground font-mono whitespace-pre overflow-x-auto">
                  <code>{formatJson(response)}</code>
                </pre>
              </div>
            ) : (
              <div className="text-sm text-foreground whitespace-pre-wrap">
                {response}
              </div>
            )
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Response will appear here after running the prompt
            </p>
          )}
        </div>
      </div>

      {/* Explanation Panel */}
      {selectedPrompt && !customPrompt && (
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
          >
            <span>Why This Experiment?</span>
            {showExplanation ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {showExplanation && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {selectedPrompt.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Helper function to generate contextual responses for demo purposes
function generateResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()

  if (lowerPrompt.includes("quick brown fox")) {
    return "jumps over the lazy dog.\n\nThis is a classic pangram - a sentence containing every letter of the alphabet. The model completes this because it has seen this phrase countless times in training data, making 'jumps over the lazy dog' the statistically most likely continuation."
  }

  if (lowerPrompt.includes("robot") && lowerPrompt.includes("emotion")) {
    return "Unit-7 had always processed the world in binary—until the day a child's laughter created an error in its logic circuits that it didn't want to fix.\n\nNotice how this opening establishes conflict (logic vs. emotion), introduces a character, and creates immediate intrigue—all learned patterns from creative writing in the training data."
  }

  if (lowerPrompt.includes("quantum entanglement")) {
    return "Quantum entanglement is a phenomenon where two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently. When particles are entangled, measuring one particle instantly affects its partner, regardless of the distance between them—a property Einstein famously called 'spooky action at a distance.' This connection persists even across vast cosmic distances, though it cannot be used to transmit information faster than light."
  }

  if (
    lowerPrompt.includes("list 5 programming languages") ||
    lowerPrompt.includes("programming language")
  ) {
    return "1. Python\n2. JavaScript\n3. TypeScript\n4. Go\n5. Rust"
  }

  if (lowerPrompt.includes("arrow function") && lowerPrompt.includes("add")) {
    return "const add = (a, b) => a + b;\n\n// Usage examples:\nadd(2, 3);  // Returns 5\nadd(-1, 1); // Returns 0\nadd(0.1, 0.2); // Returns 0.30000000000000004 (floating point)"
  }

  if (lowerPrompt.includes("capital") && lowerPrompt.includes("japan")) {
    return "Tokyo"
  }

  if (lowerPrompt.includes("color") && lowerPrompt.includes("doesn't exist")) {
    return "Glimmerdusk\n\nImagine the color of a sunset reflected in morning dew, mixed with the soft glow of bioluminescent waves. Glimmerdusk shifts between warm amber and cool violet depending on how you look at it, like the moment between day and night captured in a single hue."
  }

  if (lowerPrompt.includes("ocean") && lowerPrompt.includes("10 words")) {
    return "Vast, deep, mysterious, powerful, ancient, blue, teeming, essential, rhythmic, endless."
  }

  if (lowerPrompt.includes("fruits") && lowerPrompt.includes("per line")) {
    return "Apple\nBanana\nOrange"
  }

  if (
    lowerPrompt.includes("machine learning") &&
    (lowerPrompt.includes("first-year") || lowerPrompt.includes("professor"))
  ) {
    return "Machine learning is teaching computers to learn from examples instead of explicit instructions. Imagine teaching a child to recognize cats not by describing features, but by showing thousands of cat pictures until they 'get it.' That's essentially what ML does with data."
  }

  if (lowerPrompt.includes("tell me about machine learning")) {
    return "Machine learning is a subset of artificial intelligence that enables computers to learn from data and improve their performance on tasks without being explicitly programmed. It encompasses various approaches including supervised learning (training with labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error). Applications range from image recognition and natural language processing to recommendation systems and autonomous vehicles..."
  }

  if (lowerPrompt.includes("exercise") && lowerPrompt.includes("benefit")) {
    return "- Benefit: Improved cardiovascular health\n  Why: Regular exercise strengthens the heart and improves blood circulation.\n\n- Benefit: Enhanced mental well-being\n  Why: Physical activity releases endorphins that reduce stress and anxiety.\n\n- Benefit: Better sleep quality\n  Why: Exercise helps regulate sleep patterns and promotes deeper rest."
  }

  if (lowerPrompt.includes("review") && lowerPrompt.includes("function add")) {
    if (lowerPrompt.includes("typescript")) {
      return "Issues identified:\n\n1. **Missing Type Annotations**: Parameters `a` and `b` should have explicit types.\n2. **No Return Type**: The function should declare its return type.\n\nImproved version:\n```typescript\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n```\n\nConsider using an arrow function for brevity."
    }
    return "The function is simple and functional. However:\n\n1. No input validation - what happens with non-numeric inputs?\n2. No JSDoc comments explaining the function's purpose\n3. Could benefit from TypeScript types for better maintainability"
  }

  if (
    lowerPrompt.includes("cooking assistant") &&
    lowerPrompt.includes("programming")
  ) {
    return "I appreciate your curiosity! However, I'm specialized in cooking and culinary topics. I'd be happy to help you with recipes, cooking techniques, or ingredient substitutions instead. Is there anything food-related I can help you with?"
  }

  if (lowerPrompt.includes("arrived late but works great")) {
    if (lowerPrompt.includes("feedback:") && lowerPrompt.includes("category:")) {
      return "mixed\n\nThis feedback contains both negative (late arrival) and positive (works great) sentiments, following the pattern from the examples."
    }
    return "This feedback appears to be mixed or neutral, containing both negative (late arrival) and positive (product works great) elements."
  }

  if (lowerPrompt.includes("10 tips for clean code")) {
    return "10-tips-for-clean-code"
  }

  if (lowerPrompt.includes("john smith") && lowerPrompt.includes("json")) {
    return '{\n  "name": "John Smith",\n  "age": 32,\n  "occupation": "software engineer",\n  "location": "Seattle",\n  "hobby": "hiking"\n}'
  }

  if (lowerPrompt.includes("books") && lowerPrompt.includes("json")) {
    return '{\n  "books": [\n    {\n      "title": "1984",\n      "author": "George Orwell",\n      "year": 1949,\n      "genre": "Dystopian Fiction"\n    },\n    {\n      "title": "To Kill a Mockingbird",\n      "author": "Harper Lee",\n      "year": 1960,\n      "genre": "Literary Fiction"\n    }\n  ]\n}'
  }

  if (lowerPrompt.includes("recipe") && lowerPrompt.includes("chocolate chip cookies")) {
    return '{\n  "name": "Classic Chocolate Chip Cookies",\n  "prepTime": 15,\n  "ingredients": [\n    {"item": "all-purpose flour", "amount": "2 cups"},\n    {"item": "chocolate chips", "amount": "1 cup"},\n    {"item": "butter", "amount": "1/2 cup"}\n  ],\n  "steps": [\n    "Cream butter and sugars until fluffy",\n    "Mix in flour and chocolate chips",\n    "Bake at 375°F for 10 minutes"\n  ]\n}'
  }

  if (lowerPrompt.includes("search_products") && lowerPrompt.includes("running shoes")) {
    return '{\n  "function": "search_products",\n  "arguments": {\n    "query": "running shoes",\n    "max_price": 100\n  }\n}\n\nThe model extracted "running shoes" as the query and correctly interpreted "under $100" as max_price: 100.'
  }

  if (lowerPrompt.includes("book_flight") && lowerPrompt.includes("nyc")) {
    return '{\n  "function": "book_flight",\n  "arguments": {\n    "origin": "NYC",\n    "destination": "London",\n    "date": "2024-03-15",\n    "passengers": 2\n  }\n}\n\nAll four required parameters were successfully extracted from natural language.'
  }

  if (lowerPrompt.includes("italian restaurants") && lowerPrompt.includes("seattle")) {
    return '{\n  "function": "search_restaurants",\n  "arguments": {\n    "cuisine": "Italian",\n    "location": "downtown Seattle"\n  }\n}\n\nThe model correctly chose search_restaurants over get_weather or book_table.'
  }

  if (lowerPrompt.includes("farmer") && lowerPrompt.includes("apples")) {
    if (lowerPrompt.includes("step by step")) {
      return "Let me work through this step by step:\n\n1. **Starting amount**: 15 apples\n\n2. **Gives 1/3 to neighbor**:\n   - 1/3 of 15 = 5 apples given away\n   - Remaining: 15 - 5 = 10 apples\n\n3. **Buys 10 more**:\n   - 10 + 10 = 20 apples\n\n4. **Eats 2**:\n   - 20 - 2 = 18 apples\n\n**Final answer: 18 apples**"
    }
    return "18 apples"
  }

  if (
    lowerPrompt.includes("roses") &&
    lowerPrompt.includes("flowers") &&
    lowerPrompt.includes("fade")
  ) {
    return "Let me analyze this step by step:\n\n1. **Premise 1**: All roses are flowers (Roses ⊆ Flowers)\n2. **Premise 2**: Some flowers fade quickly\n\n**Analysis**:\n- We know roses are a subset of flowers\n- We know some flowers fade quickly\n- However, we don't know if the fading flowers include roses\n\n**Conclusion**: No, we cannot conclude that some roses fade quickly.\n\nThis is a logical fallacy. The flowers that fade quickly might be tulips, daisies, or other non-rose flowers."
  }

  if (lowerPrompt.includes("summarize") && lowerPrompt.includes("conversation")) {
    return "Summary: User is building a todo app using React, TypeScript, and PostgreSQL with Prisma ORM. Key technical decisions have been made for the frontend framework, language, database, and data access layer."
  }

  if (lowerPrompt.includes("semantic similarity")) {
    return "Semantic Similarity Ratings:\n\n1. **'car' and 'automobile'**: 9/10 - Near-synonyms with nearly identical meanings\n\n2. **'car' and 'banana'**: 1/10 - Completely unrelated concepts\n\n3. **'happy' and 'joyful'**: 8/10 - Synonyms with slightly different connotations\n\n4. **'bank' (financial) vs 'bank' (river)**: 4/10 - Homonyms with different meanings; context-aware embeddings can distinguish these"
  }

  if (lowerPrompt.includes("rag prompt template")) {
    return "```\nYou are a helpful assistant answering questions based on the provided context.\n\n## Context\n{retrieved_documents}\n\n## Instructions\n1. Answer ONLY based on the context above\n2. If the context doesn't contain the answer, say \"I don't have information about that\"\n3. Cite your sources using [Source: document_name]\n\n## Question\n{user_question}\n```"
  }

  if (lowerPrompt.includes("chunking strategy")) {
    return "**Recommended Chunking Strategy:**\n\n**Chunk Size**: 400-500 tokens\n- Large enough to preserve context\n- Small enough for precise retrieval\n\n**Overlap**: 50-100 tokens\n- Prevents information loss at boundaries\n\n**Metadata to Include**:\n- Document title and section headers\n- Page numbers for citations\n- Document date and category tags\n\n**Tables**: Keep intact as single chunks when possible"
  }

  if (lowerPrompt.includes("vacation policy") && lowerPrompt.includes("irrelevant")) {
    return "**Likely Issues**:\n1. Semantic ambiguity - \"vacation\" has multiple meanings\n2. Missing domain context\n\n**Solutions**:\n1. Add metadata filtering by document category\n2. Use hybrid search (semantic + keyword)\n3. Query expansion: \"vacation policy time off PTO leave\"\n4. Re-rank results with a cross-encoder"
  }

  if (
    lowerPrompt.includes("streaming") &&
    (lowerPrompt.includes("3 seconds") || lowerPrompt.includes("without"))
  ) {
    return "**Without Streaming**:\n- User waits 3 seconds seeing nothing\n- Entire response appears at once\n- Perceived latency: 3000ms\n\n**With Streaming**:\n- First tokens appear in ~200ms\n- Response builds progressively\n- Perceived latency: 200ms\n\n**Result**: Streaming feels 15x faster, even though total generation time is identical."
  }

  if (lowerPrompt.includes("partial") && lowerPrompt.includes("json")) {
    return "**Challenges**:\n- Partial JSON can't be parsed\n- Incomplete data causes errors\n- UI may flicker with partial content\n\n**Solutions**:\n1. Buffer until valid JSON is complete\n2. Use streaming-friendly formats (NDJSON)\n3. Validate before parsing\n4. Show loading state until complete"
  }

  if (lowerPrompt.includes("connection drops")) {
    return "**Graceful Error Handling**:\n\n1. Preserve and display partial content\n2. Show clear message: \"Response interrupted\"\n3. Offer \"Retry\" button\n4. Implement automatic retry with backoff\n5. Log interruption points for debugging"
  }

  if (lowerPrompt.includes("llm-as-judge") || lowerPrompt.includes("customer support")) {
    return "# Customer Support Response Evaluator\n\n## Criteria\n\n**Accuracy (1-5)**: Is the information correct?\n**Tone (1-5)**: Is it empathetic and professional?\n**Completeness (1-5)**: Does it fully address the inquiry?\n\n## Example Good Response (5/5/5):\n\"I understand how frustrating this must be. Your refund was processed on March 1st and should appear in 3-5 business days.\"\n\n## Example Poor Response (2/1/2):\n\"Check your bank. Refunds take time.\""
  }

  if (lowerPrompt.includes("100,000 messages") && lowerPrompt.includes("cost")) {
    return "**Daily Cost Calculation**:\n\n- Input: 100K × 500 tokens = 50M tokens → $500/day\n- Output: 100K × 200 tokens = 20M tokens → $600/day\n- **Total: $1,100/day** (~$33K/month)\n\n**Cost Reduction Strategies**:\n\n1. **Use smaller models for simple queries** (save 40-60%)\n2. **Implement response caching** (save 20-40%)\n3. **Optimize prompt length** (save 20-30%)\n\nCombined approach: ~50% savings possible"
  }

  if (lowerPrompt.includes("temperature") && lowerPrompt.includes("0.0")) {
    return "With temperature 0.0, the model produces highly deterministic output.\n\nRunning the same prompt multiple times:\n1. \"The capital of France is Paris.\"\n2. \"The capital of France is Paris.\"\n3. \"The capital of France is Paris.\"\n\nNotice: Identical outputs every time. This is ideal for factual queries where consistency matters."
  }

  if (lowerPrompt.includes("temperature") && lowerPrompt.includes("1.0")) {
    return "With temperature 1.0, the model produces more varied, creative output.\n\nRunning the same prompt multiple times:\n1. \"Paris, the City of Light, serves as France's capital.\"\n2. \"France's governmental seat is in Paris.\"\n3. \"The capital of France is Paris, along the Seine.\"\n\nNotice: Each response is different. Higher temperature is great for creative tasks."
  }

  // Default response for unmatched prompts
  return "This is a simulated response demonstrating how an LLM would process your input. In a real implementation, this would connect to an actual language model API.\n\nThe response would be generated based on:\n- The model's training data\n- Your prompt's context and instructions\n- The configured generation parameters (temperature, max tokens, etc.)"
}
