"use client";

import { useState, useRef, useCallback } from "react";
import Character from "./Character";
import MessageBox from "./MessageBox";
import AnswerBox from "./AnswerBox";
import BottomBar from "./BottomBar";

const CONFIG = {
  characterName: "翔平",
  greeting: "こんにちは、AIの翔平です。今日は応募というより、ちょっとしたお話の時間です。正解はありません。あなたに合いそうな働き方を、一緒に考えられたらうれしいな。",
  completeMessage: "今日はお話を聞かせてくれて、ありがとう！あなたの想いは、スタッフがきちんと目を通します。2日以内にご連絡しますので、少しだけお待ちください。",
};

const QUESTIONS = [
  { q: "最近「誰かの役に立てた」と感じた出来事はある？なんでもいいよ、小さなことでも。", short: "役に立てた経験", reaction: "そうなんだ、素敵だね。ありがとう。" },
  { q: "仕事で大切にしていることを3つ挙げるとしたら何かな？", short: "仕事で大切なこと", reaction: "なるほどね、いい考え方だと思うよ。" },
  { q: "これまでの職場で「嬉しかったこと」と「しんどかったこと」を教えてくれる？", short: "嬉しい/しんどい経験", reaction: "話してくれてありがとう。気持ちわかるよ。" },
  { q: "人と関わる仕事で、心がけていることってある？", short: "心がけていること", reaction: "うん、それは大事なことだよね。" },
  { q: "ここで働くことに興味を持った理由を教えてくれる？", short: "興味を持った理由", reaction: "ありがとう。そう思ってくれて嬉しいよ。" },
  { q: "チームで働くとき、意識していることは？", short: "チームワーク", reaction: "チームワーク大事にしてるんだね。" },
  { q: "これまでの経験の中で「成長できた」と感じた瞬間ってある？", short: "成長の瞬間", reaction: "いい経験をしてきたんだね。" },
  { q: "どんな働き方をしてみたい？希望や理想があれば聞かせて。", short: "希望の働き方", reaction: "ありがとう！全部聞けてよかった。" },
];

