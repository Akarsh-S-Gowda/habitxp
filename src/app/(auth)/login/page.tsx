import Link from "next/link"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInAction } from "@/app/actions/auth"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { AuthSubmitButton } from "@/components/shared/auth-submit-button"

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function LoginPage({ searchParams }: Props) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.auth.getUser()

  if (data.user) redirect("/dashboard")

  const params = await searchParams
  const error = typeof params.error === "string" ? params.error : ""
  const message = typeof params.message === "string" ? params.message : ""

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl">Login to habitxp</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signInAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

            <AuthSubmitButton label="Login" pendingLabel="Logging in..." />
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
