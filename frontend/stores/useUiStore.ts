'use client';
import { create } from 'zustand';
import type { LogFormValues } from '@/schemas/constlog.schema';

type UiStore = {
  isModalOpen: boolean;
  editingLog: LogFormValues | null;
  openModal: (log?: LogFormValues) => void;
  closeModal: () => void;
  sort: 'asc' | 'desc';
  setSort: (value: 'asc' | 'desc') => void;
};

export const useUiStore = create<UiStore>((set) => ({
  isModalOpen: false,
  editingLog: null,
  sort: 'desc',
  openModal: (log) => {
    set((state) => ({ ...state, isModalOpen: true, editingLog: log }));
  },
  closeModal: () => {
    set((state) => ({ ...state, isModalOpen: false, editingLog: null }));
  },
  setSort: (value) => {
    set((state) => ({
      ...state,
      sort: value,
    }));
  },
}));
