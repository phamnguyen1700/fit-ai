'use client';

import { create } from 'zustand';

// Generic Filter Store cho search, sort, filter
interface FilterState {
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filters: Record<string, any>;
}

interface FilterActions {
  setSearchTerm: (term: string) => void;
  setSortBy: (field: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;
  getFilterValue: (key: string) => any;
}

const initialState: FilterState = {
  searchTerm: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  filters: {},
};

export const useFilterStore = create<FilterState & FilterActions>((set, get) => ({
  ...initialState,
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  setSortBy: (field) => set({ sortBy: field }),
  
  setSortOrder: (order) => set({ sortOrder: order }),
  
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  
  resetFilters: () => set({
    searchTerm: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    filters: {},
  }),
  
  getFilterValue: (key) => get().filters[key],
}));
