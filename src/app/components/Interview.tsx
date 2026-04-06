"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Character from "./Character";

const CONFIG = {
  title: "AI面談",
  subtitle: "履歴書なし・スマホで10分",
  characterName: "翔平",
  greeting:
    "こんにちは。AIの翔平です。\n\n今日は応募というより、ちょっとしたお話の時間です。\n正解はありません。\n\nあなたに合いそうな働き方を、一緒に考えられたらうれしいな。",
  completeMessage:
    "今日はお話を聞かせてくれて、ありがとう！\n\nあなたの想いや大切にしていることは、スタッフがきちんと目を通します。\n\n2日以内に今後についてご連絡しますので、少しだけお待ちください。\n\n不安なことや聞いておきたいことがあれば、いつでも大丈夫だよ。",
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
  const [answers, setAnswers] = useState<string[]>([]);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [nickname, setNickname] = useState("");
  const [contact, setContact] = useState("");
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [showUI, setShowUI] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const typeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    };
  }, []);

  const typeText = useCallback((text: string, onDone?: () => void) => {
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    setIsTyping(true);
    setShowUI(false);
    setDisplayText("");
    let i = 0;
    typeIntervalRef.current = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
        setIsTyping(false);
        setTimeout(() => setShowUI(true), 200);
        onDone?.();
      }
    }, 35);
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !window.speechSynthesis) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\n/g, "。"));
    u.lang = "ja-JP";
    u.rate = 0.95;
    u.pitch = 0.85;
    u.onend = () => onEnd?.();
    synthRef.current = u;
    window.speechSynthesis.speak(u);
  }, []);

  const startRecording = useCallback(() => {
    const API = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
    if (!API) { setInputMode("text"); return; }
    const r = new API();
    r.lang = "ja-JP";
    r.interimResults = true;
    r.continuous = true;
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

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  const startInterview = () => {
    setScreen("greeting");
    typeText(CONFIG.greeting, () => speak(CONFIG.greeting));
  };

  const startQuestions = () => {
    window.speechSynthesis?.cancel();
    setScreen("question");
    setCurrentQ(0);
    showQuestion(0);
  };

  const showQuestion = (index: number) => {
    setTextInput("");
    const q = QUESTIONS[index].q;
    typeText(q, () => speak(q));
  };

  const submitAnswer = () => {
    const answer = textInput.trim();
    if (!answer) return;
    window.speechSynthesis?.cancel();
    stopRecording();
    setAnswers(prev => [...prev, answer]);
    setScreen("reaction");
    const reaction = QUESTIONS[currentQ].reaction;
    typeText(reaction, () => {
      speak(reaction, () => {
        setTimeout(() => {
          if (currentQ + 1 < QUESTIONS.length) {
            setCurrentQ(prev => prev + 1);
            setScreen("question");
            showQuestion(currentQ + 1);
          } else {
            setScreen("contact");
            typeText("ありがとう！とても良い話が聞けたよ。\n\n最後に、連絡が取れるようにニックネームと連絡先を教えてもらえるかな？");
          }
        }, 800);
      });
    });
  };

  const submitContact = () => {
    if (!nickname.trim() || !contact.trim()) return;
    setScreen("complete");
    typeText(CONFIG.completeMessage, () => speak(CONFIG.completeMessage));
  };

  const expression = screen === "complete" || screen === "reaction" ? "happy" : screen === "greeting" ? "smile" : "normal";
  const progress = screen === "complete" || screen === "contact" ? 100
    : (screen === "question" || screen === "reaction") ? ((currentQ + 1) / QUESTIONS.length) * 100 : 0;

  return (
    <div className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden select-none">
      {/* ===== 背景 ===== */}
      <div className="absolute inset-0">
        {/* 空のグラデーション - 夕方の温かい空 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#89CFF0] via-[#B8E4F0] via-35% to-[#E8F5E9]" />
        {/* 太陽光 */}
        <div className="absolute top-[5%] right-[10%] w-32 h-32 bg-[#FFF9C4] rounded-full blur-3xl opacity-50" />
        {/* 雲 */}
        <div className="absolute top-[6%] left-[5%] w-28 h-10 bg-white/50 rounded-full blur-md" />
        <div className="absolute top-[4%] left-[15%] w-20 h-8 bg-white/40 rounded-full blur-md" />
        <div className="absolute top-[10%] right-[20%] w-24 h-9 bg-white/45 rounded-full blur-md" />
        {/* 遠くの山 */}
        <div className="absolute bottom-[42%] left-0 right-0">
          <svg viewBox="0 0 430 60" className="w-full" preserveAspectRatio="none">
            <path d="M0,60 L0,35 Q50,10 100,30 Q150,5 200,25 Q250,8 300,28 Q350,12 400,30 Q420,20 430,25 L430,60 Z" fill="#A5D6A7" opacity="0.5" />
          </svg>
        </div>
        {/* 芝生 */}
        <div className="absolute bottom-[30%] left-0 right-0 h-[15%] bg-gradient-to-b from-[#C8E6C9] to-[#A5D6A7]" />
        <div className="absolute bottom-0 left-0 right-0 h-[32%] bg-[#A5D6A7]" />
        {/* 花のドット（装飾） */}
        <div className="absolute bottom-[34%] left-[12%] w-2.5 h-2.5 bg-[#F48FB1] rounded-full opacity-60" />
        <div className="absolute bottom-[36%] left-[25%] w-2 h-2 bg-[#FFD54F] rounded-full opacity-60" />
        <div className="absolute bottom-[33%] right-[18%] w-2.5 h-2.5 bg-[#F48FB1] rounded-full opacity-50" />
        <div className="absolute bottom-[35%] right-[30%] w-2 h-2 bg-white rounded-full opacity-60" />
        <div className="absolute bottom-[37%] left-[45%] w-2 h-2 bg-[#CE93D8] rounded-full opacity-50" />
        {/* 木 */}
        <svg className="absolute bottom-[30%] left-[3%] w-16 h-24 opacity-70" viewBox="0 0 60 90">
          <rect x="26" y="55" width="8" height="35" rx="3" fill="#795548" />
          <ellipse cx="30" cy="40" rx="25" ry="30" fill="#66BB6A" />
          <ellipse cx="22" cy="35" rx="15" ry="20" fill="#81C784" />
        </svg>
        <svg className="absolute bottom-[30%] right-[5%] w-14 h-20 opacity-60" viewBox="0 0 60 90">
          <rect x="26" y="55" width="8" height="35" rx="3" fill="#795548" />
          <ellipse cx="30" cy="42" rx="22" ry="25" fill="#66BB6A" />
          <ellipse cx="35" cy="38" rx="13" ry="18" fill="#81C784" />
        </svg>
      </div>

      {/* ===== プログレスバー ===== */}
      {screen !== "title" && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/15 z-20">
          <div
            className="h-full bg-gradient-to-r from-[#66BB6A] to-[#FFB74D] transition-all duration-700 ease-out rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* ===== 質問カウンター ===== */}
      {(screen === "question" || screen === "reaction") && (
        <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md border border-[#66BB6A]/50">
          Q{currentQ + 1} / {QUESTIONS.length}
        </div>
      )}

      {/* ===== キャラクター ===== */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center transition-all duration-500"
        style={{ top: screen === "title" ? "2%" : "1%" }}
      >
        <Character expression={expression} />
        {/* 名前プレート */}
        <div className="mt-1 bg-gradient-to-r from-[#2E7D32] to-[#43A047] text-white text-sm font-bold px-6 py-1.5 rounded-full shadow-lg tracking-[0.15em] border border-[#66BB6A]/40">
          AI面接官 {CONFIG.characterName}
        </div>
      </div>

      {/* ===== ダイアログエリア ===== */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-5">

        {/* タイトル画面: タイトルロゴ */}
        {screen === "title" && (
          <div className="absolute -top-[52dvh] left-0 right-0 text-center animate-fade-up">
            <h1 className="text-3xl font-extrabold text-[#1B5E20] drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)] leading-snug">
              {CONFIG.title}
            </h1>
            <p className="mt-2 text-sm text-[#2E7D32] font-medium tracking-wider">
              {CONFIG.subtitle}
            </p>
          </div>
        )}

        {/* メッセージボックス */}
        <div className="vn-textbox px-5 py-4 min-h-[120px]">
          {screen !== "title" && (
            <p className="text-[#81C784] text-[13px] font-bold mb-1.5 tracking-wider">{CONFIG.characterName}</p>
          )}
          <p className="text-[#E8F5E9] text-[15px] leading-[1.9] whitespace-pre-wrap">
            {screen === "title"
              ? "ちょっと話してみない？\n履歴書いらないよ。スマホだけでOK。"
              : displayText}
            {isTyping && <span className="animate-pulse ml-0.5 text-[#81C784]">|</span>}
          </p>
        </div>

        {/* ===== タイトル画面 ===== */}
        {screen === "title" && (
          <button
            onClick={startInterview}
            className="vn-btn vn-btn-accent w-full mt-3 py-4 text-lg animate-gentle-pulse tracking-widest"
          >
            面接をはじめる
          </button>
        )}

        {/* ===== あいさつ画面 ===== */}
        {screen === "greeting" && showUI && (
          <button onClick={startQuestions} className="vn-btn vn-btn-primary w-full mt-3 py-3.5 animate-fade-up">
            はじめる
          </button>
        )}

        {/* ===== 質問画面 ===== */}
        {screen === "question" && showUI && (
          <div className="mt-3 space-y-2.5 animate-fade-up">
            {inputMode === "voice" ? (
              <>
                {textInput && (
                  <div className="bg-white/95 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed shadow-sm border border-[#C8E6C9]">
                    {textInput}
                  </div>
                )}
                <div className="flex gap-2.5">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="vn-btn flex-1 py-3.5 bg-gradient-to-r from-[#EF5350] to-[#E57373] text-white flex items-center justify-center gap-2 shadow-md"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                      話す
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="vn-btn flex-1 py-3.5 bg-gradient-to-r from-[#424242] to-[#616161] text-white flex items-center justify-center gap-2 animate-rec-pulse"
                    >
                      <span className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                      録音中...タップで停止
                    </button>
                  )}
                  {textInput && (
                    <button onClick={submitAnswer} className="vn-btn vn-btn-primary flex-1 py-3.5">
                      回答する
                    </button>
                  )}
                </div>
                <button onClick={() => setInputMode("text")} className="w-full py-1.5 text-xs text-[#A5D6A7]/80 underline underline-offset-2">
                  テキスト入力に切り替え
                </button>
              </>
            ) : (
              <>
                <textarea
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder="ここに入力してください..."
                  className="vn-input resize-none h-[76px]"
                />
                <div className="flex gap-2.5">
                  <button onClick={() => setInputMode("voice")} className="vn-btn vn-btn-ghost py-3 px-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                  </button>
                  <button
                    onClick={submitAnswer}
                    disabled={!textInput.trim()}
                    className="vn-btn vn-btn-primary flex-1 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    回答する
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== 連絡先入力 ===== */}
        {screen === "contact" && showUI && (
          <div className="mt-3 space-y-2.5 animate-fade-up">
            <div>
              <label className="text-[#A5D6A7] text-xs font-medium block mb-1 ml-1">ニックネーム</label>
              <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="例：たろう" className="vn-input" />
            </div>
            <div>
              <label className="text-[#A5D6A7] text-xs font-medium block mb-1 ml-1">電話番号 または LINE ID</label>
              <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="例：090-xxxx-xxxx / line_id" className="vn-input" />
            </div>
            <button
              onClick={submitContact}
              disabled={!nickname.trim() || !contact.trim()}
              className="vn-btn vn-btn-primary w-full py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              送信する
            </button>
          </div>
        )}

        {/* ===== 完了画面 ===== */}
        {screen === "complete" && showUI && (
          <div className="mt-3 space-y-2.5 animate-fade-up">
            <div className="bg-white/8 border border-[#66BB6A]/40 rounded-xl p-4 text-[#C8E6C9] text-xs leading-relaxed backdrop-blur-sm">
              <p className="text-[#81C784] font-bold text-sm mb-2">AI要約レポート（デモ）</p>
              <p><span className="text-[#A5D6A7] font-medium">応募者:</span> {nickname}</p>
              <p><span className="text-[#A5D6A7] font-medium">連絡先:</span> {contact}</p>
              <div className="mt-3 pt-3 border-t border-[#66BB6A]/20 space-y-2">
                <div>
                  <p className="text-[#A5D6A7] font-bold">価値観・特徴</p>
                  <p>人の役に立つことにやりがいを感じるタイプ。チームワークを重視し、周囲への配慮ができる方。</p>
                </div>
                <div>
                  <p className="text-[#A5D6A7] font-bold">働き方の希望</p>
                  <p>安定した環境で長く働きたい意向。利用者との関わりを大切にしたいという想い。</p>
                </div>
                <div>
                  <p className="text-[#A5D6A7] font-bold">総合コメント</p>
                  <p>価値観が法人理念と合致しており、長く関われる可能性あり。二次面接を推奨。</p>
                </div>
              </div>
            </div>
            <button onClick={() => location.reload()} className="vn-btn vn-btn-ghost w-full py-3">
              もう一度体験する
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
