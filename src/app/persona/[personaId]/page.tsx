// src/app/persona/[personaId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Persona } from '@/app/types';

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


export default function PersonaProfilePage() {
  const params = useParams();
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
    return <div className="max-w-4xl mx-auto p-8"><PersonaDetailSkeleton /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">加载人格信息失败: {error}</div>;
  }

  if (!persona) {
    return <div className="text-center p-8">找不到这个人格。</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-gray-800 dark:text-gray-200">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* 左侧：头像 */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <Image
            src={persona.avatar}
            alt={`${persona.name}的头像`}
            width={256}
            height={256}
            className="rounded-full shadow-lg object-cover border-4 border-gray-200 dark:border-gray-600"
            priority // 优先加载此图片
          />
        </div>

        {/* 右侧：信息 */}
        <div className="w-full md:w-2/3">
          <h1 className="text-5xl font-extrabold mb-2">{persona.name}</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">{persona.description}</p>
          
          <p className="text-lg leading-relaxed mb-8">{persona.bio}</p>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold mb-2">详细信息</h3>
            <ul className="space-y-1">
              {Object.entries(persona.details).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold">{key}:</span> {value}
                </li>
              ))}
            </ul>
          </div>

          <Link href={`/chat?personaId=${persona.id}`}>
            <button className="w-full md:w-auto px-8 py-4 text-xl bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105">
              立即与 {persona.name} 对话
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
