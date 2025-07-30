'use client';

import { useState, useEffect } from 'react';
import { PersonaSelector } from '@/components/PersonaSelector';
import { ChatWindow } from '@/components/ChatWindow';
import { ChatInput } from '@/components/ChatInput';
import { Persona, ChatMessage } from '@/app/types';
import Link from 'next/link';

export default function HomePage() {
  // --- 状态管理 ---
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- 数据获取 ---
  // 组件加载时，获取所有可用的人格
  useEffect(() => {
    async function fetchPersonas() {
      const response = await fetch('/api/personas');
      const data = await response.json();
      setPersonas(data);
      // 默认选择第一个人格
      if (data.length > 0) {
        setSelectedPersona(data[0]);
      }
    }
    fetchPersonas();
  }, []);

  // --- 核心交互逻辑 ---
  const handleSendMessage = async (userInput: string) => {
    if (!selectedPersona) return;

    // 1. 立即在UI上显示用户的消息 (乐观更新)
    const userMessage: ChatMessage = { role: 'user', content: userInput };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // 2. 调用我们的 Mock API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          persona_id: selectedPersona.id,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const aiResponse: ChatMessage = await response.json();

      
      setMessages(prevMessages => [...prevMessages, aiResponse]);

    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: ChatMessage = { role: 'assistant', content: '抱歉，我好像出了一点问题...' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      
      setIsLoading(false);
    }
  };
  
  const handleSelectPersona = (persona: Persona) => {
    setSelectedPersona(persona);
    // 切换人格时，清空聊天记录
    setMessages([]);
  }

  // --- 渲染UI ---
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* 霓虹灯效果 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 主光源 */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px] animate-pulse animation-delay-1000"></div>
        
        {/* 装饰光源 */}
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-violet-500/20 rounded-full blur-[96px] animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-[96px] animate-pulse animation-delay-3000"></div>
      </div>

      {/* 主界面内容 */}
      <div className="relative flex h-screen">
        {/* 左侧 PersonaSelector - 修改溢出处理 */}
        <div className="w-1/4 min-w-[280px] max-w-[420px] backdrop-blur-xl bg-white/5 border-r border-white/10 relative overflow-hidden">
          <div className="h-full pb-20"> {/* 保持底部 padding */}
            <PersonaSelector
              personas={personas}
              selectedPersona={selectedPersona}
              onSelectPersona={handleSelectPersona}
            />
          </div>
          
          {/* Dashboard 按钮 */}
          <Link 
            href="/dashboard"
            className="absolute bottom-4 left-4 px-4 py-3 
              backdrop-blur-md rounded-xl
              bg-white/5 border border-white/10
              transition-all duration-300 group
              hover:bg-white/10 hover:scale-105
              hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            <div className="flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-purple-400 transition-transform group-hover:scale-110" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                />
              </svg>
              <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                进入控制台
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
            </div>
          </Link>
        </div>

        {/* 右侧聊天区域保持不变 */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-black/30 backdrop-blur-xl">
          {selectedPersona ? (
            <>
              <header className="flex-shrink-0 p-4 border-b border-white/10 backdrop-blur-md bg-white/5">
                <h1 className="text-xl font-bold text-white">
                  与 {selectedPersona.name} 对话
                </h1>
              </header>
              <div className="flex-1 flex flex-col min-h-0"> {/* 添加 min-h-0 确保 flex-1 正常工作 */}
                <ChatWindow messages={messages} isLoading={isLoading} />
                <div className="flex-shrink-0 border-t border-white/10">
                  <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/60">
              <p>请从左侧选择一个聊天伙伴开始对话</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
