'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Persona } from '@/app/types';

const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-3 w-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-3 w-3 bg-purple-500 rounded-full animate-bounce"></span>
        </div>
        <p className="text-sm text-white/60">加载 3D 模型中...</p>
      </div>
    </div>
  )
});

export function ModelDisplay({ persona }: { persona: Persona | null }) {
  if (!persona) return null;
  return (
    <div className="w-full h-full">
      <Suspense fallback={null}>
        <Scene persona={persona} />
      </Suspense>
    </div>
  );
}