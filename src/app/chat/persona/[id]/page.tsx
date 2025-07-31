// src/app/chat/persona/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getMessages, setMessagesMap } from '@/utils/chatStorage';
import { useRouter } from 'next/navigation';
import { ModelDisplay } from '@/components/ModelDisplay';
import { ChatWindow } from '@/components/ChatWindow';
import { ChatInput } from '@/components/ChatInput';
import { Persona } from '@/app/types';

export default function ChatPersonaPage({ params }: { params: { id: string } }) {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 获取 persona 数据（可根据实际情况从 API 或全局缓存获取）
    async function fetchPersona() {
      const res = await fetch(`/api/personas/${params.id}`);
      if (res.ok) {
        setPersona(await res.json());
      }
    }
    fetchPersona();
    // 聊天记录初始化
    if (typeof window !== 'undefined') {
      setMessages(getMessages(String(params.id)));
    }
  }, [params.id]);

  const handleSendMessage = async (userInput: string) => {
    if (!persona) return;
    const personaId = String(persona.id);
    const userMessage: { role: 'user' | 'assistant'; content: string } = { role: 'user', content: userInput };
    setMessages((prev) => {
      const newMsgs = [...prev, userMessage];
      // 写入 localStorage
      if (typeof window !== 'undefined') {
        const map = JSON.parse(localStorage.getItem('persona_chat_messages') || '{}');
        map[personaId] = newMsgs;
        setMessagesMap(map);
      }
      return newMsgs;
    });
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          persona_id: personaId,
        }),
      });
      const aiResponseRaw = await response.json();
      // 保证 role 类型安全
      const aiResponse: { role: 'user' | 'assistant'; content: string } = {
        role: aiResponseRaw.role === 'user' ? 'user' : 'assistant',
        content: aiResponseRaw.content,
      };
      setMessages((prev) => {
        const newMsgs = [...prev, aiResponse];
        if (typeof window !== 'undefined') {
          const map = JSON.parse(localStorage.getItem('persona_chat_messages') || '{}');
          map[personaId] = newMsgs;
          setMessagesMap(map);
        }
        return newMsgs;
      });
    } catch {
      setMessages((prev) => {
        const newMsgs = [...prev, { role: 'assistant' as const, content: '抱歉，出错了。' }];
        if (typeof window !== 'undefined') {
          const map = JSON.parse(localStorage.getItem('persona_chat_messages') || '{}');
          map[personaId] = newMsgs;
          setMessagesMap(map);
        }
        return newMsgs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!persona) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/60">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 霓虹灯效果等装饰与主页一致 */}
      {/* ...可复用主页的装饰代码... */}

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

      {/* 聊天和模型区域，布局与主页隐藏侧栏时一致 */}
      <div className="fixed inset-0 flex flex-col bg-black/30 backdrop-blur-xl transition-all duration-300 ease-in-out left-0" style={{ height: '100vh' }}>
        <header className="flex-shrink-0 p-4 border-b border-white/10 backdrop-blur-md bg-white/5" />
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 flex transition-all duration-500 ease-in-out">
            {/* 聊天气泡区域 */}
            <div className="w-2/5 min-w-[240px] max-w-[420px] flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto neon-scrollbar">
                <ChatWindow messages={messages} isLoading={isLoading} />
              </div>
            </div>
            {/* 3D模型区域 */}
            <div className="w-5/5 h-full relative flex items-center justify-center overflow-hidden">
              <div className="w-full h-full transition-transform duration-700 ease-out translate-y-0 opacity-100">
                <ModelDisplay persona={persona} />
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 border-t border-white/10">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}