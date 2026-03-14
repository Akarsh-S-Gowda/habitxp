import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

type Difficulty = "easy" | "medium" | "hard"

function toDateOnly(d: Date) {
  return d.toISOString().slice(0, 10)
}

export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = auth.user.id
  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range")

  if (range === "profile") {
    const { data, error } = await supabase
      .from("profiles")
      .select("total_xp")
      .eq("user_id", userId)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ totalXp: data?.total_xp ?? 0 })
  }

  if (range === "today") {
    const today = toDateOnly(new Date())
    const { data, error } = await supabase
      .from("habit_completions")
      .select("habit_id, completion_date")
      .eq("user_id", userId)
      .eq("completion_date", today)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ completions: data ?? [] })
  }

  if (range === "overview") {
    const today = new Date()
    const from30 = new Date(today)
    from30.setDate(today.getDate() - 29)
    const from7 = new Date(today)
    from7.setDate(today.getDate() - 6)

    const [completionsRes, habitsRes] = await Promise.all([
      supabase
        .from("habit_completions")
        .select("completion_date, habit_id")
        .eq("user_id", userId)
        .gte("completion_date", toDateOnly(from30))
        .lte("completion_date", toDateOnly(today)),
      supabase
        .from("habits")
        .select("id, difficulty")
        .eq("user_id", userId)
        .eq("is_active", true),
    ])

    if (completionsRes.error) {
      return NextResponse.json({ error: completionsRes.error.message }, { status: 400 })
    }
    if (habitsRes.error) {
      return NextResponse.json({ error: habitsRes.error.message }, { status: 400 })
    }

    const completions = completionsRes.data ?? []
    const habits = habitsRes.data ?? []

    // Line chart: last 30 days completion counts
    const dayMap = new Map<string, number>()
    for (let i = 0; i < 30; i++) {
      const d = new Date(from30)
      d.setDate(from30.getDate() + i)
      dayMap.set(toDateOnly(d), 0)
    }
    completions.forEach((c) => {
      dayMap.set(c.completion_date, (dayMap.get(c.completion_date) ?? 0) + 1)
    })
    const lineData = Array.from(dayMap.entries()).map(([date, completed]) => ({
      date,
      completed,
    }))

    // Pie chart: active habits by difficulty
    const diffCount: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 }
    habits.forEach((h) => {
      const d = h.difficulty as Difficulty
      if (d in diffCount) diffCount[d] += 1
    })
    const pieData = [
      { name: "easy", value: diffCount.easy },
      { name: "medium", value: diffCount.medium },
      { name: "hard", value: diffCount.hard },
    ]

    // Weekly stats
    const from7Str = toDateOnly(from7)
    const weekCompletions = completions.filter((c) => c.completion_date >= from7Str)
    const totalActiveHabits = habits.length
    const completedThisWeek = weekCompletions.length
    const maxPossible = totalActiveHabits * 7
    const weeklyCompletionRate = maxPossible > 0 ? (completedThisWeek / maxPossible) * 100 : 0

    const uniqueCompletedHabits = new Set(weekCompletions.map((c) => c.habit_id)).size
    const weeklyStats = {
      totalActiveHabits,
      completedThisWeek,
      uniqueCompletedHabits,
      weeklyCompletionRate: Number(weeklyCompletionRate.toFixed(1)),
    }

    return NextResponse.json({ lineData, pieData, weeklyStats })
  }

  return NextResponse.json({ error: "Invalid range" }, { status: 400 })
}
