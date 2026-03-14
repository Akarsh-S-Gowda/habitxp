import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/app/actions/auth"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <main className="min-h-screen">
      <header className="border-b border-border/70 bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-bold tracking-wide">habitxp</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/analytics">Analytics</Link>
            </Button>
            <form action={signOutAction}>
              <Button variant="destructive" type="submit">
                Logout
              </Button>
            </form>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">{children}</section>
    </main>
  )
}
