import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { nickname, answers } = await req.json() as {
      nickname: string;
      answers: { question: string; answer: string }[];
    };

    const answersText = answers
      .map((a, i) => `Q${i + 1}. ${a.question}\n回答: ${a.answer}`)
      .join("\n\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `あなたは介護・福祉業界の一次面接を担当する厳格な採用アドバイザーです。
以下はAI面接での応募者の音声認識テキスト（全質問分が連続しています）です。
この回答をもとに「応募者カルテ」を作成してください。

重要な評価方針:
- これは一次面接の合否判断に使われます。やや厳しめに評価してください
- 回答が曖昧・具体性に欠ける場合はスコアを下げてください
- 介護・福祉の現場で求められる「思いやり」「忍耐力」「コミュニケーション力」を重視してください
- 音声認識のため多少の誤字脱字は無視してください

応募者: ${nickname}

${answersText}

以下の項目を簡潔にまとめてください（各項目2〜3文程度）:

【価値観・特徴】
応募者の人柄や大切にしていること

【働き方の希望】
どんな働き方を望んでいるか

【強み】
面接から読み取れる強み

【懸念点】
気になる点やリスク（なければ「特になし」）

【配属候補】
向いていそうな部署や役割（訪問看護・訪問介護・障害福祉・就労支援など）

【面接官へのメモ】
二次面接で確認すべき点や注意点

【総合コメント】
一次面接の合否推奨と理由（1〜2文）

【AIスコア】
1〜5の数字1つだけ記載（5が最高評価）
- 5: 即二次面接へ進めるべき
- 4: 二次面接推奨
- 3: 判断が難しい、要確認
- 2: 懸念あり、慎重に検討
- 1: 見送り推奨`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ report: text });
  } catch (e) {
    console.error("Report generation failed:", e);
    return NextResponse.json({ report: "レポート生成に失敗しました。" }, { status: 500 });
  }
}
