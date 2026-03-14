export const LEVELS = [
  { level: 1, minXp: 0, maxXp: 99, rank: "E" },
  { level: 2, minXp: 100, maxXp: 249, rank: "D" },
  { level: 3, minXp: 250, maxXp: 499, rank: "C" },
  { level: 4, minXp: 500, maxXp: 799, rank: "B" },
  { level: 5, minXp: 800, maxXp: Number.MAX_SAFE_INTEGER, rank: "A" },
] as const

export const DIFFICULTY_XP = {
  easy: 10,
  medium: 25,
  hard: 50,
} as const

export const RANKS = ["E", "D", "C", "B", "A", "S"] as const
