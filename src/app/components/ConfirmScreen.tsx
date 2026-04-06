"use client";

import { useForm } from "react-hook-form";
import { Drawer } from "vaul";
import { RotateCcw, Send } from "lucide-react";
import { QUESTIONS } from "./Interview";

type FormData = {
  nickname: string;
  contact: string;
};

type Props = {
  answers: string[];
  nickname: string;
  contact: string;
  onNicknameChange: (v: string) => void;
  onContactChange: (v: string) => void;
  onSubmit: () => void;
  onRestart: () => void;
  audioBlobs: Blob[];
  showAnswers: boolean;
  setShowAnswers: (v: boolean) => void;
};

export default function ConfirmScreen({
  answers, nickname, contact,
  onNicknameChange, onContactChange, onSubmit, onRestart,
  audioBlobs, showAnswers, setShowAnswers,
}: Props) {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    mode: "onChange",
    defaultValues: { nickname, contact },
  });

  const doSubmit = (data: FormData) => {
    onNicknameChange(data.nickname);
    onContactChange(data.contact);
    setTimeout(onSubmit, 0);
  };

  return (
    <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] bg-white flex flex-col">
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-slate-800 text-lg font-bold">回答の確認・提出</h2>
        <p className="text-slate-400 text-base mt-1">内容を確認し、連絡先を入力して提出してください</p>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 space-y-4">
        <form id="contact-form" onSubmit={handleSubmit(doSubmit)} className="bg-slate-50 rounded-xl px-5 py-5 space-y-4">
          <p className="text-slate-800 text-base font-bold text-center">連絡先</p>
          <div>
            <label className="text-slate-500 text-sm block mb-1">ニックネーム <span className="text-red-400">*</span></label>
            <input
              {...register("nickname", { required: "入力してください" })}
              onChange={(e) => { register("nickname").onChange(e); onNicknameChange(e.target.value); }}
              placeholder="例：たろう"
              className="vn-input"
            />
            {errors.nickname && <p className="text-red-400 text-xs mt-1">{errors.nickname.message}</p>}
          </div>
          <div>
            <label className="text-slate-500 text-sm block mb-1">電話番号 または LINE ID <span className="text-red-400">*</span></label>
            <input
              {...register("contact", { required: "入力してください" })}
              onChange={(e) => { register("contact").onChange(e); onContactChange(e.target.value); }}
              placeholder="例：090-xxxx-xxxx"
              className="vn-input"
            />
            {errors.contact && <p className="text-red-400 text-xs mt-1">{errors.contact.message}</p>}
          </div>
        </form>

        {/* 回答確認ボトムシート */}
        <Drawer.Root open={showAnswers} onOpenChange={setShowAnswers}>
          <Drawer.Trigger asChild>
            <button className="w-full py-4 rounded-xl text-base font-bold text-slate-500 border-2 border-slate-200 active:translate-y-[1px] transition-all shadow-[0_2px_0_#e2e8f0] active:shadow-none">
              回答内容を確認する
            </button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col max-h-[85vh] rounded-t-2xl bg-white">
              <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-3 mb-2" />
              <Drawer.Title className="px-5 pb-3 text-slate-800 text-lg font-bold border-b border-slate-100">回答内容</Drawer.Title>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {QUESTIONS.map((q, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl px-5 py-4">
                    <p className="text-slate-400 text-sm font-bold mb-2">Q{i + 1}. {q.short}</p>
                    <p className="text-slate-700 text-base leading-relaxed">{answers[i] || "（未回答）"}</p>
                    {audioBlobs[i] && (
                      <audio controls src={URL.createObjectURL(audioBlobs[i])} className="mt-2 w-full h-8" />
                    )}
                  </div>
                ))}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>

      <div className="bg-white/70 backdrop-blur-md border-t border-slate-100 px-6 py-6 flex justify-around items-center">
        <button onClick={onRestart} className="w-[80px] h-[80px] flex flex-col items-center justify-center rounded-2xl text-sm font-bold border-2 border-slate-200 text-slate-400 shadow-[0_2px_0_#e2e8f0] active:translate-y-[1px] active:shadow-none transition-all">
          <RotateCcw size={20} />
          <span className="mt-1">もう一度</span>
        </button>
        <button type="submit" form="contact-form" disabled={!isValid} className="w-[90px] h-[90px] flex flex-col items-center justify-center rounded-2xl font-bold text-base bg-[#1e293b] text-white shadow-[0_2px_0_#0f172a] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-40 gap-1">
          <Send size={22} />
          <span className="text-sm">提出する</span>
        </button>
      </div>
    </div>
  );
}
