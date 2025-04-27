import { create } from 'zustand';

interface SideBarState {
  isSideBarOpen: boolean;
  isSideBarCollapsed: boolean;
  openSideBar: () => void;
  closeSideBar: () => void;
  toggleSideBar: () => void;
  setSideBarCollapsed: (collapsed: boolean) => void;
  toggleSideBarCollapsed: () => void;
}

export const useSideBarStore = create<SideBarState>((set) => ({
  isSideBarOpen: false,
  isSideBarCollapsed: false,
  openSideBar: () => set({ isSideBarOpen: true }),
  closeSideBar: () => set({ isSideBarOpen: false }),
  toggleSideBar: () => set((state) => ({ isSideBarOpen: !state.isSideBarOpen })),
  setSideBarCollapsed: (collapsed) => set({ isSideBarCollapsed: collapsed }),
  toggleSideBarCollapsed: () => set((state) => ({ isSideBarCollapsed: !state.isSideBarCollapsed })),
}));