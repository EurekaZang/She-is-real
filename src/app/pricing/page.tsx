'use client';

import Link from 'next/link';

interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "普通会员",
    price: 0,
    description: "开始您的AI对话之旅",
    features: [
      "无限基础对话",
      "标准响应速度",
      "基础AI角色选择",
      "社区支持"
    ]
  },
  {
    name: "高阶会员",
    price: 10,
    description: "增强您的对话体验",
    features: [
      "优先响应速度",
      "高级AI角色解锁",
      "自定义角色设置",
      "24/7专业支持",
      "历史对话存档"
    ],
    isPopular: true
  },
  {
    name: "尊贵会员",
    price: 50,
    description: "享受顶级定制服务",
    features: [
      "即时响应",
      "完整AI角色库",
      "自定义AI训练",
      "专属客户经理",
      "API访问权限",
      "团队协作功能"
    ]
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 霓虹灯效果 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 主光源 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px] animate-pulse animation-delay-1000"></div>
        
        {/* 装饰光源 */}
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-violet-500/20 rounded-full blur-[96px] animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-[96px] animate-pulse animation-delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent mb-4">
            选择您的会员等级
          </h1>
          <p className="text-xl text-gray-400">
            解锁更多高级功能，获得更优质的对话体验
          </p>
        </div>

        {/* 价格卡片容器 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`group relative pricing-card-hover backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden
                transition-all duration-500 hover:scale-[1.005] hover:shadow-2xl
                hover:shadow-purple-500/25
                ${tier.isPopular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-1 rounded-bl-lg">
                  最受欢迎
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400 mb-6">{tier.description}</p>
                
                <div className="mb-8">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    ${tier.price}
                  </span>
                  <span className="text-gray-400">/month</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-300">
                      <svg
                        className="h-5 w-5 text-purple-500 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300
                    ${tier.isPopular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    }`}
                >
                  选择此方案
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 返回按钮 */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}