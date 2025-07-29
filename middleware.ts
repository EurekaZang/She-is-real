// middleware.ts
export { default } from "next-auth/middleware"

// 这个配置决定了哪些路径需要被中间件保护
export const config = { 
  matcher: [
    '/dashboard/:path*', // 保护所有 /dashboard 下的路径
    '/chat/:path*',      // 保护所有 /chat 下的路径
    // 如果你的主聊天页是 /chat, 也需要保护
    '/chat'
  ] 
};
