"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HabitCard } from "@/components/habit/habit-card"
import { XPBar } from "@/components/xp/xp-bar"
import { LevelBadge } from "@/components/xp/level-badge"
import { CreateHabitForm } from "@/components/habit/create-habit-form"
import { getXpProgress } from "@/lib/helpers/xp"
import { useUserStore } from "@/store/use-user-store"

type Habit = {
  id: string
  name: string
  difficulty: "easy" | "medium" | "hard"
  xp_reward: number
  reminder_time: string | null
  streak_count: number
}

type Completion = {
  habit_id: string
  completion_date: string
}

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [completedTodayMap, setCompletedTodayMap] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  const totalXp = useUserStore((s) => s.totalXp)
  const setTotalXp = useUserStore((s) => s.setTotalXp)
  const xpInfo = getXpProgress(totalXp)

  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      const [habitsRes, completionsRes, profileRes] = await Promise.all([
        fetch("/api/habits"),
        fetch("/api/analytics?range=today"),
        fetch("/api/analytics?range=profile"),
      ])

      if (!habitsRes.ok) throw new Error("Failed to load habits")
      const habitsJson = await habitsRes.json()
      setHabits(habitsJson.habits ?? [])

      if (completionsRes.ok) {
        const compJson = await completionsRes.json()
        const todayMap: Record<string, boolean> = {}
        ;(compJson.completions as Completion[] | undefined)?.forEach((c) => {
          todayMap[c.habit_id] = true
        })
        setCompletedTodayMap(todayMap)
      }

      if (profileRes.ok) {
        const profileJson = await profileRes.json()
        setTotalXp(profileJson.totalXp ?? 0)
      }
    } catch (err) {
      toast.error("Could not load dashboard data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [setTotalXp])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const completedCount = useMemo(
    () => habits.filter((h) => completedTodayMap[h.id]).length,
    [habits, completedTodayMap]
  )

  const onComplete = async (habitId: string) => {
    try {
      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId }),
      })

      if (res.status === 409) {
        toast.message("Already completed today")
        return
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? "Failed to complete habit")
      }

      const data = await res.json()
      setCompletedTodayMap((prev) => ({ ...prev, [habitId]: true }))
      setTotalXp(data.totalXp ?? totalXp)
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId ? { ...h, streak_count: h.streak_count + 1 } : h
        )
      )
      toast.success(`+${data.xpGained} XP gained`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Completion failed")
    }
  }

  const onDeleteHabit = async (habitId: string) => {
    try {
      const res = await fetch(`/api/habits/${habitId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete habit")
      setHabits((prev) => prev.filter((h) => h.id !== habitId))
      toast.success("Habit archived")
    } catch {
      toast.error("Failed to delete habit")
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-900/30 via-slate-900/40 to-blue-900/30 p-5"
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Hunter Dashboard</h1>
        <p className="mt-1 text-sm text-slate-300">
          Complete habits daily to gain XP and rank up.
        </p>
      </motion.div>

      <CreateHabitForm onCreated={loadDashboardData} />

      <Card className="border-slate-700/60 bg-slate-900/60">
        <CardHeader>
          <CardTitle>Player Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LevelBadge level={xpInfo.currentLevel} rank={xpInfo.rank} />
          <XPBar totalXp={totalXp} />
          <p className="text-xs text-slate-400">
            Today: {completedCount}/{habits.length} habits completed
          </p>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-100">Today&apos;s Habits</h2>

        {loading ? (
          <p className="text-sm text-slate-400">Loading habits...</p>
        ) : habits.length === 0 ? (
          <p className="text-sm text-slate-400">No habits yet. Create your first one above.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {habits.map((habit) => (
              <div key={habit.id} className="space-y-2">
                <HabitCard
                  id={habit.id}
                  name={habit.name}
                  difficulty={habit.difficulty}
                  xpReward={habit.xp_reward}
                  streak={habit.streak_count}
                  reminderTime={habit.reminder_time}
                  completedToday={!!completedTodayMap[habit.id]}
                  onComplete={(id) => onComplete(id)}
                />
                <button
                  onClick={() => onDeleteHabit(habit.id)}
                  className="text-xs text-rose-400 hover:text-rose-300"
                  type="button"
                >
                  Archive habit
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
