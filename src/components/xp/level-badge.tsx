import { Badge } from "@/components/ui/badge"

type LevelBadgeProps = {
  level: number
  rank: string
}

export function LevelBadge({ level, rank }: LevelBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge className="border border-violet-400/40 bg-violet-500/20 text-violet-200">
        LVL {level}
      </Badge>
      <Badge className="border border-blue-400/40 bg-blue-500/20 text-blue-200">
        Rank {rank}
      </Badge>
    </div>
  )
}
