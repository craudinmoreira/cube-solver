import { create } from 'zustand';
import { getInitialCubies, type CubieState, type Move, applyRotationToCubies, getInverseMove } from '../utils/cubeLogic';

interface CubeStore {
  cubies: CubieState[];
  history: Move[];
  isAnimating: boolean;
  currentMove: Move | null;
  moveQueue: Move[];
  isResetting: boolean;
  showFaceLabels: boolean;

  // Actions
  addMove: (move: Move) => void;
  undo: () => void;
  finishAnimation: () => void;
  shuffle: () => void;
  reset: () => void;
  toggleFaceLabels: () => void;
}

export const useCubeStore = create<CubeStore>((set) => ({
  cubies: getInitialCubies(),
  history: [],
  isAnimating: false,
  currentMove: null,
  moveQueue: [],
  isResetting: false,
  showFaceLabels: false,

  toggleFaceLabels: () => {
    set((state) => ({ showFaceLabels: !state.showFaceLabels }));
  },

  addMove: (move) => {
    set((state) => {
      if (state.isAnimating || state.moveQueue.length > 0 || state.isResetting) return state;
      return {
        isAnimating: true,
        currentMove: move,
        history: [...state.history, move],
      };
    });
  },

  undo: () => {
    set((state) => {
      if (state.isAnimating || state.moveQueue.length > 0 || state.isResetting || state.history.length === 0) return state;
      const lastMove = state.history[state.history.length - 1];
      const inverseMove = getInverseMove(lastMove);
      return {
        isAnimating: true,
        currentMove: inverseMove,
        history: state.history.slice(0, -1),
      };
    });
  },

  shuffle: () => {
    const moves: Move[] = ["U", "U'", "D", "D'", "R", "R'", "L", "L'", "F", "F'", "B", "B'"];
    const randomMoves: Move[] = [];
    for (let i = 0; i < 20; i++) {
      randomMoves.push(moves[Math.floor(Math.random() * moves.length)]);
    }
    
    set((state) => {
      if (state.isAnimating || state.moveQueue.length > 0 || state.isResetting) return state;
      const firstMove = randomMoves[0];
      const remainingMoves = randomMoves.slice(1);
      return {
        isAnimating: true,
        currentMove: firstMove,
        moveQueue: remainingMoves,
        history: [...state.history, firstMove],
      };
    });
  },

  reset: () => {
    set((state) => {
      if (state.isAnimating || state.moveQueue.length > 0 || state.isResetting || state.history.length === 0) return state;
      const lastMove = state.history[state.history.length - 1];
      const inverseMove = getInverseMove(lastMove);
      return {
        isAnimating: true,
        currentMove: inverseMove,
        history: state.history.slice(0, -1),
        isResetting: true,
      };
    });
  },

  finishAnimation: () => {
    set((state) => {
      if (!state.currentMove) return { isAnimating: false };
      
      const newCubies = applyRotationToCubies(state.cubies, state.currentMove);
      
      let nextMove = null;
      let newQueue = state.moveQueue;
      let newHistory = state.history;
      let isResetting = state.isResetting;
      let newIsAnimating = false;

      if (isResetting) {
        if (newHistory.length > 0) {
          const lastMove = newHistory[newHistory.length - 1];
          nextMove = getInverseMove(lastMove);
          newHistory = newHistory.slice(0, -1);
          newIsAnimating = true;
        } else {
          isResetting = false;
        }
      } else if (newQueue.length > 0) {
        nextMove = newQueue[0];
        newQueue = newQueue.slice(1);
        newHistory = [...newHistory, nextMove];
        newIsAnimating = true;
      }

      return {
        cubies: newCubies,
        isAnimating: newIsAnimating,
        currentMove: nextMove,
        moveQueue: newQueue,
        history: newHistory,
        isResetting,
      };
    });
  },
}));
