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
          content: `あなたは介護・福祉業界の採用担当アドバイザーです。
以下はAI面接での応募者の回答です。この回答をもとに「応募者カルテ」を作成してください。

応募者: ${nickname}

${answersText}

以下の項目を簡潔にまとめてください（各項目2〜3文程度）:

【価値観・特徴】
応募者の人柄や大切にしていること

【働き方の希望】
どんな働き方を望んでいるか

【強み】
面接から読み取れる強み

【配属候補】
向いていそうな部署や役割（訪問看護・訪問介護・障害福祉・就労支援など）

【面接官へのメモ】
二次面接で確認すべき点や注意点

【総合コメント】
採用可否の推奨と理由（1〜2文）`,
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
