// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      role: 'ADMIN' | 'USER' | 'CASHIER';
      accessToken: string;
    }
  }

  interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER' | 'CASHIER';
    accessToken: string;
  }

  interface JWT {
    id: number;
    role: 'ADMIN' | 'USER' | 'CASHIER';
    accessToken: string;
  }
}