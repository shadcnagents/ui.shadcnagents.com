import { useEffect, useRef } from "react"

export function useSound(url: string) {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)

  useEffect(() => {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext

    if (!AudioContextClass) {
      return
    }

    const audioCtx = new AudioContextClass()
    audioCtxRef.current = audioCtx

    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => audioCtx.decodeAudioData(data))
      .then((decoded) => {
        bufferRef.current = decoded
      })
      .catch(() => {})

    return () => {
      audioCtx.close()
    }
  }, [url])

  const play = () => {
    if (audioCtxRef.current && bufferRef.current) {
      const source = audioCtxRef.current.createBufferSource()
      source.buffer = bufferRef.current
      source.connect(audioCtxRef.current.destination)
      source.start(0)
    }
  }

  return play
}
