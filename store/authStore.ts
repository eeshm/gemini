import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  login: (phoneNumber: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      phoneNumber: null,
      login: (phoneNumber: string) =>
        set({ isAuthenticated: true, phoneNumber }),
      logout: () => set({ isAuthenticated: false, phoneNumber: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
