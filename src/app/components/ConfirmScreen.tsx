"use client";

import { useForm } from "react-hook-form";
import { Drawer } from "vaul";
import { RotateCcw, Send, ClipboardList, User, Phone, CircleCheckBig, Home } from "lucide-react";
import { QUESTIONS } from "./Interview";
import { useInterviewStore } from "../store";

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
  const store = useInterviewStore();
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
    <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] bg-slate-50 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center justify-between">
        <button onClick={() => store.setScreen("title")} className="flex items-center gap-1 text-slate-400 active:text-slate-600 transition-colors">
          <Home size={18} />
          <span className="text-xs font-bold">トップ</span>
        </button>
        <p className="text-sm font-bold text-slate-800">回答の確認・提出</p>
        <div className="w-[60px]" />
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* 完了メッセージ */}
        <div className="px-6 pt-8 pb-6 text-center">
          <CircleCheckBig size={44} className="text-[#4a9e8e] mx-auto mb-4" />
          <h2 className="text-slate-800 text-2xl font-black">お疲れさまでした！</h2>
          <p className="text-slate-400 text-base mt-3">連絡先を入力して提出してください</p>
        </div>

        {/* フォーム */}
        <div className="px-5 pb-8 space-y-5">
          <form id="contact-form" onSubmit={handleSubmit(doSubmit)} className="bg-white rounded-2xl px-6 py-7 space-y-7 shadow-sm">
            <div>
              <label className="flex items-center gap-2 text-slate-700 text-base font-bold mb-3">
                <User size={18} className="text-slate-400" />
                ニックネーム <span className="text-red-400 text-sm">*</span>
              </label>
              <input
                {...register("nickname", { required: "入力してください" })}
                onChange={(e) => { register("nickname").onChange(e); onNicknameChange(e.target.value); }}
                placeholder="例：たろう"
                className="vn-input text-lg"
              />
              {errors.nickname && <p className="text-red-400 text-sm mt-2">{errors.nickname.message}</p>}
            </div>
            <div>
              <label className="flex items-center gap-2 text-slate-700 text-base font-bold mb-3">
                <Phone size={18} className="text-slate-400" />
                電話番号 または LINE ID <span className="text-red-400 text-sm">*</span>
              </label>
              <input
                {...register("contact", { required: "入力してください" })}
                onChange={(e) => { register("contact").onChange(e); onContactChange(e.target.value); }}
                placeholder="例：090-xxxx-xxxx"
                className="vn-input text-lg"
              />
              {errors.contact && <p className="text-red-400 text-sm mt-2">{errors.contact.message}</p>}
            </div>
          </form>

          {/* 回答確認ボタン */}
          <Drawer.Root open={showAnswers} onOpenChange={setShowAnswers}>
            <Drawer.Trigger asChild>
              <button className="w-full flex items-center justify-center gap-2.5 py-5 rounded-2xl text-base font-bold text-slate-500 bg-white shadow-sm active:translate-y-[1px] transition-all">
                <ClipboardList size={20} />
                回答内容を確認する
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
              <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col max-h-[85vh] rounded-t-2xl bg-white">
                <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-3 mb-2" />
                <Drawer.Title className="px-5 pb-3 text-slate-800 text-lg font-bold border-b border-slate-100">回答内容</Drawer.Title>
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                  {QUESTIONS.map((q, i) => (
                    <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <p className="text-[#4a9e8e] text-xs font-bold mb-1.5">Q{i + 1}. {q.short}</p>
                      <p className="text-slate-800 text-base leading-relaxed">{answers[i] || <span className="text-slate-300">（未回答）</span>}</p>
                      {audioBlobs[i] && (
                        <audio controls src={URL.createObjectURL(audioBlobs[i])} className="mt-3 w-full h-8" />
                      )}
                    </div>
                  ))}
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>

          <p className="text-slate-300 text-sm text-center">※提出後、2日以内にご連絡します</p>
        </div>
      </div>

      {/* 固定フッター */}
      <div className="bg-white border-t border-slate-100 px-5 py-4 flex items-center gap-3">
        <button onClick={onRestart} className="w-[70px] h-[70px] flex flex-col items-center justify-center rounded-2xl text-xs font-bold border-2 border-slate-200 text-slate-400 active:translate-y-[1px] active:bg-slate-50 transition-all shrink-0">
          <RotateCcw size={18} />
          <span className="mt-1">やり直す</span>
        </button>
        <button type="submit" form="contact-form" disabled={!isValid} className="flex-1 h-[70px] flex items-center justify-center gap-2.5 rounded-2xl font-bold text-lg bg-[#1e293b] text-white active:translate-y-[1px] transition-all disabled:opacity-40">
          <Send size={20} />
          提出する
        </button>
      </div>
    </div>
  );
}
