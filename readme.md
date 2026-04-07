# AI面談 - スマホで5分のAI一次面接

株式会社安心の絆向けのAI面談デモシステム。履歴書不要・スマホ完結で、AIキャラクター「翔平」が8問の価値観ヒアリングを行う。

## 技術スタック

- **Next.js 16** (App Router / Turbopack)
- **React 19** + TypeScript
- **Tailwind CSS v4** + @tailwindcss/typography
- **Anthropic Claude API** (AIレポート生成)
- **VOICEVOX** (音声合成: 剣崎雌雄)

### 主要ライブラリ

| ライブラリ      | 用途                                         |
| --------------- | -------------------------------------------- |
| zustand         | 状態管理 + localStorage永続化（途中セーブ）  |
| motion          | アニメーション（フェード、スライド、spring） |
| react-hook-form | フォームバリデーション                       |
| react-swipeable | スワイプジェスチャー                         |
| sonner          | トースト通知                                 |
| lucide-react    | アイコン                                     |
| date-fns        | 日付フォーマット                             |
| clsx            | 条件付きclassName                            |
| react-markdown  | Markdownレンダリング                         |

## 画面構成

| 画面       | パス                   | 説明                           |
| ---------- | ---------------------- | ------------------------------ |
| トップ     | `/`                    | 初めから / 続きから            |
| 面談       | `/`（state: question） | キャラ + 吹き出し + 通しマイク |
| 確認・提出 | `/`（state: confirm）  | 回答一覧 + 連絡先入力          |
| 完了       | `/`（state: complete） | お礼 → 5秒後にトップへ自動遷移 |
| 提出済み   | `/results`             | 自分の回答確認                 |
| 管理一覧   | `/admin`               | 応募者テーブル                 |
| 管理詳細   | `/admin/[id]`          | AIレポート + 回答内容          |

## 音声入力の仕組み

- 面接開始時にマイクを起動し、全8問が終わるまで通しで録音・認識
- 翔平の音声再生中は認識を自動で一時停止（スピーカー音の混入防止）
- 「次へ」で回答テキストを区切り、次の質問用にリセット
- テキスト入力のフォールバックあり（マイク不調時）

## セットアップ

```bash
npm install
cp .env.local.example .env.local  # ANTHROPIC_API_KEYを設定
npm run dev
```

### 音声生成（VOICEVOX起動が必要）

```bash
bash scripts/generate-voice.sh
```

## デプロイ

Vercel にpushで自動デプロイ。環境変数 `ANTHROPIC_API_KEY` をVercelに設定済み。
