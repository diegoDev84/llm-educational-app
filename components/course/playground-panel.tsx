"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { PlaygroundPrompt } from "@/lib/lessons"
import { Play, Sparkles, Copy, Check, ChevronDown, ChevronUp } from "lucide-react"

interface PlaygroundPanelProps {
  prompts: PlaygroundPrompt[]
  className?: string
}

export function PlaygroundPanel({ prompts, className }: PlaygroundPanelProps) {
  const [selectedPromptId, setSelectedPromptId] = useState(prompts[0]?.id || "")
  const [customPrompt, setCustomPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showExplanation, setShowExplanation] = useState(true)

  const selectedPrompt = prompts.find(p => p.id === selectedPromptId)
  const currentPromptText = customPrompt || selectedPrompt?.prompt || ""

  const runPrompt = async () => {
    if (!currentPromptText.trim()) return

    setIsLoading(true)
    setResponse("")

    // Simulate API response with educational content
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500))

    // Generate contextual response based on the prompt
    const simulatedResponse = generateResponse(currentPromptText)
    setResponse(simulatedResponse)
    setIsLoading(false)
  }

  const copyResponse = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectStarterPrompt = (promptId: string) => {
    setSelectedPromptId(promptId)
    setCustomPrompt("")
    setResponse("")
  }

  return (
    <div className={cn("flex flex-col h-full bg-card border-l border-border", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">Playground</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Experiment with the concepts from this lesson
        </p>
      </div>

      {/* Starter Prompts */}
      <div className="p-4 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Starter Prompts
        </p>
        <div className="space-y-2">
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => selectStarterPrompt(prompt.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                "border",
                selectedPromptId === prompt.id && !customPrompt
                  ? "bg-primary/10 border-primary/50 text-foreground"
                  : "bg-secondary/50 border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {prompt.title}
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
          placeholder="Enter your prompt or select a starter above..."
          className={cn(
            "w-full h-32 px-3 py-2 text-sm rounded-lg resize-none",
            "bg-secondary border border-border",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
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
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Response
          </label>
          {response && (
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
        
        <div className={cn(
          "flex-1 rounded-lg p-4 overflow-auto",
          "bg-secondary/50 border border-border",
          "min-h-[120px]"
        )}>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Spinner className="w-4 h-4" />
              <span className="text-sm">Generating response...</span>
            </div>
          ) : response ? (
            <div className="text-sm text-foreground whitespace-pre-wrap font-mono">
              {response}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Response will appear here after running the prompt
            </p>
          )}
        </div>
      </div>

      {/* Explanation */}
      {selectedPrompt && !customPrompt && (
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            <span>Why This Prompt?</span>
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

  if (lowerPrompt.includes("programming language")) {
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

  if (lowerPrompt.includes("machine learning") && lowerPrompt.includes("first-year")) {
    return "Machine learning is teaching computers to learn from examples instead of explicit instructions. Imagine teaching a child to recognize cats not by describing features, but by showing thousands of cat pictures until they 'get it.' That's essentially what ML does with data."
  }

  if (lowerPrompt.includes("exercise") && lowerPrompt.includes("benefit")) {
    return "- Benefit: Improved cardiovascular health\n  Why: Regular exercise strengthens the heart and improves blood circulation.\n\n- Benefit: Enhanced mental well-being\n  Why: Physical activity releases endorphins that reduce stress and anxiety.\n\n- Benefit: Better sleep quality\n  Why: Exercise helps regulate sleep patterns and promotes deeper rest."
  }

  if (lowerPrompt.includes("movie review") || lowerPrompt.includes("sentiment")) {
    if (lowerPrompt.includes("wooden") || lowerPrompt.includes("no sense")) {
      return "negative"
    }
    return "positive"
  }

  if (lowerPrompt.includes("formal") && lowerPrompt.includes("informal")) {
    return "I suggest we revisit this matter during our meeting next week."
  }

  if (lowerPrompt.includes("1984") && lowerPrompt.includes("json")) {
    return '{\n  "title": "1984",\n  "author": "George Orwell",\n  "year": 1949,\n  "genre": "Dystopian Fiction",\n  "themes": ["totalitarianism", "surveillance", "censorship", "psychological manipulation", "truth and memory"]\n}'
  }

  if (lowerPrompt.includes("restaurant") && lowerPrompt.includes("pizza")) {
    return '{\n  "name": "Joe\'s Pizza",\n  "cuisine": "Italian / New York Style Pizza",\n  "rating": 4.5,\n  "location": {\n    "city": "Brooklyn",\n    "neighborhood": "Williamsburg"\n  },\n  "priceRange": "$"\n}'
  }

  if (lowerPrompt.includes("sarah chen") || lowerPrompt.includes("marcus")) {
    return '[\n  { "name": "Sarah Chen", "role": "Project Lead" },\n  { "name": "Marcus Johnson", "role": "Developer" },\n  { "name": null, "role": "QA Tester" }\n]'
  }

  if (lowerPrompt.includes("15%") && lowerPrompt.includes("240")) {
    return '{\n  "function": "calculate",\n  "args": { "expression": "0.15 * 240" }\n}'
  }

  if (lowerPrompt.includes("aapl") || lowerPrompt.includes("stock")) {
    return '[\n  { "step": 1, "function": "get_stock_price", "args": { "symbol": "AAPL" } },\n  { "step": 2, "function": "calculate", "args": { "expression": "stock_price * 100" } }\n]'
  }

  if (lowerPrompt.includes("remind") && lowerPrompt.includes("john")) {
    return '{\n  "function": "create_reminder",\n  "args": {\n    "text": "Call John",\n    "datetime": "tomorrow 3:00 PM"\n  }\n}'
  }

  if (lowerPrompt.includes("bags") && lowerPrompt.includes("apples")) {
    return "Let's solve this step by step:\n\n1. Tom needs 50 apples\n2. Each bag contains 6 apples\n3. Divide: 50 ÷ 6 = 8.33...\n4. Since Tom can't buy partial bags, he needs to round UP\n5. 8 bags would give him 48 apples (not enough)\n6. 9 bags would give him 54 apples (enough!)\n\nTom should buy 9 bags of apples."
  }

  if (lowerPrompt.includes("dinner party") && lowerPrompt.includes("seating")) {
    return "Let's work through the constraints step by step:\n\n1. Bob sits in the middle (position 3 of 5)\n2. Eve sits at an end (position 1 or 5)\n3. Alice sits next to Bob (position 2 or 4)\n4. Carol doesn't sit next to Dan\n\nStarting with Bob in position 3:\n_ _ Bob _ _\n\nEve at an end, let's say position 1:\nEve _ Bob _ _\n\nAlice next to Bob, let's say position 2:\nEve Alice Bob _ _\n\nCarol and Dan fill positions 4 and 5. Since Carol can't be next to Dan, and position 4 is next to position 5... wait, they must be next to each other!\n\nLet me try Eve at position 5:\n_ _ Bob _ Eve\n\nAlice next to Bob:\n_ Alice Bob _ Eve or _ _ Bob Alice Eve\n\nWith '_ Alice Bob Dan Eve', Carol goes to position 1:\nCarol Alice Bob Dan Eve\n\nCheck: Carol (1) is not next to Dan (4) ✓\n\nIs Carol next to Eve? Carol is at position 1, Eve is at position 5.\nNo, Carol is NOT next to Eve."
  }

  if (lowerPrompt.includes("function mystery") || lowerPrompt.includes("fibonacci")) {
    return "Let's trace through with input [3, 1, 4, 1, 5]:\n\nInitial: result = 0\n\ni=0: arr[0] = 3, 3 % 2 = 1 (odd), result = 0 + 3 = 3\ni=1: arr[1] = 1, 1 % 2 = 1 (odd), result = 3 + 1 = 4\ni=2: arr[2] = 4, 4 % 2 = 0 (even), skip\ni=3: arr[3] = 1, 1 % 2 = 1 (odd), result = 4 + 1 = 5\ni=4: arr[4] = 5, 5 % 2 = 1 (odd), result = 5 + 5 = 10\n\nThe function returns 10.\n\nThis function sums all odd numbers in the array."
  }

  if (lowerPrompt.includes("previous messages") || lowerPrompt.includes("spam filter")) {
    return "Certainly! Building on our spam filter example:\n\nA spam filter learns by analyzing thousands of labeled emails—some marked 'spam', others 'not spam'. It identifies patterns:\n\n- Spam often contains: 'FREE!!!', 'Act now', suspicious links\n- Legitimate emails often have: known contacts, proper grammar, work-related content\n\nThe model learns statistical correlations. When a new email arrives with 'You've won $1,000,000!!!', the model recognizes multiple spam indicators and classifies accordingly.\n\nThis is supervised learning—the model learns from labeled examples to make predictions on new data."
  }

  if (lowerPrompt.includes("semantic similarity") || lowerPrompt.includes("automobile")) {
    return "1. 'automobile' vs 'car': 9/10\n   These are synonyms with nearly identical meanings. High semantic overlap.\n\n2. 'automobile' vs 'banana': 1/10\n   No semantic relationship. One is a vehicle, the other is fruit.\n\n3. 'happy' vs 'joyful': 9/10\n   Synonyms expressing positive emotional states. Very high similarity.\n\n4. 'bank' (river) vs 'bank' (financial): 2/10\n   Homonyms with completely different meanings. The only connection is spelling, which doesn't affect semantic similarity. In embeddings, these would be far apart because context determines meaning."
  }

  if (lowerPrompt.includes("website faster") && lowerPrompt.includes("rank")) {
    return "Relevance ranking:\n\n1. A: 'Web Performance Optimization Guide' - Most relevant\n   Directly addresses making websites faster.\n\n2. C: 'JavaScript Speed Improvements' - Highly relevant\n   JS optimization is a key part of web performance.\n\n3. B: 'Building Your First Website' - Somewhat relevant\n   May touch on performance but focused on basics.\n\n4. D: 'History of the Internet' - Not relevant\n   Historical content, not actionable performance advice.\n\nSemantic search would rank A and C highly despite not containing 'faster' because they're conceptually related to performance optimization."
  }

  if (lowerPrompt.includes("embeddings") && lowerPrompt.includes("applications")) {
    return "Three practical embedding applications:\n\n1. Smart Search in Documentation\n   Instead of keyword matching, users find answers by meaning. \"How do I authenticate?\" matches articles about \"login\", \"sign-in\", and \"user verification\" even without those exact words.\n\n2. Content Recommendations\n   When a user reads an article, show semantically similar content. Someone reading about 'machine learning basics' sees related articles on 'neural network fundamentals' and 'AI for beginners'.\n\n3. Support Ticket Routing\n   Automatically categorize incoming tickets by comparing to resolved ones. A ticket about 'payment not processing' routes to the billing team because it's semantically similar to past payment issues."
  }

  if (lowerPrompt.includes("acme corp") && lowerPrompt.includes("context")) {
    return "Based on the provided context:\n\nAcme Corp offers three pricing tiers:\n\n1. **Starter** - $29/month\n2. **Professional** - $99/month  \n3. **Enterprise** - Custom pricing (contact sales)\n\nAll plans include 24/7 support. Professional tier adds priority support and SSO. Enterprise includes a dedicated success manager.\n\n[Source: Document 1 and Document 2]"
  }

  if (lowerPrompt.includes("eiffel tower") && lowerPrompt.includes("cite")) {
    return "The Eiffel Tower was built in 1889 for the World's Fair [1]. It stands 330 meters tall including its antennas [2].\n\nSources used: [1] and [2]"
  }

  if (lowerPrompt.includes("python") && lowerPrompt.includes("version") && lowerPrompt.includes("context")) {
    return "I cannot answer this question based on the provided context. The context only mentions that Python was created by Guido van Rossum and describes its emphasis on code readability and significant whitespace. There is no information about Python versions or release dates in the provided sources."
  }

  if (lowerPrompt.includes("photosynthesis")) {
    return "Photosynthesis is the process by which plants convert light energy into chemical energy, storing it in glucose molecules. It occurs in two main stages:\n\n**Light Reactions (Light-Dependent)**\nThese occur in the thylakoid membranes of chloroplasts. When chlorophyll absorbs sunlight, it energizes electrons that move through an electron transport chain. This process:\n- Splits water molecules (H₂O), releasing oxygen as a byproduct\n- Generates ATP (energy currency)\n- Creates NADPH (electron carrier)\n\n**Dark Reactions (Calvin Cycle)**\nThese occur in the stroma of chloroplasts and don't directly require light. Using ATP and NADPH from the light reactions:\n- CO₂ from the air is \"fixed\" into organic molecules\n- Through a series of enzyme-catalyzed reactions, glucose is synthesized\n- The cycle regenerates its starting molecule (RuBP)\n\nThe overall equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nThis process is fundamental to life on Earth, producing the oxygen we breathe and forming the base of most food chains."
  }

  if (lowerPrompt.includes("fibonacci") && lowerPrompt.includes("python")) {
    return "def fibonacci(n: int) -> int:\n    \"\"\"\n    Calculate the nth Fibonacci number using dynamic programming.\n    \n    Uses bottom-up tabulation for O(n) time and O(1) space complexity.\n    \n    Args:\n        n: The position in the Fibonacci sequence (0-indexed)\n        \n    Returns:\n        The nth Fibonacci number\n    \"\"\"\n    # Base cases: F(0) = 0, F(1) = 1\n    if n <= 1:\n        return n\n    \n    # Initialize variables to store previous two values\n    # This avoids storing the entire sequence, saving memory\n    prev_prev = 0  # F(n-2)\n    prev = 1       # F(n-1)\n    \n    # Build up from F(2) to F(n)\n    for i in range(2, n + 1):\n        # Current Fibonacci number is sum of previous two\n        current = prev_prev + prev\n        \n        # Shift values for next iteration\n        prev_prev = prev\n        prev = current\n    \n    return prev\n\n# Example usage:\n# fibonacci(10) returns 55\n# fibonacci(0) returns 0\n# fibonacci(1) returns 1"
  }

  if (lowerPrompt.includes("headphone") || lowerPrompt.includes("product description")) {
    return "**SoundWave Pro X1 Wireless Headphones**\n\nEscape into pure, uninterrupted audio. The SoundWave Pro X1 features advanced active noise cancellation that silences the world around you—whether you're on a crowded commute, in a busy office, or seeking focus at home.\n\n**40 Hours of Freedom**\nWith an industry-leading 40-hour battery life, these headphones keep up with your longest days and longest playlists. A quick 10-minute charge gives you 3 hours of playback when you need it most.\n\n**Comfort Meets Craftsmanship**\nMemory foam ear cushions and an adjustable headband ensure all-day comfort, while premium aluminum accents deliver durability that matches the sound quality.\n\nBluetooth 5.3 • USB-C Fast Charging • Foldable Design • Built-in Microphone\n\n*Your soundtrack. Zero compromise.*"
  }

  if (lowerPrompt.includes("customer support") && lowerPrompt.includes("evaluate")) {
    return "Evaluation:\n\n**Empathy: 3/5**\nThe response starts with an apology, which shows some empathy. However, it feels somewhat formulaic. A stronger response might acknowledge the frustration of waiting 2 weeks specifically.\n\n**Helpfulness: 2/5**\nThe suggestion to check the tracking number is valid but assumes the customer hasn't already done this. The response doesn't offer to look up the order, provide contact info for shipping carriers, or explain what happens if the package is truly lost.\n\n**Completeness: 2/5**\nMissing several key elements:\n- No mention of investigating the issue\n- No escalation options or timeline\n- No compensation or goodwill gesture consideration\n- Doesn't address what happens next if tracking doesn't help\n\n**Improved Response:**\n\"I'm truly sorry your order hasn't arrived after two weeks—that's frustrating. Let me look into this right away. Could you share your order number? I'll check the shipping status and, if needed, arrange a replacement or refund within 24 hours.\""
  }

  if (lowerPrompt.includes("rewrite") && lowerPrompt.includes("fewer tokens")) {
    return "**Optimized prompt:**\n\"Summarize this text's key points concisely.\"\n\n**Token analysis:**\n- Original: ~40 tokens\n- Optimized: ~8 tokens\n- Savings: ~80%\n\n**Changes made:**\n1. Removed filler phrases (\"I would really appreciate it if you could kindly\")\n2. Eliminated redundancy (\"detailed and comprehensive\", \"essential information while keeping it concise\")\n3. Used direct language (\"Summarize\" vs \"provide me with a summary\")\n4. Removed obvious context (\"easy to understand\" is implied)\n\nAt scale with 1M requests/day, this could mean significant cost savings while maintaining the same output quality."
  }

  if (lowerPrompt.includes("model size") && lowerPrompt.includes("recommend")) {
    return "**1. Sentiment classification (positive/negative)**\nRecommended: Small model\nBinary classification is a simple task. Small models handle it well with lower latency and cost. Even fine-tuned lightweight models achieve 95%+ accuracy.\n\n**2. Legal contract analysis**\nRecommended: Large model\nRequires nuanced understanding, domain knowledge, and reasoning about complex language. Risk of errors is high and consequences severe. Worth the extra cost.\n\n**3. Translating common phrases**\nRecommended: Small/Medium model\nCommon phrases are well-represented in training data. Medium if handling idioms or technical terms; small for basic phrases.\n\n**4. Creative story writing**\nRecommended: Large model\nCreativity benefits from larger models with more diverse training. Better coherence over long narratives, richer vocabulary, more sophisticated plot development.\n\n**5. Medical diagnosis support**\nRecommended: Large model (with human oversight)\nHigh-stakes domain requiring broad medical knowledge, reasoning about symptoms, and careful language. Must be paired with physician review—never autonomous."
  }

  if (lowerPrompt.includes("100,000") && lowerPrompt.includes("cost")) {
    return "**Cost Analysis:**\n\n**Daily costs:**\n- Input: 100,000 × 500 tokens = 50M tokens × $0.01/1K = $500\n- Output: 100,000 × 200 tokens = 20M tokens × $0.03/1K = $600\n- **Total daily: $1,100**\n- Monthly: ~$33,000\n\n**3 Ways to Reduce Cost by 50%:**\n\n**1. Use a smaller model for simple queries (Save ~40%)**\n- Route classification/simple tasks to GPT-3.5 ($0.002/1K input)\n- Keep complex queries on GPT-4\n- Trade-off: Requires query classification logic; some quality loss on edge cases\n\n**2. Implement semantic caching (Save ~30%)**\n- Cache embeddings of frequent queries and their responses\n- Return cached responses for semantically similar queries\n- Trade-off: Cache maintenance; occasionally stale responses; storage costs\n\n**3. Optimize prompt lengths (Save ~25%)**\n- Reduce system prompt from 200 to 50 tokens\n- Compress conversation history\n- Trade-off: May lose context; requires careful prompt engineering\n\n**Combined approach could achieve 50%+ savings: ~$550/day**"
  }

  // Default response for other prompts
  return "This is a simulated response for demonstration purposes. In a production environment, this would connect to an actual LLM API to generate real responses.\n\nTry one of the starter prompts to see example interactions that demonstrate the concepts from this lesson."
}
