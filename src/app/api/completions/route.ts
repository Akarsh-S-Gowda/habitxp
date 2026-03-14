import { NextResponse } from "next/server"
import { completeHabitSchema } from "@/lib/validators/habit"
import { createServerSupabaseClient } from "@/lib/supabase/server"

type RpcResult = {
  status: "completed" | "already_completed"
  xp_gained: number
  total_xp: number
  streak_count: number
}

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = completeHabitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { data, error } = await supabase.rpc("complete_habit", {
    p_habit_id: parsed.data.habitId,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const row = (data?.[0] ?? null) as RpcResult | null
  if (!row) return NextResponse.json({ error: "No result from RPC" }, { status: 500 })

  if (row.status === "already_completed") {
    return NextResponse.json(
      {
        ok: false,
        status: row.status,
        xpGained: 0,
        totalXp: row.total_xp,
        streakCount: row.streak_count,
      },
      { status: 409 }
    )
  }

  return NextResponse.json({
    ok: true,
    status: row.status,
    xpGained: row.xp_gained,
    totalXp: row.total_xp,
    streakCount: row.streak_count,
  })
}
