'use client';
import { create } from 'zustand';
import type { LogFormValues } from '@/schemas/constlog.schema';

type UiStore = {
  isModalOpen: boolean;
  editingLog: LogFormValues | null;
  openModal: (log?: LogFormValues) => void;
  closeModal: () => void;
};

export const useUiStore = create<UiStore>((set) => ({
  isModalOpen: false,
  editingLog: null,
  openModal: (log) => set({ isModalOpen: true, editingLog: log }),
  closeModal: () => set({ isModalOpen: false, editingLog: null }),
}));
