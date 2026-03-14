"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"

type Props = {
  label: string
  pendingLabel?: string
}

export function AuthSubmitButton({ label, pendingLabel = "Please wait..." }: Props) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  )
}
