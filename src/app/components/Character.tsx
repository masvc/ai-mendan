"use client";

type CharacterProps = {
  expression?: "normal" | "smile" | "happy";
};

export default function Character({ expression = "normal" }: CharacterProps) {
  return (
    <svg width="200" height="320" viewBox="0 0 200 320" className="drop-shadow-lg">
      {/* 体 - 大きめ、がっしり */}
      <rect x="45" y="155" width="110" height="120" rx="12" fill="#1565C0" />
      {/* 襟元 / ユニフォーム風ライン */}
      <rect x="45" y="155" width="110" height="20" rx="8" fill="#0D47A1" />
      <line x1="100" y1="155" x2="100" y2="275" stroke="#0D47A1" strokeWidth="2" />
      {/* 肩幅広め */}
      <rect x="20" y="160" width="35" height="80" rx="16" fill="#1565C0" />
      <rect x="145" y="160" width="35" height="80" rx="16" fill="#1565C0" />
      {/* 手 */}
      <circle cx="37" cy="248" r="14" fill="#D7A86E" />
      <circle cx="163" cy="248" r="14" fill="#D7A86E" />
      {/* 首 - 太め */}
      <rect x="80" y="130" width="40" height="30" rx="6" fill="#D7A86E" />
      {/* 顔 - 男性的でしっかりめ */}
      <ellipse cx="100" cy="90" rx="48" ry="52" fill="#D7A86E" />
      {/* 髪 - 短髪、スポーティ */}
      <ellipse cx="100" cy="55" rx="50" ry="32" fill="#1A1A1A" />
      <rect x="50" y="50" width="15" height="25" rx="7" fill="#1A1A1A" />
      <rect x="135" y="50" width="15" height="25" rx="7" fill="#1A1A1A" />
      {/* キャップ */}
      <ellipse cx="100" cy="48" rx="54" ry="18" fill="#1565C0" />
      <rect x="46" y="34" width="108" height="18" rx="6" fill="#1565C0" />
      {/* キャップのツバ */}
      <ellipse cx="100" cy="52" rx="58" ry="8" fill="#0D47A1" />
      {/* キャップロゴ「絆」 */}
      <text x="100" y="47" textAnchor="middle" fill="#FFD54F" fontSize="14" fontWeight="bold">
        絆
      </text>

      {/* 眉 - 太め、男性的 */}
      <line x1="70" y1="72" x2="88" y2="74" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
      <line x1="112" y1="74" x2="130" y2="72" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />

      {/* 目 */}
      {expression === "happy" ? (
        <>
          <path d="M72,82 Q80,76 88,82" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M112,82 Q120,76 128,82" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="80" cy="82" rx="6" ry="7" fill="#1A1A1A" />
          <ellipse cx="120" cy="82" rx="6" ry="7" fill="#1A1A1A" />
          <circle cx="78" cy="80" r="2" fill="#fff" />
          <circle cx="118" cy="80" r="2" fill="#fff" />
        </>
      )}

      {/* 口 */}
      {expression === "happy" ? (
        <>
          <path d="M82,100 Q100,118 118,100" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="68" cy="95" rx="10" ry="6" fill="rgba(255,138,128,0.35)" />
          <ellipse cx="132" cy="95" rx="10" ry="6" fill="rgba(255,138,128,0.35)" />
        </>
      ) : expression === "smile" ? (
        <path d="M84,98 Q100,110 116,98" stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M86,100 Q100,108 114,100" stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}

      {/* 鼻 */}
      <path d="M98,88 L100,94 L102,88" stroke="#C4956A" strokeWidth="1.5" fill="none" />

      {/* 背番号風テキスト */}
      <text x="100" y="215" textAnchor="middle" fill="#FFD54F" fontSize="36" fontWeight="bold" fontFamily="Arial">
        17
      </text>
    </svg>
  );
}
