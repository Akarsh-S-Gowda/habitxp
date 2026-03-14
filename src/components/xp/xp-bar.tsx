"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { getXpProgress } from "@/lib/helpers/xp"

type XPBarProps = {
  totalXp: number
}

export function XPBar({ totalXp }: XPBarProps) {
  const xp = getXpProgress(totalXp)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>XP Progress</span>
        <span>{xp.progressPercent.toFixed(0)}%</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Progress value={xp.progressPercent} className="h-3 bg-slate-800" />
      </motion.div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Total XP: {totalXp}</span>
        <span>
          {xp.xpNeededForNext > 0 ? `${xp.xpNeededForNext} XP to next level` : "Max level reached"}
        </span>
      </div>
    </div>
  )
}
