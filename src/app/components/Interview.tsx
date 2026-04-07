"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { AnimatePresence, motion } from "motion/react";
import { Toaster, toast } from "sonner";
import { ChevronLeft, ChevronRight, RotateCcw, Play, Home, Mic } from "lucide-react";
import clsx from "clsx";
import { useInterviewStore } from "../store";
import Character from "./Character";
import MessageBox from "./MessageBox";
import AnswerBox from "./AnswerBox";
import ConfirmScreen from "./ConfirmScreen";

const CONFIG = {
  greeting1: "こんにちは、株式会社安心の絆の翔平です。今日はちょっとしたお話の時間だよ。",
  greeting2: "うまく話そうとしなくて大丈夫。落ち着いてゆっくり話してね。",
  complete1: "今日はお話を聞かせてくれて、ありがとう！あなたの想いは、スタッフがきちんと目を通すよ。",
  complete2: "2日以内に連絡するから、少しだけ待っててね。不安なことがあれば、いつでも気軽に聞いてね。",
};

export const QUESTIONS = [
  { q: "最近「誰かの役に立てた」と感じたことってある？小さなことでも大丈夫だよ。", short: "役に立てた経験", reaction: "そうなんだ、素敵だね。話してくれてありがとう。" },
  { q: "仕事で大切にしていることを3つ挙げるとしたら何かな？", short: "仕事で大切なこと", reaction: "なるほどね、いい考え方だと思うよ。" },
  { q: "これまでの職場で嬉しかったことと、しんどかったこと、教えてくれる？", short: "嬉しい/しんどい経験", reaction: "話してくれてありがとう。無理しなくていいからね。" },
  { q: "人と関わる仕事で、心がけていることってある？", short: "心がけていること", reaction: "うん、それすごく大事なことだよね。" },
  { q: "株式会社安心の絆で働くことに興味を持ってくれた理由を教えてくれる？", short: "興味を持った理由", reaction: "ありがとう。そう思ってくれて嬉しいよ。" },
  { q: "チームで働くとき、意識していることは？", short: "チームワーク", reaction: "チームワーク大事にしてるんだね。いいね。" },
  { q: "これまでの経験の中で「成長できた」と感じた瞬間ってある？", short: "成長の瞬間", reaction: "いい経験をしてきたんだね。あなたのペースでいいからね。" },
  { q: "株式会社安心の絆で、どんな働き方をしてみたい？希望があれば聞かせて。", short: "希望の働き方", reaction: "ありがとう！全部聞けてよかった。" },
];

