import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          habitxp
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Level up your life. Complete habits, gain XP, build streaks, and rise through the ranks.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/login"
            className="rounded-md bg-primary px-5 py-2.5 text-primary-foreground transition hover:opacity-90"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-md border border-border px-5 py-2.5 transition hover:bg-accent"
          >
            Sign Up
          </Link>
        </div>
      </section>
    </main>
  )
}
