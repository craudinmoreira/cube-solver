import { create } from "zustand";

interface AnimationSpeedStore {
  /** Velocidade da animação (moves/segundo). Min 0.5, Max 20 */
  speed: number;
  setSpeed: (speed: number) => void;
}

export const useAnimationSpeed = create<AnimationSpeedStore>((set) => ({
  speed: 4,
  setSpeed: (speed) => set({ speed: Math.max(0.5, Math.min(20, speed)) }),
}));
