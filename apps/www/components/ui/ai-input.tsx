"use client"

import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

type AIInputContextType = {
  isLoading: boolean
  value: string
  setValue: (value: string) => void
  maxHeight: number | string
  onSubmit?: () => void
  disabled?: boolean
}

const AIInputContext = createContext<AIInputContextType>({
  isLoading: false,
  value: "",
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
})

function useAIInput() {
  const context = useContext(AIInputContext)
  if (!context) {
    throw new Error("useAIInput must be used within an AIInput")
  }
  return context
}

type AIInputProps = {
  isLoading?: boolean
  value?: string
  onValueChange?: (value: string) => void
  maxHeight?: number | string
  onSubmit?: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

function AIInput({
  className,
  isLoading = false,
  maxHeight = 240,
  value,
  onValueChange,
  onSubmit,
  children,
  disabled = false,
}: AIInputProps) {
  const [internalValue, setInternalValue] = useState(value || "")

  const handleChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <TooltipProvider>
      <AIInputContext.Provider
        value={{
          isLoading,
          value: value ?? internalValue,
          setValue: onValueChange ?? handleChange,
          maxHeight,
          onSubmit,
          disabled,
        }}
      >
        <div
          className={cn(
            "border-input bg-background rounded-3xl border p-2 shadow-xs",
            className
          )}
        >
          {children}
        </div>
      </AIInputContext.Provider>
    </TooltipProvider>
  )
}

export type AIInputTextareaProps = {
  disableAutosize?: boolean
} & React.ComponentProps<typeof Textarea>

function AIInputTextarea({
  className,
  onKeyDown,
  disableAutosize = false,
  ...props
}: AIInputTextareaProps) {
  const { value, setValue, maxHeight, onSubmit, disabled } = useAIInput()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (disableAutosize) return

    if (!textareaRef.current) return
    textareaRef.current.style.height = "auto"
    textareaRef.current.style.height =
      typeof maxHeight === "number"
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`
  }, [value, maxHeight, disableAutosize])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit?.()
    }
    onKeyDown?.(e)
  }

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "text-primary min-h-[44px] w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      rows={1}
      disabled={disabled}
      {...props}
    />
  )
}

type AIInputFooterProps = React.HTMLAttributes<HTMLDivElement>

function AIInputFooter({
  children,
  className,
  ...props
}: AIInputFooterProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
}

type AIInputActionProps = {
  className?: string
  tooltip?: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
} & Omit<React.ComponentProps<typeof Tooltip>, "children">

function AIInputAction({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: AIInputActionProps) {
  const { disabled } = useAIInput()

  if (!tooltip) {
    return <div className={className}>{children}</div>
  }

  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

export {
  AIInput,
  AIInputTextarea,
  AIInputFooter,
  AIInputAction,
}
