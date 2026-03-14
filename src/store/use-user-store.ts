import { create } from "zustand"

interface UserState {
  totalXp: number
  setTotalXp: (xp: number) => void
  addXp: (xp: number) => void
}

export const useUserStore = create<UserState>((set) => ({
  totalXp: 0,
  setTotalXp: (xp) => set({ totalXp: xp }),
  addXp: (xp) => set((state) => ({ totalXp: state.totalXp + xp })),
}))
