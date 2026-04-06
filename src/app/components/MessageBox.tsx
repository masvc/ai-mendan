"use client";

type Props = {
  text: string;
};

function wrapText(text: string, len: number) {
  const lines: string[] = [];
  for (let i = 0; i < text.length; i += len) {
    lines.push(text.slice(i, i + len));
  }
  return lines;
}

export default function MessageBox({ text }: Props) {
  const lines = wrapText(text, 16);
  return (
    <div className="bg-[#1e293b]/90 backdrop-blur-md rounded-2xl overflow-hidden w-full min-w-0">
      <div className="px-6 py-6 h-[150px] overflow-y-auto overflow-x-hidden flex items-center">
        <div className="min-w-0 w-full">
          <p className="text-white text-lg leading-[1.8] break-words text-center whitespace-pre-wrap">{lines.join("\n")}</p>
        </div>
      </div>
    </div>
  );
}
