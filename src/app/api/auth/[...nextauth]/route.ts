import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";

// 配置 NextAuth
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET
});

// 导出 GET 和 POST 处理函数
export { handler as GET, handler as POST };