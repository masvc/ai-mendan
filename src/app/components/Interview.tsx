"use client";

import { useState, useRef, useCallback } from "react";
import Character from "./Character";
import MessageBox from "./MessageBox";
import AnswerBox from "./AnswerBox";
import BottomBar from "./BottomBar";

const CONFIG = {
  greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",
  greeting2: "うまく話そうとしなくて大丈夫。落ち着いてゆっくり話してね。",
  completeMessage: "今日はお話を聞かせてくれて、ありがとう！あなたの想いは、スタッフがきちんと目を通すよ。2日以内に連絡するから、少しだけ待っててね。不安なことがあれば、いつでも気軽に聞いてね。",
};

const QUESTIONS = [
  { q: "最近「誰かの役に立てた」と感じたことってある？小さなことでも大丈夫だよ。", short: "役に立てた経験", reaction: "そうなんだ、素敵だね。話してくれてありがとう。" },
  { q: "仕事で大切にしていることを3つ挙げるとしたら何かな？", short: "仕事で大切なこと", reaction: "なるほどね、いい考え方だと思うよ。" },
  { q: "これまでの職場で嬉しかったことと、しんどかったこと、教えてくれる？", short: "嬉しい/しんどい経験", reaction: "話してくれてありがとう。無理しなくていいからね。" },
  { q: "人と関わる仕事で、心がけていることってある？", short: "心がけていること", reaction: "うん、それすごく大事なことだよね。" },
  { q: "安心の絆で働くことに興味を持ってくれた理由を教えてくれる？", short: "興味を持った理由", reaction: "ありがとう。そう思ってくれて嬉しいよ。" },
  { q: "チームで働くとき、意識していることは？", short: "チームワーク", reaction: "チームワーク大事にしてるんだね。いいね。" },
  { q: "これまでの経験の中で「成長できた」と感じた瞬間ってある？", short: "成長の瞬間", reaction: "いい経験をしてきたんだね。あなたのペースでいいからね。" },
  { q: "安心の絆で、どんな働き方をしてみたい？希望があれば聞かせて。", short: "希望の働き方", reaction: "ありがとう！全部聞けてよかった。" },
];

