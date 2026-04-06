import { create } from "zustand";
import { persist } from "zustand/middleware";

type Screen = "title" | "question" | "confirm" | "complete" | "myrecord";

interface InterviewState {
  screen: Screen;
  currentQ: number;
  answers: string[];
  textInput: string;
  nickname: string;
  contact: string;
  voice: "aoyama" | "kenzaki";
  // actions
  setScreen: (s: Screen) => void;
  setCurrentQ: (n: number) => void;
  addAnswer: (text: string) => void;
  popAnswer: () => string;
  setTextInput: (t: string) => void;
  setNickname: (n: string) => void;
  setContact: (c: string) => void;
  setVoice: (v: "aoyama" | "kenzaki") => void;
  reset: () => void;
  hasProgress: () => boolean;
}

const INITIAL = {
  screen: "title" as Screen,
  currentQ: 0,
  answers: [] as string[],
  textInput: "",
  nickname: "",
  contact: "",
  voice: "aoyama" as const,
};

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      setScreen: (screen) => set({ screen }),
      setCurrentQ: (currentQ) => set({ currentQ }),
      addAnswer: (text) => set((s) => ({ answers: [...s.answers, text], textInput: "" })),
      popAnswer: () => {
        const s = get();
        const prev = s.currentQ - 1;
        const old = s.answers[prev] || "";
        set({ answers: s.answers.slice(0, prev), currentQ: prev, textInput: old });
        return old;
      },
      setTextInput: (textInput) => set({ textInput }),
      setNickname: (nickname) => set({ nickname }),
      setContact: (contact) => set({ contact }),
      setVoice: (voice) => set({ voice }),
      reset: () => set(INITIAL),
      hasProgress: () => {
        const s = get();
        return s.screen !== "title" && (s.answers.length > 0 || s.currentQ > 0);
      },
    }),
    {
      name: "ai-mendan-progress",
      skipHydration: true,
      partialize: (state) => ({
        screen: state.screen,
        currentQ: state.currentQ,
        answers: state.answers,
        textInput: state.textInput,
        nickname: state.nickname,
        contact: state.contact,
        voice: state.voice,
      }),
    }
  )
);
