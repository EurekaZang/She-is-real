// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { ChatMessage } from '@/app/types';

// 模拟不同人格的回复风格
const responses: { [key: number]: string[] } = {
  1: ["当然！闭包是一个函数，它可以记住并访问其词法作用域，即使该函数在其词法作用域之外执行。", "你可以把它想象成一个背包，函数背着它需要的所有变量。", "在JavaScript中，这是实现私有变量的常用方法。"],
  2: ["你问'什么是闭包'，这本身就是一个好问题。但我们是否应该先问，'知识的本质是什么？'", "告诉我，你认为一个'包'是如何'关闭'的？"],
  3: ["啊，闭包！犹如舞台落幕，演员虽已离去，其魂魄仍萦绕于场景之中！", "它是一个函数，怀揣着往昔记忆的宝匣。"],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, persona_id } = body;

    // 简单的日志，可以在VS Code的终端里看到
    console.log(`Mock API: Received message "${message}" for persona ID: ${persona_id}`);

    // 模拟AI的思考时间
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // 根据 persona_id 选择一个随机回复
    const personaResponses = responses[persona_id] || ["对不起，我不太明白你的意思。"];
    const randomResponse = personaResponses[Math.floor(Math.random() * personaResponses.length)];

    const aiMessage: ChatMessage = {
      role: 'assistant',
      content: randomResponse,
    };

    return NextResponse.json(aiMessage);

  } catch (error) {
    console.error("Mock API Error:", error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
