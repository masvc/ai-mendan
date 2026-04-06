"use client";

import { useState, useRef, useCallback } from "react";
import Character from "./Character";

const CONFIG = {
  characterName: "翔平",
  greeting:
    "こんにちは、AIの翔平です。\n\n今日は応募というより、ちょっとしたお話の時間です。正解はありません。\n\nあなたに合いそうな働き方を、一緒に考えられたらうれしいな。",
  completeMessage:
    "今日はお話を聞かせてくれて、ありがとう！\n\nあなたの想いは、スタッフがきちんと目を通します。\n2日以内にご連絡しますので、少しだけお待ちください。",
};

const QUESTIONS = [
  { q: "最近「誰かの役に立てた」と感じた出来事はある？\nなんでもいいよ、小さなことでも。", short: "役に立てた経験", reaction: "そうなんだ、素敵だね。ありがとう。" },
  { q: "仕事で大切にしていることを3つ挙げるとしたら何かな？", short: "仕事で大切なこと", reaction: "なるほどね、いい考え方だと思うよ。" },
  { q: "これまでの職場で「嬉しかったこと」と「しんどかったこと」を教えてくれる？", short: "嬉しい/しんどい経験", reaction: "話してくれてありがとう。気持ちわかるよ。" },
  { q: "人と関わる仕事で、心がけていることってある？", short: "心がけていること", reaction: "うん、それは大事なことだよね。" },
  { q: "ここで働くことに興味を持った理由を教えてくれる？", short: "興味を持った理由", reaction: "ありがとう。そう思ってくれて嬉しいよ。" },
  { q: "チームで働くとき、意識していることは？", short: "チームワーク", reaction: "チームワーク大事にしてるんだね。" },
  { q: "これまでの経験の中で「成長できた」と感じた瞬間ってある？", short: "成長の瞬間", reaction: "いい経験をしてきたんだね。" },
  { q: "どんな働き方をしてみたい？\n希望や理想があれば聞かせて。", short: "希望の働き方", reaction: "ありがとう！全部聞けてよかった。" },
];

type Screen = "title" | "greeting" | "question" | "reaction" | "confirm" | "contact" | "complete";

