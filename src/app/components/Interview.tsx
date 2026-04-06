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
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setIsSpeaking(false); setTimeout(() => { setShowUI(true); onEnd?.(); }, 300); return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\n/g, "。"));
    u.lang = "ja-JP"; u.rate = 1.0; u.pitch = 0.85;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => { setIsSpeaking(false); setShowUI(true); onEnd?.(); };
    u.onerror = () => { setIsSpeaking(false); setShowUI(true); onEnd?.(); };
    window.speechSynthesis.speak(u);
  }, []);

  const sayText = useCallback((text: string, onEnd?: () => void) => {
    showText(text); setIsSpeaking(true); speak(text, onEnd);
  }, [showText, speak]);

  const startRecording = useCallback(() => {
    const API = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
    if (!API) { setInputMode("text"); return; }
    const r = new API();
    r.lang = "ja-JP"; r.interimResults = true; r.continuous = true;
    r.onresult = (e: SpeechRecognitionEvent) => {
      let t = ""; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; setTextInput(t);
    };
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
    setAnswers(prev => [...prev, textInput.trim()]);
    setScreen("reaction");
    sayText(QUESTIONS[currentQ].reaction, () => {
      setTimeout(() => {
        if (currentQ + 1 < QUESTIONS.length) {
          const next = currentQ + 1; setCurrentQ(next); setScreen("question"); goToQuestion(next);
        } else { setScreen("confirm"); }
      }, 600);
    });
  };

  const goToContact = () => { window.speechSynthesis?.cancel(); setIsSpeaking(false); setScreen("contact"); sayText("ありがとう！最後に、連絡先を教えてもらえるかな？"); };
  const submitContact = () => { if (!nickname.trim() || !contact.trim()) return; setScreen("complete"); sayText(CONFIG.completeMessage); };

  const expression: "normal" | "smile" | "happy" | "talking" =
    isSpeaking ? "talking" : (screen === "complete" || screen === "reaction") ? "happy" : screen === "greeting" ? "smile" : "normal";

  const progress = (screen === "complete" || screen === "contact" || screen === "confirm") ? 100
    : (screen === "question" || screen === "reaction") ? ((currentQ + 1) / QUESTIONS.length) * 100 : 0;

  // ===== タイトル画面 =====
  if (screen === "title") {
    return (
      <div className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden select-none flex flex-col bg-white">
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10">
          <div className="bg-slate-50 rounded-2xl px-10 py-8 border border-slate-200 shadow-sm mb-10">
            <h1 className="text-5xl font-black text-slate-800 tracking-wider leading-tight text-center">AI面談</h1>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-slate-400 text-xs font-bold tracking-[0.25em]">INTERVIEW</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>
          </div>

          <p className="text-slate-600 text-lg font-bold mb-4 text-center">履歴書なし・スマホで10分</p>
          <div className="flex justify-center gap-5 text-slate-400 text-xs mb-10">
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              匿名OK
            </span>
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
              音声で回答
            </span>
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
              約10分
            </span>
          </div>

          <button onClick={startInterview} className="vn-btn vn-btn-accent w-full max-w-[300px] py-5 text-xl animate-gentle-pulse tracking-[0.1em] rounded-xl">
            はじめる
          </button>
          <p className="mt-8 text-slate-400 text-[11px]">AI面接官「翔平」が8つの質問をします</p>
        </div>
      </div>
    );
  }

  // ===== 回答確認画面 =====
  if (screen === "confirm") {
    return (
      <div className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden select-none flex flex-col bg-slate-900">
        <div className="shrink-0 px-5 pt-6 pb-4">
          <div className="bg-white/5 rounded-xl px-5 py-4 border border-white/10">
            <h2 className="text-white text-lg font-bold">あなたの回答</h2>
            <p className="text-slate-400 text-xs mt-1">内容を確認して、よければ提出してください</p>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4 space-y-3">
          {QUESTIONS.map((q, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/8">
              <p className="text-slate-400 text-[11px] font-bold mb-2 tracking-wide">Q{i + 1}. {q.short}</p>
              <p className="text-white text-sm leading-relaxed">{answers[i] || "（未回答）"}</p>
            </div>
          ))}
        </div>

        <div className="shrink-0 px-5 pb-8 pt-4 space-y-3">
          <button onClick={goToContact} className="vn-btn vn-btn-accent w-full py-4 text-base tracking-wider animate-gentle-pulse rounded-xl">
            この内容で提出する
          </button>
          <button onClick={() => location.reload()} className="vn-btn vn-btn-ghost w-full py-3.5 rounded-xl">
            やり直す
          </button>
        </div>
      </div>
    );
  }

  // ===== メイン画面 =====
  return (
    <div className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden select-none flex flex-col">
      {/* 上部55%: 背景 + キャラ */}
      <div className="relative flex-[55] min-h-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8ecf1] via-[#dfe4ea] to-[#cfd5dc]" />
        <div className="absolute top-[6%] left-[8%] w-20 h-6 bg-white/50 rounded-full blur-[3px]" />
        <div className="absolute top-[10%] right-[12%] w-16 h-5 bg-white/40 rounded-full blur-[3px]" />

        {/* プログレスバー */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/10 z-20">
          <div className="h-full bg-slate-700 transition-all duration-700 rounded-r-full" style={{ width: `${progress}%` }} />
        </div>

        {/* 右上パネル */}
        {(screen === "question" || screen === "reaction") && (
          <div className="info-panel absolute top-3 right-3 z-20 px-3 py-1.5 text-center">
            <p className="text-slate-400 text-[9px] font-bold tracking-wider">QUESTION</p>
            <p className="text-white text-xl font-black leading-none">{currentQ + 1}<span className="text-slate-400 text-xs font-normal">/{QUESTIONS.length}</span></p>
          </div>
        )}

        {/* キャラクター */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[2]">
          <Character expression={expression} />
        </div>
      </div>

      {/* 下部45% */}
      <div className="relative flex-[45] min-h-0 flex flex-col bg-slate-900">
        <div className="top-line shrink-0" />

        {/* セリフ */}
        <div className="vn-window mx-3 mt-2 px-5 py-3 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-block bg-slate-700 border border-slate-600 rounded-md px-3 py-0.5">
              <span className="text-slate-300 text-[11px] font-bold tracking-wider">{CONFIG.characterName}</span>
            </span>
          </div>
          <p className="text-slate-100 text-[15px] leading-[1.85] whitespace-pre-wrap min-h-[48px]">
            {"「"}{displayText}{"」"}
          </p>
        </div>

        {/* 操作エリア */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 pt-3 pb-6">

          {screen === "greeting" && showUI && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/8 animate-fade-up">
              <button onClick={startQuestions} className="vn-btn vn-btn-primary w-full py-4 text-base tracking-wider rounded-xl">
                質問をはじめる
              </button>
            </div>
          )}

          {screen === "question" && showUI && inputMode === "voice" && (
            <div className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/8 animate-fade-up">
              <p className="text-slate-400 text-[11px] font-bold">あなたの回答</p>
              <div className="bg-white rounded-lg px-4 py-3 text-[14px] text-slate-700 leading-relaxed min-h-[48px]">
                {textInput || <span className="text-slate-400">音声認識の結果がここに表示されます</span>}
                {isRecording && <span className="animate-pulse text-red-500 ml-0.5">...</span>}
              </div>
              <div className="flex gap-3">
                {!isRecording ? (
                  <button onClick={startRecording} className="vn-btn vn-btn-rec py-3.5 px-5 flex items-center justify-center gap-2 rounded-xl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                    {textInput ? "再録音" : "話す"}
                  </button>
                ) : (
                  <button onClick={stopRecording} className="vn-btn py-3.5 px-5 bg-slate-700 text-white border border-slate-600 flex items-center justify-center gap-2 animate-rec-pulse rounded-xl">
                    <span className="w-3 h-3 bg-red-400 rounded-sm" />
                    停止
                  </button>
                )}
                <button onClick={submitAnswer} disabled={!textInput.trim()} className="vn-btn vn-btn-primary flex-1 py-3.5 disabled:opacity-40 rounded-xl">
                  次へ進む
                </button>
              </div>
              <button onClick={() => setInputMode("text")} className="w-full py-1 text-[11px] text-slate-500 underline underline-offset-2">
                テキスト入力に切り替え
              </button>
            </div>
          )}

          {screen === "question" && showUI && inputMode === "text" && (
            <div className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/8 animate-fade-up">
              <p className="text-slate-400 text-[11px] font-bold">あなたの回答</p>
              <textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="ここに入力..." className="vn-input resize-none h-[76px] rounded-lg" />
              <div className="flex gap-3">
                <button onClick={() => setInputMode("voice")} className="vn-btn vn-btn-ghost py-3.5 px-4 rounded-xl">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                </button>
                <button onClick={submitAnswer} disabled={!textInput.trim()} className="vn-btn vn-btn-primary flex-1 py-3.5 disabled:opacity-40 rounded-xl">
                  次へ進む
                </button>
              </div>
            </div>
          )}

          {screen === "contact" && showUI && (
            <div className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/8 animate-fade-up">
              <div>
                <label className="text-slate-400 text-xs block mb-1 ml-1">ニックネーム</label>
                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="例：たろう" className="vn-input rounded-lg" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1 ml-1">電話番号 または LINE ID</label>
                <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="例：090-xxxx-xxxx" className="vn-input rounded-lg" />
              </div>
              <button onClick={submitContact} disabled={!nickname.trim() || !contact.trim()} className="vn-btn vn-btn-primary w-full py-4 disabled:opacity-40 rounded-xl">
                送信する
              </button>
            </div>
          )}

          {screen === "complete" && showUI && (
            <div className="space-y-3 animate-fade-up">
              <div className="bg-white/5 rounded-xl p-4 border border-white/8 text-slate-300 text-xs leading-relaxed">
                <p className="text-white font-bold text-sm mb-2">AI要約レポート（デモ）</p>
                <p><span className="text-slate-400">応募者:</span> {nickname}　<span className="text-slate-400">連絡先:</span> {contact}</p>
                <div className="mt-2.5 pt-2.5 border-t border-white/10 space-y-1.5">
                  <p><span className="text-slate-400 font-bold">価値観:</span> 人の役に立つことにやりがいを感じるタイプ。チームワーク重視。</p>
                  <p><span className="text-slate-400 font-bold">希望:</span> 安定した環境で長く働きたい。利用者との関わりを大切に。</p>
                  <p><span className="text-slate-400 font-bold">総合:</span> 理念と合致。長期定着の可能性あり。二次面接を推奨。</p>
                </div>
              </div>
              <button onClick={() => location.reload()} className="vn-btn vn-btn-ghost w-full py-3.5 rounded-xl">
                もう一度体験する
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
