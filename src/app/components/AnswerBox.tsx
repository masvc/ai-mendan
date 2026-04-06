"use client";

type Props = {
  inputMode: "voice" | "text";
  textInput: string;
  isRecording: boolean;
  onTextChange: (text: string) => void;
  onSwitchMode: () => void;
};

export default function AnswerBox({ inputMode, textInput, isRecording, onTextChange, onSwitchMode }: Props) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl">
      <div className="px-6 py-6">
        {inputMode === "voice" ? (
          <>
            <div className="bg-slate-50/80 rounded-xl px-5 py-4 text-base text-slate-700 leading-relaxed min-h-[80px]">
              {textInput || <span className="text-slate-400">音声認識の結果がここに表示されます</span>}
              {isRecording && <span className="animate-pulse text-red-500 ml-0.5">...</span>}
            </div>
            <div className="mt-4">
              <button onClick={onSwitchMode} className="text-base text-slate-400 underline underline-offset-2">テキスト入力</button>
            </div>
          </>
        ) : (
          <>
            <div>
              <textarea
                value={textInput}
                onChange={e => onTextChange(e.target.value)}
                placeholder="ここに入力..."
                className="w-full border border-slate-200 rounded-xl p-4 text-base bg-white/80 text-slate-700 outline-none resize-none h-[80px]"
              />
            </div>
            <div className="mt-4">
              <button onClick={onSwitchMode} className="text-base text-slate-400 underline underline-offset-2">音声入力</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
