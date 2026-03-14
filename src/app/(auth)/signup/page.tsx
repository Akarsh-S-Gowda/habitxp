import Link from "next/link"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpAction } from "@/app/actions/auth"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { AuthSubmitButton } from "@/components/shared/auth-submit-button"

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SignupPage({ searchParams }: Props) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.auth.getUser()

  if (data.user) redirect("/dashboard")

  const params = await searchParams
  const error = typeof params.error === "string" ? params.error : ""

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl">Create your habitxp account</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signUpAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" type="text" placeholder="Hunter name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" minLength={6} required />
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <AuthSubmitButton label="Create account" pendingLabel="Creating account..." />
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
