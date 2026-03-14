import { LEVELS } from "@/lib/constants/game"

export function getLevelFromXp(totalXp: number) {
  return LEVELS.find((lvl) => totalXp >= lvl.minXp && totalXp <= lvl.maxXp) ?? LEVELS[0]
}

export function getXpProgress(totalXp: number) {
  const current = getLevelFromXp(totalXp)
  const next = LEVELS.find((lvl) => lvl.level === current.level + 1)

  if (!next) {
    return {
      currentLevel: current.level,
      rank: current.rank,
      progressPercent: 100,
      currentXpInLevel: totalXp - current.minXp,
      xpNeededForNext: 0,
    }
  }

  const levelRange = next.minXp - current.minXp
  const currentXpInLevel = totalXp - current.minXp
  const progressPercent = Math.min(100, Math.max(0, (currentXpInLevel / levelRange) * 100))

  return {
    currentLevel: current.level,
    rank: current.rank,
    progressPercent,
    currentXpInLevel,
    xpNeededForNext: next.minXp - totalXp,
  }
}
