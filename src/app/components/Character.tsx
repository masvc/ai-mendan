"use client";

type CharacterProps = {
  expression?: "normal" | "smile" | "happy" | "talking";
};

// 安心の絆のケアワーカー「翔平」
// コンセプト: 安心して話せる伴走者、兄貴キャラ
// デザイン: やさしい丸み、ニコニコ、温かさ
const UNIFORM = "#4a9e8e";
const UNIFORM_DARK = "#3d8577";
const SKIN = "#F5C6A0";
const SKIN_SHADOW = "#E8B892";
const HAIR = "#2C2C2C";
const HAIR_LIGHT = "#3A3A3A";
const CHEEK = "#FF9A8B";

export default function Character({ expression = "normal" }: CharacterProps) {
  const isTalking = expression === "talking";
  const isHappy = expression === "happy";

  return (
    <svg width="770" height="1254" viewBox="0 15 320 520" className="drop-shadow-2xl">
      <defs>
        <style>{`
          @keyframes mouth-open {
            0%, 100% { d: path("M135,185 Q160,202 185,185"); }
            30% { d: path("M135,185 Q160,212 185,185"); }
            60% { d: path("M135,185 Q160,198 185,185"); }
          }
          .mouth-talk {
            animation: mouth-open 0.4s ease-in-out infinite;
          }
          @keyframes gentle-bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          .gentle-bob {
            animation: gentle-bob 3s ease-in-out infinite;
          }
        `}</style>
        {/* 柔らかい影 */}
        <filter id="soft-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00000015" />
        </filter>
      </defs>

      <g className="gentle-bob">
        {/* === 体 - ポロシャツ風ケアワーカー服 === */}
        {/* メインボディ（恰幅よく） */}
        <path d="M92,280 Q74,265 64,285 L42,460 Q42,500 160,500 Q278,500 278,460 L256,285 Q246,265 228,280 Z" fill={UNIFORM} />
        {/* 襟（丸襟ポロシャツ風 - より丸く） */}
        <path d="M122,272 Q128,258 142,268 Q152,276 160,280 Q168,276 178,268 Q192,258 198,272" fill={UNIFORM_DARK} stroke={UNIFORM_DARK} strokeWidth="1" />
        <path d="M126,272 Q138,260 150,272 Q156,280 160,282 Q164,280 170,272 Q182,260 194,272" fill="white" opacity="0.92" />
        {/* ボタン */}
        <circle cx="160" cy="298" r="3.5" fill={UNIFORM_DARK} opacity="0.5" />
        <circle cx="160" cy="320" r="3.5" fill={UNIFORM_DARK} opacity="0.5" />
        {/* 胸ポケット */}
        <rect x="183" y="312" width="34" height="26" rx="6" fill={UNIFORM_DARK} opacity="0.3" />
        {/* ネームタグ（暖かい色 - より丸く大きく） */}
        <g filter="url(#soft-shadow)">
          <rect x="102" y="326" width="52" height="32" rx="8" fill="white" opacity="0.97" />
          <rect x="102" y="326" width="52" height="9" rx="8" fill="#f0a875" opacity="0.7" />
          <text x="128" y="352" textAnchor="middle" fill="#3d5a50" fontSize="11" fontWeight="bold">翔平</text>
        </g>
        {/* 安心の絆マーク（ハート - 少し大きく） */}
        <path d="M198,316 Q198,310 203,310 Q208,310 208,316 Q208,322 203,326 Q198,322 198,316 Z" fill="white" opacity="0.6" />

        {/* 肩（がっしり） */}
        <ellipse cx="80" cy="305" rx="30" ry="28" fill={UNIFORM} />
        <ellipse cx="240" cy="305" rx="30" ry="28" fill={UNIFORM} />
        {/* 袖（半袖ポロシャツ - 太め） */}
        <rect x="38" y="292" width="42" height="78" rx="21" fill={UNIFORM} />
        <rect x="240" y="292" width="42" height="78" rx="21" fill={UNIFORM} />
        {/* 袖口のライン */}
        <rect x="38" y="355" width="42" height="5" rx="2" fill={UNIFORM_DARK} opacity="0.25" />
        <rect x="240" y="355" width="42" height="5" rx="2" fill={UNIFORM_DARK} opacity="0.25" />

        {/* 腕（肌色） */}
        <rect x="42" y="356" width="34" height="44" rx="17" fill={SKIN} />
        <rect x="244" y="356" width="34" height="44" rx="17" fill={SKIN} />

        {/* 手（より丸く） */}
        {isHappy ? (
          <>
            <circle cx="56" cy="392" r="22" fill={SKIN} />
            <g transform="translate(250, 366) rotate(-12)">
              <circle cx="12" cy="0" r="22" fill={SKIN} />
            </g>
          </>
        ) : (
          <>
            <circle cx="59" cy="402" r="22" fill={SKIN} />
            <circle cx="261" cy="402" r="22" fill={SKIN} />
          </>
        )}

        {/* 首 */}
        <rect x="133" y="240" width="54" height="40" rx="12" fill={SKIN} />

        {/* 頭（より丸く） */}
        <g transform="translate(0, 10)">
        <ellipse cx="160" cy="152" rx="78" ry="88" fill={SKIN_SHADOW} />
        <ellipse cx="160" cy="149" rx="76" ry="86" fill={SKIN} />

        {/* 髪 */}
        <ellipse cx="160" cy="86" rx="82" ry="54" fill={HAIR} />
        <ellipse cx="160" cy="78" rx="74" ry="44" fill={HAIR_LIGHT} />
        <rect x="80" y="80" width="24" height="62" rx="12" fill={HAIR} />
        <rect x="216" y="80" width="24" height="62" rx="12" fill={HAIR} />
        <path d="M93,103 Q113,68 135,98 Q148,64 168,92 Q182,66 198,98 Q210,71 230,106" fill={HAIR} />
        <path d="M123,76 Q138,64 153,74" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.35" />

        {/* 耳 */}
        <ellipse cx="86" cy="155" rx="13" ry="19" fill={SKIN} />
        <ellipse cx="86" cy="155" rx="7" ry="12" fill={SKIN_SHADOW} />
        <ellipse cx="234" cy="155" rx="13" ry="19" fill={SKIN} />
        <ellipse cx="234" cy="155" rx="7" ry="12" fill={SKIN_SHADOW} />

        {/* 眉（やさしく下がった形 - 穏やかさ） */}
        <path d="M116,126 Q132,118 148,124" stroke={HAIR} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M172,124 Q188,118 204,126" stroke={HAIR} strokeWidth="3.5" fill="none" strokeLinecap="round" />

        {/* 目 */}
        {isHappy ? (
          <>
            {/* にっこり目（閉じ目） */}
            <path d="M116,145 Q133,132 150,145" stroke={HAIR} strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M170,145 Q187,132 204,145" stroke={HAIR} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* 通常目（大きめ・温かみ） */}
            <ellipse cx="133" cy="147" rx="17" ry="19" fill="#fff" />
            <ellipse cx="187" cy="147" rx="17" ry="19" fill="#fff" />
            <ellipse cx="133" cy="149" rx="12" ry="14" fill="#3E2723" />
            <ellipse cx="187" cy="149" rx="12" ry="14" fill="#3E2723" />
            <ellipse cx="133" cy="150" rx="7" ry="8" fill="#1A1A1A" />
            <ellipse cx="187" cy="150" rx="7" ry="8" fill="#1A1A1A" />
            {/* ハイライト（大きめで柔らかい印象） */}
            <circle cx="127" cy="143" r="5" fill="#fff" />
            <circle cx="181" cy="143" r="5" fill="#fff" />
            <circle cx="137" cy="153" r="2.5" fill="#fff" opacity="0.5" />
            <circle cx="191" cy="153" r="2.5" fill="#fff" opacity="0.5" />
            {/* まつ毛ライン（柔らかい） */}
            <path d="M116,137 Q133,126 150,137" stroke={HAIR} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M170,137 Q187,126 204,137" stroke={HAIR} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* 鼻（小さめで丸い） */}
        <path d="M156,166 Q160,175 164,166" stroke="#D4A07A" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* チーク（常時ほんのり - 温かさ・安心感の象徴） */}
        <ellipse cx="110" cy="173" rx="16" ry="10" fill={CHEEK} opacity="0.18" />
        <ellipse cx="210" cy="173" rx="16" ry="10" fill={CHEEK} opacity="0.18" />

        {/* 口 - 全expression共通でニコニコ基調 */}
        {isHappy ? (
          <>
            {/* 大きなニコニコ笑顔 */}
            <path d="M130,185 Q160,215 190,185" stroke={HAIR} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M134,186 Q160,212 186,186" fill="#E57373" opacity="0.35" />
            {/* チーク強め */}
            <ellipse cx="110" cy="173" rx="18" ry="11" fill={CHEEK} opacity="0.35" />
            <ellipse cx="210" cy="173" rx="18" ry="11" fill={CHEEK} opacity="0.35" />
          </>
        ) : isTalking ? (
          <>
            {/* 話し中（口パク + 微笑み基調） */}
            <path className="mouth-talk" d="M135,185 Q160,202 185,185" stroke={HAIR} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <ellipse cx="110" cy="173" rx="15" ry="10" fill={CHEEK} opacity="0.28" />
            <ellipse cx="210" cy="173" rx="15" ry="10" fill={CHEEK} opacity="0.28" />
          </>
        ) : (
          <>
            {/* normal / smile = 穏やかなニコニコ（旧normalを笑顔に） */}
            <path d="M138,185 Q160,202 182,185" stroke={HAIR} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <ellipse cx="110" cy="173" rx="14" ry="9" fill={CHEEK} opacity="0.22" />
            <ellipse cx="210" cy="173" rx="14" ry="9" fill={CHEEK} opacity="0.22" />
          </>
        )}
        </g>
      </g>
    </svg>
  );
}
