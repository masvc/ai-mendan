"use client";

import { useState, useRef, useCallback } from "react";
import Character from "./Character";

// ============ 設定（案件ごとに変更可能） ============
const CONFIG = {
  title: "AI面談",
  subtitle: "履歴書いらない。スマホだけでOK。\n10分で終わる、気軽な面談です。",
  characterName: "翔平",
  greeting:
    "こんにちは。AIの翔平です。\n\n今日は応募というより、ちょっとしたお話の時間です。\n正解はありません。\n\nあなたに合いそうな働き方を、一緒に考えられたらうれしいな。",
  completeMessage:
    "今日はお話を聞かせてくれて、ありがとう！\n\nあなたの想いや大切にしていることは、スタッフがきちんと目を通します。\n\n2日以内に、今後についてご連絡しますので、少しだけお待ちください。\n\n不安なことや聞いておきたいことがあれば、いつでも大丈夫だよ。",
};

const QUESTIONS = [
  {
    q: "最近「誰かの役に立てた」と感じた出来事はある？\nなんでもいいよ、小さなことでも。",
    reaction: "そうなんだ、素敵だね。ありがとう。",
  },
  {
    q: "仕事で大切にしていることを3つ挙げるとしたら何かな？",
    reaction: "なるほどね、いい考え方だと思うよ。",
  },
  {
    q: "これまでの職場で「嬉しかったこと」と「しんどかったこと」を教えてくれる？",
    reaction: "話してくれてありがとう。気持ちわかるよ。",
  },
  {
    q: "人と関わる仕事で、心がけていることってある？",
    reaction: "うん、それは大事なことだよね。",
  },
  {
    q: "ここで働くことに興味を持った理由を教えてくれる？",
    reaction: "ありがとう。そう思ってくれて嬉しいよ。",
  },
  {
    q: "チームで働くとき、意識していることは？",
    reaction: "チームワーク大事にしてるんだね。",
  },
  {
    q: "これまでの経験の中で「成長できた」と感じた瞬間ってある？",
    reaction: "いい経験をしてきたんだね。",
  },
  {
    q: "どんな働き方をしてみたい？\n希望や理想があれば聞かせて。",
    reaction: "ありがとう！全部聞けてよかった。",
  },
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

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // テキストをタイプライター風に表示
  const typeText = useCallback((text: string, onDone?: () => void) => {
    setIsTyping(true);
    setDisplayText("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        onDone?.();
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // 音声読み上げ
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      onEnd?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\n/g, "。"));
    utterance.lang = "ja-JP";
    utterance.rate = 0.95;
    utterance.pitch = 0.85;
    utterance.onend = () => onEnd?.();
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  // 音声認識開始
  const startRecording = useCallback(() => {
    const SpeechRecognitionAPI =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    if (!SpeechRecognitionAPI) {
      setInputMode("text");
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "ja-JP";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setTextInput(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setInputMode("text");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  // ===== 画面遷移 =====
  const startInterview = () => {
    setScreen("greeting");
    typeText(CONFIG.greeting, () => {
      speak(CONFIG.greeting);
    });
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
    typeText(q, () => {
      speak(q);
    });
  };

  const submitAnswer = () => {
    const answer = textInput.trim();
    if (!answer) return;

    window.speechSynthesis?.cancel();
    stopRecording();

    setAnswers((prev) => [...prev, answer]);
    setScreen("reaction");
    const reaction = QUESTIONS[currentQ].reaction;
    typeText(reaction, () => {
      speak(reaction, () => {
        setTimeout(() => {
          if (currentQ + 1 < QUESTIONS.length) {
            setCurrentQ((prev) => prev + 1);
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
    typeText(CONFIG.completeMessage, () => {
      speak(CONFIG.completeMessage);
    });
  };

  // ===== 表情 =====
  const expression =
    screen === "complete" || screen === "reaction" ? "happy" : screen === "greeting" ? "smile" : "normal";

  // ===== プログレス =====
  const progress =
    screen === "complete" || screen === "contact"
      ? 100
      : screen === "question" || screen === "reaction"
        ? ((currentQ + 1) / QUESTIONS.length) * 100
        : 0;

  return (
    <div className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden select-none">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-top via-sky-mid via-40% to-grass" />
      {/* 背景の草原 */}
      <div className="absolute bottom-[32%] left-0 right-0 h-32 bg-gradient-to-t from-grass-light to-transparent" />
      {/* 雲 */}
      <div className="absolute top-[8%] left-[10%] w-24 h-10 bg-white/60 rounded-full blur-sm" />
      <div className="absolute top-[12%] right-[15%] w-16 h-7 bg-white/40 rounded-full blur-sm" />

      {/* プログレスバー */}
      {screen !== "title" && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/20 z-20">
          <div
            className="h-full bg-gradient-to-r from-kizuna-light to-amber-400 transition-all duration-500 rounded-r"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* 質問カウンター */}
      {(screen === "question" || screen === "reaction") && (
        <div className="absolute top-3 right-3 bg-kizuna-green text-white text-xs font-bold px-3 py-1 rounded-full z-20 border border-kizuna-light">
          Q{currentQ + 1} / {QUESTIONS.length}
        </div>
      )}

      {/* キャラクター */}
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center">
        <Character expression={expression} />
        <div className="mt-2 bg-gradient-to-r from-kizuna-green to-emerald-600 text-white text-sm font-bold px-5 py-1 rounded-full shadow-lg tracking-widest">
          {CONFIG.characterName}
        </div>
      </div>

      {/* ===== ダイアログエリア ===== */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-2 pb-4">
        {/* メッセージボックス */}
        <div className="bg-gradient-to-b from-emerald-950/92 to-emerald-950/96 border-2 border-kizuna-light rounded-xl px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] min-h-[110px]">
          {screen !== "title" && (
            <p className="text-kizuna-light text-xs font-bold mb-1">{CONFIG.characterName}</p>
          )}
          <p className="text-emerald-50 text-[15px] leading-relaxed whitespace-pre-wrap">
            {screen === "title"
              ? "ちょっと話してみない？\n履歴書いらないよ。スマホだけでOK。"
              : displayText}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
        </div>

        {/* ===== タイトル画面 ===== */}
        {screen === "title" && (
          <button
            onClick={startInterview}
            className="mt-3 w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-white text-lg font-bold shadow-lg animate-pulse tracking-wider"
          >
            面接をはじめる
          </button>
        )}

        {/* ===== あいさつ画面 ===== */}
        {screen === "greeting" && !isTyping && (
          <button
            onClick={startQuestions}
            className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-kizuna-green to-emerald-500 text-white font-bold shadow-lg"
          >
            はじめる
          </button>
        )}

        {/* ===== 質問画面 ===== */}
        {screen === "question" && !isTyping && (
          <div className="mt-3 space-y-2">
            {inputMode === "voice" ? (
              <>
                {/* 音声入力表示 */}
                {textInput && (
                  <div className="bg-white/95 rounded-lg px-3 py-2 text-sm text-gray-700 min-h-[40px]">
                    {textInput}
                  </div>
                )}
                <div className="flex gap-2">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-400 text-white font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                      <span className="w-3 h-3 bg-white rounded-full" />
                      話す
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold shadow-lg flex items-center justify-center gap-2 animate-pulse"
                    >
                      <span className="w-3 h-3 bg-red-400 rounded-full animate-ping" />
                      録音中...
                    </button>
                  )}
                  {textInput && (
                    <button
                      onClick={submitAnswer}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-kizuna-green to-emerald-500 text-white font-bold shadow-lg"
                    >
                      回答する
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setInputMode("text")}
                  className="w-full py-2 text-xs text-emerald-300/80 underline"
                >
                  テキスト入力に切り替え
                </button>
              </>
            ) : (
              <>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="ここに入力してください..."
                  className="w-full border-2 border-kizuna-light rounded-lg px-3 py-2 text-[15px] bg-white/95 text-gray-800 outline-none focus:ring-2 focus:ring-kizuna-light resize-none h-[72px]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setInputMode("voice")}
                    className="py-3 px-4 rounded-xl bg-white/15 text-emerald-200 font-bold border border-kizuna-light"
                  >
                    🎤
                  </button>
                  <button
                    onClick={submitAnswer}
                    disabled={!textInput.trim()}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-kizuna-green to-emerald-500 text-white font-bold shadow-lg disabled:opacity-40"
                  >
                    回答する
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== 連絡先入力画面 ===== */}
        {screen === "contact" && !isTyping && (
          <div className="mt-3 space-y-2">
            <div>
              <label className="text-emerald-300/80 text-xs block mb-1">ニックネーム</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="例：たろう"
                className="w-full border-2 border-kizuna-light rounded-lg px-3 py-2 text-[15px] bg-white/95 text-gray-800 outline-none focus:ring-2 focus:ring-kizuna-light"
              />
            </div>
            <div>
              <label className="text-emerald-300/80 text-xs block mb-1">電話番号 または LINE ID</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="例：090-xxxx-xxxx / line_id"
                className="w-full border-2 border-kizuna-light rounded-lg px-3 py-2 text-[15px] bg-white/95 text-gray-800 outline-none focus:ring-2 focus:ring-kizuna-light"
              />
            </div>
            <button
              onClick={submitContact}
              disabled={!nickname.trim() || !contact.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-kizuna-green to-emerald-500 text-white font-bold shadow-lg disabled:opacity-40"
            >
              送信する
            </button>
          </div>
        )}

        {/* ===== 完了画面 ===== */}
        {screen === "complete" && !isTyping && (
          <div className="mt-3 space-y-2">
            <div className="bg-white/10 border border-kizuna-light rounded-lg p-3 text-emerald-200 text-xs leading-relaxed">
              <p className="text-kizuna-light font-bold text-sm mb-2">-- AI要約レポート（デモ） --</p>
              <p><strong>応募者:</strong> {nickname}</p>
              <p><strong>連絡先:</strong> {contact}</p>
              <br />
              <p><strong>【価値観・特徴】</strong></p>
              <p>人の役に立つことにやりがいを感じるタイプ。チームワークを重視し、周囲への配慮ができる方。</p>
              <br />
              <p><strong>【働き方の希望】</strong></p>
              <p>安定した環境で長く働きたい意向。利用者との関わりを大切にしたいという想い。</p>
              <br />
              <p><strong>【総合コメント】</strong></p>
              <p>価値観が法人理念と合致しており、長く関われる可能性あり。二次面接を推奨。</p>
            </div>
            <button
              onClick={() => location.reload()}
              className="w-full py-3 rounded-xl bg-white/15 text-emerald-200 font-bold border border-kizuna-light"
            >
              もう一度体験する
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
