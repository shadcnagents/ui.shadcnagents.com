"use client"

import { useState, useRef } from "react"
import { Mic, Square, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type State = "idle" | "listening" | "processing" | "done"

export function VoiceInput({
  onTranscript,
}: {
  onTranscript: (text: string) => void
}) {
  const [state, setState] = useState<State>("idle")
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    mediaRef.current = recorder
    chunksRef.current = []

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
    recorder.onstop = async () => {
      setState("processing")
      const blob = new Blob(chunksRef.current, { type: "audio/webm" })
      const form = new FormData()
      form.append("audio", blob, "recording.webm")

      const res = await fetch("/api/transcribe", { method: "POST", body: form })
      const { text } = await res.json()
      onTranscript(text)
      setState("done")
      setTimeout(() => setState("idle"), 2000)
    }

    recorder.start()
    setState("listening")
  }

  function stopRecording() {
    mediaRef.current?.stop()
    mediaRef.current?.stream.getTracks().forEach((t) => t.stop())
  }

  return (
    <button
      onClick={state === "listening" ? stopRecording : startRecording}
      className={cn(
        "flex size-14 items-center justify-center rounded-full border-2 transition-all",
        state === "idle" && "border-border hover:border-foreground/40",
        state === "listening" && "border-foreground bg-foreground",
        state === "processing" && "border-border/40 bg-muted/30",
        state === "done" && "border-green-500/60 bg-green-500/10",
      )}
    >
      {state === "idle" && <Mic className="size-6" />}
      {state === "listening" && <Square className="size-5 text-background" />}
      {state === "processing" && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
      {state === "done" && <Check className="size-6 text-green-500" />}
    </button>
  )
}