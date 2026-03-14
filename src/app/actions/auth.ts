"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"

function getField(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

export async function signUpAction(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const email = getField(formData, "email")
  const password = getField(formData, "password")
  const name = getField(formData, "name")

  if (!email || !password) {
    redirect("/signup?error=Email and password are required")
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath("/", "layout")

  if (data.session) {
    redirect("/dashboard")
  }

  redirect("/login?message=Signup successful. Please verify your email, then login.")
}

export async function signInAction(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const email = getField(formData, "email")
  const password = getField(formData, "password")

  if (!email || !password) {
    redirect("/login?error=Email and password are required")
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
