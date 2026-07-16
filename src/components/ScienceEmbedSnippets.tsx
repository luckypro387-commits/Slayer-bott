import React, { useState } from 'react';
import { Copy, Check, Terminal, Code, Image } from 'lucide-react';

interface ScienceEmbedSnippetsProps {
  url: string;
}

export default function ScienceEmbedSnippets({ url }: ScienceEmbedSnippetsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const snippets = [
    {
      label: 'GitHub / Markdown',
      icon: <Code className="w-3.5 h-3.5 text-orange-400" />,
      code: `![STEM Banner](${url})`,
    },
    {
      label: 'HTML Embed',
      icon: <Terminal className="w-3.5 h-3.5 text-cyan-400" />,
      code: `<img src="${url}" alt="STEM Science Banner" />`,
    },
    {
      label: 'BBCode (Forums)',
      icon: <Image className="w-3.5 h-3.5 text-purple-400" />,
      code: `[IMG]${url}[/IMG]`,
    },
    {
      label: 'Direct API Link',
      icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" />,
      code: url,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-8">
      <h3 className="text-sm font-outfit font-bold text-neutral-200 uppercase mb-4 flex items-center gap-2 tracking-wider">
        <Terminal className="w-4 h-4 text-pink-400 animate-pulse" />
        STEM Banner API Snippets
      </h3>
      <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
        Integrate this dynamically generated scientific banner image into web portals, classroom portals, GitHub Readme pages, or forum threads. The image compiles on-the-fly and reflects your updated text configurations instantly!
      </p>

      <div className="space-y-4">
        {snippets.map((snip, idx) => (
          <div key={snip.label} className="flex flex-col gap-2">
            <span className="text-xs font-outfit font-bold text-neutral-400 flex items-center gap-2 tracking-wide">
              {snip.icon}
              {snip.label}
            </span>
            <div className="flex bg-neutral-950 rounded border border-neutral-800 overflow-hidden text-xs">
              <div className="flex-1 overflow-x-auto p-3 font-mono text-neutral-300 whitespace-nowrap scrollbar-none">
                {snip.code}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(snip.code, idx)}
                className="bg-neutral-900 hover:bg-neutral-850 border-l border-neutral-800 px-4 text-xs font-outfit font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer select-none"
              >
                {copiedIndex === idx ? (
                  <Check className="w-4 h-4 text-pink-400" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-400 hover:text-neutral-200" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
