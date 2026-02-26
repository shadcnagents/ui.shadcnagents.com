export interface StackContent {
  intro: string
  useCases: string[]
  howItWorks?: string
  techStack: string[]
  relatedSlugs?: string[]
}

export const stackContent: Record<string, StackContent> = {
  /* ─── SDK API ─── */

  "basics-generate-text": {
    intro:
      "Generate text with any AI model using the Vercel AI SDK's generateText function in a Next.js app. This copy-paste ready stack shows you how to call Claude, GPT-4, or Gemini from a server action or API route and return structured text responses with full TypeScript support.",
    useCases: [
      "Summarize articles, emails, or documents server-side",
      "Power form auto-fill, tag extraction, or classification pipelines",
      "Generate product descriptions, SEO copy, or report content",
      "Run batch AI processing jobs without a streaming UI",
    ],
    howItWorks:
      "Calls generateText() from the ai package on the server, passing a model provider (Anthropic, OpenAI, Google) and a prompt. Returns a typed result object with text, usage, and finish reason — no client-side JS required.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Anthropic Claude", "OpenAI GPT-4"],
    relatedSlugs: ["basics-stream-text", "basics-tool", "basics-agent"],
  },

  "basics-stream-text": {
    intro:
      "Stream AI text token-by-token to your Next.js frontend using the Vercel AI SDK's streamText and useCompletion hook. This production-ready pattern delivers real-time responses that feel snappy and alive — the same streaming architecture used by ChatGPT and Claude.ai.",
    useCases: [
      "Build chat interfaces where responses appear character-by-character",
      "Stream long-form content like articles or code without waiting",
      "Display AI progress for slow model calls with live updates",
      "Implement typewriter effects backed by real LLM output",
    ],
    howItWorks:
      "Uses streamText() in a Next.js Route Handler to pipe tokens over HTTP streaming. The client uses the useCompletion hook (or useChat) to read the stream and update state incrementally.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "Server-Sent Events"],
    relatedSlugs: ["basics-generate-text", "ai-elements-chat", "streaming-markdown-renderer"],
  },

  "basics-generate-image": {
    intro:
      "Generate AI images in Next.js using the Vercel AI SDK's experimental_generateImage with providers like fal.ai or Together AI. This stack gives you a working image generation endpoint with loading states, error handling, and a clean display component ready to drop into any project.",
    useCases: [
      "AI image generation features in SaaS products and tools",
      "Product mockup or concept visualization from text prompts",
      "Avatar and profile picture generation for user onboarding",
      "Content illustration for blog posts or marketing pages",
    ],
    howItWorks:
      "Calls experimental_generateImage() with a model and prompt from a Next.js API route. Returns a base64 or URL image that the client renders in an img tag with shimmer loading states.",
    techStack: ["Vercel AI SDK", "Next.js", "fal.ai", "Together AI", "TypeScript"],
    relatedSlugs: ["ai-image-output", "basics-generate-text", "ai-artifact-chart"],
  },

  "basics-generate-speech": {
    intro:
      "Convert text to natural-sounding speech in Next.js using the Vercel AI SDK's generateSpeech function. Stream audio directly to the browser with support for multiple voices and providers, giving your AI app a voice interface without complex audio infrastructure.",
    useCases: [
      "Read-aloud features for accessibility in content apps",
      "Voice responses in conversational AI assistants",
      "Audio narration for AI-generated summaries or reports",
      "Notification audio for AI workflow completion events",
    ],
    howItWorks:
      "Calls generateSpeech() server-side with text and a voice/model config, returning an audio stream that pipes to the browser as an ArrayBuffer playable via the Web Audio API.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Web Audio API", "OpenAI TTS"],
    relatedSlugs: ["basics-transcribe", "voice-input-button", "basics-stream-text"],
  },

  "basics-transcribe": {
    intro:
      "Transcribe audio to text in Next.js using the Vercel AI SDK's transcribe function with providers like OpenAI Whisper. Upload audio files or stream from a microphone and get back accurate text transcriptions with timestamps, ready for further AI processing.",
    useCases: [
      "Meeting notes and voice memo transcription features",
      "Voice command input for AI assistants and chatbots",
      "Audio content indexing and search in media apps",
      "Accessibility captioning for user-uploaded video content",
    ],
    howItWorks:
      "Posts an audio file (FormData) to a Next.js API route that calls transcribe() with the audio stream and returns the transcription text with confidence metadata.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "OpenAI Whisper", "Web Audio API"],
    relatedSlugs: ["basics-generate-speech", "voice-input-button", "basics-generate-text"],
  },

  "basics-tool": {
    intro:
      "Implement AI tool calling in Next.js using the Vercel AI SDK's tool() function. Give your LLM the ability to call external APIs, run calculations, or query databases — and render the results right in the chat UI. The definitive pattern for function calling with structured typed inputs.",
    useCases: [
      "Weather lookups, stock prices, or any real-time data API",
      "Database queries or CMS content retrieval from the LLM",
      "Code execution and interpreter patterns for AI assistants",
      "Multi-tool agent loops with sequential tool invocations",
    ],
    howItWorks:
      "Defines tools with Zod schemas for parameters, passes them to streamText() or generateText(). The LLM decides when to call tools; results feed back into the context for the final answer.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Zod", "OpenAI", "Anthropic"],
    relatedSlugs: ["basics-agent", "ai-human-in-the-loop", "ai-chat-agent-multi-step-tool-pattern"],
  },

  "basics-agent": {
    intro:
      "Build an autonomous AI agent in Next.js with the Vercel AI SDK using the Agent class. Create agents that reason step-by-step, call tools, and produce structured outputs — the foundation for every advanced agentic workflow from research bots to coding assistants.",
    useCases: [
      "Research agents that search, read URLs, and synthesize answers",
      "Task automation agents that orchestrate multi-step workflows",
      "Code review or generation agents with tool-augmented reasoning",
      "Customer support agents with CRM and knowledge base access",
    ],
    howItWorks:
      "Instantiates an Agent with a model and toolset, runs the agentic loop where the LLM calls tools and reflects on results until reaching a final answer or maxSteps limit.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Zod", "Anthropic Claude"],
    relatedSlugs: ["basics-tool", "ai-agents-routing", "ai-chat-agent-orchestrator-pattern"],
  },

  /* ─── Agent Patterns ─── */

  "ai-agents-routing": {
    intro:
      "Route user requests to the right specialized AI agent using a classifier LLM with the Vercel AI SDK. This pattern prevents one overloaded agent from handling everything — instead a router model reads the intent and dispatches to a fast, focused expert agent for each task type.",
    useCases: [
      "Triage support tickets to billing, technical, or sales agents",
      "Route content requests between writing, coding, and analysis agents",
      "Multi-domain chatbots that switch expertise based on context",
      "Intent classification before expensive agent calls to save cost",
    ],
    howItWorks:
      "A lightweight classifier model calls generateObject() with an intent schema, then the app dispatches to the matching specialist agent function based on the classified route.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Zod", "generateObject"],
    relatedSlugs: ["ai-chat-agent-orchestrator-pattern", "ai-agents-parallel-processing", "basics-agent"],
  },

  "ai-chat-agent-orchestrator-pattern": {
    intro:
      "Implement the orchestrator-worker pattern with the Vercel AI SDK where a manager LLM breaks down complex tasks and delegates to specialized worker agents. Build AI systems that tackle problems too large for a single context window by splitting and conquering.",
    useCases: [
      "Report generation that delegates research, writing, and formatting",
      "Code review pipelines with separate analysis and suggestion agents",
      "Multi-document processing with parallel worker coordination",
      "Complex reasoning tasks that benefit from divide-and-conquer",
    ],
    howItWorks:
      "The orchestrator calls generateObject() to produce a task plan, then runs worker agents in sequence or parallel, collecting results and synthesizing a final response.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Anthropic Claude", "Promise.all"],
    relatedSlugs: ["sub-agent-orchestrator", "ai-agents-parallel-processing", "ai-chat-agent-evaluator-optimizer-pattern"],
  },

  "sub-agent-orchestrator": {
    intro:
      "Build nested AI agent hierarchies where orchestrators spawn and coordinate sub-agents using the Vercel AI SDK. This pattern enables truly scalable agentic systems where complex goals are recursively broken into manageable sub-tasks executed by purpose-built child agents.",
    useCases: [
      "Deep research agents that spawn query specialists per topic",
      "Software development agents with dedicated coding, testing, and review sub-agents",
      "Content pipelines with research, outline, draft, and edit agents",
      "Data analysis workflows with collection, cleaning, and insight sub-agents",
    ],
    howItWorks:
      "Parent agents spawn child agents by invoking their functions as tools, passing relevant context. Child agents return structured results that the parent synthesizes into higher-level outputs.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Anthropic Claude", "Recursive Agents"],
    relatedSlugs: ["ai-chat-agent-orchestrator-pattern", "ai-agents-parallel-processing", "ai-agents-routing"],
  },

  "ai-human-in-the-loop": {
    intro:
      "Implement human-in-the-loop AI approval flows with the Vercel AI SDK where agents pause and request user confirmation before executing sensitive tool calls. Essential for production AI apps where you need oversight before the AI takes real-world actions like sending emails or modifying data.",
    useCases: [
      "Confirm before AI sends emails, creates calendar events, or posts content",
      "Approve AI-generated code before it runs in production",
      "Gate AI database writes or API calls behind explicit user consent",
      "Compliance workflows where human sign-off is required by policy",
    ],
    howItWorks:
      "The agent surfaces a pending tool call to the UI, pauses execution, and waits for user confirmation. On approval, execution resumes; on rejection, the agent receives feedback and adjusts.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "useChat"],
    relatedSlugs: ["ai-elements-confirmation", "ai-chat-agent-tool-approval", "basics-tool"],
  },

  "ai-human-in-the-loop-agentic-context-builder": {
    intro:
      "Build an AI context builder that interviews the user with targeted questions to gather the exact information an agent needs before starting a complex task. This Vercel AI SDK pattern reduces hallucination and improves output quality by ensuring agents have complete, accurate context.",
    useCases: [
      "Onboarding flows that gather user preferences before personalized recommendations",
      "Brief-collection bots for creative projects before generation begins",
      "Requirements gathering for code generation or document drafting",
      "Dynamic intake forms driven by LLM question generation",
    ],
    howItWorks:
      "The agent uses generateObject() to determine the next question based on what's already been gathered, continuing until enough context is collected to confidently complete the task.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Zod", "Anthropic Claude"],
    relatedSlugs: ["ai-human-in-the-loop", "ai-human-in-the-loop-inquire-text", "basics-agent"],
  },

  "ai-chat-agent-tool-approval": {
    intro:
      "Require explicit user approval before AI agents execute tools using the Vercel AI SDK's tool approval pattern. This gated execution model gives users visibility and control over every action the agent takes, critical for enterprise apps with strict governance requirements.",
    useCases: [
      "Enterprise AI assistants with audit trail requirements",
      "Financial applications where AI actions have monetary consequences",
      "Dev tools where AI-generated code changes need review before apply",
      "Admin dashboards where AI-triggered operations affect live systems",
    ],
    howItWorks:
      "Intercepts tool calls via a custom tool execution handler, persists the pending action to state, renders an approval card in the UI, and only proceeds when the user taps Approve.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "useChat hooks"],
    relatedSlugs: ["ai-human-in-the-loop", "ai-elements-confirmation", "basics-tool"],
  },

  "ai-human-in-the-loop-inquire-multiple-choice": {
    intro:
      "Let AI agents ask multiple-choice clarification questions mid-task using the Vercel AI SDK and generateObject. When the agent encounters ambiguity, it presents structured options to the user instead of guessing — resulting in more accurate outputs and a better user experience.",
    useCases: [
      "Disambiguation when user request can be interpreted multiple ways",
      "Style preference selection before generating creative content",
      "Scope confirmation before running expensive agent operations",
      "Survey and quiz flows powered by AI-generated dynamic questions",
    ],
    howItWorks:
      "The agent calls generateObject() with a question schema that includes an options array. The UI renders a multiple-choice card; the selected answer flows back into the agent's context.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Zod", "generateObject"],
    relatedSlugs: ["ai-human-in-the-loop-inquire-text", "ai-human-in-the-loop", "ai-elements-confirmation"],
  },

  "ai-human-in-the-loop-inquire-text": {
    intro:
      "Enable AI agents to request free-form text input from users when they need more context using the Vercel AI SDK. This pattern creates a natural back-and-forth conversation loop where the agent knows exactly what to ask and the user provides targeted information to complete the task.",
    useCases: [
      "Collecting missing details for form completion or data entry",
      "Asking follow-up questions in research and Q&A assistants",
      "Gathering custom requirements before code or content generation",
      "Interactive AI tutors that probe understanding before explaining",
    ],
    howItWorks:
      "The agent generates a text input request with a question and optional placeholder, pauses execution, and resumes with the user's response appended to the context messages.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "useChat", "Zod"],
    relatedSlugs: ["ai-human-in-the-loop-inquire-multiple-choice", "ai-human-in-the-loop", "basics-agent"],
  },

  "ai-chat-agent-evaluator-optimizer-pattern": {
    intro:
      "Implement an evaluator-optimizer agent loop with the Vercel AI SDK where a critic LLM scores outputs and a generator LLM iterates until quality thresholds are met. This self-improving pattern produces significantly better outputs than single-pass generation for complex tasks.",
    useCases: [
      "High-quality writing that iterates until tone, length, and clarity pass review",
      "Code generation with automated test and fix cycles",
      "Data extraction with validation-retry loops for structured accuracy",
      "Creative content that self-evaluates against scoring rubrics",
    ],
    howItWorks:
      "The generator produces an output, the evaluator scores it with generateObject() against defined criteria, and if the score falls below threshold, the generator receives the critique and retries up to maxIterations.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Zod", "Anthropic Claude"],
    relatedSlugs: ["ai-chat-agent-orchestrator-pattern", "ai-chat-agent-multi-step-tool-pattern", "wdk-workflows-evaluator"],
  },

  "ai-chat-agent-multi-step-tool-pattern": {
    intro:
      "Build AI agents that chain multiple tool calls in sequence using the Vercel AI SDK's maxSteps option. Each step's output feeds the next, creating powerful pipelines where the LLM plans, executes, observes results, and adapts — all within a single streamText call.",
    useCases: [
      "Research agents that search, read pages, and synthesize answers in one run",
      "Data processing pipelines with fetch, transform, and store steps",
      "Coding assistants that read files, understand context, then write changes",
      "Booking bots that check availability, confirm details, then complete reservations",
    ],
    howItWorks:
      "Sets maxSteps on streamText() and defines multiple tool functions. The AI autonomously decides the order of tool calls, with each step's result available in the next iteration's context.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Zod", "maxSteps"],
    relatedSlugs: ["basics-tool", "basics-agent", "ai-agents-parallel-processing"],
  },

  "ai-agents-parallel-processing": {
    intro:
      "Run multiple AI agents simultaneously with the Vercel AI SDK using Promise.all for true parallel execution. Dramatically speed up complex workflows by splitting independent subtasks across concurrent agent calls — cutting end-to-end latency from minutes to seconds.",
    useCases: [
      "Research agents querying multiple sources concurrently",
      "Batch document processing with parallel per-document agents",
      "Multi-model comparison running the same prompt across providers",
      "Fan-out workflows that aggregate results from specialist agents",
    ],
    howItWorks:
      "Kicks off multiple generateText() or streamText() calls with Promise.all, collecting results asynchronously. Each parallel branch has its own tool context and prompt, recombined at the end.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Promise.all", "Anthropic Claude"],
    relatedSlugs: ["ai-chat-agent-orchestrator-pattern", "wdk-workflows-parallel", "ai-agents-routing"],
  },

  /* ─── Examples ─── */

  "examples-chat-base-clone": {
    intro:
      "A full-stack AI chat application clone built with Next.js, the Vercel AI SDK, and shadcn/ui. Includes message history, streaming responses, markdown rendering, code highlighting, and a persistent conversation sidebar — everything you need to launch a ChatGPT-like product.",
    useCases: [
      "Starter template for building a custom AI chat product",
      "Internal company knowledge assistant with conversation history",
      "Customer support chatbot with branded UI and message threading",
      "Developer tool assistant with code syntax highlighting",
    ],
    howItWorks:
      "Uses useChat for real-time streaming, Next.js App Router for the API route, and a sidebar component for conversation history. Markdown is rendered with streaming-safe block parsing.",
    techStack: ["Vercel AI SDK", "Next.js", "shadcn/ui", "TypeScript", "useChat", "Tailwind CSS"],
    relatedSlugs: ["ai-elements-chat", "chat-gpt", "conversation-history-sidebar"],
  },

  "examples-form-generator": {
    intro:
      "Generate dynamic shadcn/ui forms from natural language using the Vercel AI SDK's generateObject with Zod schemas. Users describe what data they need to collect; the AI produces a fully typed form schema and renders it instantly — no manual form building required.",
    useCases: [
      "No-code form builders powered by AI for non-technical teams",
      "Dynamic intake forms that adapt to different request types",
      "Survey generation from plain-language questionnaire descriptions",
      "Auto-generated API request forms from endpoint descriptions",
    ],
    howItWorks:
      "Passes the user's natural language form description to generateObject() with a JSON Schema that defines field types, labels, and validation rules. The UI renders the resulting schema as shadcn/ui form components.",
    techStack: ["Vercel AI SDK", "Next.js", "shadcn/ui", "TypeScript", "Zod", "generateObject"],
    relatedSlugs: ["structured-output-viewer", "basics-generate-text", "ai-artifact-table"],
  },

  "example-agent-data-analysis": {
    intro:
      "An AI data analysis agent built with the Vercel AI SDK that ingests CSV or JSON data, runs statistical analysis using code execution tools, and surfaces insights in natural language with charts. Turn raw data into executive summaries without writing a single SQL query.",
    useCases: [
      "Sales performance analysis and trend identification",
      "Customer behavior analysis from exported CRM or analytics data",
      "Financial data review with anomaly detection and summaries",
      "Operations metrics analysis for engineering or support teams",
    ],
    howItWorks:
      "The agent receives structured data, uses a code execution tool to compute statistics and aggregations, then generates natural language insights and chart recommendations from the results.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Anthropic Claude", "Zod", "Chart.js"],
    relatedSlugs: ["ai-artifact-chart", "ai-artifact-table", "basics-agent"],
  },

  "example-agent-branding": {
    intro:
      "An AI branding agent that generates brand names, taglines, color palettes, and positioning statements using the Vercel AI SDK. Give it your product description and target audience; it returns a complete brand identity package ready for design handoff.",
    useCases: [
      "Startup branding and naming ideation at the early stage",
      "Product line extensions that need fast brand exploration",
      "Agency workflows for rapid brand concepting with clients",
      "Internal tool naming and icon generation for product teams",
    ],
    howItWorks:
      "Runs multiple parallel generateObject() calls for different brand dimensions (naming, color, voice, positioning), combining structured outputs into a cohesive brand brief.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Anthropic Claude", "generateObject"],
    relatedSlugs: ["ai-agents-parallel-processing", "basics-agent", "example-agent-competitor"],
  },

  "example-agent-competitor": {
    intro:
      "An AI competitor research agent that scrapes company websites, analyzes positioning, and produces structured competitive intelligence reports using the Vercel AI SDK with web scraping tools. Replace hours of manual research with a 60-second automated briefing.",
    useCases: [
      "Sales battle cards generated automatically before deals",
      "Quarterly competitive landscape reports for strategy teams",
      "Positioning gap analysis before product launches",
      "Market entry research for new verticals or geographies",
    ],
    howItWorks:
      "The agent uses web scraping tools (Cheerio or Jina) to gather competitor data, structures findings with generateObject(), and formats the output as a markdown-rich comparison report.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Cheerio", "Anthropic Claude", "Zod"],
    relatedSlugs: ["cheerio-scraper", "jina-scraper", "example-agent-seo-audit"],
  },

  "example-agent-seo-audit": {
    intro:
      "An AI SEO audit agent built with the Vercel AI SDK that crawls pages, analyzes meta tags, heading structure, content quality, and link patterns, then produces a prioritized action plan. Get a comprehensive technical and content SEO report in seconds.",
    useCases: [
      "Pre-launch site audits to catch SEO issues before going live",
      "Ongoing monitoring agents for content and technical SEO health",
      "Client SEO deliverables automated for agencies",
      "Content gap analysis comparing pages against target keywords",
    ],
    howItWorks:
      "Fetches and parses page HTML with Cheerio, extracts SEO signals (title, meta, h-tags, word count, links), and passes structured data to Claude for qualitative analysis and ranked recommendations.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Cheerio", "Anthropic Claude", "Zod"],
    relatedSlugs: ["cheerio-scraper", "markdown-new-scraper", "example-agent-competitor"],
  },

  "example-agent-reddit-validation": {
    intro:
      "An AI market validation agent that searches Reddit for organic conversations about your product space using the Vercel AI SDK with web search tools. Surfaces real user pain points, desired features, and sentiment — genuine market signal without surveys or interviews.",
    useCases: [
      "Idea validation before building a new product or feature",
      "Understanding customer language for copywriting and positioning",
      "Identifying underserved needs in an existing market",
      "Monitoring brand sentiment and tracking community conversations",
    ],
    howItWorks:
      "The agent searches Reddit via a web search tool, scrapes top threads, extracts pain points and feature requests with generateObject(), and synthesizes patterns into a validation summary.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Exa Search", "Anthropic Claude", "Zod"],
    relatedSlugs: ["tool-websearch-exa", "tool-websearch-claude", "example-agent-competitor"],
  },

  "example-agent-a11y-audit": {
    intro:
      "An AI accessibility audit agent powered by the Vercel AI SDK that evaluates pages against WCAG guidelines, identifies violations, and generates fix recommendations. Automate your a11y review process and ship more inclusive products without specialized expertise.",
    useCases: [
      "Pre-PR accessibility checks integrated into development workflow",
      "Compliance auditing for government or enterprise web properties",
      "Accessible design reviews with prioritized issue lists",
      "Ongoing monitoring for accessibility regressions after deploys",
    ],
    howItWorks:
      "Fetches page HTML, runs Cheerio-based extraction of ARIA attributes, color contrast hints, and structural patterns, then passes findings to Claude for WCAG-level classification and remediation advice.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Cheerio", "Anthropic Claude", "WCAG"],
    relatedSlugs: ["cheerio-scraper", "example-agent-seo-audit", "basics-agent"],
  },

  /* ─── Artifacts ─── */

  "ai-artifact-table": {
    intro:
      "Generate editable data tables from natural language with the Vercel AI SDK's generateObject and render them as interactive shadcn/ui tables. Users describe the data they need; the AI creates a structured, sortable, and exportable table in seconds — no manual data entry required.",
    useCases: [
      "Comparison tables generated from user-described criteria",
      "Data extraction from pasted text or documents into tabular form",
      "Budget and planning tables auto-populated from requirements",
      "AI-generated reports with structured tabular data sections",
    ],
    howItWorks:
      "Passes the user request to generateObject() with a table schema (columns, rows, types), renders the JSON output as a TanStack Table-powered interactive component with sort and filter.",
    techStack: ["Vercel AI SDK", "Next.js", "shadcn/ui", "TypeScript", "generateObject", "Zod"],
    relatedSlugs: ["ai-artifact-chart", "structured-output-viewer", "examples-form-generator"],
  },

  "ai-artifact-chart": {
    intro:
      "Generate data visualizations from natural language using the Vercel AI SDK and Recharts. Users describe what they want to visualize; the AI produces a properly configured chart specification rendered as a beautiful, responsive bar, line, or pie chart in the browser.",
    useCases: [
      "Business dashboards where non-technical users describe charts in plain English",
      "Data storytelling with AI-generated visual narratives",
      "Sales and marketing analytics charts from pasted data",
      "Report generation with automated chart selection and configuration",
    ],
    howItWorks:
      "Uses generateObject() to produce a chart config (type, data, axis labels, colors) matching the user description. The structured config drives a Recharts component for immediate visual output.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Recharts", "generateObject", "Zod"],
    relatedSlugs: ["ai-artifact-table", "example-agent-data-analysis", "structured-output-viewer"],
  },

  "json-render-shadcn": {
    intro:
      "Render full shadcn/ui interfaces from AI-generated JSON using the Vercel AI SDK's generateObject. Describe a UI in natural language and the AI produces a component tree specification that renders as interactive shadcn/ui components — the foundation for generative UI applications.",
    useCases: [
      "No-code UI builders that generate components from user descriptions",
      "Dynamic dashboard generation from data schemas",
      "AI-powered form and card generation for CMS workflows",
      "Prototyping tools that turn wireframe descriptions into working UI",
    ],
    howItWorks:
      "Calls generateObject() with a component schema (type, props, children), then a recursive renderer walks the tree and instantiates the matching shadcn/ui component for each node.",
    techStack: ["Vercel AI SDK", "Next.js", "shadcn/ui", "TypeScript", "generateObject", "Zod"],
    relatedSlugs: ["artifact-canvas", "json-render-generate", "structured-output-viewer"],
  },

  "json-render-generate": {
    intro:
      "Dynamically generate and render complex UI layouts from structured JSON using the Vercel AI SDK and React. This pattern powers generative UI applications where the AI controls not just the content but the entire component structure returned to the user.",
    useCases: [
      "AI assistants that return rich UI widgets instead of plain text",
      "Dynamic report rendering with AI-chosen layout and components",
      "Personalized dashboard widgets generated to user specifications",
      "Multi-step wizards where each step's UI is AI-generated",
    ],
    howItWorks:
      "Streams structured JSON using streamObject() and renders each component node progressively as it arrives. The renderer resolves component types from a registry and passes typed props.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "streamObject", "React", "Zod"],
    relatedSlugs: ["json-render-shadcn", "artifact-canvas", "streaming-markdown-renderer"],
  },

  "json-render-pdf": {
    intro:
      "Generate production-quality PDF documents from AI-produced structured content using the Vercel AI SDK with React PDF or Puppeteer. Users describe the document they need; the AI structures the content and layout, and the app renders it as a downloadable PDF.",
    useCases: [
      "Contract and proposal generation from user-provided parameters",
      "Invoice and receipt generation with AI-extracted line items",
      "Report generation with AI-structured sections and data",
      "Certificate and document creation from template descriptions",
    ],
    howItWorks:
      "AI generates a document structure (sections, headings, tables, text) via generateObject(), which is passed to a PDF renderer (react-pdf or Puppeteer) that produces a downloadable binary.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "react-pdf", "Puppeteer", "generateObject"],
    relatedSlugs: ["json-render-shadcn", "examples-form-generator", "ai-artifact-table"],
  },

  "json-render-remotion": {
    intro:
      "Generate animated video content from AI-produced scene specifications using the Vercel AI SDK with Remotion. Describe a video; the AI creates a structured scene graph with text, animations, and timing that Remotion renders as an MP4 — AI-powered video generation in Next.js.",
    useCases: [
      "Social media video generation from text prompts",
      "Automated explainer video creation for product features",
      "Dynamic promotional videos with AI-scripted content",
      "Data visualization videos with AI-choreographed animations",
    ],
    howItWorks:
      "Uses generateObject() to produce a Remotion composition spec (scenes, elements, timing, transitions). The spec drives a Remotion Player for preview and server-side rendering for export.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Remotion", "generateObject", "Zod"],
    relatedSlugs: ["ai-image-output", "ai-artifact-chart", "json-render-generate"],
  },

  "streaming-markdown-renderer": {
    intro:
      "Render AI-generated markdown in real-time as tokens stream in, with proper syntax highlighting and no layout thrash using the Vercel AI SDK and shadcn/ui. This production-ready component handles code blocks, headings, lists, and inline formatting — exactly like ChatGPT and Claude.ai.",
    useCases: [
      "Chat interfaces that display formatted AI responses with code blocks",
      "AI writing assistants with live markdown preview while generating",
      "Documentation generators with streaming formatted output",
      "AI coding tools where code blocks appear with syntax highlighting",
    ],
    howItWorks:
      "Parses the streaming text into markdown tokens using a streaming-safe parser, progressively renders completed blocks (headings, paragraphs, code) while buffering the current incomplete token.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "Prism.js", "marked"],
    relatedSlugs: ["ai-elements-chat", "ai-token-stream", "artifact-canvas"],
  },

  "artifact-canvas": {
    intro:
      "Build a ChatGPT Canvas or Claude Artifacts-style split-pane interface with the Vercel AI SDK and shadcn/ui. Users chat on the left while AI-generated code, documents, or HTML renders live on the right — the most-searched AI UI pattern in 2024 with zero polished open-source implementations.",
    useCases: [
      "Code generation tools with live preview of generated components",
      "Document editors where AI drafts and edits text alongside the user",
      "Interactive data apps where the AI builds dashboards in real time",
      "Learning tools where AI explains concepts with live code examples",
    ],
    howItWorks:
      "Streams the AI response into two logical channels: prose text in the chat panel and code/HTML in the canvas panel. The canvas switches between a code view and a sandboxed iframe preview.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "useChat", "sandboxed iframe"],
    relatedSlugs: ["web-preview-sandbox", "streaming-markdown-renderer", "json-render-generate"],
  },

  "ai-image-output": {
    intro:
      "Display AI-generated images with shimmer loading states, download buttons, and aspect ratio handling in a polished shadcn/ui card. This copy-paste component handles the full image generation UX — loading skeleton, error state, alt text, and one-click download — in under 100 lines.",
    useCases: [
      "Image generation features in AI creative tools and SaaS",
      "Avatar and profile image generation with polished loading UI",
      "Product visualization and mockup generation interfaces",
      "AI art generation apps with gallery and download features",
    ],
    howItWorks:
      "Shows a shimmer placeholder during generation, replaces it with the image on completion with a fade-in transition, and attaches a download handler that saves the image using the browser's native download API.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind CSS"],
    relatedSlugs: ["basics-generate-image", "ai-loading-states", "artifact-canvas"],
  },

  "structured-output-viewer": {
    intro:
      "Display Vercel AI SDK generateObject responses as an interactive, collapsible JSON tree with type-colored values. This developer-friendly component shows typed keys, string values, numbers, booleans, and nested objects in a way that's scannable and debuggable — perfect for AI apps that return structured data.",
    useCases: [
      "Debugging and testing generateObject responses during development",
      "End-user facing structured output display in AI tools",
      "API response exploration interfaces for AI-powered services",
      "Data extraction result review before downstream processing",
    ],
    howItWorks:
      "Recursively renders a JSON object with type-based color coding (sky=keys, amber=strings, green=numbers, violet=booleans) and collapsible nested nodes via a simple recursive React component.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "generateObject", "Zod"],
    relatedSlugs: ["ai-artifact-table", "examples-form-generator", "json-render-shadcn"],
  },

  "web-preview-sandbox": {
    intro:
      "Render AI-generated HTML and React code in a sandboxed iframe with live preview using the Vercel AI SDK and Next.js. The secure sandboxing prevents script injection while enabling real-time code preview — the missing piece for Claude Artifacts and ChatGPT Canvas-style interfaces.",
    useCases: [
      "Interactive code generation tools with instant HTML preview",
      "Claude Artifacts clones with full iframe sandboxing",
      "AI web design tools with real-time browser rendering",
      "Educational coding assistants with safe live code execution",
    ],
    howItWorks:
      "Injects AI-generated HTML/JS into a sandboxed iframe using srcdoc, applying a strict CSP sandbox attribute to prevent localStorage access, top-level navigation, and external script execution.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "iframe sandbox", "Content Security Policy"],
    relatedSlugs: ["artifact-canvas", "json-render-generate", "streaming-markdown-renderer"],
  },

  /* ─── Tools & Integrations ─── */

  "tool-websearch-claude": {
    intro:
      "Add real-time web search to Claude using Anthropic's built-in web search tool with the Vercel AI SDK. Give your Next.js AI app access to current information without an external search API — Anthropic's native search grounds responses in up-to-date facts and cites sources automatically.",
    useCases: [
      "Current events and news queries in AI assistants",
      "Research tools that need live data beyond training cutoffs",
      "Price comparison and product research assistants",
      "Fact-checking and source-grounded Q&A applications",
    ],
    howItWorks:
      "Passes Anthropic's web_search tool to streamText() via the Anthropic provider. Claude autonomously decides when to search, executes the query, and incorporates results with citations into its response.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Anthropic Claude", "Web Search Tool"],
    relatedSlugs: ["tool-websearch-exa", "markdown-new-scraper", "cheerio-scraper"],
  },

  "tool-websearch-exa": {
    intro:
      "Integrate Exa's neural search API with the Vercel AI SDK to give your AI app semantically accurate web search. Exa returns full page contents, not just snippets — ideal for research agents and tools that need complete context from source documents to produce high-quality answers.",
    useCases: [
      "Research agents that need full document context, not just snippets",
      "Competitor intelligence tools pulling complete webpage content",
      "Technical documentation search with full code example retrieval",
      "AI writing assistants grounded in real, complete source material",
    ],
    howItWorks:
      "Defines an Exa search function as a Vercel AI SDK tool with Zod parameter validation, calls Exa's /search endpoint with contents enabled, and returns structured results into the LLM's context.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Exa API", "Zod"],
    relatedSlugs: ["tool-websearch-claude", "tool-websearch-exa-2", "example-agent-competitor"],
  },

  "tool-websearch-exa-2": {
    intro:
      "Advanced Exa Labs search integration with the Vercel AI SDK including autoprompt optimization, domain filtering, date range constraints, and highlights extraction. This production-grade stack gives your AI research tools the precision search capabilities of serious knowledge workers.",
    useCases: [
      "Academic and scientific research agents with domain and date filters",
      "News monitoring agents targeting specific publications and topics",
      "Due diligence research requiring precise source selection",
      "SEO and content research pulling competitor articles by topic",
    ],
    howItWorks:
      "Leverages Exa's advanced search parameters (autoprompt, domains, start/end dates, num_results) via the Vercel AI SDK tool interface, with result highlighting for efficient context injection.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Exa API", "autoprompt", "Zod"],
    relatedSlugs: ["tool-websearch-exa", "tool-websearch-firecrawl", "example-agent-reddit-validation"],
  },

  "tool-websearch-firecrawl": {
    intro:
      "Scrape and search any website with Firecrawl's AI-ready web scraping API integrated as a Vercel AI SDK tool. Get clean, LLM-optimized markdown from any URL — including JavaScript-rendered pages, behind login walls, and dynamic content — without building your own scraping infrastructure.",
    useCases: [
      "Content extraction from JavaScript-heavy web applications",
      "Competitive intelligence scraping that needs authenticated access",
      "News and blog aggregation with clean markdown output",
      "Documentation and knowledge base ingestion for AI agents",
    ],
    howItWorks:
      "Defines a Firecrawl scrape tool that accepts a URL, calls Firecrawl's API to render and extract clean markdown, and returns the structured content for LLM context injection.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Firecrawl API", "Zod"],
    relatedSlugs: ["cheerio-scraper", "jina-scraper", "markdown-new-scraper"],
  },

  "cheerio-scraper": {
    intro:
      "Scrape and parse HTML from any webpage with Cheerio as a Vercel AI SDK tool in Next.js. Extract specific elements, text, links, and metadata from static websites using jQuery-style selectors — the lightweight, battle-tested approach to web data extraction for AI agents.",
    useCases: [
      "Price and availability extraction from e-commerce sites",
      "News headline and article content extraction for news agents",
      "SEO audit tools parsing page metadata and heading structure",
      "Structured data extraction from HTML tables and lists",
    ],
    howItWorks:
      "Fetches the page HTML server-side via Next.js API route, loads it into Cheerio for DOM parsing, and extracts text content using CSS selectors before passing the structured data to the LLM.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Cheerio", "node-fetch"],
    relatedSlugs: ["jina-scraper", "markdown-new-scraper", "tool-websearch-firecrawl"],
  },

  "jina-scraper": {
    intro:
      "Convert any URL to clean LLM-ready text using Jina AI's Reader API as a Vercel AI SDK tool. Jina handles JavaScript rendering, PDF extraction, and noise removal — returning clean markdown from any page in one simple API call, no HTML parsing required.",
    useCases: [
      "Quick content extraction without infrastructure setup",
      "Research agents that need clean text from arbitrary URLs",
      "AI summarization tools for articles, docs, and reports",
      "Knowledge base ingestion from diverse web sources",
    ],
    howItWorks:
      "Calls Jina's r.jina.ai reader endpoint with the target URL as a path parameter. Returns clean markdown suitable for direct injection into LLM context without further processing.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Jina AI Reader", "Zod"],
    relatedSlugs: ["cheerio-scraper", "markdown-new-scraper", "tool-websearch-firecrawl"],
  },

  "markdown-new-scraper": {
    intro:
      "Extract clean markdown from any URL for AI processing using a modern scraping approach with Vercel AI SDK tool integration. Convert web pages to LLM-optimized text that strips navigation, ads, and HTML noise — leaving only the content your agent needs to reason about.",
    useCases: [
      "Article and blog post extraction for AI summarization",
      "Documentation scraping for developer tools and knowledge agents",
      "Content auditing tools that need clean text for analysis",
      "Training data collection from curated web sources",
    ],
    howItWorks:
      "Uses a combination of fetch and HTML-to-markdown conversion to produce clean text output, applying heuristics to identify main content and remove boilerplate navigation and footer elements.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "html-to-markdown", "Zod"],
    relatedSlugs: ["cheerio-scraper", "jina-scraper", "tool-websearch-firecrawl"],
  },

  "ai-pdf-ingest": {
    intro:
      "Process and analyze PDF files with AI using the Vercel AI SDK in Next.js. Upload PDFs through the browser, extract text content server-side, and pass it to Claude or GPT-4 for summarization, Q&A, data extraction, or classification — a complete PDF AI pipeline in one stack.",
    useCases: [
      "Contract review and key clause extraction from legal documents",
      "Resume parsing and candidate evaluation for HR workflows",
      "Research paper summarization and citation extraction",
      "Invoice and receipt data extraction for accounting automation",
    ],
    howItWorks:
      "Receives the PDF as a multipart form upload, extracts text with pdf-parse server-side, chunks the content if needed for context limits, and streams the AI analysis back to the client.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "pdf-parse", "Anthropic Claude", "FormData"],
    relatedSlugs: ["basics-generate-text", "cheerio-scraper", "example-agent-data-analysis"],
  },

  /* ─── Workflows ─── */

  "ai-workflow-basic": {
    intro:
      "Build a URL analysis workflow with the Vercel AI SDK that scrapes a webpage and runs multi-step AI analysis. This beginner-friendly workflow stack demonstrates the core pattern: fetch data, process with AI, return structured insights — the foundation of every AI automation pipeline.",
    useCases: [
      "Competitive analysis tools that analyze competitor pages on demand",
      "Content quality scoring workflows for marketing teams",
      "URL-based research assistants for sales and BD teams",
      "Site monitoring agents that analyze pages for changes or issues",
    ],
    howItWorks:
      "Fetches the target URL, extracts clean text with Cheerio or Jina, runs two sequential AI passes (extract facts, then synthesize insights) using generateText(), and returns a structured report.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Cheerio", "Anthropic Claude"],
    relatedSlugs: ["cheerio-scraper", "wdk-workflows-sequential", "basics-agent"],
  },

  "wdk-workflows-sequential": {
    intro:
      "Build durable step-by-step AI workflows with guaranteed execution order using the Workflow Development Kit (WDK) with the Vercel AI SDK. Sequential workflows ensure each step completes before the next begins, with state persistence for long-running multi-step AI pipelines.",
    useCases: [
      "Content production pipelines with ordered research, draft, and edit steps",
      "Data processing workflows with dependencies between transformation stages",
      "Onboarding automation with sequential qualification and routing steps",
      "Compliance workflows where step ordering and audit trails are required",
    ],
    howItWorks:
      "Defines workflow steps as an ordered array, persists step outputs to durable storage, and resumes from the last completed step on failure — enabling reliable long-running AI pipelines.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "WDK", "Anthropic Claude"],
    relatedSlugs: ["ai-workflow-basic", "wdk-workflows-orchestrator", "ai-chat-agent-multi-step-tool-pattern"],
  },

  "wdk-workflows-evaluator": {
    intro:
      "Implement quality-gated AI workflows with an evaluator step that scores outputs and retries if they fall below threshold using the WDK and Vercel AI SDK. Guarantee output quality in production AI pipelines without manual review by building self-correcting automated workflows.",
    useCases: [
      "High-stakes content generation requiring quality assurance before delivery",
      "Data extraction pipelines with accuracy thresholds for structured fields",
      "Code generation workflows that self-test and fix until tests pass",
      "Customer communication drafting with tone and accuracy requirements",
    ],
    howItWorks:
      "After each generation step, an evaluator model scores the output against rubric criteria with generateObject(). If score < threshold, the workflow retries with the critique as additional context.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "WDK", "generateObject", "Zod"],
    relatedSlugs: ["ai-chat-agent-evaluator-optimizer-pattern", "wdk-workflows-sequential", "ai-chat-agent-multi-step-tool-pattern"],
  },

  "wdk-workflows-orchestrator": {
    intro:
      "Build managed AI orchestration workflows with task delegation, status tracking, and result aggregation using the WDK and Vercel AI SDK. A central orchestrator coordinates multiple worker tasks, handles failures gracefully, and synthesizes results into a final deliverable.",
    useCases: [
      "Report generation workflows that delegate section writing to specialist agents",
      "Data pipeline orchestration with parallel collection and sequential processing",
      "Multi-model comparison workflows with coordinated evaluation",
      "Enterprise automation with task assignment, monitoring, and completion tracking",
    ],
    howItWorks:
      "The orchestrator step plans tasks with generateObject(), dispatches each to worker functions, aggregates results as they complete, and synthesizes a final output when all workers finish.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "WDK", "Anthropic Claude", "Promise.all"],
    relatedSlugs: ["ai-chat-agent-orchestrator-pattern", "wdk-workflows-parallel", "wdk-workflows-sequential"],
  },

  "wdk-workflows-parallel": {
    intro:
      "Execute multiple AI workflow branches simultaneously with the WDK and Vercel AI SDK for maximum throughput. Run independent analysis tasks, content variations, or data processing steps in parallel, reducing total workflow time from the sum to the max of individual step durations.",
    useCases: [
      "Multi-angle content review (tone, accuracy, SEO, readability) in parallel",
      "Research pipelines querying multiple sources concurrently",
      "A/B content generation with multiple parallel variants",
      "Batch document processing with concurrent per-document pipelines",
    ],
    howItWorks:
      "Defines parallel workflow branches that fan out from a single trigger, executes them concurrently via Promise.all within the WDK runtime, then collects results for the aggregation step.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "WDK", "Promise.all", "Anthropic Claude"],
    relatedSlugs: ["ai-agents-parallel-processing", "wdk-workflows-orchestrator", "wdk-workflows-sequential"],
  },

  "wdk-workflows-routing": {
    intro:
      "Build dynamic path-routing AI workflows with the WDK and Vercel AI SDK where the path through the workflow is determined at runtime by an LLM classifier. Different input types take different workflow paths, enabling adaptive multi-track pipelines that handle complex input variety.",
    useCases: [
      "Support ticket routing that determines priority, team, and response template",
      "Content processing that routes articles, social posts, and emails differently",
      "Lead qualification workflows that branch by industry, size, or intent",
      "Document processing that adapts based on document type and content",
    ],
    howItWorks:
      "A routing step uses generateObject() to classify the input and select a branch key. The WDK runtime executes only the matching branch, with each branch optimized for its specific input type.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "WDK", "generateObject", "Zod"],
    relatedSlugs: ["ai-agents-routing", "wdk-workflows-orchestrator", "wdk-workflows-sequential"],
  },

  "ai-sdk-prompt-few-shot": {
    intro:
      "Build few-shot prompt engineering workflows with the Vercel AI SDK where example-guided prompts dramatically improve output quality. This pattern lets you curate and manage example pairs that train the model on your specific task format without fine-tuning.",
    useCases: [
      "Consistent brand voice for AI-generated marketing copy",
      "Domain-specific formatting for technical or legal document generation",
      "Custom classification labels trained from your own examples",
      "Style matching for content that needs to sound like specific authors or brands",
    ],
    howItWorks:
      "Constructs prompts with curated input-output example pairs in the user/assistant message sequence before the actual query. The model infers the pattern from examples and applies it to new inputs.",
    techStack: ["Vercel AI SDK", "Next.js", "TypeScript", "Anthropic Claude", "OpenAI GPT-4"],
    relatedSlugs: ["basics-generate-text", "ai-chat-agent-evaluator-optimizer-pattern", "basics-agent"],
  },

  /* ─── Chat UI Elements ─── */

  "ai-elements-chat": {
    intro:
      "A complete AI chat interface built with the Vercel AI SDK's useChat hook, shadcn/ui, and Next.js. Includes streaming messages, user/assistant message bubbles, scroll-to-bottom behavior, and loading states — the essential starting point for any conversational AI application.",
    useCases: [
      "Customer support chatbots embedded in product dashboards",
      "AI writing and brainstorming assistants with conversation history",
      "Internal team knowledge bots with chat-style interaction",
      "Developer tools with conversational code generation interfaces",
    ],
    howItWorks:
      "Uses the useChat hook from ai/react to manage message state and streaming. The Route Handler at /api/chat calls streamText() and pipes the response stream back to the client via the AI SDK's data stream protocol.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "useChat", "shadcn/ui"],
    relatedSlugs: ["ai-elements-reasoning-chat", "streaming-markdown-renderer", "ai-loading-states"],
  },

  "chat-gpt": {
    intro:
      "A pixel-perfect ChatGPT interface clone built with the Vercel AI SDK, Next.js, and shadcn/ui. Replicates the two-panel layout with sidebar conversation history, centered chat area, markdown rendering, code blocks with copy buttons, and the characteristic OpenAI visual design system.",
    useCases: [
      "White-label ChatGPT-style products for specific verticals",
      "Internal AI tools that users already know how to use (familiar UX)",
      "ChatGPT-powered SaaS products with custom system prompts",
      "Developer portfolios demonstrating AI application development",
    ],
    howItWorks:
      "Mirrors ChatGPT's layout with a fixed left sidebar (conversation list), main chat area with centered max-width, and bottom input — all driven by useChat with streaming markdown rendering.",
    techStack: ["Vercel AI SDK", "Next.js", "shadcn/ui", "TypeScript", "useChat", "OpenAI"],
    relatedSlugs: ["chat-claude", "ai-elements-chat", "conversation-history-sidebar"],
  },

  "chat-claude": {
    intro:
      "A Claude.ai-inspired chat interface built with the Vercel AI SDK, Next.js, and shadcn/ui. Features Anthropic's signature clean aesthetic with artifact panels, long-context indicators, model selector, and the thoughtful information hierarchy that makes Claude.ai feel distinctly premium.",
    useCases: [
      "Anthropic-powered SaaS products with Claude's native look and feel",
      "Enterprise AI assistants with the trusted Claude aesthetic",
      "Long-form writing assistants with Claude's document-centric UX",
      "Research and analysis tools matching Claude.ai's interface patterns",
    ],
    howItWorks:
      "Implements Claude.ai's layout with a content-focused main panel, right-side artifact drawer, and top model/context controls, all driven by useChat with Anthropic's streaming provider.",
    techStack: ["Vercel AI SDK", "Next.js", "shadcn/ui", "TypeScript", "Anthropic Claude", "useChat"],
    relatedSlugs: ["chat-gpt", "artifact-canvas", "ai-elements-reasoning-chat"],
  },

  "chat-grok": {
    intro:
      "A Grok-inspired chat interface built with the Vercel AI SDK and shadcn/ui, featuring xAI's dark-first aesthetic with high-density information display and real-time web search integration. Build AI products that tap into the Grok audience with a familiar interface.",
    useCases: [
      "Real-time information products with live web search integration",
      "Dark-themed AI tools targeting developer and power-user audiences",
      "Social media and trending topics analysis interfaces",
      "High-density information tools requiring compact message display",
    ],
    howItWorks:
      "Implements xAI's dark aesthetic with tight message density, web search tool integration, and real-time results display. Uses useChat with a web search tool definition for grounded responses.",
    techStack: ["Vercel AI SDK", "Next.js", "shadcn/ui", "TypeScript", "xAI Grok", "useChat"],
    relatedSlugs: ["chat-gpt", "tool-websearch-claude", "ai-elements-chat"],
  },

  "ai-elements-reasoning-chat": {
    intro:
      "Display AI reasoning chains and thinking steps in your chat interface using the Vercel AI SDK with Claude's extended thinking or OpenAI's o1/o3 models. Users see the model's step-by-step reasoning in a collapsible panel before the final answer — building trust and transparency in AI responses.",
    useCases: [
      "Complex problem-solving tools where users need to verify the reasoning",
      "Educational AI tutors that show working, not just answers",
      "Decision support tools requiring auditable AI reasoning",
      "Research assistants with transparent chain-of-thought display",
    ],
    howItWorks:
      "Streams reasoning tokens separately from response tokens using the AI SDK's reasoning parts. Reasoning is rendered in a collapsible aside that users can expand to inspect the model's thinking.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "Anthropic Claude Thinking", "OpenAI o1"],
    relatedSlugs: ["ai-elements-chat", "ai-elements-sources-chat", "ai-elements-plan"],
  },

  "ai-elements-sources-chat": {
    intro:
      "Display source citations and reference cards in AI chat responses using the Vercel AI SDK with web search tools. When the AI cites web sources, users see inline reference numbers that expand to full source cards — the citation UX pattern from Perplexity and Bing Copilot.",
    useCases: [
      "Research and Q&A tools where source credibility matters",
      "Fact-checking assistants with verifiable reference links",
      "Knowledge management tools with authoritative source attribution",
      "News and current events assistants with clickable source cards",
    ],
    howItWorks:
      "Parses the streaming response for citation markers, renders numbered superscript links inline, and shows a source cards footer with title, URL, and snippet for each cited reference.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "Web Search Tool", "useChat"],
    relatedSlugs: ["ai-elements-reasoning-chat", "tool-websearch-claude", "ai-elements-chat"],
  },

  "ai-elements-inline-citation": {
    intro:
      "Add inline citation superscripts to AI responses that expand to source popups on hover using the Vercel AI SDK and Radix Tooltip. A faithful Perplexity-style citation UX that keeps the response readable while giving users instant access to source verification.",
    useCases: [
      "Academic and research-grade AI tools with citation requirements",
      "Medical or legal AI assistants needing verifiable source links",
      "Fact-checking interfaces with hover-to-verify source context",
      "Grounded content generation tools with attribution requirements",
    ],
    howItWorks:
      "Post-processes the LLM response to find citation patterns, replaces them with Tooltip-wrapped superscript components that show source title and URL on hover without leaving the chat.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "Radix Tooltip", "useChat"],
    relatedSlugs: ["ai-elements-sources-chat", "ai-elements-reasoning-chat", "ai-elements-chat"],
  },

  "ai-elements-plan": {
    intro:
      "Render AI-generated step-by-step plans as interactive task lists in your chat interface using the Vercel AI SDK's generateObject. When the AI produces a structured plan, users see a visual checklist that tracks progress as the agent executes each step — from planning through completion.",
    useCases: [
      "Project planning assistants that show execution roadmaps",
      "Agentic task runners that visualize their action plan before executing",
      "Workflow builders where users review and approve the plan first",
      "Tutorial generators with step-by-step progress tracking",
    ],
    howItWorks:
      "The agent generates a plan via generateObject() with a steps array schema. The UI renders each step as a task item with a status indicator that updates as the agent progresses through execution.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "generateObject", "useChat"],
    relatedSlugs: ["ai-elements-confirmation", "ai-elements-queue", "ai-human-in-the-loop"],
  },

  "ai-elements-confirmation": {
    intro:
      "Add inline tool approval cards to your AI chat interface with the Vercel AI SDK — users confirm or cancel agent actions directly in the message thread. This human-in-the-loop UI pattern is essential for any AI that takes real-world actions like sending emails, creating records, or modifying data.",
    useCases: [
      "AI assistants that send emails, schedule meetings, or post to social media",
      "Database-modifying agents that need explicit write confirmation",
      "Financial applications where AI-suggested transactions need approval",
      "Workflow automation with human checkpoints at critical decision points",
    ],
    howItWorks:
      "When the agent calls a tool requiring approval, a confirmation card renders in the chat with action details and Approve/Cancel buttons. The agent's execution pauses until the user responds.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "useChat", "shadcn/ui"],
    relatedSlugs: ["ai-human-in-the-loop", "ai-elements-plan", "ai-chat-agent-tool-approval"],
  },

  "ai-elements-queue": {
    intro:
      "Visualize agent task queues and parallel execution status in your chat UI using the Vercel AI SDK. Users see all queued tasks, their running status, and completion — giving transparency into complex multi-step agent operations and reducing uncertainty during long AI runs.",
    useCases: [
      "Long-running research agents with multiple parallel subtasks",
      "Batch processing tools where users need to track progress",
      "Orchestration UIs showing which worker agents are active",
      "AI workflow tools with visual execution monitoring",
    ],
    howItWorks:
      "Maintains a task queue state array updated via streaming data events. Each task item shows its status (queued/running/done/error) with an animated indicator, updating in real-time via useChat data streams.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "useChat", "motion/react"],
    relatedSlugs: ["ai-elements-plan", "ai-agents-parallel-processing", "ai-chat-agent-orchestrator-pattern"],
  },

  "ai-prompt-input": {
    intro:
      "A production-ready AI chat input component built with shadcn/ui featuring auto-growing textarea, file attachment tray, keyboard shortcuts (Enter to send, Shift+Enter for newline), and send/stop controls. The same input behavior used by ChatGPT, Claude.ai, and every major AI product.",
    useCases: [
      "Primary text input in any AI chat or assistant application",
      "Multi-modal input with file and image attachment support",
      "Code input with proper newline handling and keyboard shortcuts",
      "Mobile-optimized touch-friendly chat inputs",
    ],
    howItWorks:
      "A textarea that auto-resizes via scrollHeight, constrained to a min/max height range. Manages send state, loading state, and file attachment state independently with proper focus and keyboard event handling.",
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind CSS"],
    relatedSlugs: ["voice-input-button", "prompt-suggestion-pills", "ai-elements-chat"],
  },

  "voice-input-button": {
    intro:
      "A mic button React component with four recording states (idle, listening, processing, done), animated waveform bars, and transcript reveal using the Web Speech API or Vercel AI SDK transcribe. Drop it into any AI chat input for instant voice-to-text input capability.",
    useCases: [
      "Voice input for AI chat interfaces on mobile and desktop",
      "Hands-free input for accessibility or hands-busy workflows",
      "Audio note-taking apps with AI transcription and processing",
      "Voice command interfaces for AI tools and automation",
    ],
    howItWorks:
      "Uses the MediaRecorder API to capture mic audio, posts the recorded blob to a Next.js API route that calls transcribe(), and returns the text to the UI where it populates the chat input.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "Web Speech API", "MediaRecorder"],
    relatedSlugs: ["basics-transcribe", "ai-prompt-input", "ai-loading-states"],
  },

  "model-selector": {
    intro:
      "A searchable command-palette model picker for AI applications built with shadcn/ui, grouped by provider (Anthropic, OpenAI, Google) with model metadata like context length and pricing. Switch models in your AI app without a clunky dropdown — the same experience as Claude.ai and ChatGPT Plus.",
    useCases: [
      "Multi-model AI tools where users choose their preferred LLM",
      "Developer tools exposing model selection with capability metadata",
      "Cost-optimized apps where users pick cheap vs powerful models",
      "AI playgrounds and testing tools comparing model outputs",
    ],
    howItWorks:
      "Renders a shadcn/ui Command component with model groups, filters by name on keystroke, shows context window and pricing tags per model, and fires onChange with the selected model ID for useChat or streamText.",
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Vercel AI SDK", "Radix Popover"],
    relatedSlugs: ["ai-elements-chat", "token-counter", "ai-prompt-input"],
  },

  "token-counter": {
    intro:
      "A real-time context window usage meter with a circular SVG progress ring, color-coded urgency states (green → amber → red), and per-model token limits built for Vercel AI SDK apps. Users always know how much context remains before the LLM runs out of memory — a must-have for long conversations.",
    useCases: [
      "Long-context chat interfaces where users paste large documents",
      "Coding assistants that load file contents into context",
      "Research tools with multi-document context assembly",
      "Any AI app where users need visibility into context consumption",
    ],
    howItWorks:
      "Estimates token count from character count (chars/4 heuristic) or exact token data from the AI SDK response, renders an SVG circle with dasharray-based fill, and changes color class at 75% and 90% thresholds.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "shadcn/ui", "SVG"],
    relatedSlugs: ["model-selector", "ai-prompt-input", "ai-elements-chat"],
  },

  "prompt-suggestion-pills": {
    intro:
      "Clickable prompt suggestion chips for the empty state of AI chat applications built with shadcn/ui and motion/react. Displays a 2×2 grid of suggested conversation starters that fill the input on click — the same UX pattern that reduces abandonment in ChatGPT, Gemini, and Claude.ai.",
    useCases: [
      "Empty state onboarding for new users discovering AI capabilities",
      "Contextual task suggestions in domain-specific AI tools",
      "Quick action chips for common workflows in AI assistants",
      "Interactive demos that guide users toward the best use cases",
    ],
    howItWorks:
      "Renders a responsive grid of suggestion cards that animate in on mount. Each card has a title, subtitle, and full prompt string. On click, the full prompt populates the chat input and focuses it for immediate submission.",
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "motion/react", "Tailwind CSS"],
    relatedSlugs: ["ai-prompt-input", "ai-elements-chat", "ai-loading-states"],
  },

  "multimodal-file-upload": {
    intro:
      "A drag-and-drop file and image attachment tray for AI chat built with shadcn/ui and the Vercel AI SDK's multimodal message support. Users attach images, PDFs, and documents that get encoded and sent to vision-capable models — enabling true multimodal AI conversations in your Next.js app.",
    useCases: [
      "Image analysis and visual Q&A features in AI assistants",
      "Document review tools with PDF and file upload support",
      "Receipt and invoice processing with photo capture",
      "Code review with screenshot and diagram attachment support",
    ],
    howItWorks:
      "Manages a file list in local state, previews images with createObjectURL, encodes files as base64 for multimodal message parts, and passes them to useChat's handleSubmit with the experimental_attachments option.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "useChat", "File API"],
    relatedSlugs: ["ai-prompt-input", "ai-pdf-ingest", "ai-elements-chat"],
  },

  "conversation-history-sidebar": {
    intro:
      "A conversation list sidebar component for AI chat apps with date grouping (Today, Yesterday, Last 7 days), search filtering, and active conversation highlighting — built with shadcn/ui and motion/react. The standard left panel pattern from ChatGPT, Claude.ai, and every successful AI product.",
    useCases: [
      "Full chat applications with persistent conversation history",
      "AI tools where users return to previous sessions",
      "Customer service platforms with conversation timeline management",
      "AI writing assistants with draft history and session navigation",
    ],
    howItWorks:
      "Groups sorted conversations by recency date bucket, renders them in a scrollable sidebar with a search input that filters by title. Active conversation has a highlighted background with a motion layoutId transition.",
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "motion/react", "Tailwind CSS"],
    relatedSlugs: ["ai-elements-chat", "examples-chat-base-clone", "chat-gpt"],
  },

  "message-branch-navigator": {
    intro:
      "Navigate between alternative AI responses in a chat interface using prev/next controls and branch indicators — the regeneration history UX from ChatGPT and Claude.ai. Users can explore different model outputs for the same prompt without losing any generated content.",
    useCases: [
      "AI writing tools where users want to compare output variations",
      "Creative generation tools exploring different tones and styles",
      "Chat interfaces where the 'Regenerate' button needs persistent history",
      "A/B testing AI outputs within the conversation interface",
    ],
    howItWorks:
      "Maintains an array of response alternatives per message turn. Left/right nav buttons cycle through the array with a smooth cross-fade animation, showing the current branch index and total count.",
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "motion/react", "useChat"],
    relatedSlugs: ["ai-elements-chat", "ai-elements-reasoning-chat", "streaming-markdown-renderer"],
  },

  "ai-loading-states": {
    intro:
      "A collection of four AI-specific loading animations built with Tailwind CSS and motion/react: Wave Dots (ellipse matrix), Pulsing Orb (breathing glow), Shimmer (skeleton bar sweep), and Typing Indicator (bouncing dots). Drop-in loading states that match the energy and feel of modern AI applications.",
    useCases: [
      "AI response loading indicators in chat interfaces",
      "Skeleton states while AI-generated content is being fetched",
      "Processing feedback during long AI workflow executions",
      "Onboarding animations for AI feature introductions",
    ],
    howItWorks:
      "Each animation is a pure CSS/motion component with no external dependencies. Wave Dots staggers opacity and scale, Orb uses CSS pulse keyframes, Shimmer animates a gradient via transform, and Typing uses staggered translateY.",
    techStack: ["Next.js", "React", "TypeScript", "motion/react", "Tailwind CSS", "shadcn/ui"],
    relatedSlugs: ["ai-token-stream", "streaming-markdown-renderer", "ai-elements-chat"],
  },

  "ai-token-stream": {
    intro:
      "Animate AI-generated text with a smooth token-by-token reveal effect using motion/react and the Vercel AI SDK. Each word fades and slides in sequentially, giving streaming LLM output a polished typewriter feel that signals intelligence and keeps users engaged while waiting for responses.",
    useCases: [
      "Premium AI product interfaces where animation quality signals quality",
      "Marketing and demo pages showcasing AI generation capabilities",
      "AI writing tools with animated output that emphasizes the generation process",
      "Notification and summary features with animated text reveals",
    ],
    howItWorks:
      "Splits the streaming text into word tokens, wraps each in a motion.span with staggered entrance animation (opacity 0→1, y 4→0), and adds new tokens progressively as the AI SDK stream delivers them.",
    techStack: ["Vercel AI SDK", "Next.js", "React", "TypeScript", "motion/react", "useStreamableValue"],
    relatedSlugs: ["streaming-markdown-renderer", "ai-loading-states", "basics-stream-text"],
  },

  /* ─── Marketing UI ─── */

  "marketing-feature-code-block-1": {
    intro:
      "A feature section with a live syntax-highlighted code block and descriptive text for AI SDK marketing pages, built with shadcn/ui and Tailwind CSS. Shows developers exactly what the API looks like before they sign up — the conversion-optimized pattern used on Vercel, Stripe, and Linear landing pages.",
    useCases: [
      "Landing pages for developer tools with API code examples",
      "AI SDK pricing or feature pages with implementation previews",
      "Developer documentation highlights with interactive code samples",
      "Product hunt launches needing a quick, credible technical showcase",
    ],
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind CSS", "Prism.js"],
    relatedSlugs: ["marketing-feature-code-block-2", "marketing-feature-grid-1", "marketing-bento-1"],
  },

  "marketing-feature-code-block-2": {
    intro:
      "An alternative feature code block layout with a split left-text / right-code arrangement and animated token stream for AI product marketing pages. The streaming code animation demonstrates the real-time capabilities of your AI product in a way that static screenshots can't convey.",
    useCases: [
      "Feature highlights for streaming AI products with live demos",
      "Hero sections that show real API output as the differentiator",
      "Comparison pages contrasting before/after with live code examples",
      "Conference and demo mode landing pages with animated showcases",
    ],
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind CSS", "motion/react"],
    relatedSlugs: ["marketing-feature-code-block-1", "marketing-feature-code-block-3", "marketing-bento-1"],
  },

  "marketing-feature-code-block-3": {
    intro:
      "A dark-themed terminal-style code showcase block for AI SDK product pages with syntax highlighting, file tabs, and line numbers. The dark aesthetic appeals to developer audiences and creates strong visual contrast against standard light marketing page sections.",
    useCases: [
      "Developer-focused SaaS marketing with terminal aesthetic appeal",
      "Dark mode landing pages for AI developer tools",
      "SDK documentation pages with embedded working examples",
      "Technical blog posts with featured code implementations",
    ],
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind CSS"],
    relatedSlugs: ["marketing-feature-code-block-1", "marketing-feature-code-block-2", "marketing-feature-grid-1"],
  },

  "marketing-feature-grid-1": {
    intro:
      "A responsive feature grid section for AI SaaS marketing pages with icon, title, and description cards built with shadcn/ui. Communicates up to 6 key product capabilities at a glance — the standard pattern for AI product feature sections that converts visitors into trial signups.",
    useCases: [
      "Above-the-fold feature overview sections on AI product landing pages",
      "Pricing page feature comparison for different plan tiers",
      "Onboarding screens that orient new users to product capabilities",
      "App store screenshots showing key features in a grid",
    ],
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind CSS", "Lucide Icons"],
    relatedSlugs: ["marketing-bento-1", "marketing-feature-code-block-1", "marketing-integrations-1"],
  },

  "marketing-bento-1": {
    intro:
      "A bento grid layout for AI product marketing pages featuring large and small cells that showcase different features with varied visual weight, built with shadcn/ui and Tailwind CSS. The bento aesthetic from Apple and Linear communicates sophistication and is optimized for high-converting hero sections.",
    useCases: [
      "Hero section alternatives that show multiple features without overwhelming",
      "Product launch pages with visual hierarchy and feature spotlights",
      "AI capability showcases with varied card sizes for visual rhythm",
      "Press kit and media pages with a polished product showcase",
    ],
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind CSS", "CSS Grid"],
    relatedSlugs: ["marketing-feature-grid-1", "marketing-feature-code-block-1", "marketing-integrations-1"],
  },

  "marketing-model-comparison": {
    intro:
      "A side-by-side AI model comparison component for marketing and documentation pages that shows model capabilities, pricing, context length, and performance benchmarks. Help users choose the right model for their use case with a clean, scannable comparison layout.",
    useCases: [
      "AI product pages comparing plans or model tiers",
      "Model selection guides for developer documentation",
      "Pricing pages with feature differentiation across tiers",
      "Technical decision guides helping developers pick the right LLM",
    ],
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind CSS"],
    relatedSlugs: ["marketing-model-comparison-compact", "marketing-model-comparison-table-1", "model-selector"],
  },

  "marketing-model-comparison-compact": {
    intro:
      "A compact inline model comparison component for documentation sidebars and product pages where space is limited. Displays key model differentiators in a dense, scannable format without consuming excessive vertical space — ideal for comparison within longer content pages.",
    useCases: [
      "Sidebar widgets on documentation pages linking to model guides",
      "Inline comparison cards within blog posts and tutorials",
      "Mobile-optimized model selection guidance",
      "Quick reference cards embedded in the app UI",
    ],
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind CSS"],
    relatedSlugs: ["marketing-model-comparison", "marketing-model-comparison-table-1", "model-selector"],
  },

  "marketing-model-comparison-table-1": {
    intro:
      "A full-width model comparison table for AI product documentation with checkmarks, pricing, context lengths, and capability flags in a sortable table layout. The enterprise-friendly comparison format that buyers expect before committing to an AI platform or provider.",
    useCases: [
      "Enterprise sales pages with detailed technical comparison",
      "Documentation pages comparing model tiers in detail",
      "Pricing pages where features are compared across plans",
      "Analyst and procurement documentation for AI platform selection",
    ],
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind CSS", "TanStack Table"],
    relatedSlugs: ["marketing-model-comparison", "marketing-model-comparison-compact", "ai-artifact-table"],
  },

  "marketing-integrations-1": {
    intro:
      "An integration showcase grid displaying partner logos, names, and categories for AI product marketing pages. Communicate ecosystem breadth and technology credibility at a glance — the partner logos section used by every successful developer tool to signal market adoption.",
    useCases: [
      "Landing pages showcasing AI model provider integrations",
      "Marketplace pages listing supported tools and platforms",
      "Partner pages for API products showing integration breadth",
      "Documentation hub index showing all supported technologies",
    ],
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind CSS"],
    relatedSlugs: ["marketing-integrations-2", "marketing-feature-grid-1", "marketing-bento-1"],
  },

  "marketing-integrations-2": {
    intro:
      "A circular orbit integration layout with animated rotation for AI product hero sections. Partner logos orbit a central product logo in a visually distinctive pattern that communicates ecosystem connectivity — a premium alternative to static logo grids for high-impact marketing sections.",
    useCases: [
      "Hero sections for AI platforms with rich integration ecosystems",
      "Animated product launch pages with ecosystem storytelling",
      "Interactive showcase sections that reward visitor attention",
      "Conference demos and keynote backgrounds with live animation",
    ],
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "motion/react", "Tailwind CSS"],
    relatedSlugs: ["marketing-integrations-1", "marketing-bento-1", "marketing-feature-grid-1"],
  },

  "marketing-calculator-agent-roi": {
    intro:
      "An AI-powered ROI calculator for AI automation products that estimates cost savings, hours recovered, and payback period from user-entered parameters. Interactive, instant, and highly persuasive — the type of conversion tool that moves prospects from interest to pipeline.",
    useCases: [
      "Sales pages for AI automation products with ROI-first positioning",
      "Lead generation forms that personalize value propositions",
      "Pricing page supporting material that justifies plan costs",
      "Trial conversion pages that show value before signup",
    ],
    howItWorks:
      "Takes user inputs (team size, hours saved per week, hourly rate) and computes savings, ROI percentage, and payback timeline client-side with reactive state. An AI agent can also generate narrative commentary on the results.",
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind CSS", "Vercel AI SDK"],
    relatedSlugs: ["marketing-feature-grid-1", "marketing-model-comparison", "basics-generate-text"],
  },

  "marketing-changelog-1": {
    intro:
      "A product changelog component for AI SaaS marketing and documentation sites with timeline layout, version badges, date display, and categorized feature entries. Keep your users informed of updates with a visually polished release notes display that doubles as a trust signal for new visitors.",
    useCases: [
      "Public changelog pages for AI products and APIs",
      "In-app 'What's New' panels for SaaS products",
      "Documentation version history with feature links",
      "Email digest layout for product update announcements",
    ],
    techStack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind CSS"],
    relatedSlugs: ["marketing-feature-grid-1", "marketing-bento-1", "marketing-integrations-1"],
  },
}
