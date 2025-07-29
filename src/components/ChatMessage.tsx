'use client';

import { ChatMessage as Message } from '@/app/types';

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-xl p-3 rounded-2xl backdrop-blur-md transition-all duration-300 
          ${isUser 
            ? 'bg-gradient-to-r from-purple-500/50 to-pink-500/50 text-white rounded-br-md border border-purple-400/30 hover:shadow-purple-500/20' 
            : 'bg-white/5 text-gray-100 rounded-bl-md border border-white/10 hover:shadow-blue-500/20'
          } hover:shadow-lg`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
