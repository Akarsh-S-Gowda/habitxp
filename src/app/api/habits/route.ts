import { NextResponse } from "next/server"
import { createHabitSchema } from "@/lib/validators/habit"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", auth.user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ habits: data })
}

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createHabitSchema.safeParse({
    ...body,
    xp_reward: Number(body.xp_reward),
    reminder_time: body.reminder_time || null,
  })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const payload = {
    ...parsed.data,
    user_id: auth.user.id,
  }

  const { data, error } = await supabase.from("habits").insert(payload).select("*").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ habit: data }, { status: 201 })
}
