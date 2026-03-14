"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CompletionButton } from "@/components/habit/completion-button"

type HabitCardProps = {
  id: string
  name: string
  difficulty: "easy" | "medium" | "hard"
  xpReward: number
  streak: number
  reminderTime: string | null
  completedToday: boolean
  onComplete: (id: string, xpReward: number) => void
}

const difficultyStyles: Record<"easy" | "medium" | "hard", string> = {
  easy: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  medium: "border-amber-400/40 bg-amber-500/10 text-amber-300",
  hard: "border-rose-400/40 bg-rose-500/10 text-rose-300",
}

export function HabitCard({
  id,
  name,
  difficulty,
  xpReward,
  streak,
  reminderTime,
  completedToday,
  onComplete,
}: HabitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-slate-700/60 bg-slate-900/60 backdrop-blur">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-slate-100">{name}</CardTitle>
            <p className="mt-1 text-xs text-slate-400">
              Reminder: {reminderTime ?? "Not set"}
            </p>
          </div>
          <Badge className={difficultyStyles[difficulty]}>{difficulty}</Badge>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-blue-200">+{xpReward} XP</p>
            <p className="text-xs text-slate-400">Streak: {streak} day(s)</p>
          </div>

          <CompletionButton
            completed={completedToday}
            onClick={() => onComplete(id, xpReward)}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
