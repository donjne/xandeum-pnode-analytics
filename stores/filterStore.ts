import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type FilterStatus = 'all' | 'online' | 'offline';
export type FilterVersion = 'all' | string;
export type FilterStorageRange = 'all' | 'low' | 'medium' | 'high';
export type FilterHealthRange = 'all' | 'excellent' | 'good' | 'fair' | 'poor';
export type SortBy = 'uptime' | 'credits' | 'storage' | 'lastSeen' | 'version' | 'health' | 'utilization';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list' | 'cards';

interface FilterState {
  // Filters
  searchQuery: string;
  status: FilterStatus;
  version: FilterVersion;
  storageRange: FilterStorageRange;
  healthRange: FilterHealthRange;
  
  // Sorting
  sortBy: SortBy;
  sortOrder: SortOrder;
  
  // View
  viewMode: ViewMode;
  itemsPerPage: number;
  currentPage: number;
  
  // Filter presets
  savedPresets: Array<{
    id: string;
    name: string;
    filters: {
      status: FilterStatus;
      version: FilterVersion;
      storageRange: FilterStorageRange;
      healthRange: FilterHealthRange;
      sortBy: SortBy;
      sortOrder: SortOrder;
    };
  }>;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setStatus: (status: FilterStatus) => void;
  setVersion: (version: FilterVersion) => void;
  setStorageRange: (range: FilterStorageRange) => void;
  setHealthRange: (range: FilterHealthRange) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
  toggleSortOrder: () => void;
  setViewMode: (mode: ViewMode) => void;
  setItemsPerPage: (items: number) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
  clearSearch: () => void;
  
  // Preset actions
  savePreset: (name: string) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;
  
  // Computed helpers
  hasActiveFilters: () => boolean;
  getActiveFilterCount: () => number;
}

const initialState = {
  searchQuery: '',
  status: 'all' as FilterStatus,
  version: 'all' as FilterVersion,
  storageRange: 'all' as FilterStorageRange,
  healthRange: 'all' as FilterHealthRange,
  sortBy: 'uptime' as SortBy,
  sortOrder: 'desc' as SortOrder,
  viewMode: 'grid' as ViewMode,
  itemsPerPage: 20,
  currentPage: 1,
  savedPresets: [],
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setSearchQuery: (query) => 
        set({ searchQuery: query, currentPage: 1 }),
      
      setStatus: (status) => 
        set({ status, currentPage: 1 }),
      
      setVersion: (version) => 
        set({ version, currentPage: 1 }),
      
      setStorageRange: (storageRange) => 
        set({ storageRange, currentPage: 1 }),
      
      setHealthRange: (healthRange) => 
        set({ healthRange, currentPage: 1 }),
      
      setSortBy: (sortBy) => 
        set({ sortBy }),
      
      setSortOrder: (sortOrder) => 
        set({ sortOrder }),
      
      toggleSortOrder: () => 
        set((state) => ({ 
          sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' 
        })),
      
      setViewMode: (viewMode) => 
        set({ viewMode }),
      
      setItemsPerPage: (itemsPerPage) => 
        set({ itemsPerPage, currentPage: 1 }),
      
      setCurrentPage: (currentPage) => 
        set({ currentPage }),
      
      resetFilters: () => 
        set({
          searchQuery: '',
          status: 'all',
          version: 'all',
          storageRange: 'all',
          healthRange: 'all',
          sortBy: 'uptime',
          sortOrder: 'desc',
          currentPage: 1,
        }),
      
      clearSearch: () => 
        set({ searchQuery: '', currentPage: 1 }),
      
      savePreset: (name) => {
        const state = get();
        const newPreset = {
          id: `preset_${Date.now()}`,
          name,
          filters: {
            status: state.status,
            version: state.version,
            storageRange: state.storageRange,
            healthRange: state.healthRange,
            sortBy: state.sortBy,
            sortOrder: state.sortOrder,
          },
        };
        set({ 
          savedPresets: [...state.savedPresets, newPreset] 
        });
      },
      
      loadPreset: (id) => {
        const preset = get().savedPresets.find(p => p.id === id);
        if (preset) {
          set({
            status: preset.filters.status,
            version: preset.filters.version,
            storageRange: preset.filters.storageRange,
            healthRange: preset.filters.healthRange,
            sortBy: preset.filters.sortBy,
            sortOrder: preset.filters.sortOrder,
            currentPage: 1,
          });
        }
      },
      
      deletePreset: (id) => {
        set((state) => ({
          savedPresets: state.savedPresets.filter(p => p.id !== id)
        }));
      },
      
      hasActiveFilters: () => {
        const state = get();
        return (
          state.status !== 'all' ||
          state.version !== 'all' ||
          state.storageRange !== 'all' ||
          state.healthRange !== 'all' ||
          state.searchQuery.trim() !== ''
        );
      },
      
      getActiveFilterCount: () => {
        const state = get();
        let count = 0;
        if (state.status !== 'all') count++;
        if (state.version !== 'all') count++;
        if (state.storageRange !== 'all') count++;
        if (state.healthRange !== 'all') count++;
        if (state.searchQuery.trim() !== '') count++;
        return count;
      },
    }),
    {
      name: 'xandeum-filter-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        viewMode: state.viewMode,
        itemsPerPage: state.itemsPerPage,
        savedPresets: state.savedPresets,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);