import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type WeeklyStatsData = {
  totalActiveHabits: number
  completedThisWeek: number
  uniqueCompletedHabits: number
  weeklyCompletionRate: number
}

export function WeeklyStats({ data }: { data: WeeklyStatsData }) {
  return (
    <Card className="border-slate-700/60 bg-slate-900/60">
      <CardHeader>
        <CardTitle>Weekly Stats</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-slate-700/60 p-3">
          <p className="text-xs text-slate-400">Active Habits</p>
          <p className="text-xl font-semibold">{data.totalActiveHabits}</p>
        </div>
        <div className="rounded-md border border-slate-700/60 p-3">
          <p className="text-xs text-slate-400">Completions (7d)</p>
          <p className="text-xl font-semibold">{data.completedThisWeek}</p>
        </div>
        <div className="rounded-md border border-slate-700/60 p-3">
          <p className="text-xs text-slate-400">Unique Habits Done</p>
          <p className="text-xl font-semibold">{data.uniqueCompletedHabits}</p>
        </div>
        <div className="rounded-md border border-slate-700/60 p-3">
          <p className="text-xs text-slate-400">Weekly Completion Rate</p>
          <p className="text-xl font-semibold">{data.weeklyCompletionRate}%</p>
        </div>
      </CardContent>
    </Card>
  )
}
