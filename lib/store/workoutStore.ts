import { create } from 'zustand';
import { WorkoutSession, WorkoutSet, Exercise } from '@/types';

interface ActiveWorkout {
  session: WorkoutSession;
  exercises: Exercise[];
  sets: WorkoutSet[];
}

interface WorkoutStore {
  activeWorkout: ActiveWorkout | null;
  startWorkout: (session: WorkoutSession, exercises: Exercise[]) => void;
  addSet: (set: WorkoutSet) => void;
  completeWorkout: () => void;
  cancelWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  activeWorkout: null,
  startWorkout: (session, exercises) =>
    set({ activeWorkout: { session, exercises, sets: [] } }),
  addSet: (newSet) =>
    set((state) => ({
      activeWorkout: state.activeWorkout
        ? {
            ...state.activeWorkout,
            sets: [...state.activeWorkout.sets, newSet],
          }
        : null,
    })),
  completeWorkout: () => set({ activeWorkout: null }),
  cancelWorkout: () => set({ activeWorkout: null }),
}));
