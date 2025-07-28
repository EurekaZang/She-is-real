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

      // 3. 将AI的回复添加到消息列表
      setMessages(prevMessages => [...prevMessages, aiResponse]);

    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: ChatMessage = { role: 'assistant', content: '抱歉，我好像出了一点问题...' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      // 4. 无论成功失败，都结束加载状态
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
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PersonaSelector
        personas={personas}
        selectedPersona={selectedPersona}
        onSelectPersona={handleSelectPersona}
      />
      <div className="flex-1 flex flex-col">
        {selectedPersona ? (
          <>
            <header className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold">{selectedPersona.name}</h1>
            </header>
            <ChatWindow messages={messages} isLoading={isLoading} />
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>请从左侧选择一个聊天伙伴开始对话</p>
          </div>
        )}
      </div>
    </div>
  );
}
