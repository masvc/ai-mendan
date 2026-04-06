"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { AnimatePresence, motion } from "motion/react";
import { Toaster, toast } from "sonner";
import { Mic, MicOff, ChevronLeft, ChevronRight, RotateCcw, Play, Home } from "lucide-react";
import clsx from "clsx";
import { useInterviewStore } from "../store";
import Character from "./Character";
import MessageBox from "./MessageBox";
import AnswerBox from "./AnswerBox";
import ConfirmScreen from "./ConfirmScreen";

const CONFIG = {
  greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",
  greeting2: "うまく話そうとしなくて大丈夫。落ち着いてゆっくり話してね。",
  complete1: "今日はお話を聞かせてくれて、ありがとう！あなたの想いは、スタッフがきちんと目を通すよ。",
  complete2: "2日以内に連絡するから、少しだけ待っててね。不安なことがあれば、いつでも気軽に聞いてね。",
};

export const QUESTIONS = [
  { q: "最近「誰かの役に立てた」と感じたことってある？小さなことでも大丈夫だよ。", short: "役に立てた経験", reaction: "そうなんだ、素敵だね。話してくれてありがとう。" },
  { q: "仕事で大切にしていることを3つ挙げるとしたら何かな？", short: "仕事で大切なこと", reaction: "なるほどね、いい考え方だと思うよ。" },
  { q: "これまでの職場で嬉しかったことと、しんどかったこと、教えてくれる？", short: "嬉しい/しんどい経験", reaction: "話してくれてありがとう。無理しなくていいからね。" },
  { q: "人と関わる仕事で、心がけていることってある？", short: "心がけていること", reaction: "うん、それすごく大事なことだよね。" },
  { q: "安心の絆で働くことに興味を持ってくれた理由を教えてくれる？", short: "興味を持った理由", reaction: "ありがとう。そう思ってくれて嬉しいよ。" },
  { q: "チームで働くとき、意識していることは？", short: "チームワーク", reaction: "チームワーク大事にしてるんだね。いいね。" },
  { q: "これまでの経験の中で「成長できた」と感じた瞬間ってある？", short: "成長の瞬間", reaction: "いい経験をしてきたんだね。あなたのペースでいいからね。" },
  { q: "安心の絆で、どんな働き方をしてみたい？希望があれば聞かせて。", short: "希望の働き方", reaction: "ありがとう！全部聞けてよかった。" },
];

