// src/types.ts

export interface Persona {
  id: number;
  name: string;
  description: string;
  avatar_url: string; // 本地图片路径
  system_prompt?: string; // 前端暂时用不到，但定义好
}

export interface ChatMessage {
  id?: number; // 数据库中的ID，前端可以没有
  role: 'user' | 'assistant';
  content: string;
}
