import { create } from "zustand";

const useStore = create((set) => ({
  isLoading: false,
  setIsLoading: () => set({ isLoading: true }),

  userId: null,
  setUserId: () => (userId) => set({ userId: userId }),
}));

export default useStore;
