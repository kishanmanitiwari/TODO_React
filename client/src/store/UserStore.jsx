import { create } from "zustand";

const useStore = create((set) => ({
  isLoading: false,
  setIsLoading: (loadingState) => set({ isLoading: loadingState }),

  userId: null,
  userName:null,
  isAuthenticated: false,

  setUserId: (userId) => set({ userId }),
  setUserName: (userName) => set({ userName }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
}));

export default useStore;
