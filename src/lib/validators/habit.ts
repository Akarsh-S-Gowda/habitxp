import { z } from "zod"

export const createHabitSchema = z.object({
  name: z.string().min(1).max(120),
  difficulty: z.enum(["easy", "medium", "hard"]),
  xp_reward: z.number().int().min(1).max(500),
  reminder_time: z.string().nullable().optional(),
})

export const completeHabitSchema = z.object({
  habitId: z.string().uuid(),
})

export type CreateHabitInput = z.infer<typeof createHabitSchema>
