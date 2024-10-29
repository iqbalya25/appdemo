// auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            "https://appdemo-343470541894.asia-southeast2.run.app/api/auth/login",
            {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!res.ok) {
            throw new Error("Invalid credentials");
          }

          const user = await res.json();

          if (user) {
            return {
              id: user.id,
              name: user.username,
              email: user.email,
              role: user.role,
              accessToken: user.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role as "ADMIN" | "USER" | "CASHIER";
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Check for custom callback URL in the signin page query parameters
      if (url.startsWith("/login") && url.includes("callbackUrl")) {
        const params = new URLSearchParams(url.split("?")[1]);
        const callbackUrl = params.get("callbackUrl");
        if (callbackUrl) return callbackUrl;
      }

      // Handle role-based redirects
      if (url === baseUrl) {
        const session = await fetch(`${baseUrl}/api/auth/session`).then(res => res.json());
        if (session?.user?.role === "CASHIER") {
          return `${baseUrl}/cashier`;
        } else if (session?.user?.role === "ADMIN") {
          return `${baseUrl}/dashboard`;
        }
      }

      // Default redirect behavior
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
};

export default authOptions;