'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 动态导入 Three.js 相关组件
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

export function ModelDisplay() {
  return (
    <div className="w-full h-full">
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </div>
  );
}