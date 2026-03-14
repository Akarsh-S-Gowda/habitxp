export type HabitDifficulty = "easy" | "medium" | "hard"

export interface Habit {
  id: string
  user_id: string
  name: string
  difficulty: HabitDifficulty
  xp_reward: number
  reminder_time: string | null
  streak_count: number
  created_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  user_id: string
  completed_at: string
  xp_gained: number
}
