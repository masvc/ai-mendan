"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Character from "./Character";

const CONFIG = {
  characterName: "翔平",
  greeting:
    "こんにちは、AIの翔平です。\n\n今日は応募というより、ちょっとしたお話の時間です。正解はありません。\n\nあなたに合いそうな働き方を、一緒に考えられたらうれしいな。",
  completeMessage:
    "今日はお話を聞かせてくれて、ありがとう！\n\nあなたの想いは、スタッフがきちんと目を通します。\n2日以内にご連絡しますので、少しだけお待ちください。",
};

const QUESTIONS = [
  { q: "最近「誰かの役に立てた」と感じた出来事はある？\nなんでもいいよ、小さなことでも。", reaction: "そうなんだ、素敵だね。ありがとう。" },
  { q: "仕事で大切にしていることを3つ挙げるとしたら何かな？", reaction: "なるほどね、いい考え方だと思うよ。" },
  { q: "これまでの職場で「嬉しかったこと」と「しんどかったこと」を教えてくれる？", reaction: "話してくれてありがとう。気持ちわかるよ。" },
  { q: "人と関わる仕事で、心がけていることってある？", reaction: "うん、それは大事なことだよね。" },
  { q: "ここで働くことに興味を持った理由を教えてくれる？", reaction: "ありがとう。そう思ってくれて嬉しいよ。" },
  { q: "チームで働くとき、意識していることは？", reaction: "チームワーク大事にしてるんだね。" },
  { q: "これまでの経験の中で「成長できた」と感じた瞬間ってある？", reaction: "いい経験をしてきたんだね。" },
  { q: "どんな働き方をしてみたい？\n希望や理想があれば聞かせて。", reaction: "ありがとう！全部聞けてよかった。" },
];

type Screen = "title" | "greeting" | "question" | "reaction" | "contact" | "complete";

