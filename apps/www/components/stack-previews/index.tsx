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
const GenerateTextMultiModelPreview = dynamic(() => import("./basics").then((m) => ({ default: m.GenerateTextMultiModelPreview })))
const GenerateTextPromptPreview = dynamic(() => import("./basics").then((m) => ({ default: m.GenerateTextPromptPreview })))

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

/* ─── Pro: Agent Architecture ─── */
const OrchestratorPatternPreview = dynamic(() => import("./pro-agents").then((m) => ({ default: m.OrchestratorPatternPreview })))
const SubAgentOrchestratorPreview = dynamic(() => import("./pro-agents").then((m) => ({ default: m.SubAgentOrchestratorPreview })))
const AgentToolApprovalPreview = dynamic(() => import("./pro-agents").then((m) => ({ default: m.AgentToolApprovalPreview })))
const EvaluatorOptimizerPreview = dynamic(() => import("./pro-agents").then((m) => ({ default: m.EvaluatorOptimizerPreview })))
const MultiStepToolPreview = dynamic(() => import("./pro-agents").then((m) => ({ default: m.MultiStepToolPreview })))
const AgenticContextBuilderPreview = dynamic(() => import("./pro-agents").then((m) => ({ default: m.AgenticContextBuilderPreview })))
const InquireMultipleChoicePreview = dynamic(() => import("./pro-agents").then((m) => ({ default: m.InquireMultipleChoicePreview })))
const InquireTextPreview = dynamic(() => import("./pro-agents").then((m) => ({ default: m.InquireTextPreview })))

/* ─── Pro: Chat Kit ─── */
const ChatGPTPreview = dynamic(() => import("./pro-chat").then((m) => ({ default: m.ChatGPTPreview })))
const ChatClaudePreview = dynamic(() => import("./pro-chat").then((m) => ({ default: m.ChatClaudePreview })))
const ChatGrokPreview = dynamic(() => import("./pro-chat").then((m) => ({ default: m.ChatGrokPreview })))
const InlineCitationPreview = dynamic(() => import("./pro-chat").then((m) => ({ default: m.InlineCitationPreview })))
const MultimodalFileUploadPreview = dynamic(() => import("./pro-chat").then((m) => ({ default: m.MultimodalFileUploadPreview })))
const ConversationHistorySidebarPreview = dynamic(() => import("./pro-chat").then((m) => ({ default: m.ConversationHistorySidebarPreview })))
const MessageBranchNavigatorPreview = dynamic(() => import("./pro-chat").then((m) => ({ default: m.MessageBranchNavigatorPreview })))

/* ─── Pro: Starter Apps / Examples ─── */
const ChatBaseClonePreview = dynamic(() => import("./pro-examples").then((m) => ({ default: m.ChatBaseClonePreview })))
const FormGeneratorPreview = dynamic(() => import("./pro-examples").then((m) => ({ default: m.FormGeneratorPreview })))
const AgentDataAnalysisPreview = dynamic(() => import("./pro-examples").then((m) => ({ default: m.AgentDataAnalysisPreview })))
const AgentBrandingPreview = dynamic(() => import("./pro-examples").then((m) => ({ default: m.AgentBrandingPreview })))
const AgentCompetitorPreview = dynamic(() => import("./pro-examples").then((m) => ({ default: m.AgentCompetitorPreview })))
const AgentSEOAuditPreview = dynamic(() => import("./pro-examples").then((m) => ({ default: m.AgentSEOAuditPreview })))
const AgentRedditValidationPreview = dynamic(() => import("./pro-examples").then((m) => ({ default: m.AgentRedditValidationPreview })))
const AgentA11yAuditPreview = dynamic(() => import("./pro-examples").then((m) => ({ default: m.AgentA11yAuditPreview })))

