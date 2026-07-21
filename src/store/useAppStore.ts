import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserStats } from '../types';

interface AppState {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  userStats: UserStats;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSound: () => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      soundEnabled: true,
      userStats: {
        xp: 0,
        level: 1,
        streak: 0,
        lastStudyDate: null,
      },
      setTheme: (theme) => set({ theme }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      addXP: (amount) => set((state) => {
        let newXp = state.userStats.xp + amount;
        let newLevel = state.userStats.level;
        
        // Simple leveling system: 100 XP per level
        while (newXp >= newLevel * 100) {
          newXp -= newLevel * 100;
          newLevel++;
        }
        
        return {
          userStats: {
            ...state.userStats,
            xp: newXp,
            level: newLevel,
          }
        };
      }),
      updateStreak: () => set((state) => {
        const now = new Date();
        const lastDate = state.userStats.lastStudyDate ? new Date(state.userStats.lastStudyDate) : null;
        
        let newStreak = state.userStats.streak;
        
        if (!lastDate) {
          newStreak = 1;
        } else {
          const diffTime = Math.abs(now.getTime() - lastDate.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            newStreak++;
          } else if (diffDays > 1) {
            newStreak = 1; // Streak broken
          }
        }
        
        return {
          userStats: {
            ...state.userStats,
            streak: newStreak,
            lastStudyDate: now,
          }
        };
      }),
    }),
    {
      name: 'quiz-app-storage',
    }
  )
);
