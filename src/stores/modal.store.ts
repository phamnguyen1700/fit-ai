'use client';

import { create } from 'zustand';

// Generic Modal Store cho các loại modal chung
interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: any;
}

interface ModalActions {
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  setData: (data: any) => void;
}

const initialState: ModalState = {
  isOpen: false,
  type: null,
  data: null,
};

export const useModalStore = create<ModalState & ModalActions>((set) => ({
  ...initialState,
  
  openModal: (type, data = null) => set({ 
    isOpen: true, 
    type, 
    data 
  }),
  
  closeModal: () => set({ 
    isOpen: false, 
    type: null, 
    data: null 
  }),
  
  setData: (data) => set({ data }),
}));
