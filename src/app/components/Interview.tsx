"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Toaster, toast } from "sonner";
import { ChevronRight, RotateCcw, Home, Mic } from "lucide-react";
import { useInterviewStore } from "../store";
import Character from "./Character";
import MessageBox from "./MessageBox";
import AnswerBox from "./AnswerBox";

const CONFIG = {
  greeting1: "こんにちは、株式会社安心の絆の翔平です。今日はちょっとしたお話の時間だよ。",
  greeting2: "各質問に答えたら「次へ」を押してね。全部で8問あるよ！",
  complete1: "今日はお話を聞かせてくれて、ありがとう！あなたの想いは、スタッフがきちんと目を通すよ。",
  complete2: "2日以内に連絡するから、少しだけ待っててね。不安なことがあれば、いつでも気軽に聞いてね。",
};

export const QUESTIONS = [
  { q: "最近「誰かの役に立てた」と感じたことってある？小さなことでも大丈夫だよ。", short: "役に立てた経験" },
  { q: "仕事で大切にしていることを3つ挙げるとしたら何かな？", short: "仕事で大切なこと" },
  { q: "これまでの職場で嬉しかったことと、しんどかったこと、教えてくれる？", short: "嬉しい/しんどい経験" },
  { q: "人と関わる仕事で、心がけていることってある？", short: "心がけていること" },
  { q: "株式会社安心の絆で働くことに興味を持ってくれた理由を教えてくれる？", short: "興味を持った理由" },
  { q: "チームで働くとき、意識していることは？", short: "チームワーク" },
  { q: "これまでの経験の中で「成長できた」と感じた瞬間ってある？", short: "成長の瞬間" },
  { q: "株式会社安心の絆で、どんな働き方をしてみたい？希望があれば聞かせて。", short: "希望の働き方" },
];

