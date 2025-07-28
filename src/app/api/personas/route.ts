// src/app/api/personas/route.ts
import { NextResponse } from 'next/server';
import { Persona } from '@/app/types'; // 从我们定义的类型文件中导入

// 模拟的数据库数据
const MOCK_PERSONAS: Persona[] = [
  { id: 1, name: '资深程序员', description: '一位乐于助人的代码导师', avatar_url: '/avatars/developer.png' },
  { id: 2, name: '苏格拉底', description: '一位善于提问的哲学家', avatar_url: '/avatars/socrates.png' },
  { id: 3, name: '莎士比亚', description: '一位文采斐然的剧作家', avatar_url: '/avatars/shakespeare.png' }
];

// Next.js API Route 的标准写法
export async function GET() {
  // 模拟真实世界的网络延迟，让加载状态更明显
  await new Promise(resolve => setTimeout(resolve, 500)); 

  return NextResponse.json(MOCK_PERSONAS);
}
