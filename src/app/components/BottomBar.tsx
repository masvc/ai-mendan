"use client";

type Props = {
  onBack?: () => void;
  onRecord: () => void;
  onStop: () => void;
  onNext: () => void;
  onRestart?: () => void;
  isRecording: boolean;
  canGoBack: boolean;
  canGoNext: boolean;
  disabled: boolean;
  mode: "question" | "complete";
  recordLabel: string;
};

export default function BottomBar({ onBack, onRecord, onStop, onNext, onRestart, isRecording, canGoBack, canGoNext, disabled, mode, recordLabel }: Props) {
  const btnBase = "flex flex-col items-center justify-center transition-all duration-150 active:translate-y-[1px]";

  if (mode === "complete") {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-2xl">
        <div className="px-6 py-8 flex justify-around items-center">
          <button onClick={onRestart} className={`${btnBase} w-[80px] h-[80px] rounded-2xl border-2 border-slate-200 text-slate-400 shadow-[0_2px_0_#e2e8f0] active:shadow-none`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
            <span className="text-base font-bold mt-0.5">再開</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl">
      <div className="px-6 py-8 flex justify-around items-center">
        <button onClick={onBack} disabled={!canGoBack || disabled} className={`${btnBase} w-[80px] h-[80px] rounded-2xl text-slate-400 disabled:opacity-30 border-2 border-slate-200 shadow-[0_2px_0_#e2e8f0] active:shadow-none`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          <span className="text-base font-bold mt-0.5">戻る</span>
        </button>

        {!isRecording ? (
          <button onClick={onRecord} disabled={disabled} className={`${btnBase} w-[90px] h-[90px] rounded-2xl bg-red-600 text-white disabled:opacity-30 shadow-[0_2px_0_#991b1b] active:shadow-none`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            <span className="text-base font-bold mt-1">{recordLabel}</span>
          </button>
        ) : (
          <button onClick={onStop} className={`${btnBase} w-[90px] h-[90px] rounded-2xl bg-slate-700 text-white shadow-[0_2px_0_#334155] active:shadow-none animate-rec-pulse`}>
            <span className="w-6 h-6 bg-red-400 rounded-md" />
            <span className="text-base font-bold mt-1">停止</span>
          </button>
        )}

        <button onClick={onNext} disabled={!canGoNext || disabled} className={`${btnBase} w-[80px] h-[80px] rounded-2xl bg-[#1e293b] text-white disabled:opacity-30 shadow-[0_2px_0_#0f172a] active:shadow-none`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          <span className="text-base font-bold mt-0.5">次へ</span>
        </button>
      </div>
    </div>
  );
}