export default function Interview() {
  const store = useInterviewStore();
  const { screen, currentQ, answers, textInput, nickname, contact } = store;

  const [displayText, setDisplayText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioBlobs, setAudioBlobs] = useState<Blob[]>([]);
  const [hasHistory, setHasHistory] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const baseTextRef = useRef(""); // 認識再起動前のテキスト保持

  // --- 復帰処理 ---
  const resumed = useRef(false);
  useEffect(() => {
    if (resumed.current) return;
    resumed.current = true;
    useInterviewStore.persist.rehydrate();
    setHasHistory(!!localStorage.getItem("ai-mendan-history"));
  }, []);

  // --- 音声再生（挨拶・完了のみ） ---
  const playAudio = useCallback((audioKey: string, onEnd?: () => void) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    const audio = new Audio(`/audio/kenzaki/${audioKey}.wav?v=2`);
    audioRef.current = audio;
    audio.onplay = () => { setIsSpeaking(true); };
    audio.onended = () => { setIsSpeaking(false); audioRef.current = null; onEnd?.(); };
    audio.onerror = () => { setIsSpeaking(false); audioRef.current = null; onEnd?.(); };
    audio.play().catch(() => { setIsSpeaking(false); onEnd?.(); });
  }, []);

  // --- マイク（1本通し） ---
  const startMic = useCallback(() => {
    if (recognitionRef.current) return;

    const API = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
    if (!API) { toast.error("このブラウザは音声入力に対応していません"); return; }

    baseTextRef.current = "";
    store.setTextInput("");

    const r = new API();
    r.lang = "ja-JP";
    r.interimResults = true;
    r.continuous = true;
    r.onresult = (e: SpeechRecognitionEvent) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) {
        t += e.results[i][0].transcript;
      }
      store.setTextInput(baseTextRef.current + t);
    };
    r.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "no-speech") return;
    };
    r.onend = () => {
      if (recognitionRef.current === r) {
        // 再起動前にテキストを保持（スマホで勝手に止まる対策）
        baseTextRef.current = useInterviewStore.getState().textInput;
        try { r.start(); } catch { /* ignore */ }
      }
    };
    recognitionRef.current = r;
    try { r.start(); } catch { /* ignore */ }
    setIsListening(true);

    // 録音
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start();
      mediaRecorderRef.current = mr;
    }).catch(() => {});
  }, [store]);

  const stopMic = useCallback(() => {
    const r = recognitionRef.current;
    if (r) { r.onresult = null; r.onend = null; r.onerror = null; try { r.stop(); } catch { /* */ } }
    recognitionRef.current = null;
    setIsListening(false);

    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlobs(prev => [...prev, blob]);
        mr.stream.getTracks().forEach(t => t.stop());
        mediaRecorderRef.current = null;
      };
      mr.stop();
    }
  }, []);

  // --- フロー ---
  const startInterview = () => {
    store.reset();
    store.setScreen("question");
    store.setCurrentQ(0);
    setShowInput(false);
    setDisplayText(CONFIG.greeting1);
    playAudio("greeting1", () => {
      setDisplayText(CONFIG.greeting2);
      playAudio("greeting2", () => {
        // greeting2が終わってからマイク許可→Q1
        startMic();
        setDisplayText(`Q1. ${QUESTIONS[0].q}`);
        setShowInput(true);
      });
    });
  };

  const nextQuestion = () => {
    if (currentQ + 1 < QUESTIONS.length) {
      const next = currentQ + 1;
      store.setCurrentQ(next);
      setDisplayText(`Q${next + 1}. ${QUESTIONS[next].q}`);
    } else {
      // 全問完了 → 全テキストを1つの回答として保存
      stopMic();
      store.addAnswer(textInput.trim());
      store.setScreen("confirm");
      setDisplayText("全部の質問が終わったよ！回答内容を確認して、よければ提出してね。");
    }
  };

  const submitContact = async () => {
    if (!nickname.trim() || !contact.trim()) return;
    const fullText = answers[0] || "";
    const answersData = [{ question: "面接全文", answer: fullText }];

    store.setScreen("complete");
    setDisplayText(CONFIG.complete1);
    playAudio("complete1", () => {
      setDisplayText(CONFIG.complete2);
      playAudio("complete2", () => {
        setTimeout(() => { store.reset(); location.reload(); }, 5000);
      });
    });

    let reportText = "";
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim(), answers: answersData }),
      });
      const data = await res.json();
      reportText = data.report || "";
    } catch { /* ignore */ }

    const record = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      nickname: nickname.trim(),
      contact: contact.trim(),
      answers: answersData,
      report: reportText,
    };
    const history = JSON.parse(localStorage.getItem("ai-mendan-history") || "[]");
    history.push(record);
    localStorage.setItem("ai-mendan-history", JSON.stringify(history));

    store.reset();
    toast.success("提出が完了しました");
  };

  const expression: "normal" | "smile" | "happy" | "talking" =
    isSpeaking ? "talking" : screen === "complete" ? "happy" : "normal";

  const progress = (screen === "complete" || screen === "confirm") ? 100
    : screen === "question" ? ((currentQ + 1) / QUESTIONS.length) * 100 : 0;

  // ===== タイトル =====
  if (screen === "title") {
    return (
      <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] bg-white flex flex-col justify-center px-8 gap-10">
        <Toaster position="top-center" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl font-black text-slate-800 tracking-wide">AI面談で<br />応募してみよう！</h1>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center">
          <p className="text-slate-700 text-2xl font-bold">履歴書なし・スマホで5分</p>
          <p className="text-slate-400 text-lg mt-2">匿名OK / 音声で回答 / 8問</p>
          <p className="text-slate-400 text-sm mt-3">※イヤホンの使用をおすすめします</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }} className="flex flex-col items-center gap-4">
          <button onClick={startInterview} className="w-[160px] h-[160px] flex flex-col items-center justify-center rounded-3xl font-bold text-lg bg-[#1e293b] text-white shadow-[0_2px_0_#0f172a] active:translate-y-[1px] active:shadow-none transition-all gap-1">
            <RotateCcw size={24} />
            <span>面接をはじめる</span>
          </button>
          {hasHistory && (
            <a href="/results" className="text-sm text-slate-400 underline underline-offset-2">
              提出済みの回答を見る
            </a>
          )}
        </motion.div>
        <div className="text-center">
          <p className="text-slate-300 text-xs">※デモ用: <a href="/admin" className="underline">管理画面はこちら</a>（本番では非表示）</p>
        </div>
      </div>
    );
  }

  // ===== 確認・提出 =====
  if (screen === "confirm") {
    return (
      <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] bg-white flex flex-col px-6 py-8 gap-6 overflow-y-auto">
        <Toaster position="top-center" />
        <h2 className="text-xl font-bold text-slate-800">回答内容を確認して提出</h2>

        {/* 音声 */}
        {audioBlobs.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 mb-2">面接の録音</p>
            <audio controls src={URL.createObjectURL(new Blob(audioBlobs, { type: "audio/webm" }))} className="w-full h-10" />
          </div>
        )}

        {/* テキスト */}
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-2">音声認識テキスト</p>
          <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{answers[0] || "（テキストなし）"}</p>
        </div>

        {/* 連絡先 */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-bold text-slate-700">ニックネーム <span className="text-red-500">*</span></label>
            <input type="text" placeholder="ニックネーム" value={nickname} onChange={(e) => store.setNickname(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-3 text-base w-full mt-1" />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700">電話番号 または LINE ID <span className="text-red-500">*</span></label>
            <input type="text" placeholder="電話番号 または LINE ID" value={contact} onChange={(e) => store.setContact(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-3 text-base w-full mt-1" />
          </div>
        </div>

        {/* ボタン */}
        <div className="flex flex-col gap-3 mt-auto">
          <button onClick={submitContact} disabled={!nickname.trim() || !contact.trim()} className="w-full py-4 rounded-xl font-bold text-lg bg-[#1e293b] text-white disabled:bg-slate-300 disabled:text-slate-500 transition-colors">
            提出する
          </button>
          <button onClick={() => { store.reset(); location.reload(); }} className="text-sm text-slate-400 underline">
            やり直す
          </button>
        </div>
      </div>
    );
  }

  // ===== 面談画面 =====
  return (
    <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] relative bg-slate-100 overflow-hidden">
      <Toaster position="top-center" />

      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="absolute inset-0 flex items-center justify-center z-0">
        <Character expression={expression} />
      </motion.div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 z-20">
        <motion.div className="h-full bg-slate-800" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
      </div>

      <div className="absolute top-3 left-4 right-4 z-20 flex justify-between items-center">
        <button onClick={() => { stopMic(); store.reset(); location.reload(); }} className="flex items-center gap-1 text-slate-500 active:text-slate-800 transition-colors w-[80px]">
          <Home size={18} />
          <span className="text-xs font-bold">トップへ</span>
        </button>
        {screen === "question" && isListening && (
          <span className="flex items-center gap-1 text-red-500 text-sm font-bold">
            <Mic size={16} className="animate-pulse" />
            <span>録音中</span>
          </span>
        )}
        {screen === "question" && (
          <p className="text-slate-800 text-lg font-bold w-[80px] text-right">残り{QUESTIONS.length - currentQ}問</p>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-4 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`msg-${currentQ}-${displayText.slice(0, 10)}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <MessageBox text={displayText} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {screen === "question" && showInput && (
            <motion.div
              key="answer-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AnswerBox textInput={textInput} isRecording={isListening} onTextChange={store.setTextInput} />
            </motion.div>
          )}
        </AnimatePresence>

        {screen === "question" ? (
          <div className="flex justify-center">
            <button onClick={nextQuestion} disabled={isSpeaking} className="w-full py-4 rounded-2xl text-base font-bold transition-all active:translate-y-[1px] bg-[#1e293b] text-white shadow-[0_2px_0_#0f172a] active:shadow-none flex items-center justify-center gap-2">
              <span>答えたら次へ</span>
              <ChevronRight size={20} />
            </button>
          </div>
        ) : screen === "complete" ? (
          <div className="text-center">
            <p className="text-slate-500 text-sm font-bold">体験していただきありがとうございました</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
