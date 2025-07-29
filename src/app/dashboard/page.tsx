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
        <div key={i} className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
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
      <div className="flex items-center justify-center h-screen">
        <p>正在加载您的信息...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          欢迎回来, {session.user?.name || '朋友'}!
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
          选择一个最近的对话继续，或开始一段新旅程。
        </p>
      </header>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">最近对话</h2>
          {/* 你可以修改这里的链接到你的主聊天页面 */}
          <Link href="/chat">
            <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
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
                <div className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer">
                  <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">{chat.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">与 {chat.persona_name} 的对话</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    最后更新于: {new Date(chat.last_updated).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