type Screen = "title" | "question" | "confirm" | "complete";

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
  const [voice, setVoice] = useState<"aoyama" | "kenzaki" | "browser">("aoyama");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- 音声 ---
  const playAudio = useCallback((audioKey: string, text: string, onEnd?: () => void) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    if (voice === "browser") {
      if (typeof window === "undefined" || !window.speechSynthesis) { setIsSpeaking(false); onEnd?.(); return; }
      const u = new SpeechSynthesisUtterance(text.replace(/\n/g, "。"));
      u.lang = "ja-JP"; u.rate = 1.0; u.pitch = 0.85;
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => { setIsSpeaking(false); onEnd?.(); };
      u.onerror = () => { setIsSpeaking(false); onEnd?.(); };
      window.speechSynthesis.speak(u);
    } else {
      const audio = new Audio(`/audio/${voice}/${audioKey}.wav`);
      audioRef.current = audio;
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => { setIsSpeaking(false); audioRef.current = null; onEnd?.(); };
      audio.onerror = () => { setIsSpeaking(false); audioRef.current = null; onEnd?.(); };
      audio.play().catch(() => { setIsSpeaking(false); onEnd?.(); });
    }
  }, [voice]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // --- 録音 ---
  const startRecording = useCallback(() => {
    stopAudio();
    const API = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
    if (!API) { setInputMode("text"); return; }
    const r = new API(); r.lang = "ja-JP"; r.interimResults = true; r.continuous = true;
    r.onresult = (e: SpeechRecognitionEvent) => { let t = ""; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; setTextInput(t); };
    r.onerror = () => { setIsRecording(false); setInputMode("text"); };
    r.onend = () => setIsRecording(false);
    recognitionRef.current = r; r.start(); setIsRecording(true);
  }, [stopAudio]);
  const stopRecording = useCallback(() => { recognitionRef.current?.stop(); setIsRecording(false); }, []);

  // --- フロー ---
  const startInterview = () => {
    setScreen("question");
    setCurrentQ(0);
    setDisplayText(CONFIG.greeting);
    playAudio("greeting", CONFIG.greeting, () => {
      // あいさつ終了 → Q1を表示
      setDisplayText(QUESTIONS[0].q);
      playAudio("q1", QUESTIONS[0].q);
    });
  };

  const submitAnswer = () => {
    if (!textInput.trim()) return;
    stopAudio(); stopRecording();
    const newAnswers = [...answers, textInput.trim()];
    setAnswers(newAnswers);

    // リアクション → 次の質問 or 確認画面
    setDisplayText(QUESTIONS[currentQ].reaction);
    playAudio(`r${currentQ + 1}`, QUESTIONS[currentQ].reaction, () => {
      if (currentQ + 1 < QUESTIONS.length) {
        const next = currentQ + 1;
        setCurrentQ(next);
        setTextInput("");
        setDisplayText(QUESTIONS[next].q);
        playAudio(`q${next + 1}`, QUESTIONS[next].q);
      } else {
        setScreen("confirm");
      }
    });
  };

  const goBack = () => {
    if (currentQ <= 0) return;
    stopAudio(); stopRecording();
    const prev = currentQ - 1;
    setCurrentQ(prev);
    setTextInput(answers[prev] || "");
    setAnswers(a => a.slice(0, prev));
    setDisplayText(QUESTIONS[prev].q);
    playAudio(`q${prev + 1}`, QUESTIONS[prev].q);
  };

  const submitContact = () => {
    if (!nickname.trim() || !contact.trim()) return;
    setScreen("complete");
    setDisplayText(CONFIG.completeMessage);
    playAudio("complete", CONFIG.completeMessage);
  };

  const expression: "normal" | "smile" | "happy" | "talking" =
    isSpeaking ? "talking" : screen === "complete" ? "happy" : "normal";

  const progress = (screen === "complete" || screen === "confirm") ? 100
    : screen === "question" ? ((currentQ + 1) / QUESTIONS.length) * 100 : 0;

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
          <button onClick={startInterview} className="w-[140px] h-[140px] flex items-center justify-center rounded-3xl font-bold text-lg bg-[#1e293b] text-white shadow-[0_2px_0_#0f172a] active:translate-y-[1px] active:shadow-none transition-all">
            はじめる
          </button>
          <p className="mt-5 text-slate-400 text-base">AI面接官「翔平」が質問します</p>
        </div>
      </div>
    );
  }

  // ===== 回答確認 + 連絡先 =====
  if (screen === "confirm") {
    return (
      <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] bg-white flex flex-col">
        <div className="px-5 pt-6 pb-4">
          <h2 className="text-slate-800 text-lg font-bold">回答の確認・提出</h2>
          <p className="text-slate-400 text-base mt-1">内容を確認し、連絡先を入力して提出してください</p>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
          <div className="space-y-4 mb-6">
            {QUESTIONS.map((q, i) => (
              <div key={i}>
                <p className="text-slate-400 text-base font-bold mb-1">Q{i + 1}. {q.short}</p>
                <p className="text-slate-700 text-base leading-relaxed">{answers[i] || "（未回答）"}</p>
                {i < QUESTIONS.length - 1 && <div className="border-b border-slate-100 mt-4" />}
              </div>
            ))}
          </div>
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
        <div className="px-5 pb-8 pt-4 flex justify-center gap-4 border-t border-slate-100">
          <button onClick={submitContact} disabled={!nickname.trim() || !contact.trim()} className="w-[140px] h-[140px] flex items-center justify-center rounded-3xl font-bold text-base bg-[#1e293b] text-white shadow-[0_2px_0_#0f172a] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-40">
            提出する
          </button>
          <button onClick={() => location.reload()} className="w-[85px] h-[85px] flex flex-col items-center justify-center rounded-2xl font-bold text-base border-2 border-slate-200 text-slate-400 shadow-[0_2px_0_#e2e8f0] active:translate-y-[1px] active:shadow-none transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
            やり直す
          </button>
        </div>
      </div>
    );
  }

  // ===== 面談画面（質問 + 完了） =====
  return (
    <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] relative bg-slate-100 overflow-hidden">
      {/* キャラクター（最背面） */}
      <div className="absolute inset-0 flex items-end justify-center z-0">
        <Character expression={expression} />
      </div>

      {/* プログレスバー */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 z-20">
        <div className="h-full bg-slate-800 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Qカウンター */}
      {screen === "question" && (
        <div className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm rounded-md px-3 py-1 text-center">
          <p className="text-slate-400 text-base font-bold">Q{currentQ + 1}<span className="text-slate-400 font-normal">/{QUESTIONS.length}</span></p>
        </div>
      )}

      {/* 下部UI（キャラの上にモーダル風） */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-4">
        <MessageBox speaker={CONFIG.characterName} text={displayText} />

        {screen === "question" && (
          <AnswerBox
            inputMode={inputMode}
            textInput={textInput}
            isRecording={isRecording}
            onTextChange={setTextInput}
            onSwitchMode={() => setInputMode(m => m === "voice" ? "text" : "voice")}
          />
        )}

        {screen === "complete" && (
          <div className="bg-white/80 backdrop-blur-md px-5 py-4 rounded-2xl">
            <p className="text-slate-800 font-bold text-lg mb-2">AI要約レポート（デモ）</p>
            <p className="text-slate-500 text-base mb-2">{nickname} / {contact}</p>
            <div className="space-y-1.5 text-base text-slate-600 leading-relaxed">
              <p><span className="font-bold text-slate-700">価値観:</span> チームワーク重視。人の役に立つことにやりがい。</p>
              <p><span className="font-bold text-slate-700">希望:</span> 安定した環境で長く働きたい。</p>
              <p><span className="font-bold text-slate-700">総合:</span> 二次面接を推奨。</p>
            </div>
            <p className="text-slate-400 text-base text-center mt-3">
              {voice === "browser" ? "音声: Web Speech API" : `VOICEVOX:${voice === "aoyama" ? "青山龍星" : "剣崎雌雄"}`}
            </p>
          </div>
        )}

        <BottomBar
          mode={screen === "complete" ? "complete" : "question"}
          onBack={goBack}
          onRecord={startRecording}
          onStop={stopRecording}
          onNext={submitAnswer}
          onRestart={() => location.reload()}
          isRecording={isRecording}
          canGoBack={currentQ > 0}
          canGoNext={!!textInput.trim()}
          disabled={isSpeaking}
          recordLabel={textInput ? "再録音" : "話す"}
        />
      </div>
    </div>
  );
}
