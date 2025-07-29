'use client';

import { useState, useEffect } from 'react';
import { PersonaSelector } from '@/components/PersonaSelector';
import { ChatWindow } from '@/components/ChatWindow';
import { ChatInput } from '@/components/ChatInput';
import { Persona, ChatMessage } from '@/app/types';

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
        {/* PersonaSelector with glass effect */}
        <div className="w-1/4 min-w-[280px] backdrop-blur-xl bg-white/5 border-r border-white/10">
          <PersonaSelector
            personas={personas}
            selectedPersona={selectedPersona}
            onSelectPersona={handleSelectPersona}
          />
        </div>

        {/* Chat area with glass effect */}
        <div className="flex-1 flex flex-col bg-black/30 backdrop-blur-xl">
          {selectedPersona ? (
            <>
              <header className="p-4 border-b border-white/10 backdrop-blur-md bg-white/5">
                <h1 className="text-xl font-bold text-white">
                  与 {selectedPersona.name} 对话
                </h1>
              </header>
              <div className="flex-1 flex flex-col">
                <ChatWindow messages={messages} isLoading={isLoading} />
                <div className="border-t border-white/10">
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
