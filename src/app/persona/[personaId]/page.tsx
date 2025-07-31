// src/app/persona/[personaId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Persona } from '@/app/types';
import ReactMarkdown from 'react-markdown';

// 扩展 Persona 类型以包含详情
type PersonaDetails = Persona & {
  bio: string;
  details: Record<string, string>;
};

function PersonaDetailSkeleton() {
    return (
        <div className="animate-pulse flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3">
                <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto"></div>
            </div>
            <div className="w-full md:w-2/3 space-y-6">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
                </div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
        </div>
    );
}

function PersonaBio({ bio }: { bio: string }) {
  return <ReactMarkdown>{bio}</ReactMarkdown>;
}


export default function PersonaProfilePage() {
  const params = useParams();
  const router = useRouter();
  const personaId = params.personaId;

  const [persona, setPersona] = useState<PersonaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!personaId) return;

    setIsLoading(true);
    setError(null);

    fetch(`/api/personas/${personaId}`)
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setPersona(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [personaId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative">
        <div className="max-w-4xl mx-auto p-8">
          <PersonaDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400/80 backdrop-blur-xl bg-white/5 p-8 rounded-xl border border-red-500/20">
          加载人格信息失败: {error}
        </div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 backdrop-blur-xl bg-white/5 p-8 rounded-xl border border-white/10">
          找不到这个人格。
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 霓虹灯效果 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 主光源 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px] animate-pulse animation-delay-1000"></div>
        
        {/* 装饰光源 */}
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-violet-500/20 rounded-full blur-[96px] animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-[96px] animate-pulse animation-delay-3000"></div>
      </div>

      {/* 返回按钮 */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 p-3 z-50 rounded-xl
          bg-white/5 backdrop-blur-md border border-white/10
          text-white/80 transition-all duration-300
          hover:bg-white/10 hover:scale-105
          hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]
          group"
      >
        <div className="flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 transition-transform group-hover:-translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          <span className="text-sm font-medium">返回</span>
        </div>
      </button>

      {/* 主要内容 */}
      <div className="relative max-w-4xl mx-auto p-8">
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* 左侧：头像 */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <Image
                  src={persona.avatar}
                  alt={`${persona.name}的头像`}
                  width={256}
                  height={256}
                  className="relative rounded-full shadow-lg object-cover border-2 border-white/20 group-hover:border-white/40 transition duration-300"
                  priority
                />
              </div>
            </div>

            {/* 右侧：信息 */}
            <div className="w-full md:w-2/3">
              <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                {persona.name}
              </h1>
              <p className="text-xl text-gray-400 mb-6">{persona.description}</p>

              <div className="text-lg leading-relaxed mb-8 text-white/80">
                <PersonaBio bio={persona.bio} />
              </div>

              <div className="backdrop-blur-md bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-white">详细信息</h3>
                <ul className="space-y-3">
                  {Object.entries(persona.details).map(([key, value]) => (
                    <li key={key} className="text-gray-300">
                      <span className="font-semibold text-purple-400">{key}:</span>{' '}
                      <span className="text-gray-300">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 修改对话按钮 */}
              <button
                onClick={() => router.push(`/?personaId=${persona.id}`)}
                className="w-full md:w-auto px-8 py-4 text-xl bg-gradient-to-r from-purple-500 to-pink-500 
                  text-white font-bold rounded-xl transition-all duration-300
                  hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-[1.02]
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black
                  group"
              >
                <span className="flex items-center justify-center gap-2">
                  与 {persona.name} 开始对话
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
