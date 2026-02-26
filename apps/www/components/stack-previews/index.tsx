"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

/* ─── Lazy-loaded preview components ─── */

const GenerateTextPreview = dynamic(() => import("./basics").then((m) => ({ default: m.GenerateTextPreview })))
const StreamTextPreview = dynamic(() => import("./basics").then((m) => ({ default: m.StreamTextPreview })))
const GenerateImagePreview = dynamic(() => import("./basics").then((m) => ({ default: m.GenerateImagePreview })))
const GenerateSpeechPreview = dynamic(() => import("./basics").then((m) => ({ default: m.GenerateSpeechPreview })))
const TranscribePreview = dynamic(() => import("./basics").then((m) => ({ default: m.TranscribePreview })))
const ToolCallingPreview = dynamic(() => import("./basics").then((m) => ({ default: m.ToolCallingPreview })))
const AgentSetupPreview = dynamic(() => import("./basics").then((m) => ({ default: m.AgentSetupPreview })))

const BasicChatPreview = dynamic(() => import("./chat").then((m) => ({ default: m.BasicChatPreview })))
const ReasoningChatPreview = dynamic(() => import("./chat").then((m) => ({ default: m.ReasoningChatPreview })))
const SourcesChatPreview = dynamic(() => import("./chat").then((m) => ({ default: m.SourcesChatPreview })))
const PlanDisplayPreview = dynamic(() => import("./chat").then((m) => ({ default: m.PlanDisplayPreview })))
const ToolApprovalPreview = dynamic(() => import("./chat").then((m) => ({ default: m.ToolApprovalPreview })))
const QueueDisplayPreview = dynamic(() => import("./chat").then((m) => ({ default: m.QueueDisplayPreview })))

const RoutingPatternPreview = dynamic(() => import("./agents").then((m) => ({ default: m.RoutingPatternPreview })))
const ParallelProcessingPreview = dynamic(() => import("./agents").then((m) => ({ default: m.ParallelProcessingPreview })))
const HumanInTheLoopPreview = dynamic(() => import("./agents").then((m) => ({ default: m.HumanInTheLoopPreview })))
const URLAnalysisPreview = dynamic(() => import("./agents").then((m) => ({ default: m.URLAnalysisPreview })))

const ClaudeWebSearchPreview = dynamic(() => import("./tools").then((m) => ({ default: m.ClaudeWebSearchPreview })))
const ExaWebSearchPreview = dynamic(() => import("./tools").then((m) => ({ default: m.ExaWebSearchPreview })))
const CheerioScraperPreview = dynamic(() => import("./tools").then((m) => ({ default: m.CheerioScraperPreview })))
const JinaScraperPreview = dynamic(() => import("./tools").then((m) => ({ default: m.JinaScraperPreview })))
const MarkdownScraperPreview = dynamic(() => import("./tools").then((m) => ({ default: m.MarkdownScraperPreview })))
const PDFAnalysisPreview = dynamic(() => import("./tools").then((m) => ({ default: m.PDFAnalysisPreview })))

const TableEditorPreview = dynamic(() => import("./artifacts").then((m) => ({ default: m.TableEditorPreview })))
const ChartGenerationPreview = dynamic(() => import("./artifacts").then((m) => ({ default: m.ChartGenerationPreview })))

const CodeBlock1Preview = dynamic(() => import("./marketing").then((m) => ({ default: m.CodeBlock1Preview })))
const CodeBlock2Preview = dynamic(() => import("./marketing").then((m) => ({ default: m.CodeBlock2Preview })))
const CodeBlock3Preview = dynamic(() => import("./marketing").then((m) => ({ default: m.CodeBlock3Preview })))
const FeatureGridPreview = dynamic(() => import("./marketing").then((m) => ({ default: m.FeatureGridPreview })))
const BentoLayoutPreview = dynamic(() => import("./marketing").then((m) => ({ default: m.BentoLayoutPreview })))

