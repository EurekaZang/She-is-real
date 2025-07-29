'use client';
import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="p-4 backdrop-blur-md bg-white/10 border-t border-white/20">
      <form onSubmit={handleSubmit} className="flex items-center gap-4 max-w-4xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="和你的AI伙伴聊点什么..."
          disabled={isLoading}
          className="flex-1 p-3 rounded-xl 
            bg-white/10 backdrop-blur-md
            border border-white/20
            text-white placeholder-white/50
            transition-all duration-300
            hover:scale-[1.02] hover:bg-white/20
            focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 rounded-xl
            bg-white/20 backdrop-blur-md
            border border-white/20
            text-white font-medium
            transition-all duration-300
            hover:scale-[1.02] hover:bg-white/30
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '思考中...' : '发送'}
        </button>
      </form>
    </div>
  );
}
