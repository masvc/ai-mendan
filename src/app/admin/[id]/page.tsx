"use client";

import { useState, useEffect, use } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Toaster, toast } from "sonner";
import { ChevronLeft, Phone, Calendar, FileText, MessageSquare, Volume2 } from "lucide-react";
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
      const idx = stored.findIndex(s => s.id === rec.id);
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
      <div className="min-h-dvh bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400">記録が見つかりません</p>
      </div>
    );
  }

  const dateStr = format(new Date(rec.date), "yyyy/M/d（E） HH:mm", { locale: ja });

  return (
    <div className="min-h-dvh bg-slate-50">
      <Toaster position="top-center" />

      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-5 py-4">
        <a href="/admin" className="flex items-center gap-1 text-slate-400 text-sm mb-3">
          <ChevronLeft size={16} />
          一覧に戻る
        </a>
        <h1 className="text-2xl font-black text-slate-800">{rec.nickname}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
          <span className="flex items-center gap-1"><Phone size={14} />{rec.contact}</span>
          <span className="flex items-center gap-1"><Calendar size={14} />{dateStr}</span>
        </div>
      </header>

      <main className="px-5 py-6 space-y-6">
        {/* AIレポート */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
            <FileText size={18} className="text-[#4a9e8e]" />
            <h2 className="text-lg font-bold text-slate-800">AIレポート</h2>
          </div>
          <div className="px-6 py-5">
            {rec.report ? (
              <div className="prose prose-sm prose-slate max-w-none">
                <ReactMarkdown>{rec.report}</ReactMarkdown>
              </div>
            ) : (
              <button
                onClick={generateReport}
                disabled={generating}
                className="w-full py-4 rounded-xl text-base font-bold bg-[#1e293b] text-white disabled:opacity-50 active:translate-y-[1px] transition-all"
              >
                {generating ? "レポート生成中..." : "AIレポートを生成"}
              </button>
            )}
          </div>
        </section>

        {/* 回答内容 */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-[#4a9e8e]" />
              <h2 className="text-lg font-bold text-slate-800">回答内容</h2>
            </div>
            <span className="flex items-center gap-1 text-xs text-slate-300">
              <Volume2 size={14} />本番では音声再生可
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {rec.answers.map((a, i) => (
              <div key={i} className="px-6 py-5">
                <h3 className="text-[#4a9e8e] text-xs font-bold mb-2">Q{i + 1}. {a.question}</h3>
                <p className="text-base text-slate-800 leading-relaxed">{a.answer || <span className="text-slate-300">（未回答）</span>}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