export default function Interview() {
  const [screen, setScreen] = useState<Screen>("title");
  const [currentQ, setCurrentQ] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [nickname, setNickname] = useState("");
  const [contact, setContact] = useState("");
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [showUI, setShowUI] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (typeRef.current) clearInterval(typeRef.current); }, []);

  const typeText = useCallback((text: string, onDone?: () => void) => {
    if (typeRef.current) clearInterval(typeRef.current);
    setIsTyping(true);
    setShowUI(false);
    setDisplayText("");
    let i = 0;
    typeRef.current = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        if (typeRef.current) clearInterval(typeRef.current);
        setIsTyping(false);
        setTimeout(() => setShowUI(true), 150);
        onDone?.();
      }
    }, 30);
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !window.speechSynthesis) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\n/g, "。"));
    u.lang = "ja-JP"; u.rate = 0.95; u.pitch = 0.85;
    u.onend = () => onEnd?.();
    window.speechSynthesis.speak(u);
  }, []);

  const startRecording = useCallback(() => {
    const API = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
    if (!API) { setInputMode("text"); return; }
    const r = new API();
    r.lang = "ja-JP"; r.interimResults = true; r.continuous = true;
    r.onresult = (e: SpeechRecognitionEvent) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setTextInput(t);
    };
    r.onerror = () => { setIsRecording(false); setInputMode("text"); };
    r.onend = () => setIsRecording(false);
    recognitionRef.current = r;
    r.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => { recognitionRef.current?.stop(); setIsRecording(false); }, []);

  const startInterview = () => { setScreen("greeting"); typeText(CONFIG.greeting, () => speak(CONFIG.greeting)); };

  const startQuestions = () => {
    window.speechSynthesis?.cancel();
    setScreen("question"); setCurrentQ(0); showQuestion(0);
  };

  const showQuestion = (idx: number) => {
    setTextInput("");
    typeText(QUESTIONS[idx].q, () => speak(QUESTIONS[idx].q));
  };

  const submitAnswer = () => {
    if (!textInput.trim()) return;
    window.speechSynthesis?.cancel(); stopRecording();
    setScreen("reaction");
    typeText(QUESTIONS[currentQ].reaction, () => {
      speak(QUESTIONS[currentQ].reaction, () => {
        setTimeout(() => {
          if (currentQ + 1 < QUESTIONS.length) {
            const next = currentQ + 1;
            setCurrentQ(next); setScreen("question"); showQuestion(next);
          } else {
            setScreen("contact");
            typeText("ありがとう！とても良い話が聞けたよ。\n\n最後に、連絡先を教えてもらえるかな？");
          }
        }, 600);
      });
    });
  };

  const submitContact = () => {
    if (!nickname.trim() || !contact.trim()) return;
    setScreen("complete");
    typeText(CONFIG.completeMessage, () => speak(CONFIG.completeMessage));
  };

  const expression: "normal" | "smile" | "happy" | "talking" =
    isTyping ? "talking" : (screen === "complete" || screen === "reaction") ? "happy" : screen === "greeting" ? "smile" : "normal";

  const progress = screen === "complete" || screen === "contact" ? 100
    : (screen === "question" || screen === "reaction") ? ((currentQ + 1) / QUESTIONS.length) * 100 : 0;

  return (
    <div className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden select-none flex flex-col">

      {/* ========== 上部60%: 背景 + キャラ + セリフ ========== */}
      <div className="relative flex-[6] min-h-0 overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#6BB3D9] via-[#A8D8EA] via-30% to-[#D4E9C7]" />
          <div className="absolute top-[3%] right-[8%] w-40 h-40 bg-[#FFF9C4] rounded-full blur-3xl opacity-40" />

          {/* 建物 */}
          <svg className="absolute bottom-0 left-[3%] w-[50%] opacity-45" viewBox="0 0 240 100" preserveAspectRatio="xMidYMax meet">
            <rect x="10" y="20" width="100" height="80" rx="3" fill="#D7CCC8" />
            <rect x="10" y="20" width="100" height="8" rx="3" fill="#A1887F" />
            <rect x="22" y="38" width="14" height="16" rx="2" fill="#B3E5FC" opacity="0.8" />
            <rect x="44" y="38" width="14" height="16" rx="2" fill="#B3E5FC" opacity="0.8" />
            <rect x="66" y="38" width="14" height="16" rx="2" fill="#B3E5FC" opacity="0.8" />
            <rect x="88" y="38" width="14" height="16" rx="2" fill="#B3E5FC" opacity="0.8" />
            <rect x="22" y="62" width="14" height="16" rx="2" fill="#B3E5FC" opacity="0.7" />
            <rect x="44" y="62" width="14" height="16" rx="2" fill="#B3E5FC" opacity="0.7" />
            <rect x="66" y="62" width="14" height="16" rx="2" fill="#B3E5FC" opacity="0.7" />
            <rect x="88" y="62" width="14" height="16" rx="2" fill="#B3E5FC" opacity="0.7" />
            <rect x="48" y="75" width="24" height="25" rx="2" fill="#A1887F" />
            <rect x="130" y="45" width="70" height="55" rx="3" fill="#BCAAA4" />
            <rect x="130" y="45" width="70" height="6" rx="3" fill="#8D6E63" />
            <rect x="140" y="58" width="12" height="14" rx="2" fill="#B3E5FC" opacity="0.7" />
            <rect x="160" y="58" width="12" height="14" rx="2" fill="#B3E5FC" opacity="0.7" />
            <rect x="180" y="58" width="12" height="14" rx="2" fill="#B3E5FC" opacity="0.7" />
            <rect x="155" y="78" width="20" height="22" rx="2" fill="#8D6E63" />
          </svg>

          {/* 木 */}
          <svg className="absolute bottom-0 right-[2%] w-20 opacity-55" viewBox="0 0 80 120">
            <rect x="34" y="75" width="12" height="45" rx="4" fill="#6D4C41" />
            <ellipse cx="40" cy="50" rx="35" ry="42" fill="#43A047" />
            <ellipse cx="30" cy="42" rx="22" ry="28" fill="#66BB6A" />
          </svg>

          {/* 地面ライン */}
          <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-gradient-to-t from-[#A5D6A7] to-[#C8E6C9]" />

          {/* 雲 */}
          <div className="absolute top-[6%] left-[8%] w-20 h-6 bg-white/40 rounded-full blur-[3px]" />
          <div className="absolute top-[10%] right-[12%] w-16 h-5 bg-white/35 rounded-full blur-[3px]" />
        </div>

        {/* プログレスバー */}
        {screen !== "title" && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-black/20 z-20">
            <div className="h-full bg-gradient-to-r from-[#66BB6A] to-[#FFB74D] transition-all duration-700 rounded-r-full" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* 右上パネル */}
        {(screen === "question" || screen === "reaction") && (
          <div className="info-panel absolute top-2.5 right-2.5 z-20 px-3 py-1.5 text-center">
            <p className="text-[#81C784] text-[9px] font-bold tracking-wider">QUESTION</p>
            <p className="text-white text-xl font-black leading-none">{currentQ + 1}<span className="text-[#A5D6A7] text-xs font-normal">/{QUESTIONS.length}</span></p>
          </div>
        )}

        {/* タイトルテキスト */}
        {screen === "title" && (
          <div className="absolute top-[8%] left-0 right-0 text-center z-10 animate-fade-up">
            <h1 className="text-3xl font-black text-[#1B5E20] drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)]">AI面談</h1>
            <p className="mt-1.5 text-sm text-[#2E7D32] font-medium tracking-wider">履歴書なし・スマホで10分</p>
          </div>
        )}

        {/* キャラクター */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[2]">
          <Character expression={expression} />
        </div>
      </div>

      {/* ========== 下部: セリフ + ユーザーUI ========== */}
      <div className="relative flex-[4] min-h-0 flex flex-col bg-[#0A1F0E]">
        {/* チェッカー装飾 */}
        <div className="checker-deco h-2.5 border-t-2 border-[#4CAF50] shrink-0" />

        {/* セリフ部分 */}
        <div className="vn-window mx-1.5 mt-1 px-4 py-2.5 shrink-0" style={{ borderTop: "none", borderRadius: "0 0 6px 6px" }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block bg-gradient-to-r from-[#2E7D32] to-[#388E3C] border border-[#66BB6A]/50 rounded px-2.5 py-px">
              <span className="text-[#C8E6C9] text-[11px] font-bold tracking-wider">{CONFIG.characterName}</span>
            </span>
          </div>
          <p className="text-[#E8F5E9] text-[14px] leading-[1.8] whitespace-pre-wrap min-h-[42px]">
            {screen === "title" ? (
              "「ちょっと話してみない？\n　履歴書いらないよ。スマホだけでOK。」"
            ) : (
              <>{"「"}{displayText}{isTyping ? <span className="animate-cursor text-[#81C784]">|</span> : "」"}</>
            )}
          </p>
        </div>

        {/* ユーザー操作エリア */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2 space-y-2">

          {/* === タイトル === */}
          {screen === "title" && (
            <button onClick={startInterview} className="vn-btn vn-btn-accent w-full py-4 text-lg animate-gentle-pulse tracking-widest">
              面接をはじめる
            </button>
          )}

          {/* === あいさつ === */}
          {screen === "greeting" && showUI && (
            <button onClick={startQuestions} className="vn-btn vn-btn-primary w-full py-3 animate-fade-up tracking-wider">
              はじめる
            </button>
          )}

          {/* === 質問（音声） === */}
          {screen === "question" && showUI && inputMode === "voice" && (
            <div className="space-y-2 animate-fade-up">
              <div className="bg-white/95 rounded-lg px-3 py-2 text-[13px] text-gray-700 leading-relaxed border border-[#C8E6C9] min-h-[40px]">
                {textInput || <span className="text-gray-400">音声認識の結果がここに表示されます</span>}
                {isRecording && <span className="animate-pulse text-red-400 ml-0.5">...</span>}
              </div>
              <div className="flex gap-2">
                {!isRecording ? (
                  <button onClick={startRecording} className="vn-btn vn-btn-rec py-2.5 px-4 flex items-center justify-center gap-1.5 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                    {textInput ? "再録音" : "話す"}
                  </button>
                ) : (
                  <button onClick={stopRecording} className="vn-btn py-2.5 px-4 bg-[#333] text-white border-2 border-[#666] flex items-center justify-center gap-1.5 text-sm animate-rec-pulse">
                    <span className="w-2.5 h-2.5 bg-red-400 rounded-sm" />
                    停止
                  </button>
                )}
                <button onClick={submitAnswer} disabled={!textInput.trim()} className="vn-btn vn-btn-primary flex-1 py-2.5 text-sm disabled:opacity-40">
                  次へ進む
                </button>
              </div>
              <button onClick={() => setInputMode("text")} className="w-full text-[10px] text-[#A5D6A7]/60 underline underline-offset-2">
                テキスト入力に切り替え
              </button>
            </div>
          )}

          {/* === 質問（テキスト） === */}
          {screen === "question" && showUI && inputMode === "text" && (
            <div className="space-y-2 animate-fade-up">
              <textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="ここに入力..." className="vn-input resize-none h-[64px] text-sm" />
              <div className="flex gap-2">
                <button onClick={() => setInputMode("voice")} className="vn-btn vn-btn-ghost py-2.5 px-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                </button>
                <button onClick={submitAnswer} disabled={!textInput.trim()} className="vn-btn vn-btn-primary flex-1 py-2.5 text-sm disabled:opacity-40">
                  次へ進む
                </button>
              </div>
            </div>
          )}

          {/* === 連絡先 === */}
          {screen === "contact" && showUI && (
            <div className="space-y-2 animate-fade-up">
              <div>
                <label className="text-[#A5D6A7]/80 text-[11px] block mb-0.5 ml-1">ニックネーム</label>
                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="例：たろう" className="vn-input text-sm" />
              </div>
              <div>
                <label className="text-[#A5D6A7]/80 text-[11px] block mb-0.5 ml-1">電話番号 または LINE ID</label>
                <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="例：090-xxxx-xxxx" className="vn-input text-sm" />
              </div>
              <button onClick={submitContact} disabled={!nickname.trim() || !contact.trim()} className="vn-btn vn-btn-primary w-full py-3 text-sm disabled:opacity-40">
                送信する
              </button>
            </div>
          )}

          {/* === 完了 === */}
          {screen === "complete" && showUI && (
            <div className="space-y-2 animate-fade-up">
              <div className="bg-white/5 border border-[#4CAF50]/30 rounded-lg p-3 text-[#C8E6C9] text-[11px] leading-relaxed">
                <p className="text-[#81C784] font-bold text-xs mb-1.5">AI要約レポート（デモ）</p>
                <p><span className="text-[#A5D6A7]">応募者:</span> {nickname}　<span className="text-[#A5D6A7]">連絡先:</span> {contact}</p>
                <div className="mt-2 pt-2 border-t border-[#4CAF50]/20 space-y-1">
                  <p><span className="text-[#A5D6A7] font-bold">価値観:</span> 人の役に立つことにやりがいを感じるタイプ。チームワーク重視。</p>
                  <p><span className="text-[#A5D6A7] font-bold">希望:</span> 安定した環境で長く働きたい。利用者との関わりを大切に。</p>
                  <p><span className="text-[#A5D6A7] font-bold">総合:</span> 理念と合致。長期定着の可能性あり。二次面接を推奨。</p>
                </div>
              </div>
              <button onClick={() => location.reload()} className="vn-btn vn-btn-ghost w-full py-2.5 text-sm">
                もう一度体験する
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
