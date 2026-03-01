import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

/* ─── OpenAI ─── */
export const BrandOpenAI = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.516 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073ZM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494ZM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646ZM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872v.024Zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667Zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66v.018ZM8.079 12.862l-2.02-1.164a.08.08 0 0 1-.038-.057V6.085a4.499 4.499 0 0 1 7.37-3.456l-.142.08L8.47 5.47a.795.795 0 0 0-.393.681l-.004 6.711h.006Zm1.097-2.363 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5-.005-2.999Z" fill="currentColor" />
  </svg>
)

/* ─── Anthropic / Claude ─── */
export const BrandAnthropic = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M17.304 3.541h-3.476l5.158 16.918h3.476L17.304 3.541Zm-10.608 0L1.538 20.459h3.386l1.076-3.674h5.345l1.076 3.674h3.386L10.649 3.541H6.696Zm-.474 10.595 1.904-6.496h.072l1.904 6.496H6.222Z" fill="currentColor" />
  </svg>
)

/* ─── Google ─── */
export const BrandGoogle = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.02 10.02 0 0 0 1.15 12c0 1.61.39 3.14 1.07 4.49l3.62-2.4Z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
  </svg>
)

/* ─── Vercel ─── */
export const BrandVercel = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 1L24 22H0L12 1Z" fill="currentColor" />
  </svg>
)

/* ─── Perplexity ─── */
export const BrandPerplexity = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 1L17.5 6.5V11H20.5V17.5L17.5 20.5V23H6.5V20.5L3.5 17.5V11H6.5V6.5L12 1ZM8.5 11H10V7.5L12 5.5L14 7.5V11H15.5V7L12 3.5L8.5 7V11ZM5.5 13V16.5L8.5 19.5V21H10.5V17L7 13.5V13H5.5ZM15.5 21V19.5L18.5 16.5V13H17V13.5L13.5 17V21H15.5ZM12 13L9 16V18.5L12 15.5L15 18.5V16L12 13Z" fill="currentColor" />
  </svg>
)

/* ─── ElevenLabs ─── */
export const BrandElevenLabs = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M9 3h2v18H9V3Zm4 0h2v18h-2V3Z" fill="currentColor" />
  </svg>
)

/* ─── DeepSeek ─── */
export const BrandDeepSeek = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 2c1.85 0 3.55.63 4.9 1.69L7.69 14.9A7.92 7.92 0 0 1 4 12c0-4.41 3.59-8 8-8Zm0 16c-1.85 0-3.55-.63-4.9-1.69L16.31 9.1A7.92 7.92 0 0 1 20 12c0 4.41-3.59 8-8 8Z" fill="currentColor" />
  </svg>
)

/* ─── xAI ─── */
export const BrandXAI = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 3l7.5 9L3 21h2.5l6.5-7.8L18.5 21H21l-7.5-9L21 3h-2.5L12 10.8 5.5 3H3Z" fill="currentColor" />
  </svg>
)

/* ─── Stripe ─── */
export const BrandStripe = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305Z" fill="currentColor" />
  </svg>
)

/* ─── Linear ─── */
export const BrandLinear = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2.654 10.6a.463.463 0 0 0-.109.496c1.675 4.607 5.752 8.684 10.359 10.359a.463.463 0 0 0 .496-.109l8.412-8.412a.5.5 0 0 0 0-.707L12.773 3.188a.5.5 0 0 0-.707 0L2.654 10.6Z" fill="currentColor" />
    <path d="M1.48 8.91a.5.5 0 0 0-.126.648 14.652 14.652 0 0 0 2.382 3.156.5.5 0 0 0 .705.006L8.88 8.28a.5.5 0 0 0 .006-.705 14.652 14.652 0 0 0-3.156-2.382.5.5 0 0 0-.648.126L1.48 8.91ZM15.72 21.146a.5.5 0 0 0 .648-.126l3.59-3.59a.5.5 0 0 0-.125-.649 14.652 14.652 0 0 0-3.156-2.382.5.5 0 0 0-.705.006l-4.44 4.44a.5.5 0 0 0 .006.705 14.652 14.652 0 0 0 3.156 2.382l.025.014ZM1.254 12.568a.5.5 0 0 0-.115.525 9.594 9.594 0 0 0 .927 1.871.5.5 0 0 0 .729.103l2.01-2.01a.5.5 0 0 0-.103-.729 9.594 9.594 0 0 0-1.87-.927.5.5 0 0 0-.526.115l-1.052 1.052ZM11.432 22.746a.5.5 0 0 0 .525-.115l1.052-1.052a.5.5 0 0 0 .115-.525 9.594 9.594 0 0 0-.927-1.87.5.5 0 0 0-.729-.104l-2.01 2.01a.5.5 0 0 0 .103.73 9.594 9.594 0 0 0 1.871.926Z" fill="currentColor" />
  </svg>
)

