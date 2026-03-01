"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { type AgentState, AudioOrb } from "@/components/ui/orb"
import { LiveWaveform } from "@/components/ui/live-waveform"

const VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const
type Voice = (typeof VOICES)[number]

const VOICE_COLORS: Record<Voice, [string, string]> = {
  alloy: ["#CADCFC", "#A0B9D1"],
  echo: ["#C4E5C0", "#8FBF8A"],
  fable: ["#F6E7D8", "#E0CFC2"],
  onyx: ["#E5E7EB", "#9CA3AF"],
  nova: ["#F8D0E0", "#E8A0C0"],
  shimmer: ["#D8D0F0", "#B8A8E0"],
}

export function GenerateSpeechDemo() {
  const [text, setText] = useState(
    "The Vercel AI SDK makes it easy to build AI-powered applications with streaming, tool use, and multi-modal capabilities."
  )
  const [voice, setVoice] = useState<Voice>("alloy")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orbState, setOrbState] = useState<AgentState>(null)
  const [audioReady, setAudioReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number>(0)
  const outputVolumeRef = useRef(0)

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      audioContextRef.current?.close()
    }
  }, [])

  /* ── Volume tracking via Web Audio API ── */
  const trackVolume = useCallback(() => {
    if (!analyserNode) return
    const data = new Uint8Array(analyserNode.frequencyBinCount)
    analyserNode.getByteFrequencyData(data)
    const sum = data.reduce((a, b) => a + b, 0)
    outputVolumeRef.current = Math.min(1, sum / data.length / 100)
    rafRef.current = requestAnimationFrame(trackVolume)
  }, [analyserNode])

  const getOutputVolume = useCallback(() => outputVolumeRef.current, [])

  async function handleGenerate() {
    if (!text.trim() || loading) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    setLoading(true)
    setError(null)
    setAudioReady(false)
    setPlaying(false)
    setOrbState("thinking")
    setAnalyserNode(null)
    setCurrentTime(0)
    setDuration(0)

    try {
      const res = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), voice }),
      })
      if (!res.ok) throw new Error("Failed to generate speech")

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      audioUrlRef.current = url

      const audio = new Audio(url)
      audioRef.current = audio

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      const ctx = audioContextRef.current
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      setAnalyserNode(analyser)

      const source = ctx.createMediaElementSource(audio)
      source.connect(analyser)
      analyser.connect(ctx.destination)

      audio.addEventListener("loadedmetadata", () => setDuration(audio.duration))
      audio.addEventListener("timeupdate", () =>
        setCurrentTime(audio.currentTime)
      )
      audio.addEventListener("ended", () => {
        setPlaying(false)
        setOrbState(null)
        outputVolumeRef.current = 0
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
      })

      await audio.play()
      setAudioReady(true)
      setPlaying(true)
      setOrbState("talking")
      trackVolume()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate speech")
      setOrbState(null)
    } finally {
      setLoading(false)
    }
  }

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      setPlaying(false)
      setOrbState(null)
      outputVolumeRef.current = 0
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    } else {
      audio.play()
      setPlaying(true)
      setOrbState("talking")
      trackVolume()
    }
  }

  function reset() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    outputVolumeRef.current = 0
    setAudioReady(false)
    setPlaying(false)
    setOrbState(null)
    setAnalyserNode(null)
    setCurrentTime(0)
    setDuration(0)
    setError(null)
  }

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Generate Speech
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Convert text to natural-sounding audio with OpenAI TTS.
        </p>
      </div>

      {/* Visual: Orb + Waveform side by side */}
      <div className="flex items-center gap-4">
        <div className="size-36 shrink-0 overflow-hidden rounded-full">
          <AudioOrb
            colors={VOICE_COLORS[voice]}
            seed={42}
            agentState={orbState}
            volumeMode={playing ? "manual" : "auto"}
            getOutputVolume={playing ? getOutputVolume : undefined}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <LiveWaveform
            analyserNode={analyserNode}
            active={playing}
            processing={loading}
            mode="static"
            height={120}
            barWidth={3}
            barGap={1}
            barRadius={1.5}
            sensitivity={1.2}
            fadeEdges
            fadeWidth={16}
            className="text-foreground/70"
          />
          <div className="flex items-center justify-between px-1">
            {playing ? (
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
                <span className="font-mono text-[10px] text-foreground/40">
                  Playing
                </span>
              </span>
            ) : loading ? (
              <span className="font-mono text-[10px] text-foreground/40">
                Generating…
              </span>
            ) : (
              <span className="font-mono text-[10px] text-foreground/20">
                Idle
              </span>
            )}
            <span className="font-mono text-[10px] text-foreground/20">
              tts-1
            </span>
          </div>
        </div>
      </div>

      {/* Playback controls */}
      {audioReady && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={togglePlay}
            className="flex size-8 items-center justify-center rounded-full bg-foreground transition-transform active:scale-95"
          >
            {playing ? (
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-background"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-0.5 text-background"
              >
                <polygon points="5 3 19 12 5 21" />
              </svg>
            )}
          </button>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {fmt(currentTime)} / {fmt(duration)}
          </span>
          <button
            onClick={reset}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            clear
          </button>
        </div>
      )}

      {/* Text input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleGenerate()
          }
        }}
        disabled={loading}
        placeholder="Enter text to convert to speech…"
        rows={3}
        className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-foreground/20 disabled:opacity-40"
      />

      {/* Voice picker + generate */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {VOICES.map((v) => (
            <button
              key={v}
              onClick={() => setVoice(v)}
              className={`rounded-full px-2 py-0.5 text-xs font-medium transition-all ${
                voice === v
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          onClick={handleGenerate}
          disabled={!text.trim() || loading}
          className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
        >
          {loading ? "Generating…" : "Speak"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-3 border-t border-border/40 pt-3">
        <span className="font-mono text-[10px] text-foreground/20">tts-1</span>
        <span className="text-foreground/10">&middot;</span>
        <span className="font-mono text-[10px] text-foreground/20">
          {voice}
        </span>
        <span className="text-foreground/10">&middot;</span>
        <span className="font-mono text-[10px] tabular-nums text-foreground/20">
          {text.trim().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </div>
  )
}
