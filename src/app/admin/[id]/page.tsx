"use client";

import { useState, useEffect, use } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Toaster, toast } from "sonner";
import ReactMarkdown from "react-markdown";

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
    const cached = sessionStorage.getItem(`admin-rec-${id}`);
    if (cached) { setRec(JSON.parse(cached)); return; }
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
      const stored = JSON.parse(localStorage.getItem("ai-mendan-history") || "[]") as Record[];
      const idx = stored.findIndex(s => s.date === rec.date);
      if (idx >= 0) {
        stored[idx].report = data.report;
        localStorage.setItem("ai-mendan-history", JSON.stringify(stored));
      }
      toast.success("レポートを生成しました");
    } catch {
      toast.error("レポート生成に失敗しました");
    }
    setGenerating(false);
  };

  if (!rec) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <p className="text-slate-400">記録が見つかりません</p>
      </div>
    );
  }

  const dateStr = format(new Date(rec.date), "yyyy/M/d（E） HH:mm", { locale: ja });

  return (
    <div className="min-h-dvh bg-white">
      <Toaster position="top-center" />
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-5 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{rec.nickname}</h1>
            <p className="text-sm text-slate-400 mt-1">{rec.contact} / {dateStr}</p>
          </div>
          <a href="/admin" className="text-sm text-slate-400 shrink-0">一覧へ</a>
        </div>
      </header>

      <main className="px-5 py-6">
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">AIレポート</h2>
          {rec.report ? (
            <div className="prose prose-sm prose-slate max-w-none bg-slate-50 rounded-xl px-5 py-4">
              <ReactMarkdown>{rec.report}</ReactMarkdown>
            </div>
          ) : (
            <button
              onClick={generateReport}
              disabled={generating}
              className="w-full py-3 rounded-xl text-sm font-bold bg-[#1e293b] text-white disabled:opacity-50 active:translate-y-[1px] transition-all"
            >
              {generating ? "レポート生成中..." : "AIレポートを生成"}
            </button>
          )}
        </section>

        <hr className="border-slate-100 mb-8" />

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">回答内容</h2>
            <p className="text-xs text-slate-300">※本番では音声も確認できます</p>
          </div>
          <div className="space-y-5">
            {rec.answers.map((a, i) => (
              <div key={i}>
                <h3 className="text-xs font-bold text-slate-400 mb-1">Q{i + 1}. {a.question}</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{a.answer || "（未回答）"}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