const ArtifactCanvasPreview = dynamic(() => import("./ui-primitives").then((m) => ({ default: m.ArtifactCanvasPreview })))
const VoiceInputPreview = dynamic(() => import("./ui-primitives").then((m) => ({ default: m.VoiceInputPreview })))
const StreamingMarkdownPreview = dynamic(() => import("./ui-primitives").then((m) => ({ default: m.StreamingMarkdownPreview })))
const ModelSelectorPreview = dynamic(() => import("./ui-primitives").then((m) => ({ default: m.ModelSelectorPreview })))
const PromptSuggestionsPreview = dynamic(() => import("./ui-primitives").then((m) => ({ default: m.PromptSuggestionsPreview })))
const TokenCounterPreview = dynamic(() => import("./ui-primitives").then((m) => ({ default: m.TokenCounterPreview })))
const AILoadingStatesPreview = dynamic(() => import("./ui-primitives").then((m) => ({ default: m.AILoadingStatesPreview })))
const StructuredOutputPreview = dynamic(() => import("./ui-primitives").then((m) => ({ default: m.StructuredOutputPreview })))
const AIImageOutputPreview = dynamic(() => import("./ui-primitives").then((m) => ({ default: m.AIImageOutputPreview })))

/* ─── Registry: slug → component ─── */

export const stackPreviewRegistry: Record<string, ComponentType> = {
  // Getting Started
  "basics-generate-text": GenerateTextPreview,
  "basics-stream-text": StreamTextPreview,
  "basics-generate-image": GenerateImagePreview,
  "basics-generate-speech": GenerateSpeechPreview,
  "basics-transcribe": TranscribePreview,
  "basics-tool": ToolCallingPreview,
  "basics-agent": AgentSetupPreview,

  // Chat & Conversations
  "ai-elements-chat": BasicChatPreview,
  "ai-elements-reasoning-chat": ReasoningChatPreview,
  "ai-elements-sources-chat": SourcesChatPreview,
  "ai-elements-plan": PlanDisplayPreview,
  "ai-elements-confirmation": ToolApprovalPreview,
  "ai-elements-queue": QueueDisplayPreview,

  // Agents & Orchestration
  "ai-agents-routing": RoutingPatternPreview,
  "ai-agents-parallel-processing": ParallelProcessingPreview,

  // Human in the Loop
  "ai-human-in-the-loop": HumanInTheLoopPreview,

  // Tools & Integrations
  "tool-websearch-claude": ClaudeWebSearchPreview,
  "tool-websearch-exa": ExaWebSearchPreview,
  "cheerio-scraper": CheerioScraperPreview,
  "jina-scraper": JinaScraperPreview,
  "markdown-new-scraper": MarkdownScraperPreview,
  "ai-pdf-ingest": PDFAnalysisPreview,

  // Workflows & Pipelines
  "ai-workflow-basic": URLAnalysisPreview,

  // Artifacts & Generation
  "ai-artifact-table": TableEditorPreview,
  "ai-artifact-chart": ChartGenerationPreview,

  // Marketing & Landing
  "marketing-feature-code-block-1": CodeBlock1Preview,
  "marketing-feature-code-block-2": CodeBlock2Preview,
  "marketing-feature-code-block-3": CodeBlock3Preview,
  "marketing-feature-grid-1": FeatureGridPreview,
  "marketing-bento-1": BentoLayoutPreview,

  // AI UI Primitives
  "artifact-canvas": ArtifactCanvasPreview,
  "voice-input-button": VoiceInputPreview,
  "streaming-markdown-renderer": StreamingMarkdownPreview,
  "model-selector": ModelSelectorPreview,
  "prompt-suggestion-pills": PromptSuggestionsPreview,
  "token-counter": TokenCounterPreview,
  "ai-loading-states": AILoadingStatesPreview,
  "structured-output-viewer": StructuredOutputPreview,
  "ai-image-output": AIImageOutputPreview,
}
