// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 定义聊天摘要的类型
interface ChatSummary {
  id: string;
  persona_name: string;
  title: string;
  last_updated: string;
}

// 一个简单的骨架屏组件，用于加载状态
function ChatListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
          <div className="h-5 bg-white/10 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 当会话状态变化时，处理重定向
  useEffect(() => {
    // 如果未认证且加载已完成，重定向到登录页
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // 获取聊天数据
  useEffect(() => {
    // 只有在认证成功后才去获取数据
    if (status === 'authenticated') {
      setIsLoading(true);
      fetch('/api/user/chats/summary')
        .then(res => res.json())
        .then(data => {
          setChats(data);
          setIsLoading(false);
        });
    }
  }, [status]);

  // 优雅地处理加载和未认证状态
  if (status === 'loading' || !session) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-white/60">正在加载您的信息...</p>
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

      {/* 主要内容 */}
      <div className="relative min-h-screen">
        <div className="max-w-4xl mx-auto p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              欢迎回来, {session.user?.name || '朋友'}!
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              选择一个最近的对话继续，或开始一段新旅程。
            </p>
          </header>

          <div className="backdrop-blur-xl bg-white/5 p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden">
            {/* 卡片内部装饰光效 */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[32px]"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[32px]"></div>
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">最近对话</h2>
                <Link href="/">
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg
                    transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-[1.02]">
                    + 开始新聊天
                  </button>
                </Link>
              </div>

              {isLoading ? (
                <ChatListSkeleton />
              ) : (
                <div className="space-y-4">
                  {chats.map(chat => (
                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                      <div className="block p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg
                        hover:bg-white/10 transition-all duration-300 cursor-pointer
                        hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:scale-[1.01]">
                        <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                          {chat.title}
                        </h3>
                        <p className="text-sm text-gray-300">与 {chat.persona_name} 的对话</p>
                        <p className="text-xs text-gray-500 mt-2">
                          最后更新于: {new Date(chat.last_updated).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
