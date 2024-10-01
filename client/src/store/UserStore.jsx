import { create } from "zustand";

const useStore = create((set) => ({
  isLoading: false,
  setIsLoading: () => set({ isLoading: true }),

  userId: null,
  isAuthenticated: false,


  setUserId: () => () => {
    const userId = localStorage.getItem("userId");
    set({userId:userId,isAuthenticated:true})

  }
}));

export default useStore;
