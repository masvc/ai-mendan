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

type Screen = "title" | "greeting" | "question" | "reaction" | "confirm" | "complete";

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
  const [voice, setVoice] = useState<"aoyama" | "kenzaki" | "browser">("aoyama");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const showText = useCallback((text: string) => { setDisplayText(text); setShowUI(false); }, []);

  const playAudio = useCallback((audioKey: string, text: string, onEnd?: () => void) => {
    // 既存の再生を停止
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();

    if (voice === "browser") {
      // Web Speech API
      if (typeof window === "undefined" || !window.speechSynthesis) { setIsSpeaking(false); setTimeout(() => { setShowUI(true); onEnd?.(); }, 300); return; }
      const u = new SpeechSynthesisUtterance(text.replace(/\n/g, "。"));
      u.lang = "ja-JP"; u.rate = 1.0; u.pitch = 0.85;
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => { setIsSpeaking(false); setShowUI(true); onEnd?.(); };
      u.onerror = () => { setIsSpeaking(false); setShowUI(true); onEnd?.(); };
      window.speechSynthesis.speak(u);
    } else {
      // VOICEVOX wav
      const audio = new Audio(`/audio/${voice}/${audioKey}.wav`);
      audioRef.current = audio;
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => { setIsSpeaking(false); setShowUI(true); audioRef.current = null; onEnd?.(); };
      audio.onerror = () => { setIsSpeaking(false); setShowUI(true); audioRef.current = null; onEnd?.(); };
      audio.play().catch(() => { setIsSpeaking(false); setShowUI(true); onEnd?.(); });
    }
  }, [voice]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const sayText = useCallback((text: string, audioKey: string, onEnd?: () => void) => {
    showText(text); setIsSpeaking(true); playAudio(audioKey, text, onEnd);
  }, [showText, playAudio]);

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

  const startInterview = () => { setScreen("greeting"); sayText(CONFIG.greeting, "greeting"); };
  const startQuestions = () => { stopAudio(); setScreen("question"); setCurrentQ(0); goToQuestion(0); };
  const goToQuestion = (idx: number) => { setTextInput(""); sayText(QUESTIONS[idx].q, `q${idx + 1}`); };
  const submitAnswer = () => {
    if (!textInput.trim()) return;
    stopAudio(); stopRecording();
    setAnswers(prev => [...prev, textInput.trim()]); setScreen("reaction");
    sayText(QUESTIONS[currentQ].reaction, `r${currentQ + 1}`, () => { setTimeout(() => { if (currentQ + 1 < QUESTIONS.length) { const n = currentQ + 1; setCurrentQ(n); setScreen("question"); goToQuestion(n); } else { setScreen("confirm"); } }, 600); });
  };
  const submitContact = () => { if (!nickname.trim() || !contact.trim()) return; setScreen("complete"); sayText(CONFIG.completeMessage, "complete"); };

  const expression: "normal" | "smile" | "happy" | "talking" = isSpeaking ? "talking" : (screen === "complete" || screen === "reaction") ? "happy" : screen === "greeting" ? "smile" : "normal";
  const progress = (screen === "complete" || screen === "confirm") ? 100 : (screen === "question" || screen === "reaction") ? ((currentQ + 1) / QUESTIONS.length) * 100 : 0;

  const Btn = ({ onClick, children, disabled, variant = "primary", className = "" }: { onClick: () => void; children: React.ReactNode; disabled?: boolean; variant?: "primary" | "ghost" | "danger"; className?: string }) => {
    const base = "w-[140px] h-[140px] flex items-center justify-center mx-auto rounded-3xl font-bold text-lg transition-all duration-150 disabled:opacity-40 active:translate-y-[1px]";
    const styles = {
      primary: "bg-[#1e293b] text-white shadow-[0_2px_0_#0f172a] hover:bg-[#334155] active:shadow-none",
      ghost: "bg-white text-slate-500 border-2 border-slate-200 shadow-[0_2px_0_#e2e8f0] hover:bg-slate-50 active:shadow-none",
      danger: "bg-red-600 text-white shadow-[0_2px_0_#991b1b] hover:bg-red-700 active:shadow-none",
    };
    return <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>{children}</button>;
  };

  // ===== タイトル =====
  if (screen === "title") {
    return (
      <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] bg-white flex flex-col justify-center px-8 gap-10">
        <div className="text-center">
          <h1 className="text-5xl font-black text-slate-800 tracking-wide">AI面談</h1>
          <p className="text-slate-400 text-lg tracking-[0.2em] mt-2">INTERVIEW</p>
        </div>

        <div className="text-center">
          <p className="text-slate-700 text-2xl font-bold">履歴書なし・スマホで10分</p>
          <p className="text-slate-400 text-lg mt-2">匿名OK / 音声で回答 / 8問</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-slate-400 text-base mb-3">音声を選択</p>
          <div className="flex gap-3 justify-center">
            {([["aoyama", "青山龍星"], ["kenzaki", "剣崎雌雄"], ["browser", "ブラウザ"]] as const).map(([k, label]) => (
              <button key={k} onClick={() => setVoice(k)} className={`w-[110px] h-[110px] rounded-2xl text-base font-bold transition-all duration-150 active:translate-y-[1px] flex items-center justify-center ${voice === k ? "bg-slate-800 text-white shadow-[0_2px_0_#0f172a]" : "bg-white text-slate-500 border-2 border-slate-200 shadow-[0_2px_0_#e2e8f0]"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Btn onClick={startInterview}>はじめる</Btn>
          <p className="mt-5 text-slate-400 text-base">AI面接官「翔平」が質問します</p>
        </div>
      </div>
    );
  }

  // ===== 回答確認 + 連絡先入力 =====
  if (screen === "confirm") {
    return (
      <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] bg-white flex flex-col">
        <div className="px-5 pt-6 pb-4">
          <h2 className="text-slate-800 text-lg font-bold">回答の確認・提出</h2>
          <p className="text-slate-400 text-base mt-1">内容を確認し、連絡先を入力して提出してください</p>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
          {/* 回答一覧 */}
          <div className="space-y-4 mb-6">
            {QUESTIONS.map((q, i) => (
              <div key={i}>
                <p className="text-slate-400 text-base font-bold mb-1">Q{i + 1}. {q.short}</p>
                <p className="text-slate-700 text-base leading-relaxed">{answers[i] || "（未回答）"}</p>
                {i < QUESTIONS.length - 1 && <div className="border-b border-slate-100 mt-4" />}
              </div>
            ))}
          </div>
          {/* 連絡先入力 */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <p className="text-slate-800 text-base font-bold">連絡先</p>
            <div>
              <label className="text-slate-500 text-base block mb-1">ニックネーム</label>
              <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="例：たろう" className="vn-input" />
            </div>
            <div>
              <label className="text-slate-500 text-base block mb-1">電話番号 または LINE ID</label>
              <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="例：090-xxxx-xxxx" className="vn-input" />
            </div>
          </div>
        </div>
        <div className="px-5 pb-8 pt-4 space-y-3 border-t border-slate-100">
          <Btn onClick={submitContact} disabled={!nickname.trim() || !contact.trim()}>この内容で提出する</Btn>
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
            <p className="text-slate-400 text-base font-bold">QUESTION</p>
            <p className="text-slate-800 text-lg font-black leading-none">{currentQ + 1}<span className="text-slate-400 text-base font-normal">/{QUESTIONS.length}</span></p>
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
          <p className="text-slate-400 text-base font-bold mb-1">{CONFIG.characterName}</p>
          <p className="text-white text-lg leading-[1.85] whitespace-pre-wrap min-h-[44px]">
            {"「"}{displayText}{"」"}
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-white px-5 py-4">


          {screen === "question" && showUI && (inputMode === "voice" ? (
            <div className="animate-fade-up">
              <p className="text-slate-400 text-base font-bold mb-2">あなたの回答</p>
              <div className="bg-slate-50 rounded-lg px-4 py-3 text-base text-slate-700 leading-relaxed min-h-[60px]">
                {textInput || <span className="text-slate-400">音声認識の結果がここに表示されます</span>}
                {isRecording && <span className="animate-pulse text-red-500 ml-0.5">...</span>}
              </div>
              <button onClick={() => setInputMode("text")} className="mt-2 text-base text-slate-400 underline underline-offset-2">テキスト入力に切り替え</button>
            </div>
          ) : (
            <div className="animate-fade-up">
              <p className="text-slate-400 text-base font-bold mb-2">あなたの回答</p>
              <textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="ここに入力..." className="vn-input resize-none h-[100px]" />
              <button onClick={() => setInputMode("voice")} className="mt-2 text-base text-slate-400 underline underline-offset-2">音声入力に切り替え</button>
            </div>
          ))}

          {screen === "complete" && showUI && (
            <div className="space-y-4 animate-fade-up">
              <div>
                <p className="text-slate-800 font-bold text-lg mb-3">AI要約レポート（デモ）</p>
                <p className="text-slate-500 text-base mb-3">{nickname} / {contact}</p>
                <div className="space-y-2 text-base text-slate-600 leading-relaxed">
                  <p><span className="font-bold text-slate-700">価値観:</span> 人の役に立つことにやりがいを感じるタイプ。チームワーク重視。</p>
                  <p><span className="font-bold text-slate-700">希望:</span> 安定した環境で長く働きたい。利用者との関わりを大切に。</p>
                  <p><span className="font-bold text-slate-700">総合:</span> 理念と合致。長期定着の可能性あり。二次面接を推奨。</p>
                </div>
              </div>
              <p className="text-slate-400 text-base text-center">
                {voice === "browser" ? "音声: Web Speech API" : `音声: VOICEVOX:${voice === "aoyama" ? "青山龍星" : "剣崎雌雄"}`}
              </p>
            </div>
          )}
        </div>

        {/* ===== ボトムバー ===== */}
        {(screen === "question" || screen === "greeting" || screen === "complete") && (
          <div className="shrink-0 bg-white border-t border-slate-100 px-6 py-8 flex justify-around items-center">
            {screen === "greeting" && showUI && (
              <button
                onClick={startQuestions}
                className="w-[110px] h-[110px] rounded-3xl flex flex-col items-center justify-center bg-[#1e293b] text-white shadow-[0_3px_0_#0f172a] active:translate-y-[1px] active:shadow-none transition-all"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                <span className="text-base font-bold mt-0.5">次へ</span>
              </button>
            )}

            {screen === "question" && (
              <>
                {/* 戻る */}
                <button
                  onClick={() => { if (currentQ > 0) { const prev = currentQ - 1; setCurrentQ(prev); goToQuestion(prev); } }}
                  disabled={currentQ === 0}
                  className="w-[85px] h-[85px] rounded-2xl flex flex-col items-center justify-center text-slate-400 disabled:opacity-30 active:translate-y-[1px] transition-all border-2 border-slate-200 shadow-[0_2px_0_#e2e8f0] active:shadow-none"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                  <span className="text-base font-bold mt-0.5">戻る</span>
                </button>

                {/* 録音 */}
                {!isRecording ? (
                  <button
                    onClick={inputMode === "voice" ? startRecording : () => {}}
                    className="w-[110px] h-[110px] rounded-3xl flex flex-col items-center justify-center bg-red-600 text-white shadow-[0_3px_0_#991b1b] active:translate-y-[1px] active:shadow-none transition-all"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                    <span className="text-base font-bold mt-1">{textInput ? "再録音" : "話す"}</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="w-[110px] h-[110px] rounded-3xl flex flex-col items-center justify-center bg-slate-700 text-white shadow-[0_3px_0_#334155] active:translate-y-[1px] active:shadow-none transition-all animate-rec-pulse"
                  >
                    <span className="w-6 h-6 bg-red-400 rounded-md" />
                    <span className="text-base font-bold mt-1">停止</span>
                  </button>
                )}

                {/* 次へ */}
                <button
                  onClick={submitAnswer}
                  disabled={!textInput.trim()}
                  className="w-[85px] h-[85px] rounded-2xl flex flex-col items-center justify-center bg-[#1e293b] text-white disabled:opacity-30 active:translate-y-[1px] transition-all shadow-[0_2px_0_#0f172a] active:shadow-none"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                  <span className="text-base font-bold mt-0.5">次へ</span>
                </button>
              </>
            )}

            {screen === "complete" && (
              <button
                onClick={() => location.reload()}
                className="w-[85px] h-[85px] rounded-2xl flex flex-col items-center justify-center border-2 border-slate-200 text-slate-400 shadow-[0_2px_0_#e2e8f0] active:translate-y-[1px] active:shadow-none transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                <span className="text-base font-bold mt-0.5">再開</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
