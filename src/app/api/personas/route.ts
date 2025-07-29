// src/app/api/personas/route.ts
import { NextResponse } from 'next/server';
import { Persona } from '@/app/types';

// 模拟的数据库数据
const MOCK_PERSONAS: Persona[] = [
  { 
    id: 1, 
    name: '资深程序员', 
    description: '一位乐于助人的代码导师', 
    avatar: '/avatars/lecun.jpg'
  },
  { 
    id: 2, 
    name: '苏格拉底', 
    description: '一位善于提问的哲学家', 
    avatar: '/avatars/sgld.jpg'
  },
  { 
    id: 3, 
    name: '莎士比亚', 
    description: '一位文采斐然的剧作家', 
    avatar: '/avatars/ssby.jpg'
  }
];

// Next.js API Route
export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 500)); 

  return NextResponse.json(MOCK_PERSONAS);
}
