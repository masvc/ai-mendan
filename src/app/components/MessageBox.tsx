"use client";

type Props = {
  speaker: string;
  text: string;
};

export default function MessageBox({ speaker, text }: Props) {
  return (
    <div className="bg-[#1e293b]/90 backdrop-blur-md rounded-2xl">
      <div className="px-6 py-6">
        <div className="mb-3">
          <p className="text-slate-400 text-base font-bold">{speaker}</p>
        </div>
        <div>
          <p className="text-white text-lg leading-[1.8]">{"「"}{text}{"」"}</p>
        </div>
      </div>
    </div>
  );
}
