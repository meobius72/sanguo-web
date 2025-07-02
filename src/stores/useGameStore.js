
import { create } from 'zustand';
import { initialTerritories } from '../data/initialGameData';

export const useGameStore = create((set) => ({
  territories: initialTerritories,
  turn: 1,
  selectedTerritoryId: null,

  // 액션: 영토 선택
  selectTerritory: (id) => set({ selectedTerritoryId: id }),

  // 액션: 턴 진행
  nextTurn: () => set((state) => {
    const newTerritories = { ...state.territories };
    for (const id in newTerritories) {
      newTerritories[id].gold += 100; // 매 턴 금 100씩 증가
    }
    return {
      turn: state.turn + 1,
      territories: newTerritories,
    };
  }),
}));