/* ─── Pro: Rich Output, Connectors, Pipelines, Marketing ─── */
const JSONRenderShadcnPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.JSONRenderShadcnPreview })))
const JSONRenderGeneratePreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.JSONRenderGeneratePreview })))
const JSONRenderPDFPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.JSONRenderPDFPreview })))
const JSONRenderRemotionPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.JSONRenderRemotionPreview })))
const WebPreviewSandboxPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.WebPreviewSandboxPreview })))
const ExaWebSearch2Preview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.ExaWebSearch2Preview })))
const FirecrawlScraperPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.FirecrawlScraperPreview })))
const SequentialWorkflowPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.SequentialWorkflowPreview })))
const EvaluatorWorkflowPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.EvaluatorWorkflowPreview })))
const OrchestratorWorkflowPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.OrchestratorWorkflowPreview })))
const ParallelWorkflowPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.ParallelWorkflowPreview })))
const RoutingWorkflowPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.RoutingWorkflowPreview })))
const FewShotPromptPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.FewShotPromptPreview })))
const ModelComparisonPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.ModelComparisonPreview })))
const ModelComparisonCompactPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.ModelComparisonCompactPreview })))
const ModelComparisonTablePreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.ModelComparisonTablePreview })))
const IntegrationsGridPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.IntegrationsGridPreview })))
const IntegrationsGrid2Preview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.IntegrationsGrid2Preview })))
const CalculatorAgentROIPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.CalculatorAgentROIPreview })))
const ChangelogPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.ChangelogPreview })))
const AIPromptInputPreview = dynamic(() => import("./pro-rest").then((m) => ({ default: m.AIPromptInputPreview })))

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
  "basics-generate-text-multi-model": GenerateTextMultiModelPreview,
  "basics-generate-text-prompt": GenerateTextPromptPreview,

  // Chat & Conversations
  "ai-elements-chat": BasicChatPreview,
  "ai-elements-reasoning-chat": ReasoningChatPreview,
  "ai-elements-sources-chat": SourcesChatPreview,
  "ai-elements-plan": PlanDisplayPreview,
  "ai-elements-confirmation": ToolApprovalPreview,
  "ai-elements-queue": QueueDisplayPreview,

  // Agents & Orchestration (free)
  "ai-agents-routing": RoutingPatternPreview,
  "ai-agents-parallel-processing": ParallelProcessingPreview,

  // Human in the Loop (free)
  "ai-human-in-the-loop": HumanInTheLoopPreview,

  // Tools & Integrations (free)
  "tool-websearch-claude": ClaudeWebSearchPreview,
  "tool-websearch-exa": ExaWebSearchPreview,
  "cheerio-scraper": CheerioScraperPreview,
  "jina-scraper": JinaScraperPreview,
  "markdown-new-scraper": MarkdownScraperPreview,
  "ai-pdf-ingest": PDFAnalysisPreview,

  // Workflows & Pipelines (free)
  "ai-workflow-basic": URLAnalysisPreview,

  // Artifacts & Generation
  "ai-artifact-table": TableEditorPreview,
  "ai-artifact-chart": ChartGenerationPreview,

  // Marketing & Landing (free)
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
  "ai-prompt-input": AIPromptInputPreview,

  // ── Pro: Agent Architecture ──
  "ai-chat-agent-orchestrator-pattern": OrchestratorPatternPreview,
  "sub-agent-orchestrator": SubAgentOrchestratorPreview,
  "ai-chat-agent-tool-approval": AgentToolApprovalPreview,
  "ai-chat-agent-evaluator-optimizer-pattern": EvaluatorOptimizerPreview,
  "ai-chat-agent-multi-step-tool-pattern": MultiStepToolPreview,
  "ai-human-in-the-loop-agentic-context-builder": AgenticContextBuilderPreview,
  "ai-human-in-the-loop-inquire-multiple-choice": InquireMultipleChoicePreview,
  "ai-human-in-the-loop-inquire-text": InquireTextPreview,

  // ── Pro: Chat Kit ──
  "chat-gpt": ChatGPTPreview,
  "chat-claude": ChatClaudePreview,
  "chat-grok": ChatGrokPreview,
  "ai-elements-inline-citation": InlineCitationPreview,
  "multimodal-file-upload": MultimodalFileUploadPreview,
  "conversation-history-sidebar": ConversationHistorySidebarPreview,
  "message-branch-navigator": MessageBranchNavigatorPreview,

  // ── Pro: Starter Apps ──
  "examples-chat-base-clone": ChatBaseClonePreview,
  "examples-form-generator": FormGeneratorPreview,
  "example-agent-data-analysis": AgentDataAnalysisPreview,
  "example-agent-branding": AgentBrandingPreview,
  "example-agent-competitor": AgentCompetitorPreview,
  "example-agent-seo-audit": AgentSEOAuditPreview,
  "example-agent-reddit-validation": AgentRedditValidationPreview,
  "example-agent-a11y-audit": AgentA11yAuditPreview,

  // ── Pro: Rich Output ──
  "json-render-shadcn": JSONRenderShadcnPreview,
  "json-render-generate": JSONRenderGeneratePreview,
  "json-render-pdf": JSONRenderPDFPreview,
  "json-render-remotion": JSONRenderRemotionPreview,

  // ── Pro: Connectors ──
  "web-preview-sandbox": WebPreviewSandboxPreview,
  "tool-websearch-exa-2": ExaWebSearch2Preview,
  "tool-websearch-firecrawl": FirecrawlScraperPreview,

  // ── Pro: Pipelines & Workflows ──
  "wdk-workflows-sequential": SequentialWorkflowPreview,
  "wdk-workflows-evaluator": EvaluatorWorkflowPreview,
  "wdk-workflows-orchestrator": OrchestratorWorkflowPreview,
  "wdk-workflows-parallel": ParallelWorkflowPreview,
  "wdk-workflows-routing": RoutingWorkflowPreview,
  "ai-sdk-prompt-few-shot": FewShotPromptPreview,

  // ── Pro: Marketing ──
  "marketing-model-comparison": ModelComparisonPreview,
  "marketing-model-comparison-compact": ModelComparisonCompactPreview,
  "marketing-model-comparison-table-1": ModelComparisonTablePreview,
  "marketing-integrations-1": IntegrationsGridPreview,
  "marketing-integrations-2": IntegrationsGrid2Preview,
  "marketing-calculator-agent-roi": CalculatorAgentROIPreview,
  "marketing-changelog-1": ChangelogPreview,
}
