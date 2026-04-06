"use client";

type Props = {
  textInput: string;
  isRecording: boolean;
};

function wrapText(text: string, len: number) {
  const lines: string[] = [];
  for (let i = 0; i < text.length; i += len) {
    lines.push(text.slice(i, i + len));
  }
  return lines;
}

export default function AnswerBox({ textInput, isRecording }: Props) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-dashed border-red-400">
      <div className="px-6 py-6">
        <div className="bg-slate-50/80 rounded-xl px-5 py-4 text-base text-slate-700 leading-relaxed h-[150px] overflow-y-auto break-words flex items-center justify-center text-center whitespace-pre-wrap">
          {textInput ? wrapText(textInput, 17).join("\n") : <span className="text-slate-400">{isRecording ? "音声認識中..." : "話すボタンで音声入力"}</span>}
          {isRecording && <span className="animate-pulse text-red-500 ml-0.5">...</span>}
        </div>
      </div>
    </div>
  );
}
