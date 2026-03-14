"use client"

import { Button } from "@/components/ui/button"

type CompletionButtonProps = {
  completed: boolean
  onClick: () => void
  disabled?: boolean
}

export function CompletionButton({ completed, onClick, disabled }: CompletionButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled || completed}
      className={
        completed
          ? "bg-emerald-600/80 hover:bg-emerald-600/80"
          : "bg-violet-600 hover:bg-violet-500"
      }
    >
      {completed ? "Completed" : "Complete"}
    </Button>
  )
}
