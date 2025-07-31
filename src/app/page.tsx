'use client';

import { useState, useEffect } from 'react';
import { PersonaSelector } from '@/components/PersonaSelector';
import { ChatWindow } from '@/components/ChatWindow';
import { ChatInput } from '@/components/ChatInput';
import { Persona, ChatMessage } from '@/app/types';
import Link from 'next/link';
import { ModelDisplay } from '@/components/ModelDisplay';

export default function HomePage() {
  // --- 状态管理 ---
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 添加边栏状态

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
        {/* 左侧 PersonaSelector */}
        <div
          className={`
            fixed z-20
            w-[320px] h-full
            backdrop-blur-xl bg-white/5 border-r border-white/10
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="h-full pb-20">
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

        {/* 显示/隐藏按钮 - 居中显示，稍微留一点距离 */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`
            fixed z-30
            left-0 right-auto
            top-1/2 -translate-y-1/2
            p-2 rounded-xl
            backdrop-blur-md bg-white/5 border border-white/10
            transition-all duration-300
            hover:bg-white/10 hover:scale-105
            hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]
            ${isSidebarOpen ? 'ml-[340px]' : 'ml-4'}
          `}
          style={{
            // 让按钮始终在侧栏边缘并留一点距离
            transition: 'margin-left 0.3s',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 text-white/80 transition-transform duration-300 ${
              isSidebarOpen ? 'rotate-180' : 'rotate-0'
            }`}
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
        </button>

        {/* 添加遮罩层（移动端） */}
        {isSidebarOpen && (
          <div 
            className="fixed md:hidden inset-0 bg-black/60 backdrop-blur-sm z-10"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 右侧聊天区域 - 完全覆盖整个屏幕 */}
        <div 
          className={`
            fixed inset-0 flex flex-col bg-black/30 backdrop-blur-xl
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'left-[320px]' : 'left-0'}
          `}
          style={{ height: '100vh' }} // 强制高度为视口高度
        >
          {selectedPersona ? (
            <>
              {/* Header */}
              <header className="flex-shrink-0 p-4 border-b border-white/10 backdrop-blur-md bg-white/5">
                <h1 className="text-xl font-bold text-white">
                  与 {selectedPersona.name} 对话
                </h1>
              </header>
              
              {/* Chat Content */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* 主内容区域 - 水平布局 */}
                <div className={`
                  flex-1 min-h-0 flex
                  transition-all duration-500 ease-in-out
                `}>
                  {/* 聊天区域 */}
                  <div
                    className={`
                      transition-all duration-500 ease-in-out
                      ${!isSidebarOpen 
                        ? 'w-2/5 min-w-[240px] max-w-[420px]' 
                        : 'w-full'}
                      flex flex-col
                    `}
                  >
                    {/* 聊天窗口容器 - 保持滚动功能 */}
                    <div className="flex-1 min-h-0 overflow-y-auto neon-scrollbar">
                      <ChatWindow messages={messages} isLoading={isLoading} />
                    </div>
                  </div>

                  {/* 3D 模型区域 - 仅在全屏模式显示 */}
                  {!isSidebarOpen && (
                    <div className="w-5/5 h-full relative flex items-center justify-center overflow-hidden">
                      <div
                        className={`
                          w-full h-full
                          transition-all duration-700 ease-out
                          ${!isSidebarOpen 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-full opacity-0'}
                        `}
                        style={{
                          transform: !isSidebarOpen ? 'translateY(0)' : 'translateY(100%)',
                        }}
                      >
                        {/* 传递当前 persona 给 ModelDisplay */}
                        <ModelDisplay persona={selectedPersona} />
                      </div>
                    </div>
                  )}
                </div>

                {/* 输入框 - 始终在底部 */}
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
