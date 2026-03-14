"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CompletionLineChart } from "@/components/charts/completion-line-chart"
import { HabitDistributionPie } from "@/components/charts/habit-distribution-pie"
import { WeeklyStats } from "@/components/charts/weekly-stats"

type LinePoint = { date: string; completed: number }
type PieSlice = { name: string; value: number }
type WeeklyStatsData = {
  totalActiveHabits: number
  completedThisWeek: number
  uniqueCompletedHabits: number
  weeklyCompletionRate: number
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [lineData, setLineData] = useState<LinePoint[]>([])
  const [pieData, setPieData] = useState<PieSlice[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStatsData>({
    totalActiveHabits: 0,
    completedThisWeek: 0,
    uniqueCompletedHabits: 0,
    weeklyCompletionRate: 0,
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await fetch("/api/analytics?range=overview")
      const data = await res.json()
      setLineData(data.lineData ?? [])
      setPieData(data.pieData ?? [])
      setWeeklyStats(
        data.weeklyStats ?? {
          totalActiveHabits: 0,
          completedThisWeek: 0,
          uniqueCompletedHabits: 0,
          weeklyCompletionRate: 0,
        }
      )
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>

      {loading ? (
        <p className="text-sm text-slate-400">Loading analytics...</p>
      ) : (
        <>
          <Card className="border-slate-700/60 bg-slate-900/60">
            <CardHeader>
              <CardTitle>Habit Completion Trend (30 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <CompletionLineChart data={lineData} />
            </CardContent>
          </Card>

          <Card className="border-slate-700/60 bg-slate-900/60">
            <CardHeader>
              <CardTitle>Habit Distribution by Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <HabitDistributionPie data={pieData} />
            </CardContent>
          </Card>

          <WeeklyStats data={weeklyStats} />
        </>
      )}
    </div>
  )
}
