import { create } from 'zustand';
import { User, UserLevel, SubscriptionTier } from '@/types';

interface UserProfile extends Omit<User, 'created_at'> {
  created_at: string;
}

interface UserStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
  clearProfile: () => set({ profile: null }),
}));