export default function Interview() {
  const store = useInterviewStore();
  const { screen, currentQ, answers, textInput, nickname, contact, voice } = store;

  const [displayText, setDisplayText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlobs, setAudioBlobs] = useState<Blob[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const [hasHistory, setHasHistory] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const prevTextRef = useRef("");

  // --- 復帰処理（クライアントのみ） ---
  const resumed = useRef(false);
  useEffect(() => {
    if (resumed.current) return;
    resumed.current = true;
    // zustandのlocalStorage復元を手動実行（SSR hydrationミスマッチ防止）
    useInterviewStore.persist.rehydrate();
    setHasHistory(!!localStorage.getItem("ai-mendan-history"));

    // rehydrate後に状態を確認して復帰通知
    const unsub = useInterviewStore.subscribe((s) => {
      if (s.screen === "question" && s.answers.length > 0) {
        setDisplayText(QUESTIONS[s.currentQ]?.q || "");
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
    const audio = new Audio(`/audio/${voice}/${audioKey}.wav?v=2`);
    audioRef.current = audio;
    audio.onplay = () => setIsSpeaking(true);
    audio.onended = () => { setIsSpeaking(false); audioRef.current = null; onEnd?.(); };
    audio.onerror = () => { setIsSpeaking(false); audioRef.current = null; onEnd?.(); };
    audio.play().catch(() => { setIsSpeaking(false); onEnd?.(); });
  }, [voice]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setIsSpeaking(false);
  }, []);

  // --- 録音 ---
  const startRecording = useCallback(() => {
    stopAudio();
    const API = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
    if (!API) { toast.error("このブラウザは音声入力に対応していません"); return; }
    prevTextRef.current = textInput ? textInput + " " : "";
    const r = new API(); r.lang = "ja-JP"; r.interimResults = true; r.continuous = true;
    r.onresult = (e: SpeechRecognitionEvent) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      store.setTextInput(prevTextRef.current + t);
    };
    r.onerror = () => { setIsRecording(false); toast.error("音声認識でエラーが発生しました"); };
    r.onend = () => setIsRecording(false);
    recognitionRef.current = r; r.start();

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start();
      mediaRecorderRef.current = mr;
    }).catch(() => {});

    setIsRecording(true);
  }, [stopAudio, textInput, store]);

  const stopRecording = useCallback(() => {
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
    setIsRecording(false);
  }, []);

  // --- フロー ---
  const startInterview = () => {
    store.setScreen("question");
    store.setCurrentQ(0);
    setDisplayText(CONFIG.greeting1);
    playAudio("greeting1", CONFIG.greeting1, () => {
      setDisplayText(CONFIG.greeting2);
      playAudio("greeting2", CONFIG.greeting2, () => {
        setDisplayText(QUESTIONS[0].q);
        playAudio("q1", QUESTIONS[0].q);
      });
    });
  };

  const resumeInterview = () => {
    store.setScreen("question");
    setDisplayText(QUESTIONS[currentQ].q);
    playAudio(`q${currentQ + 1}`, QUESTIONS[currentQ].q);
    toast("続きから再開します");
  };

  const submitAnswer = () => {
    if (!textInput.trim()) return;
    stopAudio(); stopRecording();
    setSlideDir(1);
    store.addAnswer(textInput.trim());

    setDisplayText(QUESTIONS[currentQ].reaction);
    playAudio(`r${currentQ + 1}`, QUESTIONS[currentQ].reaction, () => {
      if (currentQ + 1 < QUESTIONS.length) {
        const next = currentQ + 1;
        store.setCurrentQ(next);
        setDisplayText(QUESTIONS[next].q);
        playAudio(`q${next + 1}`, QUESTIONS[next].q);
      } else {
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
    stopAudio(); stopRecording();
    setSlideDir(-1);
    store.popAnswer();
    setDisplayText(QUESTIONS[currentQ - 1].q);
    playAudio(`q${currentQ}`, QUESTIONS[currentQ - 1].q);
  };

  const submitContact = async () => {
    if (!nickname.trim() || !contact.trim()) return;
    const answersData = QUESTIONS.map((q, i) => ({ question: q.short, answer: answers[i] || "" }));

    store.setScreen("complete");
    setDisplayText(CONFIG.complete1);
    playAudio("complete1", CONFIG.complete1, () => {
      setDisplayText(CONFIG.complete2);
      playAudio("complete2", CONFIG.complete2);
    });

    let reportText = "";
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim(), contact: contact.trim(), answers: answersData }),
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

    // 進捗データをクリア
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
          <h1 className="text-5xl font-black text-slate-800 tracking-wide">AI面談</h1>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center">
          <p className="text-slate-700 text-2xl font-bold">履歴書なし・スマホで10分</p>
          <p className="text-slate-400 text-lg mt-2">匿名OK / 音声で回答 / 8問</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center">
          <div className="flex gap-3 justify-center">
            {([["aoyama", "音声A", "青山龍星"], ["kenzaki", "音声B", "剣崎雌雄"]] as const).map(([k, label, sub]) => (
              <button key={k} onClick={() => store.setVoice(k)} className={clsx("w-[110px] h-[70px] rounded-2xl text-sm font-bold transition-all duration-150 active:translate-y-[1px] flex flex-col items-center justify-center gap-0.5", voice === k ? "bg-slate-800 text-white shadow-[0_2px_0_#0f172a]" : "bg-white text-slate-500 border-2 border-slate-200 shadow-[0_2px_0_#e2e8f0]")}>
                <span>{label}</span>
                <span className="text-xs opacity-70">{sub}</span>
              </button>
            ))}
          </div>
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
          {hasHistory && (
            <button onClick={() => store.setScreen("myrecord")} className="text-sm text-slate-400 underline underline-offset-2">
              提出済みの回答を見る
            </button>
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
          showAnswers={showAnswers}
          setShowAnswers={setShowAnswers}
        />
      </>
    );
  }

  // ===== 自分の回答記録 =====
  if (screen === "myrecord") {
    const history = JSON.parse(localStorage.getItem("ai-mendan-history") || "[]") as { date: string; nickname: string; answers: { question: string; answer: string }[] }[];
    const latest = history[history.length - 1];
    return (
      <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] bg-white flex flex-col">
        <div className="px-5 pt-6 pb-4 flex justify-between items-center">
          <h2 className="text-slate-800 text-lg font-bold">提出済みの回答</h2>
          <button onClick={() => store.setScreen("title")} className="text-sm text-slate-400 underline">戻る</button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 space-y-3">
          {latest ? (
            <>
              <div className="bg-slate-50 rounded-xl px-5 py-3 flex justify-between items-center">
                <p className="text-slate-700 text-sm font-bold">{latest.nickname}</p>
                <p className="text-slate-400 text-xs">{new Date(latest.date).toLocaleDateString("ja-JP")}</p>
              </div>
              {latest.answers.map((a, i) => (
                <div key={i} className="bg-slate-50 rounded-xl px-5 py-4">
                  <p className="text-slate-400 text-sm font-bold mb-2">Q{i + 1}. {a.question}</p>
                  <p className="text-slate-700 text-base leading-relaxed">{a.answer || "（未回答）"}</p>
                </div>
              ))}
              <p className="text-slate-300 text-xs text-center pt-2">※内容はスタッフが確認し、2日以内にご連絡します</p>
            </>
          ) : (
            <p className="text-slate-400 text-center py-16">まだ提出記録がありません</p>
          )}
        </div>
      </div>
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
        <button onClick={() => { stopAudio(); stopRecording(); store.setScreen("title"); }} className="flex items-center gap-1 text-slate-500 active:text-slate-800 transition-colors">
          <Home size={18} />
          <span className="text-xs font-bold">トップ</span>
        </button>
        {screen === "question" && (
          <p className="text-slate-800 text-lg font-bold">残り{QUESTIONS.length - currentQ}問</p>
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

        {screen === "question" && (isRecording || textInput) && (
          <AnswerBox textInput={textInput} isRecording={isRecording} />
        )}

        {screen === "question" ? (
          <div className="flex justify-around items-center">
            <button onClick={goBack} disabled={currentQ <= 0 || isSpeaking} className={clsx("w-[80px] h-[80px] flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all active:translate-y-[1px]", currentQ > 0 ? "border-2 border-slate-200 text-slate-500 shadow-[0_2px_0_#e2e8f0] active:shadow-none" : "border-2 border-slate-100 text-slate-300")}>
              <ChevronLeft size={22} />
              <span className="mt-1">戻る</span>
            </button>
            {isRecording ? (
              <button onClick={stopRecording} className="w-[90px] h-[90px] flex flex-col items-center justify-center rounded-2xl font-bold text-base bg-red-500 text-white shadow-[0_2px_0_#b91c1c] active:translate-y-[1px] active:shadow-none transition-all animate-rec-pulse">
                <MicOff size={26} />
                <span className="text-xs mt-1">停止</span>
              </button>
            ) : (
              <button onClick={startRecording} disabled={isSpeaking} className={clsx("w-[90px] h-[90px] flex flex-col items-center justify-center rounded-2xl font-bold text-base transition-all active:translate-y-[1px] active:shadow-none", isSpeaking ? "bg-slate-300 text-white" : "bg-[#c4756e] text-white shadow-[0_2px_0_#a85b55]")}>
                <Mic size={26} />
                <span className="text-xs mt-1">{textInput ? "再録音" : "話す"}</span>
              </button>
            )}
            <button onClick={submitAnswer} disabled={!textInput.trim() || isSpeaking} className={clsx("w-[80px] h-[80px] flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all active:translate-y-[1px]", textInput.trim() ? "border-2 border-slate-200 text-slate-500 shadow-[0_2px_0_#e2e8f0] active:shadow-none" : "border-2 border-slate-100 text-slate-300")}>
              <ChevronRight size={22} />
              <span className="mt-1">次へ</span>
            </button>
          </div>
        ) : screen === "complete" ? (
          <div className="flex justify-center">
            <button onClick={() => { store.reset(); location.reload(); }} className="w-[80px] h-[80px] flex flex-col items-center justify-center rounded-2xl text-sm font-bold border-2 border-slate-200 text-slate-500 shadow-[0_2px_0_#e2e8f0] active:translate-y-[1px] active:shadow-none transition-all">
              <RotateCcw size={20} />
              <span className="mt-1">再開</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
