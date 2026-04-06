#!/bin/bash
# VOICEVOX 青山龍星(speaker=13)で音声生成
SPEAKER=13
OUT_DIR="$(dirname "$0")/../public/audio"
API="http://localhost:50021"

generate() {
  local name="$1"
  local text="$2"
  echo "Generating: $name"
  # audio_query
  curl -s -X POST "$API/audio_query?text=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$text'))")&speaker=$SPEAKER" -o /tmp/vv_query.json
  # synthesis -> wav
  curl -s -X POST "$API/synthesis?speaker=$SPEAKER" -H "Content-Type: application/json" -d @/tmp/vv_query.json -o "$OUT_DIR/$name.wav"
  echo "  -> $OUT_DIR/$name.wav"
}

# あいさつ
generate "greeting" "こんにちは、AIの翔平です。今日は応募というより、ちょっとしたお話の時間です。正解はありません。あなたに合いそうな働き方を、一緒に考えられたらうれしいな。"

# 質問 1-8
generate "q1" "最近、誰かの役に立てたと感じた出来事はある？なんでもいいよ、小さなことでも。"
generate "q2" "仕事で大切にしていることを3つ挙げるとしたら何かな？"
generate "q3" "これまでの職場で、嬉しかったことと、しんどかったことを教えてくれる？"
generate "q4" "人と関わる仕事で、心がけていることってある？"
generate "q5" "ここで働くことに興味を持った理由を教えてくれる？"
generate "q6" "チームで働くとき、意識していることは？"
generate "q7" "これまでの経験の中で、成長できたと感じた瞬間ってある？"
generate "q8" "どんな働き方をしてみたい？希望や理想があれば聞かせて。"

# リアクション 1-8
generate "r1" "そうなんだ、素敵だね。ありがとう。"
generate "r2" "なるほどね、いい考え方だと思うよ。"
generate "r3" "話してくれてありがとう。気持ちわかるよ。"
generate "r4" "うん、それは大事なことだよね。"
generate "r5" "ありがとう。そう思ってくれて嬉しいよ。"
generate "r6" "チームワーク大事にしてるんだね。"
generate "r7" "いい経験をしてきたんだね。"
generate "r8" "ありがとう！全部聞けてよかった。"

# 確認・連絡先・完了
generate "confirm" "全部の質問が終わったよ！回答内容を確認して、よければ提出してね。"
generate "contact" "ありがとう！最後に、連絡先を教えてもらえるかな？"
generate "complete" "今日はお話を聞かせてくれて、ありがとう！あなたの想いは、スタッフがきちんと目を通します。2日以内にご連絡しますので、少しだけお待ちください。"

echo ""
echo "Done! Generated $(ls $OUT_DIR/*.wav | wc -l) files."
