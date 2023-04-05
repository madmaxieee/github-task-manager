import { type RequiredLabels } from "@/utils/labels";
import type { Session } from "next-auth";
import { createStore } from "zustand/vanilla";

type UpdateRepoDataParams = {
  owner: string;
  name: string;
  data: Partial<{ id: string; labels: RequiredLabels | null }>;
};
export interface Store {
  session: Session | null;
  setSession: (session: Session | null) => void;
  repoData: {
    [owner: string]: {
      [name: string]: {
        id: string;
        labels: RequiredLabels | null;
      };
    };
  };
  updateRepoData: (params: UpdateRepoDataParams) => void;
  updateManyRepoData: (params: UpdateRepoDataParams[]) => void;
}

const store = createStore<Store>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  repoData: {},
  updateRepoData: ({ owner, name, data: { id, labels } }) => {
    const newRepoData = store.getState().repoData[owner]?.[name] ?? {
      id: "",
      labels: null,
    };

    if (id) newRepoData.id = id;
    if (labels) newRepoData.labels = labels;

    set({
      repoData: {
        ...store.getState().repoData,
        [owner]: {
          ...store.getState().repoData[owner],
          [name]: newRepoData,
        },
      },
    });
  },
  updateManyRepoData: (params) => {
    params.forEach((param) => store.getState().updateRepoData(param));
  },
}));

export default store;
