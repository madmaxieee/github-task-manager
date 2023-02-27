import type { Session } from "next-auth";
import { createStore } from "zustand/vanilla";

export interface Store {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

const store = createStore<Store>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
}));

export default store;