type Screen = "title" | "question" | "confirm" | "complete" | "myrecord";

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
  const [voice, setVoice] = useState<"aoyama" | "kenzaki">("aoyama");
  const [showAnswers, setShowAnswers] = useState(false);
  const [audioBlobs, setAudioBlobs] = useState<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // --- 音声 ---
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
  const prevTextRef = useRef("");
  const startRecording = useCallback(() => {
    stopAudio();
    // Speech Recognition
    const API = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
    if (!API) { return; }
    prevTextRef.current = textInput ? textInput + " " : "";
    const r = new API(); r.lang = "ja-JP"; r.interimResults = true; r.continuous = true;
    r.onresult = (e: SpeechRecognitionEvent) => { let t = ""; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; setTextInput(prevTextRef.current + t); };
    r.onerror = () => { setIsRecording(false); };
    r.onend = () => setIsRecording(false);
    recognitionRef.current = r; r.start();

    // MediaRecorder（音声録音）
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start();
      mediaRecorderRef.current = mr;
    }).catch(() => {});

    setIsRecording(true);
  }, [stopAudio, textInput]);

  const stopRecording = useCallback(() => {
    // Speech Recognition停止
    const r = recognitionRef.current;
    if (r) { r.onresult = null; r.onend = null; r.onerror = null; r.stop(); recognitionRef.current = null; }
    // MediaRecorder停止 → Blob保存
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
    setScreen("question");
    setCurrentQ(0);
    setDisplayText(CONFIG.greeting1);
    playAudio("greeting1", CONFIG.greeting1, () => {
      setDisplayText(CONFIG.greeting2);
      playAudio("greeting2", CONFIG.greeting2, () => {
        setDisplayText(QUESTIONS[0].q);
        playAudio("q1", QUESTIONS[0].q);
      });
    });
  };

  const submitAnswer = () => {
    if (!textInput.trim()) return;
    stopAudio(); stopRecording();
    const newAnswers = [...answers, textInput.trim()];
    setAnswers(newAnswers);
    setTextInput("");

    // リアクション → 次の質問 or 確認画面
    setDisplayText(QUESTIONS[currentQ].reaction);
    playAudio(`r${currentQ + 1}`, QUESTIONS[currentQ].reaction, () => {
      if (currentQ + 1 < QUESTIONS.length) {
        const next = currentQ + 1;
        setCurrentQ(next);
        setDisplayText(QUESTIONS[next].q);
        playAudio(`q${next + 1}`, QUESTIONS[next].q);
      } else {
        const confirmMsg = "全部の質問が終わったよ！回答内容を確認して、よければ提出してね。";
        setDisplayText(confirmMsg);
        playAudio("confirm", confirmMsg, () => {
          setScreen("confirm");
        });
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

  const submitContact = async () => {
    if (!nickname.trim() || !contact.trim()) return;
    const answersData = QUESTIONS.map((q, i) => ({ question: q.short, answer: answers[i] || "" }));

    // 画面遷移＋音声再生
    setScreen("complete");
    setDisplayText(CONFIG.completeMessage);
    playAudio("complete", CONFIG.completeMessage);

    // レポート生成（バックグラウンド）
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

    // localStorageに保存
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
        </div>
        <div className="text-center">
          <p className="text-slate-700 text-2xl font-bold">履歴書なし・スマホで10分</p>
          <p className="text-slate-400 text-lg mt-2">匿名OK / 音声で回答 / 8問</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex gap-3 justify-center">
            {([["aoyama", "音声A", "青山龍星"], ["kenzaki", "音声B", "剣崎雌雄"]] as const).map(([k, label, sub]) => (
              <button key={k} onClick={() => setVoice(k)} className={`w-[110px] h-[70px] rounded-2xl text-sm font-bold transition-all duration-150 active:translate-y-[1px] flex flex-col items-center justify-center gap-0.5 ${voice === k ? "bg-slate-800 text-white shadow-[0_2px_0_#0f172a]" : "bg-white text-slate-500 border-2 border-slate-200 shadow-[0_2px_0_#e2e8f0]"}`}>
                <span>{label}</span>
                <span className="text-xs opacity-70">{sub}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <button onClick={startInterview} className="w-[140px] h-[140px] flex items-center justify-center rounded-3xl font-bold text-lg bg-[#1e293b] text-white shadow-[0_2px_0_#0f172a] active:translate-y-[1px] active:shadow-none transition-all">
            はじめる
          </button>
          {typeof window !== "undefined" && localStorage.getItem("ai-mendan-history") && (
            <button onClick={() => setScreen("myrecord" as Screen)} className="text-sm text-slate-400 underline underline-offset-2">
              提出済みの回答を見る
            </button>
          )}
        </div>
        <div className="text-center">
          <p className="text-slate-300 text-xs">※デモ用: <a href="/admin" className="underline">管理画面はこちら</a>（本番では非表示）</p>
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
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 space-y-4">
          <div className="bg-slate-50 rounded-xl px-5 py-5 space-y-4">
            <p className="text-slate-800 text-base font-bold text-center">連絡先</p>
            <div>
              <label className="text-slate-500 text-sm block mb-1">ニックネーム <span className="text-red-400">*</span></label>
              <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="例：たろう" className="vn-input" />
            </div>
            <div>
              <label className="text-slate-500 text-sm block mb-1">電話番号 または LINE ID <span className="text-red-400">*</span></label>
              <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="例：090-xxxx-xxxx" className="vn-input" />
            </div>
          </div>
          <button onClick={() => setShowAnswers(true)} className="w-full py-4 rounded-xl text-base font-bold text-slate-500 border-2 border-slate-200 active:translate-y-[1px] transition-all shadow-[0_2px_0_#e2e8f0] active:shadow-none">
            回答内容を確認する
          </button>
        </div>

        {showAnswers && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setShowAnswers(false)}>
            <div className="w-full max-w-[430px] max-h-[80vh] bg-white rounded-t-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="px-5 pt-5 pb-3 flex justify-between items-center border-b border-slate-100">
                <p className="text-slate-800 text-lg font-bold">回答内容</p>
                <button onClick={() => setShowAnswers(false)} className="text-slate-400 text-2xl leading-none">&times;</button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {QUESTIONS.map((q, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl px-5 py-4 text-center">
                    <p className="text-slate-400 text-sm font-bold mb-2">Q{i + 1}. {q.short}</p>
                    <p className="text-slate-700 text-base leading-relaxed">{answers[i] || "（未回答）"}</p>
                    {audioBlobs[i] && (
                      <audio controls src={URL.createObjectURL(audioBlobs[i])} className="mt-2 w-full h-8" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="bg-white/70 backdrop-blur-md border-t border-slate-100 px-6 py-6 flex justify-around items-center">
          <button onClick={() => location.reload()} className="w-[80px] h-[80px] flex flex-col items-center justify-center rounded-2xl text-sm font-bold border-2 border-slate-200 text-slate-400 shadow-[0_2px_0_#e2e8f0] active:translate-y-[1px] active:shadow-none transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
            <span className="mt-1">もう一度</span>
          </button>
          <button onClick={submitContact} disabled={!nickname.trim() || !contact.trim()} className="w-[90px] h-[90px] flex items-center justify-center rounded-2xl font-bold text-base bg-[#1e293b] text-white shadow-[0_2px_0_#0f172a] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-40">
            提出する
          </button>
        </div>
      </div>
    );
  }

  // ===== 自分の回答記録 =====
  if (screen === "myrecord") {
    const history = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("ai-mendan-history") || "[]") as { date: string; nickname: string; answers: { question: string; answer: string }[] }[] : [];
    const latest = history[history.length - 1];
    return (
      <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] bg-white flex flex-col">
        <div className="px-5 pt-6 pb-4 flex justify-between items-center">
          <h2 className="text-slate-800 text-lg font-bold">提出済みの回答</h2>
          <button onClick={() => setScreen("title")} className="text-sm text-slate-400 underline">戻る</button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 space-y-3">
          {latest ? (
            <>
              <div className="bg-slate-50 rounded-xl px-5 py-3 flex justify-between items-center">
                <p className="text-slate-700 text-sm font-bold">{latest.nickname}</p>
                <p className="text-slate-400 text-xs">{new Date(latest.date).toLocaleDateString("ja-JP")}</p>
              </div>
              {latest.answers.map((a, i) => (
                <div key={i} className="bg-slate-50 rounded-xl px-5 py-4 text-center">
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
    <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] relative bg-slate-100 overflow-hidden">
      {/* キャラクター（最背面） */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <Character expression={expression} />
      </div>

      {/* プログレスバー */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 z-20">
        <div className="h-full bg-slate-800 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Qカウンター */}
      {screen === "question" && (
        <div className="absolute top-4 right-4 z-20">
          <p className="text-slate-800 text-lg font-bold">残り{QUESTIONS.length - currentQ}問</p>
        </div>
      )}

      {/* 下部UI（キャラの上にモーダル風） */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-4 min-w-0">
        <MessageBox text={displayText} />

        {screen === "question" && (isRecording || textInput) && (
          <AnswerBox
            textInput={textInput}
            isRecording={isRecording}
          />
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
