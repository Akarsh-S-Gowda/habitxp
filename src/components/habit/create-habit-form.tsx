"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = { onCreated: () => void }

export function CreateHabitForm({ onCreated }: Props) {
  const [name, setName] = useState("")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [xpReward, setXpReward] = useState(10)
  const [reminderTime, setReminderTime] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          difficulty,
          xp_reward: xpReward,
          reminder_time: reminderTime || null,
        }),
      })
      if (!res.ok) throw new Error("Failed to create habit")
      setName("")
      setDifficulty("easy")
      setXpReward(10)
      setReminderTime("")
      onCreated()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-slate-700/60 bg-slate-900/60">
      <CardHeader>
        <CardTitle>Create Habit</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-12" onSubmit={onSubmit}>
          <div className="md:col-span-6">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          <div className="md:col-span-3">
            <Label>Difficulty</Label>
            <select
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
            >
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <Label>XP</Label>
            <Input
              type="number"
              min={1}
              max={500}
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              required
              className="mt-2"
            />
          </div>

          <div className="md:col-span-3">
            <Label>Reminder</Label>
            <Input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="md:col-span-9" />

          <div className="md:col-span-3 md:flex md:items-end">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Add Habit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
