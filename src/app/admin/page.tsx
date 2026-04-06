"use client";

import { useState, useEffect } from "react";

type Record = {
  id: string;
  date: string;
  nickname: string;
  contact: string;
  answers: { question: string; answer: string }[];
  report?: string;
};

const SAMPLE: Record = {
  id: "sample-001",
  date: "2026-04-06T10:30:00.000Z",
  nickname: "たろう",
  contact: "090-1234-5678",
  answers: [
    { question: "役に立てた経験", answer: "近所のおばあちゃんの買い物を手伝った" },
    { question: "仕事で大切なこと", answer: "思いやり、チームワーク、笑顔" },
    { question: "嬉しい/しんどい経験", answer: "利用者さんに名前を覚えてもらえた" },
    { question: "心がけていること", answer: "相手のペースに合わせること" },
    { question: "興味を持った理由", answer: "どんな人でも受け入れる理念に共感" },
    { question: "チームワーク", answer: "報連相を大事にしている" },
    { question: "成長の瞬間", answer: "初めて一人で訪問できた時" },
    { question: "希望の働き方", answer: "日勤メインで利用者とじっくり向き合いたい" },
  ],
  report: "【価値観・特徴】\n思いやりがあり、人の役に立つことに喜びを感じるタイプ。\n\n【強み】\nコミュニケーション力が高く、チームワークを重視。\n\n【配属候補】\n訪問介護（日勤帯）\n\n【総合コメント】\n二次面接を推奨。理念への共感度が高く、定着が期待できる。",
};

function getStatus(report?: string): { label: string; color: string } {
  if (!report) return { label: "未判定", color: "text-slate-400 bg-slate-100" };
  if (report.includes("推奨")) return { label: "推奨", color: "text-green-700 bg-green-50" };
  if (report.includes("見送")) return { label: "見送り", color: "text-red-600 bg-red-50" };
  return { label: "判定済", color: "text-blue-600 bg-blue-50" };
}

export default function AdminPage() {
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ai-mendan-history") || "[]") as Record[];
    const withIds = stored.map((r, i) => ({ ...r, id: r.id || `rec-${i}-${Date.now()}` }));
    setRecords(withIds.length > 0 ? withIds.reverse() : [SAMPLE]);
  }, []);

  return (
    <div className="min-h-dvh bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold text-slate-800">応募者管理</h1>
          <a href="/" className="text-xs text-slate-400">トップへ</a>
        </div>
        <p className="text-xs text-slate-400 mt-1">{records.length}件</p>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            <th className="px-4 py-3 text-xs font-bold text-slate-400">名前</th>
            <th className="px-3 py-3 text-xs font-bold text-slate-400">日時</th>
            <th className="px-3 py-3 text-xs font-bold text-slate-400">判定</th>
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec, i) => {
            const status = getStatus(rec.report);
            return (
              <tr
                key={i}
                onClick={() => { sessionStorage.setItem(`admin-rec-${rec.id}`, JSON.stringify(rec)); location.href = `/admin/${rec.id}`; }}
                className="border-b border-slate-100 cursor-pointer active:bg-slate-50 hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <p className="text-slate-800 font-bold text-sm">{rec.nickname}</p>
                  <p className="text-slate-400 text-[11px]">{rec.contact}</p>
                </td>
                <td className="px-3 py-3 text-xs text-slate-500 whitespace-nowrap">
                  {new Date(rec.date).toLocaleDateString("ja-JP")}<br />
                  {new Date(rec.date).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="px-3 py-3">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${status.color}`}>{status.label}</span>
                </td>
                <td className="pr-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-slate-300"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