export default function Interview() {
  const store = useInterviewStore();
  const { screen, currentQ, answers, textInput, nickname, contact } = store;

  const [displayText, setDisplayText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioBlobs, setAudioBlobs] = useState<Blob[]>([]);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const [hasHistory, setHasHistory] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const prevTextRef = useRef("");
  const micPausedRef = useRef(false);

  // --- 復帰処理（クライアントのみ） ---
  const resumed = useRef(false);
  useEffect(() => {
    if (resumed.current) return;
    resumed.current = true;
    useInterviewStore.persist.rehydrate();
    setHasHistory(!!localStorage.getItem("ai-mendan-history"));

    const unsub = useInterviewStore.subscribe((s) => {
      if (s.screen === "question" && s.answers.length > 0) {
        setDisplayText(QUESTIONS[s.currentQ]?.q || "");
        setShowInput(true);
        toast("前回の続きから再開します", { duration: 3000 });
      } else if (s.screen === "confirm") {
        setDisplayText("全部の質問が終わったよ！回答内容を確認して、よければ提出してね。");
        toast("前回の続きから再開します", { duration: 3000 });
      } else if (s.screen === "complete") {
        setDisplayText(CONFIG.complete2);
      }
      unsub();
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- 音声再生 ---
  const playAudio = useCallback((audioKey: string, _text: string, onEnd?: () => void) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    const audio = new Audio(`/audio/kenzaki/${audioKey}.wav?v=2`);
    audioRef.current = audio;
    // 再生中は音声認識を一時停止（翔平の声を拾わないように）
    const pauseRecognition = () => {
      micPausedRef.current = true;
      const r = recognitionRef.current;
      if (r) { try { r.stop(); } catch { /* ignore */ } }
    };
    const resumeRecognition = () => {
      micPausedRef.current = false;
      const r = recognitionRef.current;
      if (r) { try { r.start(); } catch { /* ignore */ } }
    };
    audio.onplay = () => { setIsSpeaking(true); pauseRecognition(); };
    audio.onended = () => { setIsSpeaking(false); audioRef.current = null; resumeRecognition(); onEnd?.(); };
    audio.onerror = () => { setIsSpeaking(false); audioRef.current = null; resumeRecognition(); onEnd?.(); };
    audio.play().catch(() => { setIsSpeaking(false); resumeRecognition(); onEnd?.(); });
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setIsSpeaking(false);
  }, []);

  // --- マイク（通しで起動） ---
  const startMic = useCallback(() => {
    if (recognitionRef.current) return; // 既に起動中

    const API = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
    if (!API) { toast.error("このブラウザは音声入力に対応していません"); return; }

    prevTextRef.current = "";
    const r = new API();
    r.lang = "ja-JP";
    r.interimResults = true;
    r.continuous = true;

    r.onresult = (e: SpeechRecognitionEvent) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      store.setTextInput(prevTextRef.current + t);
    };
    r.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "no-speech") return;
      // エラー後も自動リスタート
    };
    r.onend = () => {
      // 通しで動かすため、refが残っていれば自動リスタート（一時停止中はスキップ）
      if (recognitionRef.current === r && !micPausedRef.current) {
        try { r.start(); } catch { /* ignore */ }
      }
    };

    recognitionRef.current = r;
    r.start();
    setIsListening(true);

    // 録音（1本通し）
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
    if (r) { r.onresult = null; r.onend = null; r.onerror = null; r.stop(); recognitionRef.current = null; }
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
    setIsListening(false);
  }, []);

  // 質問切り替え時に認識をリセット（停止のみ。再開はrestartRecognitionで明示的に行う）
  const resetRecognition = useCallback(() => {
    prevTextRef.current = "";
    store.setTextInput("");
    const r = recognitionRef.current;
    if (r) {
      r.onresult = null;
      r.onend = null;
      r.onerror = null;
      r.stop();
      recognitionRef.current = null;
    }
  }, [store]);

  // 新しいSpeechRecognitionセッションを開始（質問音声の再生終了後に呼ぶ）
  const restartRecognition = useCallback(() => {
    if (recognitionRef.current) return; // 既に起動中
    const API = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
    if (!API) return;
    const nr = new API();
    nr.lang = "ja-JP";
    nr.interimResults = true;
    nr.continuous = true;
    nr.onresult = (e: SpeechRecognitionEvent) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      store.setTextInput(prevTextRef.current + t);
    };
    nr.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "no-speech") return;
    };
    nr.onend = () => {
      if (recognitionRef.current === nr && !micPausedRef.current) {
        try { nr.start(); } catch { /* ignore */ }
      }
    };
    recognitionRef.current = nr;
    try { nr.start(); } catch { /* ignore */ }
  }, [store]);

  // --- フロー ---
  const startInterview = () => {
    store.setScreen("question");
    store.setCurrentQ(0);
    setShowInput(false);
    setDisplayText(CONFIG.greeting1);
    playAudio("greeting1", CONFIG.greeting1, () => {
      setDisplayText(CONFIG.greeting2);
      playAudio("greeting2", CONFIG.greeting2, () => {
        setDisplayText(QUESTIONS[0].q);
        playAudio("q1", QUESTIONS[0].q, () => {
          // 全挨拶+最初の質問が終わってからマイク起動
          startMic();
          setShowInput(true);
        });
      });
    });
  };

  const resumeInterview = () => {
    const safeQ = Math.min(currentQ, QUESTIONS.length - 1);
    store.setScreen("question");
    store.setCurrentQ(safeQ);
    setShowInput(false);
    setDisplayText(QUESTIONS[safeQ].q);
    playAudio(`q${safeQ + 1}`, QUESTIONS[safeQ].q, () => {
      // 質問音声が終わってからマイク起動
      startMic();
      setShowInput(true);
    });
    toast("続きから再開します");
  };

  const submitAnswer = () => {
    if (!textInput.trim()) return;
    stopAudio();
    setSlideDir(1);
    setShowInput(false);
    store.addAnswer(textInput.trim());
    // 即座にテキスト表示をクリア（リアクション再生中に前の回答が残らないように）
    store.setTextInput("");
    prevTextRef.current = "";

    setDisplayText(QUESTIONS[currentQ].reaction);
    playAudio(`r${currentQ + 1}`, QUESTIONS[currentQ].reaction, () => {
      if (currentQ + 1 < QUESTIONS.length) {
        const next = currentQ + 1;
        store.setCurrentQ(next);
        setDisplayText(QUESTIONS[next].q);
        // 認識をリセットして、次の質問音声が終わったら再開
        resetRecognition();
        playAudio(`q${next + 1}`, QUESTIONS[next].q, () => {
          restartRecognition();
          setShowInput(true);
        });
      } else {
        // 全問完了 → マイク停止
        stopMic();
        const confirmMsg = "全部の質問が終わったよ！回答内容を確認して、よければ提出してね。";
        setDisplayText(confirmMsg);
        playAudio("confirm", confirmMsg, () => {
          store.setScreen("confirm");
        });
      }
    });
  };

  const goBack = () => {
    if (currentQ <= 0) return;
    stopAudio();
    setSlideDir(-1);
    setShowInput(false);
    store.popAnswer();
    store.setTextInput("");
    prevTextRef.current = "";
    resetRecognition();
    setDisplayText(QUESTIONS[currentQ - 1].q);
    playAudio(`q${currentQ}`, QUESTIONS[currentQ - 1].q, () => {
      restartRecognition();
      setShowInput(true);
    });
  };

  const submitContact = async () => {
    if (!nickname.trim() || !contact.trim()) return;
    const answersData = QUESTIONS.map((q, i) => ({ question: q.short, answer: answers[i] || "" }));

    store.setScreen("complete");
    setDisplayText(CONFIG.complete1);
    playAudio("complete1", CONFIG.complete1, () => {
      setDisplayText(CONFIG.complete2);
      playAudio("complete2", CONFIG.complete2, () => {
        // 音声終了後5秒でトップに自動遷移
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

  // --- スワイプ ---
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => { if (screen === "question" && textInput.trim()) submitAnswer(); },
    onSwipedRight: () => { if (screen === "question" && currentQ > 0) goBack(); },
    trackMouse: false,
    delta: 50,
  });

  const expression: "normal" | "smile" | "happy" | "talking" =
    isSpeaking ? "talking" : screen === "complete" ? "happy" : "normal";

  const progress = (screen === "complete" || screen === "confirm") ? 100
    : screen === "question" ? ((currentQ + 1) / QUESTIONS.length) * 100 : 0;

  // ===== タイトル =====
  if (screen === "title") {
    const hasProgress = store.hasProgress();
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
          <div className="flex gap-4">
            <button onClick={() => { store.reset(); startInterview(); }} className="w-[130px] h-[130px] flex flex-col items-center justify-center rounded-3xl font-bold text-lg bg-[#1e293b] text-white shadow-[0_2px_0_#0f172a] active:translate-y-[1px] active:shadow-none transition-all gap-1">
              <RotateCcw size={24} />
              <span>初めから</span>
            </button>
            <button onClick={resumeInterview} disabled={!hasProgress} className={clsx("w-[130px] h-[130px] flex flex-col items-center justify-center rounded-3xl font-bold text-lg transition-all gap-1 active:translate-y-[1px]", hasProgress ? "bg-[#1e293b] text-white shadow-[0_2px_0_#0f172a] active:shadow-none" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>
              <Play size={28} />
              <span>続きから</span>
            </button>
          </div>
          {hasProgress && (
            <p className="text-slate-400 text-sm text-center">Q{Math.min(answers.length + 1, QUESTIONS.length)}まで保存済み</p>
          )}
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

  // ===== 回答確認 + 連絡先 =====
  if (screen === "confirm") {
    return (
      <>
        <Toaster position="top-center" />
        <ConfirmScreen
          answers={answers}
          nickname={nickname}
          contact={contact}
          onNicknameChange={store.setNickname}
          onContactChange={store.setContact}
          onSubmit={submitContact}
          onRestart={() => { store.reset(); location.reload(); }}
          audioBlobs={audioBlobs}
        />
      </>
    );
  }

  // ===== 面談画面（質問 + 完了） =====
  return (
    <div {...swipeHandlers} className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] relative bg-slate-100 overflow-hidden">
      <Toaster position="top-center" />

      {/* キャラクター */}
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="absolute inset-0 flex items-center justify-center z-0">
        <Character expression={expression} />
      </motion.div>

      {/* プログレスバー */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 z-20">
        <motion.div className="h-full bg-slate-800" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
      </div>

      {/* トップバー */}
      <div className="absolute top-3 left-4 right-4 z-20 flex justify-between items-center">
        <button onClick={() => { stopAudio(); stopMic(); store.setScreen("title"); toast("回答は自動保存済み。「続きから」で再開できます", { duration: 3000 }); }} className="flex items-center gap-1 text-slate-500 active:text-slate-800 transition-colors w-[80px]">
          <Home size={18} />
          <span className="text-xs font-bold">中断する</span>
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

      {/* 下部UI */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-4 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`msg-${currentQ}-${displayText.slice(0, 10)}`}
            initial={{ opacity: 0, x: slideDir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDir * -40 }}
            transition={{ duration: 0.25 }}
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
          <div className="flex justify-between items-center">
            <button onClick={goBack} disabled={currentQ <= 0 || isSpeaking} className={clsx("w-[80px] h-[80px] flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all active:translate-y-[1px]", currentQ > 0 ? "bg-white/90 border-2 border-slate-200 text-slate-600 shadow-[0_2px_0_#e2e8f0] active:shadow-none" : "bg-white/50 border-2 border-slate-100 text-slate-300")}>
              <ChevronLeft size={22} />
              <span className="mt-1">戻る</span>
            </button>
            <button onClick={submitAnswer} disabled={!textInput.trim() || isSpeaking} className={clsx("w-[80px] h-[80px] flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all active:translate-y-[1px]", textInput.trim() ? "bg-[#1e293b] text-white shadow-[0_2px_0_#0f172a] active:shadow-none" : "bg-white/50 border-2 border-slate-100 text-slate-300")}>
              <ChevronRight size={22} />
              <span className="mt-1">次へ</span>
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
