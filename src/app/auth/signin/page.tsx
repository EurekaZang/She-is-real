// 简化版登录组件
'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/dashboard'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* 霓虹灯效果 */}
      <div className="absolute -inset-32 opacity-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full blur-[96px] animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-violet-500 rounded-full blur-[96px] animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 p-8 relative">
        {/* 玻璃拟态卡片效果 */}
        <div className="absolute inset-0 -bottom-4 bg-white/5 backdrop-blur-xl rounded-2x1 border border-white/10 shadow-2xl"></div>
        
        <div className="relative space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              进入数字世界
            </h2>
            <p className="mt-2 text-gray-400">选择您偏好的登录方式</p>
          </div>

          {/* Google 登录按钮 */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full p-3 flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 
              border border-white/10 rounded-xl text-white transition-all duration-300
              hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-medium">使用 Google 账号登录</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-400">或使用邮箱登录</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent
                  transition-all duration-300"
                placeholder="邮箱地址"
              />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent
                  transition-all duration-300"
                placeholder="密码"
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium
                transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
