import { create } from 'zustand';

interface MessageState {
  message: string | null;
  setMessage: (msg: string | null) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  message: null,
  setMessage: (msg) => {
    set({ message: msg });
    if (msg) {
      setTimeout(() => set({ message: null }), 3000);
    }
  },
}));