/* ─── Notion ─── */
export const BrandNotion = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.29 2.168c-.42-.326-.98-.7-2.055-.607l-12.77.839c-.466.047-.56.28-.374.466l1.368 1.342ZM5.251 7.15v13.892c0 .746.373 1.026 1.213.98l14.523-.839c.84-.046.934-.56.934-1.166V6.63c0-.607-.234-.933-.747-.887l-15.177.887c-.56.046-.746.326-.746.52ZM18.43 7.756c.094.42 0 .84-.42.887l-.7.14v10.264c-.607.327-1.166.514-1.633.514-.746 0-.933-.234-1.493-.934l-4.571-7.186v6.953l1.446.327s0 .84-1.166.84l-3.219.186c-.094-.187 0-.654.327-.747l.84-.233V9.854L6.6 9.714c-.094-.42.14-1.026.793-1.073l3.452-.234 4.758 7.28v-6.44l-1.213-.14c-.094-.514.28-.887.747-.933l3.293-.218Z" fill="currentColor" />
  </svg>
)

/* ─── LangChain ─── */
export const BrandLangChain = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2L6 5.5v5L2 13v5l4 2.5 4-2.5v-3l2 1.25L14 18v2.5l4 2.5 4-2.5v-5l-4-2.5v3l-2-1.25L14 14v-2.5l4-2.5V4L12 2Zm0 2.5 2 1.25v2.5l-2 1.25-2-1.25v-2.5L12 4.5ZM6 7.75l2 1.25v2.5l-2 1.25-2-1.25V9L6 7.75Zm12 6.5 2 1.25v2.5l-2 1.25-2-1.25v-2.5l2-1.25Z" fill="currentColor" />
  </svg>
)

/* ─── CrewAI ─── */
export const BrandCrewAI = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="5" r="3" fill="currentColor" />
    <circle cx="5" cy="17" r="3" fill="currentColor" />
    <circle cx="19" cy="17" r="3" fill="currentColor" />
    <path d="M12 8v3m0 0-5.5 3.5M12 11l5.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

/* ─── Midjourney ─── */
export const BrandMidjourney = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 5h2l3.5 7L12 5h2L9.5 14v6h-1V14L3 5Zm10 0h2l3.5 7L22 5h2l-5.5 9v6h-1V14L13 5Z" fill="currentColor" />
  </svg>
)

/* ─── Firecrawl ─── */
export const BrandFirecrawl = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2c-1.5 4-5 6-5 10a5 5 0 0 0 10 0c0-4-3.5-6-5-10Zm0 14a2 2 0 0 1-2-2c0-1.5 1-2.5 2-4 1 1.5 2 2.5 2 4a2 2 0 0 1-2 2Z" fill="currentColor" />
  </svg>
)

/* ─── Exa ─── */
export const BrandExa = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 3c3.86 0 7 3.14 7 7h-3c0-2.21-1.79-4-4-4V5Zm0 14c-3.86 0-7-3.14-7-7h3c0 2.21 1.79 4 4 4v3Z" fill="currentColor" />
  </svg>
)

