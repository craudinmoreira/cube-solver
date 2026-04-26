import { create } from 'zustand';
import { getInitialCubies, type CubieState, type Move, applyRotationToCubies, getInverseMove } from '../utils/cubeLogic';

interface CubeStore {
  cubies: CubieState[];
  history: Move[];
  isAnimating: boolean;
  currentMove: Move | null;

  // Actions
  addMove: (move: Move) => void;
  undo: () => void;
  finishAnimation: () => void;
}

export const useCubeStore = create<CubeStore>((set, get) => ({
  cubies: getInitialCubies(),
  history: [],
  isAnimating: false,
  currentMove: null,

  addMove: (move) => {
    if (get().isAnimating) return;
    set((state) => ({
      isAnimating: true,
      currentMove: move,
      history: [...state.history, move],
    }));
  },

  undo: () => {
    if (get().isAnimating) return;
    const { history } = get();
    if (history.length === 0) return;

    const lastMove = history[history.length - 1];
    const inverseMove = getInverseMove(lastMove);

    set((state) => ({
      isAnimating: true,
      currentMove: inverseMove, // Anima o movimento reverso
      history: state.history.slice(0, -1), // Remove do histórico
    }));
  },

  finishAnimation: () => {
    set((state) => {
      if (!state.currentMove) return { isAnimating: false };
      
      const newCubies = applyRotationToCubies(state.cubies, state.currentMove);
      return {
        cubies: newCubies,
        isAnimating: false,
        currentMove: null,
      };
    });
  },
}));
