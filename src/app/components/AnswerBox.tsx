"use client";

import { Type, X } from "lucide-react";
import { useState } from "react";

type Props = {
  textInput: string;
  isRecording: boolean;
  onTextChange: (text: string) => void;
};

export default function AnswerBox({ textInput, isRecording, onTextChange }: Props) {
  const [isTyping, setIsTyping] = useState(false);

  if (isTyping) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-slate-300 relative">
        <button
          onClick={() => setIsTyping(false)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 active:bg-slate-300 transition-colors z-10"
        >
          <X size={18} />
        </button>
        <div className="px-4 py-4">
          <textarea
            autoFocus
            value={textInput}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="テキストで入力..."
            className="w-full bg-slate-50/80 rounded-xl px-4 py-3 text-base text-slate-700 leading-relaxed h-[130px] resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-dashed border-red-400">
      <div className="px-6 py-6">
        <div className="bg-slate-50/80 rounded-xl px-5 py-4 text-base text-slate-700 leading-relaxed h-[120px] overflow-y-auto break-words flex items-center justify-center text-center whitespace-pre-wrap">
          {textInput ? textInput : <span className="text-slate-400">{isRecording ? "音声認識中..." : "話すボタンで音声入力"}</span>}
          {isRecording && <span className="animate-pulse text-red-500 ml-0.5">...</span>}
        </div>
        <button
          onClick={() => setIsTyping(true)}
          className="mt-3 w-full flex items-center justify-center gap-2 text-base font-bold text-slate-500 active:text-slate-700 transition-colors py-2"
        >
          <Type size={20} />
          <span>テキストで入力する</span>
        </button>
      </div>
    </div>
  );
}
