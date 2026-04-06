# AI面談

スマホで完結するAI面接デモアプリ。

## 概要

- 履歴書なし・匿名で受けられるAI面談
- AI面接官「翔平」が8つの質問を音声で読み上げ
- 音声またはテキストで回答
- 回答確認 → 連絡先入力 → 提出

## 技術スタック

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Web Speech API（読み上げ・音声認識）
- Vercel（デプロイ）

## 開発

```bash
npm install
npm run dev
```

## デプロイ

Vercelに自動デプロイ（mainブランチへのpush時）

Basic認証: `src/middleware.ts`
