"use client"

import { motion } from "framer-motion"
import { getXpProgress } from "@/lib/helpers/xp"

type XPBarProps = {
  totalXp: number
}

export function XPBar({ totalXp }: XPBarProps) {
  const xp = getXpProgress(totalXp)
  const progress = Number.isFinite(xp.progressPercent)
    ? Math.max(0, Math.min(100, xp.progressPercent))
    : 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>XP Progress</span>
        <span className="font-semibold text-blue-300">{progress.toFixed(0)}%</span>
      </div>

      <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-800/90 ring-1 ring-slate-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.45)]"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Total XP: {totalXp}</span>
        <span>
          {xp.xpNeededForNext > 0 ? `${xp.xpNeededForNext} XP to next level` : "Max level reached"}
        </span>
      </div>
    </div>
  )
}
