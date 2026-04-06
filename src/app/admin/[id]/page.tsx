"use client";

import { useState, useEffect, use } from "react";

type Record = {
  id: string;
  date: string;
  nickname: string;
  contact: string;
  answers: { question: string; answer: string }[];
  report?: string;
};

export default function AdminDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [rec, setRec] = useState<Record | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // sessionStorageから取得（一覧からの遷移）
    const cached = sessionStorage.getItem(`admin-rec-${id}`);
    if (cached) { setRec(JSON.parse(cached)); return; }
    // fallback: localStorageから検索
    const stored = JSON.parse(localStorage.getItem("ai-mendan-history") || "[]") as Record[];
    const found = stored.find(r => r.id === id);
    if (found) setRec(found);
  }, [id]);

  const generateReport = async () => {
    if (!rec || rec.report) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: rec.nickname, contact: rec.contact, answers: rec.answers }),
      });
      const data = await res.json();
      const updated = { ...rec, report: data.report };
      setRec(updated);
      // localStorageも更新
      const stored = JSON.parse(localStorage.getItem("ai-mendan-history") || "[]") as Record[];
      const idx = stored.findIndex(s => s.date === rec.date);
      if (idx >= 0) { stored[idx].report = data.report; localStorage.setItem("ai-mendan-history", JSON.stringify(stored)); }
    } catch { /* ignore */ }
    setGenerating(false);
  };

  if (!rec) {
    return (
      <div className="mx-auto max-w-[600px] min-h-dvh bg-white flex items-center justify-center">
        <p className="text-slate-400">記録が見つかりません</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50">
      {/* ヘッダー */}
      <div className="bg-white sticky top-0 z-10 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <div>
          <p className="text-slate-800 font-bold text-lg">{rec.nickname}</p>
          <p className="text-slate-400 text-xs">{rec.contact} / {new Date(rec.date).toLocaleDateString("ja-JP")}</p>
        </div>
        <a href="/admin" className="text-sm text-slate-400 border border-slate-200 rounded-lg px-3 py-1.5">一覧へ</a>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* AIレポート（上） */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-slate-800 font-bold">AIレポート</p>
          </div>
          <div className="px-5 py-4">
            {rec.report ? (
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {rec.report}
              </div>
            ) : (
              <button
                onClick={generateReport}
                disabled={generating}
                className="w-full py-3 rounded-xl text-sm font-bold bg-[#1e293b] text-white disabled:opacity-50 active:translate-y-[1px] transition-all shadow-[0_2px_0_#0f172a] active:shadow-none"
              >
                {generating ? "レポート生成中..." : "AIレポートを生成"}
              </button>
            )}
          </div>
        </div>

        {/* 回答内容（下） */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <p className="text-slate-800 font-bold">回答内容</p>
            <p className="text-slate-300 text-xs">※本番では音声も確認できます</p>
          </div>
          <div className="px-4 py-4 space-y-3">
            {rec.answers.map((a, i) => (
              <div key={i} className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-slate-400 text-xs font-bold mb-1">Q{i + 1}. {a.question}</p>
                <p className="text-slate-700 text-sm leading-relaxed">{a.answer || "（未回答）"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
