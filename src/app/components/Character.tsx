"use client";

type CharacterProps = {
  expression?: "normal" | "smile" | "happy" | "talking";
};

// 安心の絆のケアワーカー「翔平」
// やさしい丸みのあるデザイン、安心感・肯定を表現
const UNIFORM = "#4a9e8e"; // ティールグリーン（介護・福祉で親しみやすい色）
const UNIFORM_DARK = "#3d8577";
const SKIN = "#F5C6A0";
const SKIN_SHADOW = "#E8B892";
const HAIR = "#2C2C2C";
const HAIR_LIGHT = "#3A3A3A";

export default function Character({ expression = "normal" }: CharacterProps) {
  const isTalking = expression === "talking";
  const isHappy = expression === "happy";

  return (
    <svg width="700" height="1140" viewBox="0 0 320 520" className="drop-shadow-2xl">
      <defs>
        <style>{`
          @keyframes mouth-open {
            0%, 100% { d: path("M140,183 Q160,194 180,183"); }
            30% { d: path("M140,183 Q160,200 180,183"); }
            60% { d: path("M140,185 Q160,192 180,185"); }
          }
          .mouth-talk {
            animation: mouth-open 0.35s ease-in-out infinite;
          }
        `}</style>
      </defs>

      {/* === 体 - ポロシャツ風ケアワーカー服 === */}
      {/* メインボディ */}
      <path d="M92,280 Q84,268 76,282 L56,460 Q56,490 160,490 Q264,490 264,460 L244,282 Q236,268 228,280 Z" fill={UNIFORM} />
      {/* 襟（丸襟ポロシャツ風） */}
      <path d="M125,270 Q130,260 140,268 Q150,275 160,278 Q170,275 180,268 Q190,260 195,270" fill={UNIFORM_DARK} stroke={UNIFORM_DARK} strokeWidth="1" />
      <path d="M128,270 Q140,262 148,272 Q155,278 160,280 Q165,278 172,272 Q180,262 192,270" fill="white" opacity="0.9" />
      {/* ボタン */}
      <circle cx="160" cy="295" r="3" fill={UNIFORM_DARK} opacity="0.6" />
      <circle cx="160" cy="315" r="3" fill={UNIFORM_DARK} opacity="0.6" />
      {/* 胸ポケット */}
      <rect x="185" y="310" width="32" height="24" rx="4" fill={UNIFORM_DARK} opacity="0.4" />
      {/* ネームタグ（暖かい色） */}
      <g>
        <rect x="105" y="328" width="48" height="28" rx="5" fill="white" opacity="0.95" />
        <rect x="105" y="328" width="48" height="8" rx="5" fill="#e8a87c" opacity="0.8" />
        <text x="129" y="350" textAnchor="middle" fill="#3d5a50" fontSize="10" fontWeight="bold">翔平</text>
      </g>
      {/* 安心の絆ロゴマーク（小さなハート） */}
      <path d="M200,318 Q200,313 204,313 Q208,313 208,318 Q208,323 204,326 Q200,323 200,318 Z" fill="white" opacity="0.7" />

      {/* 肩（丸く柔らかく） */}
      <ellipse cx="90" cy="286" rx="26" ry="28" fill={UNIFORM} />
      <ellipse cx="230" cy="286" rx="26" ry="28" fill={UNIFORM} />
      {/* 袖（半袖ポロシャツ） */}
      <rect x="52" y="290" width="36" height="80" rx="18" fill={UNIFORM} />
      <rect x="232" y="290" width="36" height="80" rx="18" fill={UNIFORM} />
      {/* 袖口のライン */}
      <rect x="52" y="355" width="36" height="5" rx="2" fill={UNIFORM_DARK} opacity="0.3" />
      <rect x="232" y="355" width="36" height="5" rx="2" fill={UNIFORM_DARK} opacity="0.3" />

      {/* 腕（肌色） */}
      <rect x="56" y="358" width="30" height="40" rx="14" fill={SKIN} />
      <rect x="234" y="358" width="30" height="40" rx="14" fill={SKIN} />

      {/* 手 */}
      {isHappy ? (
        <>
          <circle cx="67" cy="392" r="18" fill={SKIN} />
          <g transform="translate(240, 368) rotate(-15)">
            <circle cx="12" cy="0" r="18" fill={SKIN} />
          </g>
        </>
      ) : (
        <>
          <circle cx="71" cy="400" r="18" fill={SKIN} />
          <circle cx="249" cy="400" r="18" fill={SKIN} />
        </>
      )}

      {/* 首 */}
      <rect x="135" y="232" width="50" height="48" rx="10" fill={SKIN} />

      {/* 頭 */}
      <ellipse cx="160" cy="155" rx="76" ry="85" fill={SKIN_SHADOW} />
      <ellipse cx="160" cy="152" rx="74" ry="83" fill={SKIN} />

      {/* 髪 */}
      <ellipse cx="160" cy="90" rx="80" ry="52" fill={HAIR} />
      <ellipse cx="160" cy="82" rx="72" ry="42" fill={HAIR_LIGHT} />
      <rect x="82" y="82" width="22" height="60" rx="11" fill={HAIR} />
      <rect x="216" y="82" width="22" height="60" rx="11" fill={HAIR} />
      <path d="M95,105 Q115,72 135,100 Q148,68 168,95 Q182,70 198,100 Q210,75 228,108" fill={HAIR} />
      <path d="M125,78 Q138,66 152,76" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />

      {/* 耳 */}
      <ellipse cx="88" cy="158" rx="12" ry="18" fill={SKIN} />
      <ellipse cx="88" cy="158" rx="7" ry="11" fill={SKIN_SHADOW} />
      <ellipse cx="232" cy="158" rx="12" ry="18" fill={SKIN} />
      <ellipse cx="232" cy="158" rx="7" ry="11" fill={SKIN_SHADOW} />

      {/* 眉 */}
      <path d="M118,128 Q133,120 148,126" stroke={HAIR} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M172,126 Q187,120 202,128" stroke={HAIR} strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* 目 */}
      {isHappy ? (
        <>
          <path d="M118,145 Q133,134 148,145" stroke={HAIR} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M172,145 Q187,134 202,145" stroke={HAIR} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="133" cy="147" rx="16" ry="18" fill="#fff" />
          <ellipse cx="187" cy="147" rx="16" ry="18" fill="#fff" />
          <ellipse cx="133" cy="149" rx="11" ry="13" fill="#3E2723" />
          <ellipse cx="187" cy="149" rx="11" ry="13" fill="#3E2723" />
          <ellipse cx="133" cy="150" rx="6" ry="7" fill="#1A1A1A" />
          <ellipse cx="187" cy="150" rx="6" ry="7" fill="#1A1A1A" />
          <circle cx="128" cy="143" r="4" fill="#fff" />
          <circle cx="182" cy="143" r="4" fill="#fff" />
          <circle cx="137" cy="152" r="2" fill="#fff" opacity="0.6" />
          <circle cx="191" cy="152" r="2" fill="#fff" opacity="0.6" />
          <path d="M117,138 Q133,128 149,138" stroke={HAIR} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M171,138 Q187,128 203,138" stroke={HAIR} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* 鼻 */}
      <path d="M157,165 Q160,174 163,165" stroke="#D4A07A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* チーク（常時うっすら表示 → 安心感） */}
      <ellipse cx="112" cy="172" rx="14" ry="9" fill="#FF8A80" opacity="0.15" />
      <ellipse cx="208" cy="172" rx="14" ry="9" fill="#FF8A80" opacity="0.15" />

      {/* 口 */}
      {isHappy ? (
        <>
          <path d="M135,185 Q160,208 185,185" stroke={HAIR} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M138,186 Q160,204 182,186" fill="#E57373" opacity="0.4" />
          <ellipse cx="112" cy="172" rx="16" ry="10" fill="#FF8A80" opacity="0.3" />
          <ellipse cx="208" cy="172" rx="16" ry="10" fill="#FF8A80" opacity="0.3" />
        </>
      ) : isTalking ? (
        <>
          <path className="mouth-talk" d="M140,183 Q160,194 180,183" stroke={HAIR} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="112" cy="172" rx="13" ry="8" fill="#FF8A80" opacity="0.25" />
          <ellipse cx="208" cy="172" rx="13" ry="8" fill="#FF8A80" opacity="0.25" />
        </>
      ) : expression === "smile" ? (
        <>
          <path d="M140,183 Q160,198 180,183" stroke={HAIR} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="112" cy="172" rx="13" ry="8" fill="#FF8A80" opacity="0.25" />
          <ellipse cx="208" cy="172" rx="13" ry="8" fill="#FF8A80" opacity="0.25" />
        </>
      ) : (
        <path d="M142,183 Q160,194 178,183" stroke={HAIR} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}
