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

  // 每次消息更新时，自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-md">
                <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