export default function Interview() {
  const [screen, setScreen] = useState<Screen>("title");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [displayText, setDisplayText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [nickname, setNickname] = useState("");
  const [contact, setContact] = useState("");
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [showUI, setShowUI] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const showText = useCallback((text: string) => { setDisplayText(text); setShowUI(false); }, []);
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !window.speechSynthesis) { setIsSpeaking(false); setTimeout(() => { setShowUI(true); onEnd?.(); }, 300); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\n/g, "。"));
    u.lang = "ja-JP"; u.rate = 1.0; u.pitch = 0.85;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => { setIsSpeaking(false); setShowUI(true); onEnd?.(); };
    u.onerror = () => { setIsSpeaking(false); setShowUI(true); onEnd?.(); };
    window.speechSynthesis.speak(u);
  }, []);
  const sayText = useCallback((text: string, onEnd?: () => void) => { showText(text); setIsSpeaking(true); speak(text, onEnd); }, [showText, speak]);

  const startRecording = useCallback(() => {
    const API = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
    if (!API) { setInputMode("text"); return; }
    const r = new API(); r.lang = "ja-JP"; r.interimResults = true; r.continuous = true;
    r.onresult = (e: SpeechRecognitionEvent) => { let t = ""; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; setTextInput(t); };
    r.onerror = () => { setIsRecording(false); setInputMode("text"); };
    r.onend = () => setIsRecording(false);
    recognitionRef.current = r; r.start(); setIsRecording(true);
  }, []);
  const stopRecording = useCallback(() => { recognitionRef.current?.stop(); setIsRecording(false); }, []);

  const startInterview = () => { setScreen("greeting"); sayText(CONFIG.greeting); };
  const startQuestions = () => { window.speechSynthesis?.cancel(); setIsSpeaking(false); setScreen("question"); setCurrentQ(0); goToQuestion(0); };
  const goToQuestion = (idx: number) => { setTextInput(""); sayText(QUESTIONS[idx].q); };
  const submitAnswer = () => {
    if (!textInput.trim()) return;
    window.speechSynthesis?.cancel(); setIsSpeaking(false); stopRecording();
    setAnswers(prev => [...prev, textInput.trim()]); setScreen("reaction");
    sayText(QUESTIONS[currentQ].reaction, () => { setTimeout(() => { if (currentQ + 1 < QUESTIONS.length) { const n = currentQ + 1; setCurrentQ(n); setScreen("question"); goToQuestion(n); } else { setScreen("confirm"); } }, 600); });
  };
  const goToContact = () => { window.speechSynthesis?.cancel(); setIsSpeaking(false); setScreen("contact"); sayText("ありがとう！最後に、連絡先を教えてもらえるかな？"); };
  const submitContact = () => { if (!nickname.trim() || !contact.trim()) return; setScreen("complete"); sayText(CONFIG.completeMessage); };

  const expression: "normal" | "smile" | "happy" | "talking" = isSpeaking ? "talking" : (screen === "complete" || screen === "reaction") ? "happy" : screen === "greeting" ? "smile" : "normal";
  const progress = (screen === "complete" || screen === "contact" || screen === "confirm") ? 100 : (screen === "question" || screen === "reaction") ? ((currentQ + 1) / QUESTIONS.length) * 100 : 0;

  const Btn = ({ onClick, children, disabled, variant = "primary", className = "" }: { onClick: () => void; children: React.ReactNode; disabled?: boolean; variant?: "primary" | "ghost" | "danger"; className?: string }) => {
    const base = "w-full py-3.5 rounded-lg font-semibold text-[15px] transition-colors active:opacity-80 disabled:opacity-40";
    const styles = { primary: "bg-[#1e293b] text-white", ghost: "bg-transparent text-slate-400 border border-slate-300", danger: "bg-red-600 text-white" };
    return <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>{children}</button>;
  };

  // ===== タイトル =====
  if (screen === "title") {
    return (
      <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] bg-white flex flex-col items-center justify-center px-8">
        <h1 className="text-4xl font-black text-slate-800 tracking-wide">AI面談</h1>
        <p className="text-slate-400 text-xs tracking-[0.2em] mt-2 mb-8">INTERVIEW</p>
        <p className="text-slate-600 text-base font-medium mb-2">履歴書なし・スマホで10分</p>
        <p className="text-slate-400 text-xs mb-12">匿名OK / 音声で回答 / 8問</p>
        <Btn onClick={startInterview} className="max-w-[280px]">はじめる</Btn>
        <p className="mt-8 text-slate-400 text-[11px]">AI面接官「翔平」が質問します</p>
      </div>
    );
  }

  // ===== 回答確認 =====
  if (screen === "confirm") {
    return (
      <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] bg-white flex flex-col">
        <div className="px-5 pt-6 pb-4">
          <h2 className="text-slate-800 text-lg font-bold">あなたの回答</h2>
          <p className="text-slate-400 text-xs mt-1">内容を確認して、よければ提出してください</p>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4 space-y-4">
          {QUESTIONS.map((q, i) => (
            <div key={i}>
              <p className="text-slate-400 text-[11px] font-bold mb-1">Q{i + 1}. {q.short}</p>
              <p className="text-slate-700 text-sm leading-relaxed">{answers[i] || "（未回答）"}</p>
              {i < QUESTIONS.length - 1 && <div className="border-b border-slate-100 mt-4" />}
            </div>
          ))}
        </div>
        <div className="px-5 pb-8 pt-4 space-y-3 border-t border-slate-100">
          <Btn onClick={goToContact}>この内容で提出する</Btn>
          <Btn onClick={() => location.reload()} variant="ghost">やり直す</Btn>
        </div>
      </div>
    );
  }

  // ===== メイン =====
  return (
    <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] flex flex-col bg-white">
      {/* キャラエリア */}
      <div className="relative flex-[55] min-h-0 overflow-hidden bg-slate-100">
        {/* プログレス */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 z-20">
          <div className="h-full bg-slate-800 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        {/* Qカウンター */}
        {(screen === "question" || screen === "reaction") && (
          <div className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm rounded-md px-3 py-1 text-center">
            <p className="text-slate-400 text-[9px] font-bold">QUESTION</p>
            <p className="text-slate-800 text-lg font-black leading-none">{currentQ + 1}<span className="text-slate-400 text-xs font-normal">/{QUESTIONS.length}</span></p>
          </div>
        )}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[2]">
          <Character expression={expression} />
        </div>
      </div>

      {/* UI部分 */}
      <div className="flex-[45] min-h-0 flex flex-col">
        {/* セリフ */}
        <div className="bg-[#1e293b] px-5 py-4">
          <p className="text-slate-400 text-[11px] font-bold mb-1">{CONFIG.characterName}</p>
          <p className="text-white text-[15px] leading-[1.85] whitespace-pre-wrap min-h-[44px]">
            {"「"}{displayText}{"」"}
          </p>
        </div>

        {/* 操作 */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-white px-5 py-4 space-y-3">

          {screen === "greeting" && showUI && (
            <div className="animate-fade-up">
              <Btn onClick={startQuestions}>質問をはじめる</Btn>
            </div>
          )}

          {screen === "question" && showUI && inputMode === "voice" && (
            <div className="space-y-3 animate-fade-up">
              <p className="text-slate-400 text-[11px] font-bold">あなたの回答</p>
              <div className="bg-slate-50 rounded-lg px-4 py-3 text-[14px] text-slate-700 leading-relaxed min-h-[44px]">
                {textInput || <span className="text-slate-400">音声認識の結果がここに表示されます</span>}
                {isRecording && <span className="animate-pulse text-red-500 ml-0.5">...</span>}
              </div>
              <div className="flex gap-3">
                {!isRecording ? (
                  <Btn onClick={startRecording} variant="danger" className="!w-auto px-5 flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                    {textInput ? "再録音" : "話す"}
                  </Btn>
                ) : (
                  <Btn onClick={stopRecording} variant="ghost" className="!w-auto px-5 flex items-center justify-center gap-2 animate-rec-pulse">
                    <span className="w-3 h-3 bg-red-500 rounded-sm" />停止
                  </Btn>
                )}
                <Btn onClick={submitAnswer} disabled={!textInput.trim()}>次へ進む</Btn>
              </div>
              <button onClick={() => setInputMode("text")} className="w-full py-1 text-[11px] text-slate-400 underline underline-offset-2">テキスト入力に切り替え</button>
            </div>
          )}

          {screen === "question" && showUI && inputMode === "text" && (
            <div className="space-y-3 animate-fade-up">
              <p className="text-slate-400 text-[11px] font-bold">あなたの回答</p>
              <textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="ここに入力..." className="vn-input resize-none h-[76px]" />
              <div className="flex gap-3">
                <button onClick={() => setInputMode("voice")} className="py-3.5 px-4 rounded-lg border border-slate-200 text-slate-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                </button>
                <Btn onClick={submitAnswer} disabled={!textInput.trim()}>次へ進む</Btn>
              </div>
            </div>
          )}

          {screen === "contact" && showUI && (
            <div className="space-y-4 animate-fade-up">
              <div>
                <label className="text-slate-500 text-xs block mb-1">ニックネーム</label>
                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="例：たろう" className="vn-input" />
              </div>
              <div>
                <label className="text-slate-500 text-xs block mb-1">電話番号 または LINE ID</label>
                <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="例：090-xxxx-xxxx" className="vn-input" />
              </div>
              <Btn onClick={submitContact} disabled={!nickname.trim() || !contact.trim()}>送信する</Btn>
            </div>
          )}

          {screen === "complete" && showUI && (
            <div className="space-y-4 animate-fade-up">
              <div>
                <p className="text-slate-800 font-bold text-sm mb-3">AI要約レポート（デモ）</p>
                <p className="text-slate-500 text-xs mb-3">{nickname} / {contact}</p>
                <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
                  <p><span className="font-bold text-slate-700">価値観:</span> 人の役に立つことにやりがいを感じるタイプ。チームワーク重視。</p>
                  <p><span className="font-bold text-slate-700">希望:</span> 安定した環境で長く働きたい。利用者との関わりを大切に。</p>
                  <p><span className="font-bold text-slate-700">総合:</span> 理念と合致。長期定着の可能性あり。二次面接を推奨。</p>
                </div>
              </div>
              <Btn onClick={() => location.reload()} variant="ghost">もう一度体験する</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
