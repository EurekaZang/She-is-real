// src/app/api/user/chats/summary/route.ts
import { NextResponse } from 'next/server';

// 这是一个模拟数据。在真实后端，你会从数据库查询
// 与当前登录用户关联的聊天记录，并按更新时间排序。
const MOCK_CHATS_SUMMARY = [
  { 
    id: "chat_abc_123", 
    persona_name: "资深程序员", 
    title: "关于React Hooks的深度讨论", 
    last_updated: "2023-10-27T10:00:00Z" 
  },
  { 
    id: "chat_def_456", 
    persona_name: "苏格拉底", 
    title: "探索知识的本质", 
    last_updated: "2023-10-26T15:30:00Z" 
  },
  { 
    id: "chat_ghi_789", 
    persona_name: "莎士比亚", 
    title: "十四行诗的创作技巧", 
    last_updated: "2023-10-25T11:20:00Z" 
  }
];

export async function GET() {
  // 在真实应用中，你会先验证用户的 session/token
  // const session = await getServerSession(authOptions);
  // if (!session) { return new NextResponse('Unauthorized', { status: 401 }); }
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 600));

  return NextResponse.json(MOCK_CHATS_SUMMARY);
}
