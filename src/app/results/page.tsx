"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";

type Record = {
  date: string;
  nickname: string;
  contact: string;
  answers: { question: string; answer: string }[];
};

export default function ResultsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ai-mendan-history") || "[]") as Record[];
    setRecords(stored.slice().reverse());
  }, []);

  return (
    <div className="mx-auto h-dvh w-full max-w-[430px] max-h-[932px] bg-white flex flex-col">
      <div className="border-b border-slate-200 px-5 py-4 shrink-0">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold text-slate-800">提出済みの回答</h1>
          <a href="/" className="text-xs text-slate-400">トップへ</a>
        </div>
        <p className="text-xs text-slate-400 mt-1">{records.length}件</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {records.length > 0 ? (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="px-4 py-3 text-sm font-bold text-slate-400">名前</th>
                  <th className="px-3 py-3 text-sm font-bold text-slate-400">連絡先</th>
                  <th className="px-3 py-3 text-sm font-bold text-slate-400">日時</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, ri) => (
                  <tr
                    key={ri}
                    onClick={() => setExpanded(expanded === ri ? null : ri)}
                    className={clsx("border-b border-slate-100 cursor-pointer active:bg-slate-50", expanded === ri && "bg-slate-50")}
                  >
                    <td className="px-4 py-3">
                      <p className="text-slate-800 font-bold text-sm">{record.nickname}</p>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-500">{record.contact}</td>
                    <td className="px-3 py-3 text-sm text-slate-500 whitespace-nowrap">
                      {new Date(record.date).toLocaleDateString("ja-JP")}<br />
                      {new Date(record.date).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {expanded !== null && records[expanded] && (
              <div className="px-5 py-5 border-t border-slate-200">
                <h2 className="text-base font-bold text-slate-800 mb-4">回答内容</h2>
                <div className="space-y-4">
                  {records[expanded].answers.map((a, i) => (
                    <div key={i}>
                      <p className="text-[#4a9e8e] text-xs font-bold mb-1">Q{i + 1}. {a.question}</p>
                      <p className="text-slate-800 text-sm leading-relaxed">{a.answer || <span className="text-slate-300">（未回答）</span>}</p>
                    </div>
                  ))}
                </div>
                <p className="text-slate-300 text-xs text-center mt-5">※内容はスタッフが確認し、2日以内にご連絡します</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400">まだ提出記録がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
