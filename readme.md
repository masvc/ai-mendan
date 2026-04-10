# AI面談 - スマホで5分のAI一次面接

AI面談デモシステム。履歴書不要・スマホ完結で、AIキャラクター「翔平」が8問の価値観ヒアリングを行う。

## こだわりポイント

### スマホでの音声認識を安定させる設計
SpeechRecognition APIはスマホで挙動が不安定（勝手に止まる、再startにユーザージェスチャーが必要、etc）。
これを解決するため、**認識インスタンスを1つ作って最後まで止めない方式**を採用。
質問の切り替えは表示だけで、認識・録音は一切触らない。
モバイルで勝手に止まっても`onend`で自動再起動し、`baseTextRef`で途中のテキストを保持する。

### 1本通しの録音
MediaRecorderも面接開始から終了まで1本通し。iOS Safariはwebm非対応なので`audio/mp4`に自動フォールバック。

### AIによる一次面接の合否判断
Claude APIで応募者カルテを自動生成。プロンプトは一次面接を想定し、やや厳しめに評価。
1〜5のスコア基準を明確に定義（5=即二次面接、1=見送り）。

### VOICEBOXキャラクター「翔平」
剣崎雌雄の音声で、挨拶・操作説明・お礼を読み上げ。質問中は音声なし（認識との干渉を避けるため）。

## 技術スタック

- **Next.js 16** (App Router / Turbopack)
- **React 19** + TypeScript
- **Tailwind CSS v4**
- **Anthropic Claude API** (AIレポート生成)
- **VOICEVOX** (音声合成: 剣崎雌雄)
- **zustand** (状態管理 + localStorage永続化)
- **motion** (アニメーション)
- **sonner** (トースト通知)
- **lucide-react** (アイコン)

## 画面構成

| 画面       | パス                   | 説明                             |
| ---------- | ---------------------- | -------------------------------- |
| トップ     | `/`                    | 面接をはじめる                   |
| 面談       | `/`（state: question） | キャラ + 質問テキスト + 通しマイク |
| 確認・提出 | `/`（state: confirm）  | 録音再生 + テキスト + 連絡先入力  |
| 完了       | `/`（state: complete） | お礼 → 5秒後にトップへ自動遷移   |
| 管理一覧   | `/admin`               | 応募者テーブル + AIスコア         |
| 管理詳細   | `/admin/[id]`          | AIレポート + 回答全文             |

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
