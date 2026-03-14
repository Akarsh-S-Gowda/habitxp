import { NextResponse } from "next/server"
import { Resend } from "resend"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET(req: Request) {
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const hh = String(now.getHours()).padStart(2, "0")
  const mm = String(now.getMinutes()).padStart(2, "0")
  const from = `${hh}:${mm}:00`
  const to = `${hh}:${mm}:59`

  const { data: habits, error } = await supabaseAdmin
    .from("habits")
    .select("id,name,user_id,reminder_time")
    .eq("is_active", true)
    .not("reminder_time", "is", null)
    .gte("reminder_time", from)
    .lte("reminder_time", to)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  if (!habits?.length) return NextResponse.json({ ok: true, sent: 0 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  let sent = 0

  for (const habit of habits) {
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(habit.user_id)
    const email = userData.user?.email
    if (!email) continue

    await resend.emails.send({
      from: "habitxp <onboarding@resend.dev>",
      to: email,
      subject: `Reminder: ${habit.name}`,
      html: `<p>Time to complete <strong>${habit.name}</strong> and gain XP.</p>`,
    })
    sent += 1
  }

  return NextResponse.json({ ok: true, sent })
}
