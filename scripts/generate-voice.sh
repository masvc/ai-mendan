#!/bin/bash
# VOICEVOX 音声生成（青山龍星: speaker=13, 剣崎雌雄: speaker=21）
API="http://localhost:50021"
BASE_DIR="$(dirname "$0")/../public/audio"

generate() {
  local speaker="$1"
  local out_dir="$2"
  local name="$3"
  local text="$4"
  mkdir -p "$out_dir"
  echo "[$out_dir] $name: $text"
  local encoded
  encoded=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$text")
  curl -s -X POST "$API/audio_query?text=$encoded&speaker=$speaker" -o /tmp/vv_query.json
  curl -s -X POST "$API/synthesis?speaker=$speaker" -H "Content-Type: application/json" -d @/tmp/vv_query.json -o "$out_dir/$name.wav"
}

generate_both() {
  local name="$1"
  local text="$2"
  generate 13 "$BASE_DIR/aoyama" "$name" "$text"
  generate 21 "$BASE_DIR/kenzaki" "$name" "$text"
}

# あいさつ（2分割）
generate_both "greeting1" "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。"
generate_both "greeting2" "うまく話そうとしなくて大丈夫。落ち着いてゆっくり話してね。"

# 質問 1-8
generate_both "q1" "最近、誰かの役に立てたと感じたことってある？小さなことでも大丈夫だよ。"
generate_both "q2" "仕事で大切にしていることを3つ挙げるとしたら何かな？"
generate_both "q3" "これまでの職場で嬉しかったことと、しんどかったこと、教えてくれる？"
generate_both "q4" "人と関わる仕事で、心がけていることってある？"
generate_both "q5" "安心の絆で働くことに興味を持ってくれた理由を教えてくれる？"
generate_both "q6" "チームで働くとき、意識していることは？"
generate_both "q7" "これまでの経験の中で、成長できたと感じた瞬間ってある？"
generate_both "q8" "安心の絆で、どんな働き方をしてみたい？希望があれば聞かせて。"

# リアクション 1-8
generate_both "r1" "そうなんだ、素敵だね。話してくれてありがとう。"
generate_both "r2" "なるほどね、いい考え方だと思うよ。"
generate_both "r3" "話してくれてありがとう。無理しなくていいからね。"
generate_both "r4" "うん、それすごく大事なことだよね。"
generate_both "r5" "ありがとう。そう思ってくれて嬉しいよ。"
generate_both "r6" "チームワーク大事にしてるんだね。いいね。"
generate_both "r7" "いい経験をしてきたんだね。あなたのペースでいいからね。"
generate_both "r8" "ありがとう！全部聞けてよかった。"

# 確認・完了
generate_both "confirm" "全部の質問が終わったよ！回答内容を確認して、よければ提出してね。"
generate_both "complete" "今日はお話を聞かせてくれて、ありがとう！あなたの想いは、スタッフがきちんと目を通すよ。2日以内に連絡するから、少しだけ待っててね。不安なことがあれば、いつでも気軽に聞いてね。"

echo ""
echo "Done!"
