"use client";

type CharacterProps = {
  expression?: "normal" | "smile" | "happy" | "talking";
};

export default function Character({ expression = "normal" }: CharacterProps) {
  const isTalking = expression === "talking";
  const isHappy = expression === "happy";

  return (
    <svg width="320" height="520" viewBox="0 0 320 520" className="drop-shadow-2xl">
      {/* 口パクアニメーション定義 */}
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

      {/* === 体 - 医療スクラブ === */}
      <path d="M90,280 Q80,268 72,280 L50,460 Q50,490 160,490 Q270,490 270,460 L248,280 Q240,268 230,280 Z" fill="#2d3a4f" />
      <path d="M130,272 L160,318 L190,272" fill="#1e293b" />
      <rect x="190" y="330" width="35" height="28" rx="4" fill="#1e293b" opacity="0.5" />
      <rect x="195" y="335" width="12" height="2" rx="1" fill="#fff" opacity="0.5" />
      <g>
        <rect x="108" y="332" width="44" height="26" rx="4" fill="#fff" opacity="0.9" />
        <rect x="108" y="332" width="44" height="7" rx="4" fill="#2d3a4f" opacity="0.7" />
        <text x="130" y="353" textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="bold">翔平</text>
      </g>

      {/* 肩 */}
      <ellipse cx="88" cy="285" rx="24" ry="30" fill="#2d3a4f" />
      <ellipse cx="232" cy="285" rx="24" ry="30" fill="#2d3a4f" />
      {/* 腕 */}
      <rect x="52" y="295" width="34" height="100" rx="16" fill="#2d3a4f" />
      <rect x="234" y="295" width="34" height="100" rx="16" fill="#2d3a4f" />

      {/* 手 */}
      {isHappy ? (
        <>
          <circle cx="65" cy="390" r="18" fill="#F5C6A0" />
          <g transform="translate(240, 365) rotate(-20)">
            <circle cx="12" cy="0" r="18" fill="#F5C6A0" />
          </g>
        </>
      ) : (
        <>
          <circle cx="69" cy="400" r="18" fill="#F5C6A0" />
          <circle cx="251" cy="400" r="18" fill="#F5C6A0" />
        </>
      )}

      {/* 首 */}
      <rect x="135" y="220" width="50" height="65" rx="10" fill="#F5C6A0" />

      {/* 頭 */}
      <ellipse cx="160" cy="155" rx="76" ry="85" fill="#E8B892" />
      <ellipse cx="160" cy="152" rx="74" ry="83" fill="#F5C6A0" />

      {/* 髪 */}
      <ellipse cx="160" cy="90" rx="80" ry="52" fill="#2C2C2C" />
      <ellipse cx="160" cy="82" rx="72" ry="42" fill="#3A3A3A" />
      <rect x="82" y="82" width="22" height="60" rx="11" fill="#2C2C2C" />
      <rect x="216" y="82" width="22" height="60" rx="11" fill="#2C2C2C" />
      <path d="M95,105 Q115,72 135,100 Q148,68 168,95 Q182,70 198,100 Q210,75 228,108" fill="#2C2C2C" />
      <path d="M125,78 Q138,66 152,76" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />

      {/* 耳 */}
      <ellipse cx="88" cy="158" rx="12" ry="18" fill="#F5C6A0" />
      <ellipse cx="88" cy="158" rx="7" ry="11" fill="#E8B892" />
      <ellipse cx="232" cy="158" rx="12" ry="18" fill="#F5C6A0" />
      <ellipse cx="232" cy="158" rx="7" ry="11" fill="#E8B892" />

      {/* 眉 */}
      <path d="M118,128 Q133,120 148,126" stroke="#2C2C2C" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M172,126 Q187,120 202,128" stroke="#2C2C2C" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* 目 */}
      {isHappy ? (
        <>
          <path d="M118,145 Q133,134 148,145" stroke="#2C2C2C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M172,145 Q187,134 202,145" stroke="#2C2C2C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
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
          <path d="M117,138 Q133,128 149,138" stroke="#2C2C2C" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M171,138 Q187,128 203,138" stroke="#2C2C2C" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* 鼻 */}
      <path d="M157,165 Q160,174 163,165" stroke="#D4A07A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* 口 */}
      {isHappy ? (
        <>
          <path d="M135,185 Q160,208 185,185" stroke="#2C2C2C" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M138,186 Q160,204 182,186" fill="#E57373" opacity="0.4" />
          <ellipse cx="110" cy="172" rx="16" ry="10" fill="#FF8A80" opacity="0.3" />
          <ellipse cx="210" cy="172" rx="16" ry="10" fill="#FF8A80" opacity="0.3" />
        </>
      ) : isTalking ? (
        <>
          <path className="mouth-talk" d="M140,183 Q160,194 180,183" stroke="#2C2C2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="112" cy="172" rx="13" ry="8" fill="#FF8A80" opacity="0.2" />
          <ellipse cx="208" cy="172" rx="13" ry="8" fill="#FF8A80" opacity="0.2" />
        </>
      ) : expression === "smile" ? (
        <>
          <path d="M140,183 Q160,198 180,183" stroke="#2C2C2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="112" cy="172" rx="13" ry="8" fill="#FF8A80" opacity="0.2" />
          <ellipse cx="208" cy="172" rx="13" ry="8" fill="#FF8A80" opacity="0.2" />
        </>
      ) : (
        <path d="M142,183 Q160,194 178,183" stroke="#2C2C2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}