/* ─── Jina AI ─── */
export const BrandJinaAI = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="7" r="4" fill="currentColor" />
    <path d="M12 13c-4 0-7 2-7 5v2h14v-2c0-3-3-5-7-5Z" fill="currentColor" opacity="0.6" />
  </svg>
)

/* ─── Remotion ─── */
export const BrandRemotion = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 3.5L4 20.5L6.5 19L6.5 12.75L17 20.5L20.5 20.5L20.5 3.5L17 3.5L17 11.25L6.5 3.5L4 3.5Z" fill="currentColor" />
  </svg>
)

/* ─── Adobe ─── */
export const BrandAdobe = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M9 3H2v18l7-18Zm6 0h7v18l-7-18Zm-3 7.5L16.5 21h-3.25l-1.5-4h-3L12 10.5Z" fill="currentColor" />
  </svg>
)

/* ─── Reddit ─── */
export const BrandReddit = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm6.67-10.55a1.53 1.53 0 0 1-.15 2.16c.02.16.02.33 0 .49 0 2.52-2.94 4.57-6.56 4.57s-6.56-2.05-6.56-4.57a3.15 3.15 0 0 1 0-.49 1.53 1.53 0 0 1-.83-2.75 1.54 1.54 0 0 1 2.1.42 7.5 7.5 0 0 1 4.05-1.26l.77-3.6a.31.31 0 0 1 .37-.24l2.56.54a1.08 1.08 0 1 1-.12.56l-2.28-.48-.68 3.2a7.47 7.47 0 0 1 3.95 1.24 1.54 1.54 0 0 1 2.38-.49ZM8.68 14a1.08 1.08 0 1 0 0-2.16 1.08 1.08 0 0 0 0 2.16Zm6 2.89a4.36 4.36 0 0 1-2.72.82 4.36 4.36 0 0 1-2.72-.82.3.3 0 0 1 .42-.42c.59.47 1.35.73 2.3.73.95 0 1.7-.26 2.3-.73a.3.3 0 0 1 .42.42Zm-.36-1.81a1.08 1.08 0 1 0 0-2.16 1.08 1.08 0 0 0 0 2.16Z" fill="currentColor" />
  </svg>
)

/* ─── OpenRouter ─── */
export const BrandOpenRouter = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 2a8 8 0 0 1 7.93 7H16a4 4 0 0 0-8 0H4.07A8 8 0 0 1 12 4ZM8 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0Zm4 8a8 8 0 0 1-7.93-7H8a4 4 0 0 0 8 0h3.93A8 8 0 0 1 12 20Z" fill="currentColor" />
  </svg>
)

/* ─── Hugging Face ─── */
export const BrandHuggingFace = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" fill="currentColor" opacity="0.15" />
    <path d="M8.5 9.5C8.5 8.67 9.17 8 10 8s1.5.67 1.5 1.5S10.83 11 10 11s-1.5-.67-1.5-1.5Zm4 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S14.83 11 14 11s-1.5-.67-1.5-1.5Z" fill="currentColor" />
    <circle cx="9.75" cy="9.5" r="0.5" fill="white" />
    <circle cx="13.75" cy="9.5" r="0.5" fill="white" />
    <path d="M8 14c0 2.21 1.79 4 4 4s4-1.79 4-4H8Z" fill="currentColor" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z" fill="currentColor" />
  </svg>
)

/* ─── Devin ─── */
export const BrandDevin = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" opacity="0.15" />
    <path d="M7 8l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

/* ─── Canva ─── */
export const BrandCanva = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm3.17 13.65c-.55.74-1.38 1.27-2.46 1.27-2.12 0-3.56-1.95-3.56-4.51 0-2.65 1.76-4.87 4.3-4.87.88 0 1.54.38 1.88.87.22.32.14.55-.11.68-.25.13-.55.06-.77-.22-.26-.34-.6-.5-1.01-.5-1.48 0-2.8 1.5-2.8 3.91 0 1.69.8 3.45 2.44 3.45.84 0 1.52-.59 1.88-1.18.21-.36.5-.41.74-.22.27.21.18.65-.14 1.06l-.39.26Z" fill="currentColor" />
  </svg>
)

