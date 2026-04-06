"use client";

type CharacterProps = {
  expression?: "normal" | "smile" | "happy";
};

export default function Character({ expression = "normal" }: CharacterProps) {
  return (
    <svg width="260" height="400" viewBox="0 0 260 400" className="drop-shadow-xl">
      {/* === 体 - スクラブ（医療ユニフォーム）風 === */}
      {/* 胴体 */}
      <path d="M75,210 Q70,200 65,210 L55,340 Q55,355 130,355 Q205,355 205,340 L195,210 Q190,200 185,210 Z" fill="#4DB6AC" />
      {/* Vネック */}
      <path d="M105,205 L130,240 L155,205" fill="#00897B" />
      {/* 胸ポケット */}
      <rect x="155" y="245" width="28" height="22" rx="3" fill="#00897B" opacity="0.5" />
      <rect x="159" y="248" width="8" height="2" rx="1" fill="#fff" opacity="0.6" />
      {/* 名札 */}
      <rect x="90" y="248" width="35" height="20" rx="3" fill="#fff" opacity="0.85" />
      <text x="107" y="262" textAnchor="middle" fill="#00897B" fontSize="8" fontWeight="bold">翔平</text>

      {/* 肩・腕 */}
      <ellipse cx="62" cy="220" rx="22" ry="30" fill="#4DB6AC" />
      <ellipse cx="198" cy="220" rx="22" ry="30" fill="#4DB6AC" />
      {/* 腕 */}
      <rect x="35" y="225" width="30" height="85" rx="14" fill="#4DB6AC" />
      <rect x="195" y="225" width="30" height="85" rx="14" fill="#4DB6AC" />

      {/* 手 - やや上げてる（歓迎ポーズ） */}
      {expression === "happy" ? (
        <>
          <circle cx="42" cy="305" r="16" fill="#F5C6A0" />
          <g transform="translate(195, 280) rotate(-20)">
            <circle cx="15" cy="0" r="16" fill="#F5C6A0" />
          </g>
        </>
      ) : (
        <>
          <circle cx="50" cy="315" r="16" fill="#F5C6A0" />
          <circle cx="210" cy="315" r="16" fill="#F5C6A0" />
        </>
      )}

      {/* === 首 === */}
      <rect x="110" y="185" width="40" height="30" rx="8" fill="#F5C6A0" />

      {/* === 頭 === */}
      {/* 顔の影 */}
      <ellipse cx="130" cy="120" rx="62" ry="68" fill="#E8B892" />
      {/* 顔 */}
      <ellipse cx="130" cy="118" rx="60" ry="66" fill="#F5C6A0" />

      {/* === 髪 - ナチュラル短髪 === */}
      <ellipse cx="130" cy="72" rx="64" ry="40" fill="#2C2C2C" />
      <ellipse cx="130" cy="65" rx="58" ry="32" fill="#3A3A3A" />
      {/* サイドの髪 */}
      <rect x="68" y="65" width="18" height="45" rx="9" fill="#2C2C2C" />
      <rect x="174" y="65" width="18" height="45" rx="9" fill="#2C2C2C" />
      {/* 前髪 - 自然な流れ */}
      <path d="M80,80 Q95,60 110,78 Q120,55 140,75 Q155,58 165,78 Q175,62 185,82" fill="#2C2C2C" />
      {/* ハイライト */}
      <path d="M105,62 Q115,52 125,60" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* === 耳 === */}
      <ellipse cx="72" cy="120" rx="10" ry="14" fill="#F5C6A0" />
      <ellipse cx="72" cy="120" rx="6" ry="9" fill="#E8B892" />
      <ellipse cx="188" cy="120" rx="10" ry="14" fill="#F5C6A0" />
      <ellipse cx="188" cy="120" rx="6" ry="9" fill="#E8B892" />

      {/* === 眉 - しっかりめ === */}
      <path d="M96,98 Q107,92 118,96" stroke="#2C2C2C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M142,96 Q153,92 164,98" stroke="#2C2C2C" strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* === 目 === */}
      {expression === "happy" ? (
        <>
          {/* 閉じ目（嬉しい） */}
          <path d="M96,112 Q107,104 118,112" stroke="#2C2C2C" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M142,112 Q153,104 164,112" stroke="#2C2C2C" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* 白目 */}
          <ellipse cx="107" cy="112" rx="12" ry="14" fill="#fff" />
          <ellipse cx="153" cy="112" rx="12" ry="14" fill="#fff" />
          {/* 瞳 */}
          <ellipse cx="107" cy="113" rx="8" ry="10" fill="#3E2723" />
          <ellipse cx="153" cy="113" rx="8" ry="10" fill="#3E2723" />
          {/* 瞳の中心 */}
          <ellipse cx="107" cy="114" rx="4" ry="5" fill="#1A1A1A" />
          <ellipse cx="153" cy="114" rx="4" ry="5" fill="#1A1A1A" />
          {/* ハイライト */}
          <circle cx="103" cy="108" r="3" fill="#fff" />
          <circle cx="149" cy="108" r="3" fill="#fff" />
          <circle cx="110" cy="115" r="1.5" fill="#fff" opacity="0.7" />
          <circle cx="156" cy="115" r="1.5" fill="#fff" opacity="0.7" />
          {/* まつ毛（上） */}
          <path d="M95,106 Q107,98 119,106" stroke="#2C2C2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M141,106 Q153,98 165,106" stroke="#2C2C2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* === 鼻 === */}
      <path d="M127,125 Q130,133 133,125" stroke="#D4A07A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* === 口 === */}
      {expression === "happy" ? (
        <>
          <path d="M110,142 Q130,162 150,142" stroke="#2C2C2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M112,143 Q130,158 148,143" fill="#E57373" opacity="0.5" />
          {/* 頬の赤み */}
          <ellipse cx="88" cy="130" rx="14" ry="9" fill="#FF8A80" opacity="0.3" />
          <ellipse cx="172" cy="130" rx="14" ry="9" fill="#FF8A80" opacity="0.3" />
        </>
      ) : expression === "smile" ? (
        <>
          <path d="M114,140 Q130,154 146,140" stroke="#2C2C2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* 軽い頬の赤み */}
          <ellipse cx="90" cy="130" rx="12" ry="7" fill="#FF8A80" opacity="0.2" />
          <ellipse cx="170" cy="130" rx="12" ry="7" fill="#FF8A80" opacity="0.2" />
        </>
      ) : (
        <path d="M116,140 Q130,150 144,140" stroke="#2C2C2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}
