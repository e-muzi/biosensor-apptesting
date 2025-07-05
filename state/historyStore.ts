import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { HistoryRecord } from '../types';

interface HistoryState {
  records: HistoryRecord[];
  addRecord: (record: HistoryRecord) => void;
  removeRecord: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) => set({ records: [record, ...get().records] }),
      removeRecord: (id) => set({ records: get().records.filter((r) => r.id !== id) }),
      clearHistory: () => set({ records: [] }),
    }),
    {
      name: 'aptasense-history-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
