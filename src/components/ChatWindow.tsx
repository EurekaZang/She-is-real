'use client';
import { ChatMessage as Message } from '@/app/types';
import { ChatMessage } from './ChatMessage';
import { useEffect, useRef } from 'react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-1 p-6 overflow-y-auto relative">
      {/* 添加霓虠灯效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute right-1/4 top-1/3 w-64 h-64 bg-purple-600/20 rounded-full blur-[96px] animate-pulse"></div>
        <div className="absolute left-1/3 bottom-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[96px] animate-pulse animation-delay-2000"></div>
      </div>

      <div className="space-y-4 relative z-10">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl rounded-bl-md border border-white/10">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