/* ─── Chatbase ─── */
export const BrandChatbase = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.48 2 2 6 2 11c0 2.5 1.1 4.8 2.9 6.4L4 22l4.3-2.2c1.1.4 2.4.6 3.7.6 5.52 0 10-4 10-9s-4.48-9.4-10-9.4ZM8 12.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" fill="currentColor" />
  </svg>
)

/* ─── Typeform ─── */
export const BrandTypeform = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 5h18v2H3V5Zm2 4h14v2H5V9Zm3 4h8v2H8v-2Zm3 4h2v2h-2v-2Z" fill="currentColor" />
  </svg>
)

/* ─── Zapier ─── */
export const BrandZapier = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M15.557 12l2.985-2.985a6.146 6.146 0 0 0-1.557-1.557L14 10.443V6h-4v4.443L7.015 7.458a6.146 6.146 0 0 0-1.557 1.557L8.443 12l-2.985 2.985a6.146 6.146 0 0 0 1.557 1.557L10 13.557V18h4v-4.443l2.985 2.985a6.146 6.146 0 0 0 1.557-1.557L15.557 12Z" fill="currentColor" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.3" />
  </svg>
)

/* ─── Apple ─── */
export const BrandApple = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83ZM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" fill="currentColor" />
  </svg>
)

/* ─── Intercom ─── */
export const BrandIntercom = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" opacity="0.15" />
    <path d="M19.5 17.29c0 .14-.11.26-.28.26-.13 0-3.14 1.86-7.22 1.86s-7.09-1.86-7.22-1.86a.27.27 0 0 1-.28-.26v-1.16c0-.15.12-.27.28-.27.04 0 2.86 1.63 7.22 1.63 4.36 0 7.18-1.63 7.22-1.63.16 0 .28.12.28.27v1.16Z" fill="currentColor" />
    <path d="M6.5 7v6M9 5.5v9M12 5v10M15 5.5v9M17.5 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

/* ─── Ahrefs ─── */
export const BrandAhrefs = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" fill="currentColor" opacity="0.15" />
    <path d="M8 16l2-5.5L12 16M9 13.5h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 8h1.5a2.5 2.5 0 0 1 0 5H14V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ─── v0 ─── */
export const BrandV0 = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 4l6 16h1L17.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="19" cy="5" r="2.5" fill="currentColor" />
  </svg>
)

/* ─── shadcn/ui ─── */
export const BrandShadcn = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="1em" height="1em" {...props}>
    <rect width="256" height="256" fill="none" />
    <line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="22" />
    <line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="22" />
  </svg>
)

/* ─── Brand icon registry ─── */
export const brandIconMap: Record<string, (props: IconProps) => React.JSX.Element> = {
  openai: BrandOpenAI,
  anthropic: BrandAnthropic,
  google: BrandGoogle,
  vercel: BrandVercel,
  perplexity: BrandPerplexity,
  elevenlabs: BrandElevenLabs,
  deepseek: BrandDeepSeek,
  xai: BrandXAI,
  stripe: BrandStripe,
  linear: BrandLinear,
  notion: BrandNotion,
  langchain: BrandLangChain,
  crewai: BrandCrewAI,
  midjourney: BrandMidjourney,
  firecrawl: BrandFirecrawl,
  exa: BrandExa,
  jina: BrandJinaAI,
  remotion: BrandRemotion,
  adobe: BrandAdobe,
  reddit: BrandReddit,
  openrouter: BrandOpenRouter,
  huggingface: BrandHuggingFace,
  devin: BrandDevin,
  canva: BrandCanva,
  chatbase: BrandChatbase,
  typeform: BrandTypeform,
  zapier: BrandZapier,
  apple: BrandApple,
  intercom: BrandIntercom,
  ahrefs: BrandAhrefs,
  v0: BrandV0,
  shadcn: BrandShadcn,
}
