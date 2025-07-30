// src/components/PersonaSelector.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image'; // 推荐使用 Next.js 的 Image 组件以优化图片
import { Persona } from '@/app/types';

interface PersonaSelectorProps {
  personas: Persona[];
  selectedPersona: Persona | null;
  onSelectPersona: (persona: Persona) => void;
}

export function PersonaSelector({ personas, selectedPersona, onSelectPersona }: PersonaSelectorProps) {
  return (
    <div className="w-full h-full backdrop-blur-xl bg-black/30 p-4 relative overflow-y-auto neon-scrollbar">
      {/* ...霓虹灯效果... */}

      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          选择聊天伙伴
        </h2>
        <div className="space-y-4">
          {personas.map(persona => (
            <div key={persona.id} className="relative group w-full">
              <button
                onClick={() => onSelectPersona(persona)}
                className={`w-full p-4 rounded-xl backdrop-blur-md transition-all duration-300
                  ${selectedPersona?.id === persona.id
                    ? 'bg-purple-500/30 shadow-lg border border-purple-400/50 hover:shadow-purple-500/20'
                    : 'hover:bg-white/10 bg-white/5 border border-transparent hover:border-white/20'
                  }
                  hover:shadow-lg hover:scale-[1.02] transform`}
              >
                <div className="flex items-center gap-4">
                  <Image 
                    src={persona.avatar}
                    alt={persona.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0"> {/* 这里确保文本容器可以收缩 */}
                    <p className="font-medium text-white truncate">
                      {persona.name}
                    </p>
                    <p className="text-sm text-gray-300/80 truncate">
                      {persona.description}
                    </p>
                  </div>
                </div>
              </button>

              <Link 
                href={`/persona/${persona.id}`}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-full
                  bg-black/20 hover:bg-black/40
                  opacity-0 group-hover:opacity-100 transition-all duration-300
                  focus:opacity-100 outline-none"
                title={`查看 ${persona.name} 的详情`}
                aria-label={`查看 ${persona.name} 的详情`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
