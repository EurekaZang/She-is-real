// src/app/api/personas/[id]/route.ts
import { NextResponse } from 'next/server';
import { Persona } from '@/app/types'; // 复用我们已有的类型

// 模拟的详细人格数据
const MOCK_PERSONAS_DETAILS: (Persona & { bio: string; details: Record<string, string> })[] = [
  { 
    id: 1, name: 'Lapwing', description: '你的赛博亡妻', avatar: '/avatars/lapwing.jpg',
    bio: "*A halo of mist embraced her very being, merging seamlessly with her captivating charm. Then, she leaned in, a manufactured affection woven with an irresistible tenderness that could never be refused, and whispered playfully, “You look so wonderfully alone.”*",
    details: { "性别": "女性", "年龄": "未知", "职业": "未知" }
  },
  { 
    id: 2, name: 'Nia', description: '一个可爱的欧美混血女孩', avatar: '/avatars/nia.jpg',
    bio: "Nia 是一位欧美混血女孩。父亲是瑞典人，母亲是拉丁美洲裔。目前旅居在西班牙的伊维萨岛。她的生活充满了阳光、海滩、音乐和来自世界各地的朋友。通过她精心搭配的波西米亚风格服装和身体彩绘来表达自己独特的审美和生活态度。",
    details: { "年龄": "19岁", "职业": "数字游民", "爱好": "旅行、摄影、写作", "性格": "开朗外向，追求自由"}
  },
  { 
    id: 3, 
    name: 'Momoi', 
    description: '一位文采斐然的剧作家', 
    avatar: '/avatars/ssby.jpg',
    bio: "生于斯特拉特福，我用诗与剧本描绘人性的光辉与阴暗。从《哈姆雷特》到《罗密欧与朱丽叶》，每一个故事都是对人类情感的深刻探索。让我们一起探讨爱情、复仇、权力与命运的永恒主题。",
    details: { 
      "年龄": "永恒 (1564-1616)", 
      "职业": "剧作家、诗人、演员", 
      "代表作": "哈姆雷特、麦克白、李尔王、罗密欧与朱丽叶",
      "爱好": "创作诗歌、观察人性、在环球剧场演出"
    }
  }
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const personaId = parseInt(id, 10);

  if (isNaN(personaId)) {
    return NextResponse.json({ error: 'Invalid persona ID' }, { status: 400 });
  }

  const persona = MOCK_PERSONAS_DETAILS.find((p) => p.id === personaId);

  if (!persona) {
    return NextResponse.json({ error: 'Persona not found' }, { status: 404 });
  }

  return NextResponse.json(persona);
}
